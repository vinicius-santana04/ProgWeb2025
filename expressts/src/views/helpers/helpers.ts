// Arquivo /views/helpers/helpers.ts
import { Prof, Technology } from './helpersTypes';
import * as Handlebars from 'handlebars';

export function listProfs(profs: Prof[]) {
    const list = profs.map((p)=>`<li>${p.nome}-${p.sala}</li>`);
    return `<ul>${list.join('')}</ul>`;
}

export function listtechnologies(techArray: Technology[]) {
  const nodeTechs = techArray.filter(tech => tech.poweredByNodejs);
  const listItems = nodeTechs.map(tech => `<li>${tech.name} - ${tech.type}</li>`);
  return `<ul>${listItems.join('')}</ul>`;
}