import type { CSSProperties } from 'react';
const tonos=[['#264b8b','#1d1b43'],['#834b6e','#311d34'],['#2f726c','#153a46'],['#be6f3b','#46283c'],['#484577','#202443'],['#446746','#252b34']];
export function Poster({titulo,url,grande=false}:{titulo:string;url:string|null;grande?:boolean}){
  const indice=[...titulo].reduce((a,c)=>a+c.charCodeAt(0),0)%tonos.length;
  const style={ '--poster-a':tonos[indice][0], '--poster-b':tonos[indice][1] } as CSSProperties;
  return <div className={`poster ${grande?'poster-xl':''}`} style={style}>
    {url?<img loading="lazy" alt={`Póster de ${titulo}`} src={url} referrerPolicy="no-referrer"/>:
      <div className="poster-fallback" role="img" aria-label={`Portada ilustrativa de ${titulo}`}><span className="poster-abstract">✦</span><span>{titulo}</span><small>MI CARTELERA · DEMO</small></div>}
  </div>;
}
