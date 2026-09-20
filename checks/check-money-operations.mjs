import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('../engine-src/runtime.js',import.meta.url),'utf8');
const start=source.indexOf('function moneyPlaceCounts');
const end=source.indexOf('function wireMoneySteps');
assert(start>=0&&end>start,'Money operation helpers were not found.');
const context={E:value=>String(value),console};
vm.createContext(context);
vm.runInContext(`${source.slice(start,end)}\nthis.moneyAPI={moneyPlaceCounts,moneyAdditionPlan,moneySubtractionPlan,moneyPlanState,moneyOperationMat,moneyWrittenAlgorithm};`,context);
const {moneyPlaceCounts,moneyAdditionPlan,moneySubtractionPlan,moneyPlanState,moneyOperationMat,moneyWrittenAlgorithm}=context.moneyAPI;
const plain=value=>JSON.parse(JSON.stringify(value));

const add=moneyAdditionPlan({a:1275,b:860});
assert.equal(add.actions.length,5);
assert.deepEqual(plain(add.actions.map(action=>action.place)),['c5','c10','d1','d10','d100']);
assert.deepEqual(plain(moneyPlanState(add,5).top),plain(moneyPlaceCounts(2135)));
assert(add.actions[1].carry===1&&add.actions[1].next==='d1');
const addMat=moneyOperationMat(add,moneyPlanState(add,0),0);
assert.equal((addMat.match(/strict-money-bottom/g)||[]).length,5,'Addition needs two rows across five columns.');
assert(!addMat.includes('× '),'Every token must be drawn individually.');
assert(moneyWrittenAlgorithm({a:1275,b:860},add,moneyPlanState(add,2),2).includes('strict-money-carry-row'));

const subtract=moneySubtractionPlan({a:3160,b:2090});
assert.equal(subtract.actions.filter(action=>action.type==='subtract').length,5);
assert.deepEqual(plain(subtract.actions.filter(action=>action.type==='borrow').map(action=>[action.from,action.to])),[['d1','c10']]);
assert.deepEqual(plain(moneyPlanState(subtract,subtract.actions.length).work),plain(moneyPlaceCounts(1070)));
const subMat=moneyOperationMat(subtract,moneyPlanState(subtract,0),0);
assert(!subMat.includes('strict-money-bottom'),'Subtraction must use one working row.');
assert(moneyWrittenAlgorithm({a:3160,b:2090},subtract,moneyPlanState(subtract,2),2).includes('strict-money-rename-row'));

const acrossZero=moneySubtractionPlan({a:2050,b:160});
assert.deepEqual(plain(acrossZero.actions.filter(action=>action.type==='borrow').map(action=>[action.from,action.to])),[['d10','d1'],['d1','c10']]);
assert.deepEqual(plain(moneyPlanState(acrossZero,acrossZero.actions.length).work),plain(moneyPlaceCounts(1890)));

const fiveCentBorrow=moneySubtractionPlan({a:110,b:5});
const fiveBorrow=fiveCentBorrow.actions.find(action=>action.type==='borrow');
assert.deepEqual(plain([fiveBorrow.from,fiveBorrow.to]),['c10','c5']);
assert(fiveBorrow.detail.includes('2 5¢ pieces'));
assert.deepEqual(plain(moneyPlanState(fiveCentBorrow,fiveCentBorrow.actions.length).work),plain(moneyPlaceCounts(105)));

console.log('Passed strict money operation sequences, exchanges and mat structure.');
