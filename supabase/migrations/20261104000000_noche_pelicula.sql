-- E2: migración aditiva. NO modificar ni eliminar public.mi_lista del Proyecto 3.
-- Precondición: public.mi_lista(id bigint, user_id uuid, tmdb_id int, titulo text,
--                          tipo_contenido text, estado text) ya existe.

create table if not exists public.sesiones_noche (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null check (char_length(btrim(nombre)) between 1 and 100),
  fecha date not null,
  minutos_disponibles integer not null check (minutos_disponibles between 30 and 600),
  total_minutos integer not null check (total_minutos between 1 and 600),
  creado_en timestamptz not null default now()
);

create table if not exists public.sesion_peliculas (
  id bigint generated always as identity primary key,
  sesion_id uuid not null references public.sesiones_noche(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  mi_lista_id bigint references public.mi_lista(id) on delete set null,
  posicion integer not null check (posicion > 0),
  tmdb_id integer not null check (tmdb_id > 0),
  titulo_snapshot text not null check (char_length(titulo_snapshot) between 1 and 500),
  duracion_minutos integer not null check (duracion_minutos between 1 and 600),
  unique (sesion_id, posicion),
  unique (sesion_id, tmdb_id)
);

create index if not exists idx_sesiones_noche_user_fecha
  on public.sesiones_noche (user_id, fecha desc);
create index if not exists idx_sesion_peliculas_user
  on public.sesion_peliculas (user_id);
create index if not exists idx_sesion_peliculas_sesion
  on public.sesion_peliculas (sesion_id, posicion);

alter table public.sesiones_noche enable row level security;
alter table public.sesion_peliculas enable row level security;

-- Tabla visible solo para dueños; mutaciones únicamente vía función atómica controlada.
revoke all on public.sesiones_noche from public, anon, authenticated;
revoke all on public.sesion_peliculas from public, anon, authenticated;
grant select, delete on public.sesiones_noche to authenticated;
grant select on public.sesion_peliculas to authenticated;

create policy "E2 select mis sesiones"
  on public.sesiones_noche for select to authenticated
  using (user_id = (select auth.uid()));
create policy "E2 delete mis sesiones"
  on public.sesiones_noche for delete to authenticated
  using (user_id = (select auth.uid()));
create policy "E2 select mis peliculas de sesion"
  on public.sesion_peliculas for select to authenticated
  using (user_id = (select auth.uid()));

-- RPC con SECURITY DEFINER: para evitar INSERT directos no confiables, se valida
-- expresamente el JWT, propiedad de cada mi_lista_id, tipo, estado, minutos y pausas.
-- Como el owner puede saltarse RLS, NO se admite user_id del cliente.
create or replace function public.guardar_sesion_noche(
  p_nombre text,
  p_fecha date,
  p_minutos integer,
  p_peliculas jsonb
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario uuid := auth.uid();
  v_nombre text := coalesce(nullif(btrim(p_nombre), ''), 'Noche de película');
  v_item record;
  v_fila public.mi_lista%rowtype;
  v_ids bigint[] := array[]::bigint[];
  v_runtimes integer[] := array[]::integer[];
  v_tmdb integer[] := array[]::integer[];
  v_titulos text[] := array[]::text[];
  v_total integer := 0;
  v_cantidad integer := 0;
  v_sesion_id uuid;
  v_i integer;
begin
  if v_usuario is null then
    raise exception 'Debe iniciar sesión para guardar una noche de película';
  end if;
  if p_minutos is null or p_minutos < 30 or p_minutos > 600 then
    raise exception 'El tiempo debe estar entre 30 y 600 minutos';
  end if;
  if p_fecha is null then
    raise exception 'Seleccione una fecha';
  end if;
  if char_length(v_nombre) > 100 then
    raise exception 'El nombre debe tener 100 caracteres o menos';
  end if;
  if p_peliculas is null or jsonb_typeof(p_peliculas) <> 'array'
     or jsonb_array_length(p_peliculas) < 1 or jsonb_array_length(p_peliculas) > 100 then
    raise exception 'Seleccione de 1 a 100 películas';
  end if;

  for v_item in
    select * from jsonb_to_recordset(p_peliculas) as x(mi_lista_id bigint, duracion_minutos integer)
  loop
    if v_item.mi_lista_id is null or v_item.duracion_minutos is null
       or v_item.duracion_minutos < 1 or v_item.duracion_minutos > 600 then
      raise exception 'Película o duración inválida';
    end if;
    if v_item.mi_lista_id = any(v_ids) then
      raise exception 'No se permite repetir una película en la misma sesión';
    end if;
    select * into v_fila
      from public.mi_lista
      where id = v_item.mi_lista_id
        and user_id = v_usuario
        and tipo_contenido = 'pelicula'
        and estado = 'por_ver';
    if not found then
      raise exception 'Película no elegible o no pertenece al usuario';
    end if;

    v_total := v_total + v_item.duracion_minutos + case when v_cantidad > 0 then 10 else 0 end;
    if v_total > p_minutos then
      raise exception 'Las películas y pausas superan el tiempo disponible';
    end if;
    v_cantidad := v_cantidad + 1;
    v_ids := array_append(v_ids, v_fila.id);
    v_runtimes := array_append(v_runtimes, v_item.duracion_minutos);
    v_tmdb := array_append(v_tmdb, v_fila.tmdb_id);
    v_titulos := array_append(v_titulos, v_fila.titulo);
  end loop;

  insert into public.sesiones_noche
    (user_id, nombre, fecha, minutos_disponibles, total_minutos)
  values (v_usuario, v_nombre, p_fecha, p_minutos, v_total)
  returning id into v_sesion_id;

  for v_i in 1..v_cantidad loop
    insert into public.sesion_peliculas
      (sesion_id, user_id, mi_lista_id, posicion, tmdb_id, titulo_snapshot, duracion_minutos)
    values
      (v_sesion_id, v_usuario, v_ids[v_i], v_i, v_tmdb[v_i], v_titulos[v_i], v_runtimes[v_i]);
  end loop;
  return v_sesion_id;
end;
$$;

revoke all on function public.guardar_sesion_noche(text, date, integer, jsonb) from public, anon;
grant execute on function public.guardar_sesion_noche(text, date, integer, jsonb) to authenticated;
