// Arquivo /views/helpers/helpers.ts
import { Prof, Technology } from './helpersTypes';
import * as Handlebars from 'handlebars';

module.exports = {
  eq: function (a: any, b: any): boolean {
    return a === b;
  },
  
  add: function (a: number, b: number): number {
    return a + b;
  },

  listProfs: function (profs: Prof[]): Handlebars.SafeString {
    if (!profs || profs.length === 0) {
      return new Handlebars.SafeString('<ul><li>Nenhum professor listado.</li></ul>');
    }
    const list = profs.map((p) => `<li>${p.nome} - ${p.sala}</li>`);
    const html = `<ul>${list.join('')}</ul>`;
    return new Handlebars.SafeString(html);
  },

 
  listtechnologies: function (techArray: Technology[]): Handlebars.SafeString {
    if (!techArray || techArray.length === 0) {
      return new Handlebars.SafeString('<ul><li>Nenhuma tecnologia listada.</li></ul>');
    }
    const nodeTechs = techArray.filter(tech => tech.poweredByNodejs);
    if (nodeTechs.length === 0) {
      return new Handlebars.SafeString('<ul><li>Nenhuma tecnologia Node.js encontrada.</li></ul>');
    }
    const listItems = nodeTechs.map(tech => `<li>${tech.name} - ${tech.type}</li>`);
    const html = `<ul>${listItems.join('')}</ul>`;
    return new Handlebars.SafeString(html);
  }
}