import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {ENGINE_NAMES,tasks,defaults,validate,lesson,checkAnswer,generatedConfig} from '../engine-src/core.mjs';
let seed=192321;const rng=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const report={engines:[],cases:0,generatedQuestions:0,checks:[],failures:[]};
function interaction(l){const c=l.data;return {money:l.answer,moneyModel:c.correctModel,shaded:c.a,clock:[c.a,c.b],errorReason:c.errorReason,operationComplete:true,numberlineMarker:l.answer};}
function correctResponse(l){return l.type==='reason'?l.data.reasons:l.type==='money'?[Math.floor(l.answer/100),l.answer%100]:l.answer;}
for(const engine of Object.keys(ENGINE_NAMES)){
 const grades=engine==='area'?[3]:engine==='fraction'?[2,3]:[1,2,3];let ts=0,passed=0;
 for(const grade of grades)for(const [task]of tasks(engine,grade)){
  ts++;
  try{
   const c=validate(defaults(engine,grade,task)),l=lesson(c,rng);
   if(l.type==='explore'){
    assert.equal(l.answer,null);assert(!checkAnswer(l,null,{}));
    assert.throws(()=>validate({...c,mode:'random',count:8}));
    passed++;report.cases++;continue;
   }
   assert(checkAnswer(l,correctResponse(l),interaction(l)),`${engine} ${grade} ${task} correct answer`);
   assert(!checkAnswer(l,null,{}),'Null must not pass');
   const random=validate({...c,mode:'random',count:8});
   for(let i=0;i<60;i++){
    const gen=generatedConfig(random,rng);validate({...gen,mode:'fixed'});
    const x=lesson(random,rng);assert(checkAnswer(x,correctResponse(x),interaction(x)));assert(!checkAnswer(x,null,{}));
    if(engine==='error')assert.notEqual(x.data.wrong,Array.isArray(x.answer)?x.answer.join('/'):String(x.answer),'Wrong claim should differ');
    report.generatedQuestions++;
   }
   passed++;report.cases++;
  }catch(e){report.failures.push({engine,grade,task,message:e.message});}
 }
 report.engines.push({engine,name:ENGINE_NAMES[engine],taskGradeCombinations:ts,passed});
}
console.log(JSON.stringify(report.failures));
function known(engine,task,changes,expected){const c=validate({...defaults(engine,3,task),...changes}),l=lesson(c);assert.deepEqual(l.answer,expected);assert(checkAnswer(l,correctResponse(l),interaction(l)));report.checks.push(`${engine}/${task}`);}
known('operations','add',{a:999,b:1},1000);
known('operations','subtract',{a:1000,b:1},999);
known('operations','share',{a:24,b:6},4);
known('bar','part',{a:24,b:24},0);
known('money','count',{a:850,format:'mixed'},850);
known('money','convert',{a:140,direction:'cents-to-money'},140);
known('money','convert',{a:610,direction:'money-to-cents'},610);
known('money','make',{target:'1000',format:'mixed'},1000);
known('money','add',{a:1275,b:860,format:'mixed'},2135);
known('money','subtract',{a:3160,b:2090,format:'mixed'},1070);
known('money','word',{a:1275,b:860,wordType:'total',format:'mixed'},2135);
known('money','word',{a:1275,b:860,wordType:'compare',format:'mixed'},415);
known('fraction','add',{a:3,b:2,den:8},[5,8]);
known('fraction','subtract',{a:5,b:5,den:8},[0,8]);
known('fraction','compare',{a:1,b:1,den:3,den2:5},'First is greater');
known('time','later',{a:11,b:50,duration:20},[12,10]);
known('time','duration',{a:12,b:50,duration:75},75);
known('place','digit',{a:2034,place:100},0);
known('fraction','add',{a:1,den:2,b:1,den2:4},[3,4]);
known('area','compare',{a:6,b:4,cols2:8,rows2:3},'Second is greater');
known('graph','total',{values:'12, 8, 16',key:2},36);
const frac=lesson(validate({...defaults('fraction',3),a:2,den:4}));assert(checkAnswer(frac,[1,2]));assert(!checkAnswer(frac,[1,0]));assert(!checkAnswer(frac,['',4]));
const money=lesson(defaults('money',3));assert(!checkAnswer(money,[3,125]));
assert.deepEqual(tasks('money',3).map(x=>x[0]),['count','convert','make','add','subtract','word']);
const word=lesson(validate({...defaults('money',3,'word'),a:1275,b:860,wordType:'compare'}));assert(!checkAnswer(word,[4,15],{moneyModel:'part-whole'}));assert(checkAnswer(word,[4,15],{moneyModel:'compare'}));
assert.throws(()=>validate({...defaults('money',3,'add'),a:1274,b:860}));
assert.throws(()=>validate({...defaults('operations',1),a:80,b:80}));
assert.throws(()=>validate({...defaults('fraction',3,'add'),a:7,b:3,den:8}));
assert.throws(()=>validate({...defaults('graph',3),values:'11,8,16',key:2}));
assert.throws(()=>validate({...defaults('area',3,'compare'),cols2:3,rows2:3}));
assert.throws(()=>validate({engine:'unknown',grade:3,task:'read'}));
const html=await readFile(new URL('../public/engines.html',import.meta.url),'utf8');assert(!html.includes('/*SCRIPT*/'));assert(!html.includes('/*STYLE*/'));assert(!/<script\b[^>]*\bsrc=/.test(html));assert(html.includes('Created by Lim Kim Sze'));
assert(html.includes('money-answer-symbol'));assert(html.includes('money-answer-dot'));assert(html.includes('money-decimal-point'));assert(html.includes('money-coin-art'));assert(html.includes('money-note-art'));assert(html.includes('dollar sign comes before the dollar digits'));
await writeFile(new URL('validation.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));if(report.failures.length)process.exitCode=1;
