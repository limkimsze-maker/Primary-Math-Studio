import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ENGINE_NAMES} from '../engine-src/core.mjs';

const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const list=html.match(/const engines=\[(.*?)\];/s)?.[1]||'';
const ids=[...list.matchAll(/\['([^']+)','[^']+'\]/g)].map(match=>match[1]);

assert.equal(ids.length,15,'The public homepage must offer all 15 engine tabs.');
const coreIds=Object.keys(ENGINE_NAMES),expected=[...coreIds.slice(0,7),'length','mass','volume',...coreIds.slice(7)];
assert.deepEqual(ids,expected,'The homepage order must contain the 12 shared engines and three measurement engines.');
assert(html.includes('public/engines.html?engine=${encodeURIComponent(id)}'));
assert(html.includes("['length','mass','volume'].includes(id)?`public/measurement/${id}.html`"),'Measurement engines must use their standalone pages.');
assert(html.includes('id="engineFrame"')&&html.includes('id="focusButton"'));
assert(html.includes('Created by Lim Kim Sze'));
assert(!html.includes('<h2>Development</h2>'),'Development notes must not replace the public studio.');

console.log('Passed the live homepage, 15-engine tab order, routes, expanded workspace and credit checks.');
