// Convierte los colores "blanco" y "azul marino" de las utilidades de Tailwind en variables de tema
// (--ink = color de la letra, --paper = color del fondo), para que el mismo HTML sirva en claro y oscuro.
import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../../assets/tailwind.css', import.meta.url);
let css = readFileSync(file, 'utf8');

// Tailwind minifica el blanco a hsla(0,0%,100%,A) y el azul marino a rgba(2,16,36,A).
// En las reglas de texto/placeholder se refuerza el alfa en tema claro (--ab) para mantener el contraste.
css = css.replace(/([^{}]*)\{([^{}]*)\}/g, (m, sel, body) => {
  const isText = /text-white|placeholder-white/.test(sel);
  body = body.replace(/(?:hsla\(0,0%,100%,|rgba\(255,255,255,)(\.?\d*\.?\d+)\)/g, (mm, a) => {
    const x = parseFloat(a);
    return isText && x < 1
      ? `rgb(var(--ink)/calc(${a} + (1 - ${a}) * var(--ab)))`
      : `rgb(var(--ink)/${a})`;
  });
  body = body.replace(/rgb\(255 255 255\/(\.?\d*\.?\d+)\)/g, 'rgb(var(--ink)/$1)');
  body = body.replace(/rgb\(255 255 255\/var\(--tw-([a-z]+)-opacity,1\)\)/g, 'rgb(var(--ink)/var(--tw-$1-opacity,1))');
  body = body.replace(/rgba\(2,16,36,(\.?\d*\.?\d+)\)/g, 'rgb(var(--paper)/$1)');
  body = body.replace(/rgb\(2 16 36\/(\.?\d*\.?\d+|var\(--tw-[a-z]+-opacity,1\))\)/g, 'rgb(var(--paper)/$1)');
  return `${sel}{${body}}`;
});

writeFileSync(file, css);
console.log('tema aplicado a assets/tailwind.css');
