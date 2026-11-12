import { describe, expect, it } from 'vitest';
import { evaluarSesion, puedeAgregar, validarMinutos } from './nochePelicula';

describe('validarMinutos / límites', () => {
  it('acepta extremos inclusivos, incluso 30 y 600', () => {
    expect(validarMinutos(30)).toEqual({ valido: true, valor: 30 });
    expect(validarMinutos('600')).toEqual({ valido: true, valor: 600 });
  });
  it.each([29, 601, 90.5, '90.5', '', 'hola', -1, NaN, Infinity, null, undefined])('rechaza entrada %s', (valor) => {
    expect(validarMinutos(valor).valido).toBe(false);
  });
});

describe('cálculo de sesiones', () => {
  it('acepta exactamente 200 con dos películas y pausa de 10', () => {
    expect(evaluarSesion(200, [100, 90])).toMatchObject({ valido: true, cabe: true, total: 200, pausas: 10, restante: 0 });
  });
  it('no agrega pausa con una sola película', () => {
    expect(evaluarSesion(120, [120])).toMatchObject({ valido: true, cabe: true, total: 120, pausas: 0 });
  });
  it('suma solo las pausas intermedias', () => {
    expect(evaluarSesion(300, [90, 80, 70])).toMatchObject({ valido: true, cabe: true, total: 260, pausas: 20 });
  });
  it('vacía total cero y sin pausa', () => {
    expect(evaluarSesion(30, [])).toMatchObject({ valido: true, cabe: true, total: 0, pausas: 0, restante: 30 });
  });
  it.each([null, undefined, 0, -1, 3.5, NaN])('rechaza duración no disponible %s', (duracion) => {
    expect(evaluarSesion(180, [duracion]).valido).toBe(false);
  });
  it('rechaza un minuto extra a partir del límite exacto', () => {
    expect(puedeAgregar(200, [100, 90], 1)).toMatchObject({ valido: true, cabe: false, total: 211 });
  });
  it('recalcula al retirar una película', () => {
    expect(evaluarSesion(200, [100, 90]).total).toBe(200);
    expect(evaluarSesion(200, [100])).toMatchObject({ total: 100, pausas: 0, restante: 100 });
  });
  it('rechaza cambio de presupuesto a uno insuficiente', () => {
    expect(evaluarSesion(150, [100, 90]).cabe).toBe(false);
  });
  it('rechaza tiempo inválido y pausa negativa', () => {
    expect(evaluarSesion(29, [20]).valido).toBe(false);
    expect(evaluarSesion(200, [100, 90], -10).valido).toBe(false);
  });
});
