import assert from 'node:assert/strict';
import {defaults,validate,lesson,operationPlan,checkOperationStep,checkAnswer} from '../engine-src/core.mjs';

let examples=0,exchanges=0,steps=0;
function verify(task,a,b,grade=3){
 const c=validate({...defaults('operations',grade,task),a,b}),l=lesson(c),p=operationPlan(l.data);
 const mult=['multiply','multiply-column'].includes(task);
 const value=s=>s.top.reduce((v,n,i)=>v+n*p.ps[i]*(mult&&s.result[i]===null?p.multiplier:1),0)+(mult?s.carry.reduce((v,n,i)=>v+n*p.ps[i],0):0);
 for(let i=0;i<p.steps.length;i++){
  const s=p.steps[i];if(i)assert.deepEqual(s.before,p.steps[i-1].after,'Steps must continue from the previous model');
  if(s.inputs){
   const entries=Object.fromEntries(s.inputs.map(f=>[f.key,String(f.expected)]));assert(checkOperationStep(s,entries));
   for(const f of s.inputs){assert(!checkOperationStep(s,{...entries,[f.key]:''}));assert(!checkOperationStep(s,{...entries,[f.key]:String((f.expected+1)%10)}));assert(!checkOperationStep(s,{...entries,[f.key]:'0'+f.expected}));}
  }else{assert(checkOperationStep(s,String(s.expected)));assert(!checkOperationStep(s,s.expected+1));}
  assert(!checkOperationStep(s,''));assert(!checkOperationStep(s,' '));assert(!checkOperationStep(s,null));
  for(const state of [s.before,s.after])assert([...state.top,...state.lower,...state.carry,...state.groups.flat()].every(n=>Number.isInteger(n)&&n>=0),'No negative/fractional discs');
  if(['exchange','regroup'].includes(s.kind)){assert.equal(value(s.before),value(s.after),'An exchange must preserve the value');assert.equal(s.amount*p.ps[s.focus],s.received*p.ps[s.target]);exchanges++;}
  if(s.kind==='division-place'){
   const groupsValue=state=>state.groups.flatMap(g=>g.map((n,j)=>n*p.ps[j])).reduce((x,y)=>x+y,0);
   assert.equal(value(s.before)+groupsValue(s.before),a);assert.equal(value(s.after)+groupsValue(s.after),a);
   assert.equal(groupsValue(s.after)-groupsValue(s.before),s.product*p.ps[s.focus]);
   if(s.focus>0&&s.left){assert.equal(s.left*p.ps[s.focus],s.left*10*p.ps[s.focus-1]);exchanges++;}
  }
  if(task==='subtract'&&s.kind==='subtraction-place')assert.equal(value(s.before)-value(s.after),s.before.lower[s.focus]*p.ps[s.focus],'Only the active place is taken away');
  if(task==='add'&&s.kind==='addition-place'){
   assert.equal(value(s.after)-value(s.before),s.before.lower[s.focus]*p.ps[s.focus],'Only the active place is combined');
   if(s.carryOut){assert.equal(10*p.ps[s.focus],p.ps[s.focus+1]);exchanges++;}
  }
  if(s.kind==='multiplication-place'){
   assert.equal(value(s.before),a*b,'The full mat of groups and carries must represent the product');
   assert.equal(value(s.after),a*b,'Regrouping and recording must preserve the product');
   assert.equal(s.total,s.baseDigit*p.multiplier+s.incoming);
   assert.equal(s.total,s.digit+s.carryOut*10);
   assert.equal(s.after.carry[s.focus],0,'The incoming carry is consumed once');
   if(s.carryOut){assert.equal(s.carryOut*10*p.ps[s.focus],s.carryOut*p.ps[s.focus+1]);exchanges++;}
  }
  steps++;
 }
 const result=p.final.result.reduce((v,n,i)=>v+n*p.ps[i],0);
 assert.equal(result,task==='add'?a+b:task==='subtract'?a-b:['multiply','multiply-column'].includes(task)?a*b:Math.floor(a/b));
 if(task==='divide-column'){
  assert.equal(p.final.remainder,a%b);assert(p.final.remainder<b);
  for(const g of p.final.groups)assert.equal(g.reduce((v,n,i)=>v+n*p.ps[i],0),Math.floor(a/b));
  assert.equal(value(p.final),a%b);assert.equal(result*b+p.final.remainder,a);
 }
 assert(!checkAnswer(l,l.answer,{}),'The whole answer must not bypass the teaching steps');assert(checkAnswer(l,l.answer,{operationComplete:true}));examples++;return p;
}
verify('add',28,17,1);verify('add',999,1);verify('add',9999,1);verify('add',0,0);verify('add',10000,0);
const borrowing=verify('subtract',1000,1);assert.equal(borrowing.steps.filter(s=>s.kind==='exchange').length,3);
verify('subtract',10000,9999);verify('subtract',405,187);verify('subtract',1000,1000);
const referenceAdd=verify('add',234,123);assert.equal(referenceAdd.steps.length,3);
const referenceSub=verify('subtract',5320,2944);assert.deepEqual(referenceSub.final.result,[6,7,3,2]);
verify('multiply',4,6,1);
const uncleJoe=verify('multiply-column',348,4);assert.equal(uncleJoe.steps.length,4);assert.deepEqual(uncleJoe.steps.map(s=>[s.digit,s.carryOut]),[[2,3],[9,1],[3,1],[1,0]]);
verify('multiply-column',999,9);verify('multiply-column',0,9);
const internalZero=verify('multiply-column',105,4);assert.equal(internalZero.steps[1].baseDigit,0);assert.equal(internalZero.steps[1].finalCarry,false);
verify('share',20,5,1);verify('group',24,4);verify('divide-column',246,2);
const zero=verify('divide-column',326,3);assert.deepEqual(zero.final.result,[8,0,1]);assert.equal(zero.final.remainder,2);
verify('divide-column',100,9);verify('divide-column',0,2);verify('divide-column',999,1);
// Animal Rescue worlds: regrouping, a small first digit, internal zero and final remainders.
for(const [a,b] of [[864,4],[48,6],[824,4],[865,4],[912,8],[304,7]]){
 const p=verify('divide-column',a,b);assert.equal(p.steps.length,String(a).length+1);
 assert.equal(p.steps.filter(s=>s.kind==='division-place').length,String(a).length);
}
let seed=417;const r=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296),n=max=>Math.floor(r()*(max+1));
for(let i=0;i<120;i++){
 const a=n(9999),b=n(9999-a);verify('add',a,b);verify('subtract',a,n(a));
 verify('multiply-column',n(999),1+n(8));verify('divide-column',n(999),1+n(8));
}
console.log(`Passed ${examples} operation sequences, ${steps} teaching steps and ${exchanges} value-preserving exchanges.`);
