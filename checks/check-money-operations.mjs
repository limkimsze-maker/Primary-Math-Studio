import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('../engine-src/runtime.js',import.meta.url),'utf8');
const start=source.indexOf('function moneyPlaceCounts');
const end=source.indexOf('function wireMoneySteps');
assert(start>=0&&end>start,'Money operation helpers were not found.');
const context={E:value=>String(value),console};
vm.createContext(context);
vm.runInContext(`${source.slice(start,end)}\nthis.moneyAPI={MONEY_DESC,moneyPlaceCounts,moneyAdditionPlan,moneySubtractionPlan,moneyPlanState,moneyOperationMat,moneyWrittenAlgorithm,moneyOperationStepPanel,moneyTransitionStrip};`,context);
const {MONEY_DESC,moneyPlaceCounts,moneyAdditionPlan,moneySubtractionPlan,moneyPlanState,moneyOperationMat,moneyWrittenAlgorithm,moneyOperationStepPanel}=context.moneyAPI;
const plain=value=>JSON.parse(JSON.stringify(value));
const vector=value=>MONEY_DESC.map(place=>value[place]);
const snapshot=(plan,step)=>{const state=moneyPlanState(plan,step);return plain({
 top:state.top?vector(state.top):undefined,
 bottom:state.bottom?vector(state.bottom):undefined,
 work:state.work?vector(state.work):undefined,
 result:vector(state.result),
 carries:state.carries?vector(state.carries):undefined,
 revised:state.revised?vector(state.revised):undefined,
});};

// Original Adding Money sequence: 5¢, 10¢, $1, $10, $100.
const add=moneyAdditionPlan({a:1275,b:860});
assert.equal(add.actions.length,5);
assert.deepEqual(plain(add.actions.map(action=>action.place)),['c5','c10','d1','d10','d100']);
assert.deepEqual(plain(add.actions.map(action=>action.title)),[
 'Add the ones of cents (0 or 5).',
 'Add the tens of cents.',
 'Add the dollars (ones).',
 'Add the dollars (tens).',
 'Add the dollars (hundreds).',
]);
assert.deepEqual(plain(add.actions.map(action=>action.equation)),['5¢ + 0¢ = 5¢','7 tens + 6 tens = 13','2 + 8 + 1 = 11','1 + 0 + 1 = 2','0 + 0 = 0']);
assert.equal(add.actions[1].exchange,'10 × 10¢ → 1 × $1');
assert.equal(add.actions[2].exchange,'10 × $1 → 1 × $10');
const addStates=[
 {top:[0,1,2,7,1],bottom:[0,0,8,6,0],result:[null,null,null,null,null],carries:[0,0,0,0,0]},
 {top:[0,1,2,7,1],bottom:[0,0,8,6,0],result:[null,null,null,null,1],carries:[0,0,0,0,0]},
 {top:[0,1,3,3,1],bottom:[0,0,8,0,0],result:[null,null,null,3,1],carries:[0,0,1,0,0]},
 {top:[0,2,1,3,1],bottom:[0,0,0,0,0],result:[null,null,1,3,1],carries:[0,1,1,0,0]},
 {top:[0,2,1,3,1],bottom:[0,0,0,0,0],result:[null,2,1,3,1],carries:[0,1,1,0,0]},
 {top:[0,2,1,3,1],bottom:[0,0,0,0,0],result:[0,2,1,3,1],carries:[0,1,1,0,0]},
];
addStates.forEach((expected,step)=>assert.deepEqual(snapshot(add,step),expected,`Addition reveal state ${step} differs from the original sequence.`));
const addStartMat=moneyOperationMat(add,moneyPlanState(add,0),0);
assert.equal((addStartMat.match(/strict-money-bottom/g)||[]).length,5,'Addition needs two rows across five columns.');
assert(addStartMat.includes('data-transition="ready"')&&addStartMat.includes('Align the decimal dots. Begin with 5¢.'));
const addRegroupMat=moneyOperationMat(add,moneyPlanState(add,2),2);
assert(addRegroupMat.includes('data-transition="regroup"'));
assert(addRegroupMat.includes('exchange-token')&&addRegroupMat.includes('renamed-token'),'The exchanged group and new carried token must both be visible.');
assert(addRegroupMat.includes('10 × 10¢ → 1 × $1'));
const addBefore=moneyWrittenAlgorithm({a:1275,b:860},add,moneyPlanState(add,0),0);
assert.equal((addBefore.match(/result-cell" data-place="[^"]+">\?/g)||[]).length,5,'Unrevealed result places must show question marks.');
const addWritten=moneyWrittenAlgorithm({a:1275,b:860},add,moneyPlanState(add,2),2);
assert(addWritten.includes('strict-money-carry-row')&&addWritten.includes('data-place="d1">1</span>'));
assert(moneyOperationStepPanel(add,0).includes('5¢ + 0¢ = ?'));
assert(moneyOperationStepPanel(add,5).includes('$21.35')&&moneyOperationStepPanel(add,5).includes('✓'));
assert.deepEqual(plain(moneyPlanState(add,5).top),plain(moneyPlaceCounts(2135)));

// Original Subtracting Money sequence: subtract immediately when possible;
// otherwise show the adjacent borrow as its own step, then subtract.
const subtract=moneySubtractionPlan({a:3160,b:2090});
assert.deepEqual(plain(subtract.actions.map(action=>action.type==='borrow'?`borrow:${action.from}>${action.to}`:`subtract:${action.place}`)),[
 'subtract:c5','borrow:d1>c10','subtract:c10','subtract:d1','subtract:d10','subtract:d100',
]);
const subStates=[
 {work:[0,3,1,6,0],result:[null,null,null,null,null],revised:[null,null,null,null,null]},
 {work:[0,3,1,6,0],result:[null,null,null,null,0],revised:[null,null,null,null,null]},
 {work:[0,3,0,16,0],result:[null,null,null,null,0],revised:[null,null,0,16,null]},
 {work:[0,3,0,7,0],result:[null,null,null,7,0],revised:[null,null,0,16,null]},
 {work:[0,3,0,7,0],result:[null,null,0,7,0],revised:[null,null,0,16,null]},
 {work:[0,1,0,7,0],result:[null,1,0,7,0],revised:[null,null,0,16,null]},
 {work:[0,1,0,7,0],result:[0,1,0,7,0],revised:[null,null,0,16,null]},
];
subStates.forEach((expected,step)=>assert.deepEqual(snapshot(subtract,step),expected,`Subtraction reveal state ${step} differs from the original sequence.`));
const subStartMat=moneyOperationMat(subtract,moneyPlanState(subtract,0),0);
assert(!subStartMat.includes('strict-money-bottom'),'Subtraction must use one working row.');
const borrowedMat=moneyOperationMat(subtract,moneyPlanState(subtract,2),2);
assert(borrowedMat.includes('data-transition="borrow"')&&borrowedMat.includes('borrowed-token')&&borrowedMat.includes('renamed-token'));
assert(borrowedMat.includes('1 × $1 → 10 × 10¢'));
const takenMat=moneyOperationMat(subtract,moneyPlanState(subtract,3),3);
assert(takenMat.includes('data-transition="subtract"')&&takenMat.includes('removed-token'));
const subWritten=moneyWrittenAlgorithm({a:3160,b:2090},subtract,moneyPlanState(subtract,2),2);
assert(subWritten.includes('strict-money-rename-row')&&subWritten.includes('crossed-digit'));
assert(subWritten.includes('strict-money-dollar">$</b>')&&subWritten.includes('strict-money-decimal">.</b>'));
assert(moneyOperationStepPanel(subtract,1).includes('Rename (borrow) from $1 to 10¢.')&&moneyOperationStepPanel(subtract,1).includes('✓'));
assert(moneyOperationStepPanel(subtract,2).includes('16 − 9 = ?'));
assert.deepEqual(plain(moneyPlanState(subtract,subtract.actions.length).work),plain(moneyPlaceCounts(1070)));

// Across-zero renaming must remain two adjacent, visible borrow steps.
const acrossZero=moneySubtractionPlan({a:2050,b:160});
assert.deepEqual(plain(acrossZero.actions.map(action=>action.type==='borrow'?`borrow:${action.from}>${action.to}`:`subtract:${action.place}`)),[
 'subtract:c5','borrow:d10>d1','borrow:d1>c10','subtract:c10','subtract:d1','subtract:d10','subtract:d100',
]);
assert.deepEqual(snapshot(acrossZero,2).work,[0,1,10,5,0]);
assert.deepEqual(snapshot(acrossZero,3).work,[0,1,9,15,0]);
assert(moneyOperationStepPanel(acrossZero,1).includes('Rename (borrow) from $10 to $1.'));
assert(moneyOperationStepPanel(acrossZero,2).includes('Rename (borrow) from $1 to 10¢.'));
assert.deepEqual(plain(moneyPlanState(acrossZero,acrossZero.actions.length).work),plain(moneyPlaceCounts(1890)));

// A 10¢ token must become exactly two 5¢ tokens, while the written digit becomes 10.
const fiveCentBorrow=moneySubtractionPlan({a:110,b:5});
const fiveBorrow=fiveCentBorrow.actions[0];
assert.deepEqual(plain([fiveBorrow.type,fiveBorrow.from,fiveBorrow.to,fiveBorrow.factor]),['borrow','c10','c5',2]);
assert.deepEqual(snapshot(fiveCentBorrow,1).work,[0,0,1,0,2]);
const fiveMat=moneyOperationMat(fiveCentBorrow,moneyPlanState(fiveCentBorrow,1),1);
assert.equal((fiveMat.match(/renamed-token/g)||[]).length,2);
assert(fiveMat.includes('1 × 10¢ → 2 × 5¢'));
const fiveWritten=moneyWrittenAlgorithm({a:110,b:5},fiveCentBorrow,moneyPlanState(fiveCentBorrow,1),1);
assert(fiveWritten.includes('data-place="c5">10</span>'));
assert.deepEqual(plain(moneyPlanState(fiveCentBorrow,fiveCentBorrow.actions.length).work),plain(moneyPlaceCounts(105)));

console.log('Passed every addition/subtraction reveal state, carry, adjacent borrow, across-zero exchange and written-money marker.');
