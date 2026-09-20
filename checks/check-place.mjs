import assert from 'node:assert/strict';
import {defaults,validate,lesson,checkAnswer,generatedConfig,placeChangePlan,placePowers,numberWords,hundredMoves,LIMITS} from '../engine-src/core.mjs';
let seed=49218,cases=0,exchanges=0;
const rng=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
function check(c){
 const plan=placeChangePlan(c),value=xs=>xs.reduce((sum,n,i)=>sum+n*plan.ps[i],0);
 assert.equal(value(plan.initial),c.a);let previous=c.a;
 for(const step of plan.steps){assert.equal(value(step.before),previous);assert(step.after.every(n=>Number.isInteger(n)&&n>=0));const next=value(step.after);if(['group','split'].includes(step.kind)){assert.equal(next,previous);exchanges++;if(step.kind==='group'){assert.equal(step.after[step.from],step.before[step.from]-10);assert.equal(step.after[step.to],step.before[step.to]+1);}else{assert.equal(step.after[step.from],step.before[step.from]-1);assert.equal(step.after[step.to],step.before[step.to]+10);}}else if(step.kind==='add')assert.equal(next,previous+c.b);else assert.equal(next,previous-step.amount*plan.ps[step.from]);previous=next;}
 assert.equal(previous,plan.target);assert.equal(value(plan.final),plan.target);assert(plan.final.every(n=>n<10));assert.equal(lesson(c).answer,plan.target);assert(checkAnswer(lesson(c),String(plan.target)));assert(!checkAnswer(lesson(c),String(plan.target+1)));cases++;
 return plan;
}
for(const grade of [1,2,3])for(const task of ['more','less']){
 const cap=LIMITS[grade];for(const [a,b]of task==='more'?[[0,cap],[cap-1,1],[cap-10,10],[0,1]]:[[cap,1],[cap,cap],[10,1],[1,1]])check(validate({...defaults('place',grade,task),a,b}));
 for(let i=0;i<80;i++){const b=1+Math.floor(rng()*cap),a=task==='more'?Math.floor(rng()*(cap-b+1)):b+Math.floor(rng()*(cap-b+1));check(validate({...defaults('place',grade,task),a,b}));}
 const random=validate({...defaults('place',grade,task),mode:'random',count:8,b:10,representation:'discs'});for(let i=0;i<12;i++){const c=generatedConfig(random,rng);assert.equal(c.b,10);assert.equal(c.representation,'discs');check(validate({...c,mode:'fixed'}));}
 assert.throws(()=>validate({...defaults('place',grade,'more'),a:cap,b:1}));assert.throws(()=>validate({...defaults('place',grade,'less'),a:0,b:1}));
}
assert.deepEqual(check({...defaults('place',3,'less'),a:1000,b:1}).steps.map(s=>s.kind),['split','split','split','take']);
assert.deepEqual(check({...defaults('place',3,'more'),a:9999,b:1}).steps.map(s=>s.kind),['add','group','group','group','group']);
assert.deepEqual(placePowers(1,100),[100,10,1]);assert.deepEqual(placePowers(2,1000),[1000,100,10,1]);assert.deepEqual(placePowers(3,10000),[10000,1000,100,10,1]);
for(const [n,expected]of [[0,'zero'],[34,'thirty-four'],[101,'one hundred and one'],[2034,'two thousand and thirty-four'],[4250,'four thousand, two hundred and fifty'],[10000,'ten thousand']])assert.equal(numberWords(n),expected);
assert.deepEqual(hundredMoves(50,33),[60,70,80,81,82,83]);
assert.deepEqual(hundredMoves(100,-33),[90,80,70,69,68,67]);
assert.deepEqual(hundredMoves(99,1),[100]);assert.deepEqual(hundredMoves(1,-1),[0]);
assert.deepEqual(hundredMoves(0,100),[10,20,30,40,50,60,70,80,90,100]);
assert.deepEqual(hundredMoves(100,-100),[90,80,70,60,50,40,30,20,10,0]);
assert.deepEqual(hundredMoves(50,0),[]);
for(const [start,delta]of [[99,2],[0,-1],[100,1],[-1,10],[101,-10],[1.5,1],[50,.5]])assert.throws(()=>hundredMoves(start,delta));
let movements=0;
for(let start=0;start<=100;start++)for(const delta of [-100,-33,-10,-1,1,10,33,100]){
 if(start+delta<0||start+delta>100)continue;
 const path=hundredMoves(start,delta);let previous=start,onesStarted=false;
 for(const value of path){assert(value>=0&&value<=100);const diff=value-previous;assert.equal(Math.sign(diff),Math.sign(delta));assert([1,10].includes(Math.abs(diff)));if(Math.abs(diff)===1)onesStarted=true;else assert(!onesStarted,'Tens must move before ones');previous=value;}
 assert.equal(previous,start+delta);movements++;
}
for(const grade of [1,2,3]){
 const c=validate(defaults('place',grade,'hundred'));assert.equal(lesson(c).type,'explore');
 for(const a of [0,100])validate({...c,a,leftAmount:100,rightAmount:1});
 for(const changes of [{a:-1},{a:101},{a:.5},{leftAmount:0},{leftAmount:101},{rightAmount:.5},{mode:'random'}])assert.throws(()=>validate({...c,...changes}));
}
console.log(`Passed ${cases} place-value change sequences and ${exchanges} value-preserving exchanges, including inclusive grade limits, zeros and fixed-amount random practice.`);
console.log(`Passed ${movements} hundred-chart movements, including tens-first paths, 0/100 boundaries and teacher-setting validation.`);
