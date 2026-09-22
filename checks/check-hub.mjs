import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const list=html.match(/const engines=\[(.*?)\];/s)?.[1]||'';
const ids=[...list.matchAll(/\['([^']+)','[^']+'\]/g)].map(match=>match[1]);

const expected=[
 'place','compare-order','operations','mental-sum','numberline','bar','more-word-problems','money','fraction','time',
 'length','mass','volume','measurement-conversion','geometry','area','graph','explain','error'
];
assert.equal(ids.length,19,'The public homepage must offer all 19 topic tabs.');
assert.deepEqual(ids,expected,'The homepage topic order changed unexpectedly.');
assert(html.includes("id==='more-word-problems'?`https://limkimsze-maker.github.io/P3_More_Word_Problems_Monster_Quest_Main_Page/?studio=1&v=${release}`"),'P3 More Word Problems must use the original Monster Quest reference directly.');
assert(html.includes('public/engines.html?engine=${encodeURIComponent(id)}&v=${release}'));
assert(html.includes("['length','mass','volume'].includes(id)?\`public/measurement/${id}.html?v=${release}\`"),'Measurement engines must use their standalone pages.');
assert(html.includes('id="engineFrame"')&&html.includes('id="focusButton"'));
assert(html.includes('.presentation')&&html.includes("event.data?.type==='primary-maths-pupil-view'"),'Pupil view must expand the teaching engine across the whole Studio.');
assert(html.includes("active==='more-word-problems'"),'The Monster Quest reference must get the full-height mobile frame treatment.');
assert(html.includes('prepareMoreWordProblemsFrame')&&html.includes("getElementById('mqStartQuestBtn')"),'The embedded Monster Quest cover must auto-enter so mobile pupils never see a blank navy screen.');
assert(html.includes('Created by Lim Kim Sze'));
assert(!html.includes('<h2>Development</h2>'),'Development notes must not replace the public studio.');

console.log('Passed the live homepage, 19-topic order, strict Monster Quest route, expanded workspace and credit checks.');
