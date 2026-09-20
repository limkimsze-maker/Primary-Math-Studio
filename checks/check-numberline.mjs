import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {LIMITS,tasks,defaults,validate,generatedConfig,lesson,checkAnswer,sequenceValues,sequenceBlankIndices,wholeNumberText,numberlineQuestion} from '../engine-src/core.mjs';

assert.equal(tasks('place',1)[1][0],'hundred');
assert.equal(tasks('place',1)[1][1],'Explore numbers to 100 · Hundred chart & flip chart');
assert.equal(tasks('numberline',3)[1][1],'Find a number more');
assert.equal(tasks('numberline',3)[2][1],'Find a number less');
assert.equal(wholeNumberText(5941),'5 941');
assert.equal(numberlineQuestion('add',5941,200),'What is 200 more than 5 941?');
assert.equal(numberlineQuestion('subtract',5941,200),'What is 200 less than 5 941?');
assert.deepEqual(sequenceValues({...defaults('numberline',3,'pattern'),a:2400,b:100,patternType:'constant'}),[2400,2500,2600,2700,2800,2900,3000,3100,3200]);
assert.deepEqual(sequenceValues({...defaults('numberline',3,'pattern'),a:2400,b:100,b2:10,patternType:'alternating'}),[2400,2500,2510,2610,2620,2720,2730,2830,2840]);
assert.deepEqual(sequenceValues({...defaults('numberline',3,'pattern'),a:900,b:-100,patternType:'constant'}),[900,800,700,600,500,400,300,200,100]);
assert.deepEqual(sequenceBlankIndices('2'),[3,8]);assert.deepEqual(sequenceBlankIndices('3'),[2,5,8]);assert.deepEqual(sequenceBlankIndices('4'),[1,3,6,8]);

const alternating=validate({...defaults('numberline',3,'pattern'),a:2400,b:100,b2:10,patternType:'alternating',missing:'4'});
const activity=lesson(alternating);assert.equal(activity.type,'sequence');assert.deepEqual(activity.data.blanks,[1,3,6,8]);assert(checkAnswer(activity,activity.answer));
const incomplete=[...activity.answer];incomplete[3]=null;assert(!checkAnswer(activity,incomplete));
const wrong=[...activity.answer];wrong[6]++;assert(!checkAnswer(activity,wrong));

for(const grade of [1,2,3]){
 const cap=LIMITS[grade],base=defaults('numberline',grade,'pattern');
 assert.throws(()=>validate({...base,b:0}));
 assert.throws(()=>validate({...base,patternType:'alternating',b2:0}));
 assert.throws(()=>validate({...base,a:cap,b:1}));
 const random=validate({...base,mode:'random',count:8,patternType:'alternating',b:grade===1?5:grade===2?20:100,b2:grade===1?-2:grade===2?-10:-50,missing:'3'});
 for(let i=0;i<100;i++){
  const c=generatedConfig(random);assert.equal(c.b,random.b);assert.equal(c.b2,random.b2);assert.equal(c.patternType,'alternating');assert.equal(c.missing,'3');
  const values=sequenceValues(c);assert(values.every(value=>Number.isInteger(value)&&value>=0&&value<=cap));
 }
}

for(const task of ['add','subtract']){
 const c=validate({...defaults('numberline',3,task),a:task==='add'?2400:2600,b:200}),l=lesson(c);
 assert.equal(l.question,task==='add'?'What is 200 more than 2 400?':'What is 200 less than 2 600?');
 assert(checkAnswer(l,l.answer,{numberlineMarker:l.answer}));assert(!checkAnswer(l,l.answer,{numberlineMarker:c.a}));assert(!checkAnswer(l,c.a,{numberlineMarker:l.answer}));
}
const [runtime,css]=await Promise.all([readFile(new URL('../engine-src/runtime.js',import.meta.url),'utf8'),readFile(new URL('../engine-src/theme.css',import.meta.url),'utf8')]);
assert.match(runtime,/class="numberline-jump-arc"/);assert.match(runtime,/class="numberline-jump-arrowhead"/);assert.doesNotMatch(css,/\.numberline-jump path\{/);assert.match(css,/\.numberline-jump \.numberline-jump-arrowhead\{/);
console.log('Passed practice-book number-line wording, clean arrow styling, constant/decreasing/alternating patterns, 300 random valid patterns and linked marker checks.');
