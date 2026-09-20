import assert from 'node:assert/strict';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { ENGINE_NAMES,defaults,tasks,activityHTML,validate,lesson } from '../engine-src/core.mjs';
const html=await readFile(new URL('../public/engines.html',import.meta.url),'utf8');let count=0;
for(const engine of Object.keys(ENGINE_NAMES))for(const [task]of tasks(engine,engine==='fraction'?2:3))for(const mode of ['fixed','random']){
 if(engine==='place'&&task==='hundred'&&mode==='random')continue;
 const config=validate({...defaults(engine,engine==='fraction'?2:3,task),mode,count:8});
 const saved=activityHTML(html,config),match=saved.match(/<script id="saved-config" type="application\/json">(.*?)<\/script>/s);
 assert(match);assert.deepEqual(validate(JSON.parse(match[1])),config);assert(!/<script[^>]+src=/.test(saved));
 const scripts=[...saved.matchAll(/<script(?: [^>]+)?>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,2);new Function(scripts[1][1]);
 const first=lesson(config);if(mode==='fixed')assert.deepEqual(lesson(config),first);count++;
}
const odd={...defaults('bar'),context:'tokens $1 <tag> & "'};const safe=activityHTML(html,odd);assert.deepEqual(JSON.parse(safe.match(/<script id="saved-config" type="application\/json">(.*?)<\/script>/s)[1]).context,odd.context);assert(!safe.includes('tokens $1 <tag>'));
let source=await readFile(new URL('../app/api/download/route.ts',import.meta.url),'utf8');
source=source.replace("'./template'",JSON.stringify(pathToFileURL(new URL('../app/api/download/template.ts',import.meta.url).pathname).href));
// Import the generated template as JS in a test data module.
const template=await readFile(new URL('../app/api/download/template.ts',import.meta.url),'utf8');source=source.replace(JSON.stringify(pathToFileURL(new URL('../app/api/download/template.ts',import.meta.url).pathname).href),JSON.stringify('data:text/javascript;base64,'+Buffer.from(template).toString('base64')));
source=source.replace("'../../../engine-src/core.mjs'",JSON.stringify(new URL('../engine-src/core.mjs',import.meta.url).href));
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {GET}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
for(const engine of Object.keys(ENGINE_NAMES)){
 const c=defaults(engine),url='https://example.test/api/download?settings='+encodeURIComponent(JSON.stringify(c));
 const response=GET(new Request(url));assert.equal(response.status,200);assert.equal(response.headers.get('Content-Disposition'),`attachment; filename="${engine}-activity.html"`);const data=await response.text();assert(data.includes('Created by Lim Kim Sze'));assert.deepEqual(JSON.parse(data.match(/<script id="saved-config" type="application\/json">(.*?)<\/script>/s)[1]),validate(c));
 const json=GET(new Request(url+'&format=settings'));assert.equal(json.status,200);assert.deepEqual(await json.json(),validate(c));
}
assert.equal(GET(new Request('https://example.test/api/download?settings=%7B%7D')).status,400);
assert.equal(GET(new Request('https://example.test/api/download')).status,400);
await mkdir(new URL('../public/qa/',import.meta.url),{recursive:true});
await writeFile(new URL('../public/qa/fixed.html',import.meta.url),activityHTML(html,{...defaults('bar'),context:'tokens $1'}));
await writeFile(new URL('../public/qa/random.html',import.meta.url),activityHTML(html,{...defaults('operations',1,'add'),mode:'random',count:3}));
console.log(`Passed ${count} configured HTML checks, 12 HTML/JSON download endpoints and invalid-request checks.`);
