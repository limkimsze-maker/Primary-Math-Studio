// Pure configuration, generation and answer checking. Also embedded in offline HTML.
export const ENGINE_NAMES = {place:'Place value',operations:'Operations & grouping',numberline:'Number line',bar:'Bar models',money:'Money',fraction:'Fractions',time:'Time',geometry:'Shapes, angles & lines',area:'Area & perimeter',graph:'Graphs',explain:'Explain your thinking',error:'Error analysis'};
export const LIMITS = {1:100,2:1000,3:10000};
const pair=(v,label,min,max,step=1)=>({key:v,label,min,max,step,type:'number'});
const select=(key,label,options)=>({key,label,options,type:'select'});
const time24Field=(key,label)=>({key,label,type:'time24',maxLength:4});
export function tasks(engine,grade) {
 const all={
 place:[['read','Read blocks or discs'],['hundred','Explore numbers to 100 · Hundred chart & flip chart'],['digit','Value of a digit'],['more','More than a number'],['less','Less than a number']],
 operations:[...(grade===1?[['count-on-back','Addition / subtraction within 10 · Count on / count back'],['fact-family','Fact family'],['within-20','Adding & subtracting within 20 · Strategies']]:[]),['add','Add step by step'],['subtract','Subtract step by step'],['multiply','Multiply: equal groups'],['share','Divide: share equally'],['group','Divide: make equal groups'],...(grade===3?[['multiply-column','Multiply: place-value algorithm'],['divide-column','Divide: place-value algorithm']]:[])],
 numberline:[['point','Find the missing number'],['add','Find a number more'],['subtract','Find a number less'],['pattern','Complete a number pattern']],
 bar:[['whole','Part–whole: find the whole'],['part','Part–whole: find a part'],['compare','Comparison: find the difference'],['change','Change: find what remains'],['groups','Equal groups: find the total']],
 money:[['count','Count money · Big to small'],['convert','Convert cents ↔ dollars'],['make','Saving Quest · $1 / $10 / $100'],['add','Add money · Step by step'],['subtract','Subtract money · Step by step'],['word','Money word problems · Model']],
 fraction:[['write','1 · Writing Fractions'],['unit-compare','2 · Comparing Unit Fractions'],['like-compare','3 · Comparing Like Fractions'],['like-add','4 · Adding Like Fractions'],['like-subtract','5 · Subtracting Like Fractions'],...(grade===3?[['equivalent','6 · Equivalent Fractions'],['simplify','7 · Simplifying Fractions'],['unlike-compare','8 · Comparing & Ordering Unlike Fractions'],['unlike-add','9 · Adding Unlike Fractions'],['unlike-subtract','10 · Subtracting Unlike Fractions']]:[])],
 time:grade===1?[['read','1 · Read clocks · 5-minute intervals'],['set','2 · Set clocks · 5-minute intervals'],['ampm','3 · Read clock · a.m. / p.m.'],['duration','4 · Find a 30 min / 1 h interval']]:grade===2?[['read','1 · Read clocks · 1-minute intervals'],['set','2 · Set clocks · 1-minute intervals'],['duration','3 · Find duration · h and min'],['later','4 · Find the finishing time'],['convert-duration','5 · Convert h and min ↔ min']]:[['seconds','1 · Measure duration · seconds'],['duration','2 · Find elapsed time · 24-hour timeline'],['endtime','3 · Find the finishing time · 24-hour'],['starttime','4 · Find the starting time · 24-hour'],['twentyfour','5 · 12-hour clock → 24-hour time'],['twelvehour','6 · 24-hour time → 12-hour time']],
 geometry:[['shape','Name a 2D shape'],['sides','Count sides'],...(grade>=2?[['solid','Name a 3D shape']]:[]),...(grade===3?[['angle','Compare with a right angle'],['lines','Parallel or perpendicular']]:[])],
 area:[['area','Area of a rectangle'],['perimeter','Perimeter of a rectangle'],['compare','Same area, different perimeter']],
 graph:[['read','Read a category'],['total','Find the total'],['difference','Compare categories']],
 explain:[['add','Explain an addition model'],['groups','Explain equal groups'],...(grade>=2?[['fraction','Explain equal parts']]:[]),...(grade===3?[['perimeter','Explain perimeter']]:[])],
 error:[['place','Find a place-value error'],['add','Correct an addition error'],...(grade>=2?[['fraction','Correct a fraction error'],['time','Correct a time error']]:[]),...(grade===3?[['perimeter','Correct area / perimeter confusion']]:[])],
 }; return all[engine]||[];
}
export function fields(c) {
 const max=LIMITS[c.grade], small=c.grade===1?20:c.grade===2?100:1000;
 switch(c.engine){
 case 'place':return c.task==='hundred'?[pair('a','Starting number (0–100)',0,100),pair('leftAmount','Yellow-button amount',1,100),pair('rightAmount','Blue-button amount',1,100)]:[pair('a',['more','less'].includes(c.task)?'Starting number':'Number to show',0,max),...(['more','less'].includes(c.task)?[pair('b',c.task==='more'?'How much more?':'How much less?',1,max)]:[]),...(c.task==='digit'?[select('place','Place to focus on',[['1','Ones'],['10','Tens'],...(c.grade>=2?[['100','Hundreds']]:[]),...(c.grade===3?[['1000','Thousands']]:[])])]:[]),select('representation','Model',[['blocks','Base-ten blocks'],['discs','Place-value discs']])];
 case 'operations':if(['count-on-back','fact-family','within-20'].includes(c.task))return [];return [pair('a',c.task==='multiply-column'?'Number in each group (multiplicand)':c.task==='divide-column'?'Number to divide (dividend)':['share','group'].includes(c.task)?'Total counters':c.task==='multiply'?'Number of groups':'First number',0,c.task.endsWith('-column')?999:['multiply','share','group'].includes(c.task)?100:max),pair('b',c.task==='multiply-column'?'Number of groups (multiplier)':c.task==='divide-column'?'Number of groups (divisor)':['share','group'].includes(c.task)?c.task==='share'?'Number of groups':'Counters in each group':c.task==='multiply'?'Counters in each group':'Second number',c.task==='add'||c.task==='subtract'?0:1,['add','subtract'].includes(c.task)?max:c.task.endsWith('-column')?9:10),...(['add','subtract'].includes(c.task)?[select('representation','Model',[['discs','Place-value discs'],['blocks','Base-ten blocks']])]:[])];
 case 'numberline':return c.task==='pattern'?[pair('a','Start number',0,max),select('patternType','Pattern type',[['constant','Constant change'],['alternating','Alternating changes']]),pair('b',c.patternType==='alternating'?'First change (+ or −)':'Change each time (+ or −)',-small,small),...(c.patternType==='alternating'?[pair('b2','Second change (+ or −)',-small,small)]:[]),select('missing','Missing numbers',[['2','2 · Easy'],['3','3 · Medium'],['4','4 · Hard']])]:[pair('a',c.task==='point'?'Missing number':'Start number',0,max),pair('b',c.task==='point'?'Tick interval':'Jump size',1,c.task==='point'?Math.max(10,max/10):small)];
 case 'bar':return [pair('a',c.task==='groups'?'Number of groups':c.task==='whole'?'First part':c.task==='part'?'Whole':'Starting / larger amount',1,c.task==='groups'?10:max),pair('b',c.task==='groups'?'Amount in each group':c.task==='whole'?'Second part':c.task==='part'?'Known part':c.task==='compare'?'Smaller amount':'Amount removed',1,c.task==='groups'?10:max),{key:'context',label:'Objects in the story',type:'text',maxLength:30}];
 case 'money':{
  const moneyMax=c.grade===1?10000:99995;
  const format=select('format','Answer format',[['mixed','Dollars and cents'],['cents','Cents only']]);
  if(c.task==='convert')return [pair('a',c.direction==='money-to-cents'?'Amount in dollars and cents':'Amount in cents',5,moneyMax,5),select('direction','Conversion direction',[['cents-to-money','Cents → dollars and cents'],['money-to-cents','Dollars and cents → cents']])];
  if(c.task==='make')return [select('target','Savings Quest level',[['100','Make $1'],['1000','Make $10'],['10000','Make $100']]),format];
  if(['add','subtract'].includes(c.task))return [pair('a','First amount',5,moneyMax,5),pair('b','Second amount',5,moneyMax,5),format];
  if(c.task==='word')return [];
  return [pair('a','Amount to show',5,moneyMax,5),format];
 }
 case 'fraction':{
  const ordering=['unit-compare','like-compare','unlike-compare'].includes(c.task),three=ordering&&c.orderMode!=='compare';
  if(c.task==='write')return [pair('den','Total equal parts',2,12),pair('a','Shaded parts',1,12)];
  if(c.task==='unit-compare')return [pair('den','First denominator',2,12),pair('den2','Second denominator',2,12),select('orderMode','Question form',[['compare','Compare two'],['ascending','Order least to greatest'],['descending','Order greatest to least']]),...(three?[pair('den3','Third denominator',2,12)]:[])];
  if(c.task==='like-compare')return [pair('den','Common denominator',2,12),pair('a','First numerator',1,12),pair('b','Second numerator',1,12),select('orderMode','Question form',[['compare','Compare two'],['ascending','Order least to greatest'],['descending','Order greatest to least']]),...(three?[pair('cnum','Third numerator',1,12)]:[])];
  if(c.task==='unlike-compare')return [pair('den','First denominator',2,12),pair('a','First numerator',1,12),pair('den2','Second denominator',2,12),pair('b','Second numerator',1,12),select('orderMode','Question form',[['compare','Compare two'],['ascending','Order least to greatest'],['descending','Order greatest to least']]),...(three?[pair('den3','Third denominator',2,12),pair('cnum','Third numerator',1,12)]:[])];
  if(c.task==='equivalent')return [pair('den','Starting denominator',2,6),pair('a','Starting numerator',1,5),pair('factor','Split each part into',2,4)];
  if(c.task==='simplify')return [pair('den','Denominator',2,12),pair('a','Numerator',1,11)];
  return [pair('den','First denominator',2,12),pair('a',c.task.includes('subtract')?'Starting numerator':'First numerator',1,12),pair('b','Second numerator',1,12),...(['unlike-add','unlike-subtract'].includes(c.task)?[pair('den2','Second denominator',2,12)]:[])];
 }
 case 'time':{
  const minuteStep=c.grade===1?5:1;
  if(c.task==='ampm')return [pair('a','Clock hour (1–12)',1,12),pair('b','Minute',0,59,minuteStep),select('sky','Sky clue',[['morning','Morning · sun'],['afternoon','Afternoon · sun'],['night','Night · moon'],['overnight','Early morning · moon & owl']])];
  if(c.grade===3&&c.task==='duration')return [time24Field('startTime','Start time (24-hour, h)'),time24Field('endTime','End time (24-hour, h)')];
  if(c.grade===3&&['endtime','starttime'].includes(c.task))return [time24Field('clockTime',c.task==='endtime'?'Start time (24-hour, h)':'End time (24-hour, h)'),pair('duration','Duration (min)',1,720)];
  if(c.grade===3&&c.task==='twentyfour')return [pair('a','Clock hour (1–12)',1,12),pair('b','Minute',0,59),select('sky','Sky clue',[['morning','Morning · sun'],['afternoon','Afternoon · sun'],['night','Night · moon'],['overnight','Early morning · moon & owl']])];
  if(c.grade===3&&c.task==='twelvehour')return [time24Field('clockTime','24-hour time (h)')];
  if(c.grade===3&&c.task==='seconds')return c.secondsDirection==='from-seconds'?[pair('a','Seconds',1,599),select('secondsDirection','Conversion',[['to-seconds','Minutes and seconds → seconds'],['from-seconds','Seconds → minutes and seconds']])]:[pair('a','Minutes',0,5),pair('b','Seconds',0,59),select('secondsDirection','Conversion',[['to-seconds','Minutes and seconds → seconds'],['from-seconds','Seconds → minutes and seconds']])];
  if(c.grade===2&&c.task==='convert-duration')return c.durationDirection==='from-minutes'?[pair('a','Minutes',1,360),select('durationDirection','Conversion',[['to-minutes','Hours and minutes → minutes'],['from-minutes','Minutes → hours and minutes']])]:[pair('a','Hours',0,5),pair('b','Minutes',0,59),select('durationDirection','Conversion',[['to-minutes','Hours and minutes → minutes'],['from-minutes','Minutes → hours and minutes']])];
  if(c.task==='duration')return [pair('a','Start hour (1–12)',1,12),pair('b','Start minute',0,59,minuteStep),pair('duration',c.grade===1?'Interval (min)':'Duration (min)',c.grade===1?30:1,c.grade===1?60:360,c.grade===1?30:1)];
  if(['read','set','later'].includes(c.task))return [pair('a','Hour (1–12)',1,12),pair('b','Minute',0,59,minuteStep),...(c.task==='later'?[pair('duration','Minutes later',1,180)]:[])];
  return [];
 }
 case 'geometry':return [...(['shape','sides'].includes(c.task)?[select('shape','2D shape',[['square','Square'],['rectangle','Rectangle'],['triangle','Triangle'],['circle','Circle'],['semicircle','Semicircle'],['quarter','Quarter-circle']])]:[]),...(c.task==='solid'?[select('solid','3D shape',[['cube','Cube'],['cuboid','Cuboid'],['cone','Cone'],['cylinder','Cylinder'],['sphere','Sphere']])]:[]),...(c.task==='angle'?[select('angle','Angle type',[['less','Less than a right angle'],['right','Right angle'],['greater','Greater than a right angle']])]:[]),...(c.task==='lines'?[select('lines','Line relationship',[['parallel','Parallel'],['perpendicular','Perpendicular'],['neither','Neither']])]:[])];
 case 'area':return [pair('a','Length (cm)',1,12),pair('b','Width (cm)',1,10),...(c.task==='compare'?[pair('cols2','Second rectangle length (cm)',1,12),pair('rows2','Second rectangle width (cm)',1,10)]:[])];
 case 'graph':return [{key:'labels',label:'Category names (comma separated)',type:'text',maxLength:80},{key:'values',label:'Counts (comma separated)',type:'text',maxLength:80},pair('key','One picture / tick represents',1,c.grade===1?1:10),select('graphType','Graph type',[['picture','Picture graph'],...(c.grade===3?[['bar','Bar graph']]:[])]),select('category','Ask about category',[['0','First'],['1','Second'],['2','Third']])];
 case 'explain':return c.task==='fraction'?[pair('den','Equal parts',2,12),pair('a','Shaded parts',1,11)]:c.task==='perimeter'?[pair('a','Length (cm)',1,12),pair('b','Width (cm)',1,10)]:[pair('a',c.task==='groups'?'Number of groups':'First part',1,c.task==='groups'?10:small),pair('b',c.task==='groups'?'Counters in each group':'Second part',1,c.task==='groups'?10:small)];
 case 'error':return c.task==='fraction'?[pair('den','Equal parts',3,12),pair('a','Shaded parts',1,11)]:c.task==='time'?[pair('a','Clock hour (1–12)',1,12),pair('b','Minute',5,55)]:c.task==='perimeter'?[pair('a','Length (cm)',1,12),pair('b','Width (cm)',1,10)]:[pair('a','First / shown number',c.task==='place'?10:1,c.task==='place'?99:LIMITS[c.grade]),...(c.task==='add'?[pair('b','Second number',1,LIMITS[c.grade])]:[])];
 default:return [];
 }
}
export function defaults(engine,grade=3,task){
 if(engine==='fraction'&&grade===1)grade=2;if(engine==='area')grade=3;
 const t=task||tasks(engine,grade)[0][0];
 let c={version:1,engine,grade,task:t,mode:'fixed',count:1,a:24,b:8,place:10,context:'stickers',den:8,den2:4,den3:8,cnum:7,factor:2,orderMode:'compare',format:'mixed',direction:'cents-to-money',target:'100',wordType:'total',duration:45,durationDirection:'to-minutes',secondsDirection:'to-seconds',clockTime:'0325',startTime:'0535',endTime:'1635',sky:'night',shape:'triangle',solid:'cube',angle:'right',lines:'parallel',cols2:4,rows2:6,labels:'Apples, Bananas, Pears',values:'12, 8, 16',key:2,category:0,graphType:'picture'};
 if(engine==='place'){c.a=t==='more'?grade===1?29:grade===2?199:999:t==='less'?grade===1?30:grade===2?200:1000:grade===1?34:grade===2?234:2034;c.b=1;}
 if(engine==='place'&&t==='hundred'){c.a=50;c.leftAmount=10;c.rightAmount=1;}
 if(engine==='operations'){c.a=grade===1?28:grade===2?248:1248;c.b=grade===1?17:grade===2?175:675;if(['multiply','share','group'].includes(t)){c.a=t==='multiply'?4:grade===1?20:24;c.b=t==='multiply'?grade===1?5:6:grade===1?5:4;}}
 if(engine==='operations'&&t==='multiply-column'){c.a=348;c.b=4;}if(engine==='operations'&&t==='divide-column'){c.a=246;c.b=2;}
 if(engine==='numberline'){c.a=grade===1?24:grade===2?240:2400;c.b=t==='point'?grade===1?1:grade===2?10:100:grade===1?5:grade===2?20:200;c.b2=grade===1?2:grade===2?10:100;c.patternType='constant';c.missing='2';}
 if(engine==='bar'){c.a=t==='groups'?4:24;c.b=t==='groups'?6:8;}
 if(engine==='money'){
  c.a=grade===1?75:t==='convert'?140:1275;c.b=grade===1?20:t==='subtract'?860:860;
  c.target=String(grade===1?100:grade===2?1000:10000);c.direction='cents-to-money';c.wordType='total';
  if(t==='subtract'){c.a=grade===1?95:3160;c.b=grade===1?30:2090;}
  if(t==='word'){c.a=grade===1?75:1275;c.b=grade===1?20:860;c.wordType='compare';}
  if(t==='count'&&grade===1)c.format='cents';
 }
 if(engine==='fraction'){
  c.a=3;c.b=2;c.den=8;c.den2=4;c.den3=8;c.cnum=7;c.factor=2;c.orderMode='compare';
  if(t==='unit-compare'){c.a=1;c.b=1;c.den=3;c.den2=5;c.den3=8;}
  if(t==='like-compare'){c.a=3;c.b=5;c.cnum=7;c.den=8;c.den2=8;c.den3=8;}
  if(t==='like-subtract'){c.a=5;c.b=2;c.den=8;}
  if(t==='equivalent'){c.a=2;c.den=3;c.factor=2;}
  if(t==='simplify'){c.a=4;c.den=8;}
  if(t==='unlike-compare'){c.a=1;c.den=2;c.b=3;c.den2=4;c.cnum=5;c.den3=8;}
  if(t==='unlike-add'){c.a=1;c.den=2;c.b=1;c.den2=4;}
  if(t==='unlike-subtract'){c.a=3;c.den=4;c.b=1;c.den2=2;}
 }
 if(engine==='time'){
  c.a=3;c.b=grade===1?30:25;c.clockTime=grade===1?'0330':'0325';c.duration=grade===1?30:45;
  if(grade===1&&t==='duration'){c.a=8;c.b=15;c.duration=30;}
  if(grade===1&&t==='ampm'){c.a=7;c.b=0;c.sky='morning';}
  if(grade===2&&t==='duration'){c.a=10;c.b=45;c.duration=95;}
  if(grade===2&&t==='later'){c.a=11;c.b=40;c.duration=55;}
  if(grade===2&&t==='convert-duration'){c.durationDirection='to-minutes';c.a=2;c.b=15;}
  if(grade===3&&t==='duration'){c.startTime='0535';c.endTime='1635';}
  if(grade===3&&t==='endtime'){c.clockTime='1140';c.duration=55;}
  if(grade===3&&t==='starttime'){c.clockTime='1610';c.duration=45;}
  if(grade===3&&t==='seconds'){c.secondsDirection='to-seconds';c.a=1;c.b=20;}
  if(grade===3&&t==='twelvehour'){c.clockTime='2040';}
  if(grade===3&&t==='twentyfour'){c.a=2;c.b=35;c.sky='overnight';}
 }
 if(engine==='area'){c.a=6;c.b=4;}if(engine==='graph'&&grade===1)c.key=1;
 if(engine==='explain'){c.a=t==='fraction'?3:t==='perimeter'?6:t==='groups'?4:12;c.b=t==='perimeter'?4:t==='groups'?6:8;}
 if(engine==='error'){c.a=t==='fraction'?3:t==='time'?3:t==='perimeter'?6:t==='place'?34:28;c.b=t==='time'?25:t==='perimeter'?4:17;}
 c.representation=engine==='place'?'blocks':'discs';return c;
}
export function fractionGcd(a,b){a=Math.abs(Number(a));b=Math.abs(Number(b));while(b)[a,b]=[b,a%b];return a||1;}
export function fractionLcm(a,b){return Math.abs(a*b)/fractionGcd(a,b);}
export function simplestFraction(n,d){const factor=fractionGcd(n,d);return [n/factor,d/factor];}
function padTime(value){return String(value).padStart(2,'0');}
function time24Minutes(value){const digits=String(value??'').trim(),match=/^([01]\d|2[0-3])([0-5]\d)$/.exec(digits);return match?Number(match[1])*60+Number(match[2]):null;}
function formatTime24(total){const minute=((Number(total)%1440)+1440)%1440;return `${padTime(Math.floor(minute/60))}${padTime(minute%60)}`;}
function formatTime24Digits(total){return formatTime24(total);}
function formatTime24H(total){return `${formatTime24(total)} h`;}
function clockPartsFrom24(total){const minute=((Number(total)%1440)+1440)%1440,hour24=Math.floor(minute/60);return [hour24%12||12,minute%60];}
function formatDuration(total){const minutes=Math.max(0,Number(total)||0),hours=Math.floor(minutes/60),remaining=minutes%60;return hours&&remaining?`${hours} h ${remaining} min`:hours?`${hours} h`:`${remaining} min`;}
function analogueTo24Minutes(hour,minute,sky){const h=Number(hour)%12;const hour24=sky==='morning'||sky==='overnight'?h:sky==='afternoon'?(h===0?12:h+12):h+12;return hour24*60+Number(minute);}
function skyFor24(total){const hour=Math.floor((((Number(total)%1440)+1440)%1440)/60);return hour<6?'overnight':hour<12?'morning':hour<18?'afternoon':'night';}

export function validate(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Choose a valid settings file.');
 if(!Object.hasOwn(ENGINE_NAMES,raw.engine))throw Error('Unknown engine.');
 const g=Number(raw.grade);if(![1,2,3].includes(g))throw Error('Choose Primary 1, 2 or 3.');
 if(raw.engine==='fraction'&&g===1)throw Error('Use the fractions presets for P2 or P3.');if(raw.engine==='area'&&g!==3)throw Error('Area and perimeter presets start at P3.');
 if(!tasks(raw.engine,g).some(t=>t[0]===raw.task))throw Error('Choose a task available for this grade.');
 const c={...defaults(raw.engine,g,raw.task),...raw,grade:g};
 if(!['fixed','random'].includes(c.mode))throw Error('Choose fixed numbers or random practice.');
 if(c.engine==='place'&&c.task==='hundred'&&c.mode!=='fixed')throw Error('Hundred chart & flip chart uses a fixed starting number for exploration.');
 c.count=Number(c.count);if(!Number.isInteger(c.count)||c.count<1||c.count>20)throw Error('Use 1–20 questions.');
 if(c.mode==='fixed')c.count=1;
 for(const f of fields(c)){
  if(f.type==='number'){c[f.key]=Number(c[f.key]);if(!Number.isInteger(c[f.key])||c[f.key]<f.min||c[f.key]>f.max)throw Error(`${f.label}: use a whole number from ${f.min} to ${f.max}.`);}
  if(f.type==='time24'){const minute=time24Minutes(c[f.key]);if(minute===null)throw Error(`${f.label}: use exactly four digits, for example 0535.`);c[f.key]=formatTime24(minute);}
  if(f.type==='text'){if(typeof c[f.key]!=='string'||c[f.key].length>f.maxLength)throw Error(`${f.label}: use at most ${f.maxLength} characters.`);}
  if(f.type==='select'){c[f.key]=String(c[f.key]);if(!f.options.some(o=>o[0]===c[f.key]))throw Error(`Choose a valid ${f.label.toLowerCase()}.`);}
 }
 if(c.engine==='time'&&g===3&&c.task==='duration'){
  const start=time24Minutes(c.startTime),end=time24Minutes(c.endTime);
  if(start===null||end===null)throw Error('Use four-digit 24-hour times, for example 0535.');
  if(start===end)throw Error('Choose different start and end times.');
  c.startTime=formatTime24(start);c.endTime=formatTime24(end);
 }
 if(c.engine==='time'&&(c.task==='ampm'||g===3&&c.task==='twentyfour')){
  const hour=Number(c.a),matchesSky=c.sky==='morning'?hour>=6&&hour<=11:c.sky==='afternoon'||c.sky==='overnight'?[12,1,2,3,4,5].includes(hour):[6,7,8,9,10,11].includes(hour);
  if(!matchesSky)throw Error(c.sky==='morning'?'For a morning sun, choose 6 to 11 on the clock.':c.sky==='afternoon'?'For an afternoon sun, choose 12 to 5 on the clock.':c.sky==='night'?'For a night moon, choose 6 to 11 on the clock.':'For a moon and owl, choose 12 to 5 on the clock.');
 }
 c.place=Number(c.place);c.category=Number(c.category);
 if(c.engine==='numberline'&&c.task==='pattern'&&(c.b===0||(c.patternType==='alternating'&&c.b2===0)))throw Error('Use a non-zero change in the number pattern.');
 if(c.engine==='numberline'&&c.task==='pattern'){const values=sequenceValues({...c,a:0});if(Math.max(...values)-Math.min(...values)>LIMITS[g])throw Error(`Choose changes that can fit within 0 and ${LIMITS[g]}.`);}
 if(c.engine==='graph'&&c.labels.split(',').map(s=>s.trim()).filter(Boolean).length!==3)throw Error('Enter exactly 3 category names, separated by commas.');
 if(c.mode==='random')return c;
 const cap=LIMITS[g];
 if(c.engine==='place'&&((c.task==='more'&&c.a+c.b>cap)||(c.task==='less'&&c.b>c.a)))throw Error(`Keep the starting number and answer between 0 and ${cap}.`);
 if(c.engine==='operations'){
  if(c.task==='add'&&c.a+c.b>cap)throw Error(`The total must stay within ${cap}.`);
  if(c.task==='subtract'&&c.b>c.a)throw Error('The second number must not exceed the first.');
  if(['share','group'].includes(c.task)&&(c.a===0||c.a%c.b!==0||c.a/c.b>10))throw Error('Use equal groups with no remainder and at most 10 counters or groups in the answer.');
  if(g===1&&c.task==='multiply'&&c.a*c.b>40)throw Error('P1 multiplication presets stay within 40.');
  if(g===1&&['share','group'].includes(c.task)&&c.a>20)throw Error('P1 division presets stay within 20 counters.');
  if(c.task==='multiply'&&(c.a<1||c.a>10))throw Error('Use 1–10 groups.');
 }
 if(c.engine==='numberline'&&((c.task==='subtract'&&c.b>c.a)||(c.task==='add'&&c.a+c.b>cap)))throw Error(`Keep the number line between 0 and ${cap}.`);
 if(c.engine==='numberline'&&c.task==='pattern'&&sequenceValues(c).some(value=>value<0||value>cap))throw Error(`Keep every number in the pattern between 0 and ${cap}.`);
 if(c.engine==='numberline'&&c.task==='point'&&c.a%c.b!==0)throw Error('The missing number must lie on a whole tick interval.');
 if(c.engine==='bar'){
  if(['part','compare','change'].includes(c.task)&&c.b>c.a)throw Error('The known / smaller amount must not exceed the whole / larger amount.');
  if(c.task==='whole'&&c.a+c.b>cap)throw Error(`The whole must stay within ${cap}.`);
  if(!c.context.trim())throw Error('Enter an object name for the story.');
 }
 if(c.engine==='error'&&c.task==='place'&&c.a%10===Math.floor(c.a/10))throw Error('Choose different tens and ones digits so the swapped reading is wrong.');
 if(c.engine==='money'){
  const used=[...(['count','convert'].includes(c.task)?[c.a]:[]),...(['add','subtract','word'].includes(c.task)?[c.a,c.b]:[])];
  if(used.some(v=>v%5!==0))throw Error('Use amounts in 5-cent intervals.');
  if(c.task==='count'&&c.format==='dollars'&&c.a%100!==0)throw Error('Whole dollars only requires an amount with 0 cents.');
  if(c.task==='add'&&c.a+c.b>(g===1?10000:99995))throw Error(`Keep the total within ${g===1?'$100.00':'$999.95'}.`);
  if(c.task==='subtract'&&c.b>c.a)throw Error('The second amount must not exceed the first amount.');
  if(c.task==='word'&&['change','compare'].includes(c.wordType)&&c.b>c.a)throw Error('For this problem, the second amount must not exceed the first amount.');
  if(c.task==='word'&&c.wordType==='total'&&c.a+c.b>(g===1?10000:99995))throw Error(`Keep the total within ${g===1?'$100.00':'$999.95'}.`);
 }
 if(c.engine==='fraction'||(['explain','error'].includes(c.engine)&&c.task==='fraction')){
  if(c.a>c.den)throw Error('The numerator cannot exceed its denominator.');
  if(c.engine==='error'&&(c.a===0||c.a===c.den||c.a===c.den-c.a))throw Error('Choose a fraction with some shaded and unshaded parts; avoid exactly half for this error.');
  if(c.engine==='fraction'){
   const compare=['unit-compare','like-compare','unlike-compare'].includes(c.task),ordering=compare&&c.orderMode!=='compare';
   if(c.task==='unit-compare'){c.a=1;c.b=1;c.cnum=1;}
   if(['like-compare','like-add','like-subtract'].includes(c.task)){c.den2=c.den;c.den3=c.den;}
   if(compare&&c.b>c.den2||ordering&&c.cnum>c.den3)throw Error('Each numerator must not exceed its denominator.');
   if(c.task==='unlike-compare'&&c.den===c.den2)throw Error('Choose different denominators for unlike fractions.');
   if(ordering&&c.task==='unlike-compare'&&new Set([c.den,c.den2,c.den3]).size<3)throw Error('Use three different denominators for unlike-fraction ordering.');
   if(ordering){const values=[[c.a,c.den],[c.b,c.den2],[c.cnum,c.den3]];if(new Set(values.map(([n,d])=>n/d)).size<3)throw Error('Use three fractions with different values for ordering.');}
   if(c.task==='simplify'&&fractionGcd(c.a,c.den)===1)throw Error('Choose a fraction that can be simplified.');
   if(c.task==='equivalent'&&c.a>=c.den)throw Error('Use a proper starting fraction.');
   if(['like-add','like-subtract','unlike-add','unlike-subtract'].includes(c.task)){
    const d2=c.task.startsWith('like-')?c.den:c.den2;if(c.b>d2)throw Error('The second numerator cannot exceed its denominator.');
    if(c.task.startsWith('unlike-')&&c.den%d2&&d2%c.den)throw Error('Use related denominators so only one fraction needs to change.');
    if(c.task.endsWith('add')&&c.a/c.den+c.b/d2>1)throw Error('Keep the sum at or below one whole.');
    if(c.task.endsWith('subtract')&&c.b/d2>c.a/c.den)throw Error('The second fraction must not exceed the first.');
   }
  }
 }
 if(c.engine==='time'&&g===1&&['read','set','ampm','duration'].includes(c.task)&&c.b%5!==0)throw Error('P1 clock times use five-minute intervals.');
 if(c.engine==='time'&&g===1&&c.task==='duration'&&![30,60].includes(c.duration))throw Error('P1 duration presets use half an hour or one hour.');
 if(c.engine==='time'&&g===2&&c.task==='convert-duration'&&c.durationDirection==='to-minutes'&&c.a===0&&c.b===0)throw Error('Use a duration greater than 0 min.');
 if(c.engine==='time'&&g===3&&c.task==='seconds'&&c.secondsDirection==='to-seconds'&&c.a===0&&c.b===0)throw Error('Use a duration greater than 0 s.');
 if(c.engine==='error'&&c.task==='time'&&c.b%5!==0)throw Error('Use a five-minute interval for this clock error.');
 if(c.engine==='area'&&c.task==='compare'&&c.a*c.b!==c.cols2*c.rows2)throw Error('Use two rectangles with the same area.');
 if(c.engine==='error'&&c.task==='perimeter'&&c.a*c.b===2*(c.a+c.b))throw Error('Choose dimensions whose area and perimeter have different numerical values.');
 if(c.engine==='graph'){
  const vs=c.values.split(',').map(s=>Number(s.trim())),ls=c.labels.split(',').map(s=>s.trim());
  if(vs.length!==3||ls.length!==3||ls.some(s=>!s)||vs.some(v=>!Number.isInteger(v)||v<0||v>60||v%c.key))throw Error('Enter 3 category names and 3 whole counts from 0–60, each divisible by the key.');
 }
 return c;
}
const int=(r,min,max)=>Math.floor(r()*(max-min+1))+min;
const choose=(r,a)=>a[int(r,0,a.length-1)];
export function generatedConfig(c,r=Math.random){
 if(c.mode==='fixed')return {...c};const p={...c},g=c.grade,cap=LIMITS[g];
 const small=g===1?40:g===2?400:4000,fieldSmall=g===1?100:g===2?1000:10000;
 switch(c.engine){
 case 'place':if(['more','less'].includes(c.task)){p.b=c.b;p.a=int(r,c.task==='less'?p.b:0,c.task==='more'?cap-p.b:cap);}else p.a=int(r,1,cap-1);break;
 case 'operations':
  if(c.task.endsWith('-column')){p.a=int(r,10,999);p.b=int(r,2,9);}else if(['multiply','share','group'].includes(c.task)){const ns=g===1?[2,5,10]:[2,3,4,5,6,7,8,9,10];const b=choose(r,g===1?[2,5,10]:g===2?[2,3,4,5,10]:ns),a=int(r,1,g===1?Math.min(10,Math.floor((c.task==='multiply'?40:20)/b)):10);p.b=b;p.a=c.task==='multiply'?a:a*b;}else{p.a=int(r,1,small);p.b=int(r,1,c.task==='subtract'?p.a:small);}break;
 case 'numberline':{
  if(c.task==='pattern'){
   const offsets=sequenceValues({...c,a:0}),lo=-Math.min(...offsets),hi=cap-Math.max(...offsets);p.a=int(r,lo,hi);
  }else if(c.task==='point')p.a=int(r,1,Math.floor(cap/c.b))*c.b;
  else p.a=c.task==='subtract'?int(r,c.b,cap):int(r,0,cap-c.b);
  break;
 }
 case 'bar':p.a=int(r,2,c.task==='groups'?10:small);p.b=int(r,1,['part','compare','change'].includes(c.task)?p.a:c.task==='groups'?10:small);break;
 case 'money':{
  const moneyCap=g===1?10000:g===2?20000:99995;
  const amount=max=>int(r,1,Math.max(1,Math.floor(max/5)))*5;
  if(c.task==='make')p.target=String(choose(r,g===1?[100]:g===2?[100,1000]:[100,1000,10000]));
  else if(c.task==='count')p.a=c.format==='dollars'?int(r,1,Math.floor(moneyCap/100))*100:amount(moneyCap);
  else if(c.task==='convert')p.a=amount(moneyCap);
  else if(c.task==='add'||c.task==='word'&&c.wordType==='total'){p.a=amount(moneyCap-5);p.b=amount(moneyCap-p.a);}
  else{p.a=amount(moneyCap);p.b=amount(p.a);}
  break;
 }
 case 'fraction':{
  if(c.task==='write'){p.den=int(r,2,12);p.a=int(r,1,p.den);break;}
  if(c.task==='unit-compare'){
   const ds=[2,3,4,5,6,8,10,12],pick=()=>choose(r,ds);p.a=p.b=p.cnum=1;p.den=pick();do p.den2=pick();while(p.den2===p.den);do p.den3=pick();while([p.den,p.den2].includes(p.den3));break;
  }
  if(c.task==='like-compare'){
   p.den=int(r,3,12);const values=Array.from({length:p.den},(_,i)=>i+1);p.a=choose(r,values);do p.b=choose(r,values);while(p.b===p.a);do p.cnum=choose(r,values);while([p.a,p.b].includes(p.cnum));p.den2=p.den3=p.den;break;
  }
  if(c.task==='like-add'){p.den=int(r,3,12);p.a=int(r,1,p.den-1);p.b=int(r,1,p.den-p.a);p.den2=p.den;break;}
  if(c.task==='like-subtract'){p.den=int(r,3,12);p.a=int(r,2,p.den);p.b=int(r,1,p.a-1);p.den2=p.den;break;}
  if(c.task==='equivalent'){p.den=int(r,2,6);p.a=int(r,1,p.den-1);p.factor=c.factor;break;}
  if(c.task==='simplify'){
   const baseDen=int(r,2,6),validFactors=Array.from({length:4},(_,i)=>i+2).filter(f=>baseDen*f<=12),factor=choose(r,validFactors),validNums=Array.from({length:baseDen-1},(_,i)=>i+1).filter(n=>fractionGcd(n,baseDen)===1),baseNum=choose(r,validNums);p.a=baseNum*factor;p.den=baseDen*factor;break;
  }
  if(c.task==='unlike-compare'){
   const ordering=c.orderMode!=='compare',common=choose(r,ordering?[6,8,12]:[4,6,8,10,12]),divisors=Array.from({length:common-1},(_,i)=>i+2).filter(d=>common%d===0),pickDen=()=>choose(r,divisors);p.den=pickDen();do p.den2=pickDen();while(p.den2===p.den);p.a=int(r,1,p.den);p.b=int(r,1,p.den2);
   if(ordering){do p.den3=pickDen();while([p.den,p.den2].includes(p.den3));p.cnum=int(r,1,p.den3);let guard=0;while(new Set([p.a/p.den,p.b/p.den2,p.cnum/p.den3]).size<3&&guard++<30){p.a=int(r,1,p.den);p.b=int(r,1,p.den2);p.cnum=int(r,1,p.den3);}}
   else{p.den3=p.den;p.cnum=1;}
   break;
  }
  const small=choose(r,[2,3,4,5,6]),factor=choose(r,[2,3].filter(f=>small*f<=12));p.den=small;p.den2=small*factor;
  if(c.task==='unlike-add'){p.a=int(r,1,p.den-1);const max=Math.max(1,Math.floor((1-p.a/p.den)*p.den2));p.b=int(r,1,max);}
  else{p.a=int(r,1,p.den);const max=Math.max(1,Math.floor(p.a/p.den*p.den2));p.b=int(r,1,max);if(p.b/p.den2>p.a/p.den)p.b=Math.max(1,p.b-1);}
  break;
 }
 case 'time':{
 if(g===3&&c.task==='duration'){
   const start=int(r,0,287)*5,friendly=[10,15,20,25,30,35,40,45,50,55,60,75,90,105,120,150,180,210,240,300,360,420,480,540,600,660,720],duration=choose(r,friendly);
   p.startTime=formatTime24(start);p.endTime=formatTime24(start+duration);break;
  }
  if(g===3&&['endtime','starttime'].includes(c.task)){
   const friendly=[10,15,20,25,30,35,40,45,50,55,60,75,90,105,120,150,180,210,240,300],duration=choose(r,friendly),known=c.task==='endtime'?int(r,360,1080):int(r,480,1320);p.clockTime=formatTime24(known);p.duration=duration;break;
  }
  if(g===3&&c.task==='twelvehour'){p.clockTime=formatTime24(int(r,0,1439));break;}
  if(g===3&&c.task==='seconds'){
   p.secondsDirection=choose(r,['to-seconds','from-seconds']);
   if(p.secondsDirection==='to-seconds'){p.a=int(r,0,5);p.b=int(r,0,59);if(p.a===0&&p.b===0)p.b=1;}else p.a=choose(r,[45,59,60,65,75,80,95,110,125,135,155,185,245,305,359,420,485,599]);
   break;
  }
  if(g===3&&c.task==='twentyfour'){
   p.sky=choose(r,['morning','afternoon','night','overnight']);
   p.a=p.sky==='morning'?int(r,6,11):p.sky==='afternoon'||p.sky==='overnight'?choose(r,[12,1,2,3,4,5]):choose(r,[6,7,8,9,10,11]);
   p.b=int(r,0,59);break;
  }
  if(c.task==='ampm'){
   p.sky=choose(r,['morning','afternoon','night','overnight']);
   p.a=p.sky==='morning'?int(r,6,11):p.sky==='afternoon'||p.sky==='overnight'?choose(r,[12,1,2,3,4,5]):choose(r,[6,7,8,9,10,11]);
   p.b=g===1?int(r,0,11)*5:int(r,0,59);break;
  }
  if(g===2&&c.task==='convert-duration'){
   p.durationDirection=choose(r,['to-minutes','from-minutes']);
   if(p.durationDirection==='to-minutes'){p.a=int(r,0,5);p.b=int(r,0,59);if(p.a===0&&p.b===0)p.b=5;}else p.a=choose(r,[35,40,55,60,65,75,80,95,110,120,125,135,140,155,175,195,235,275,315,360]);
   break;
  }
  if(c.task==='duration'){
   p.a=int(r,1,12);p.b=g===1?int(r,0,11)*5:int(r,0,59);p.duration=g===1?choose(r,[30,60]):choose(r,[10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,110,120,135,150,180,240,300,360]);break;
  }
  if(['read','set','later'].includes(c.task)){p.a=int(r,1,12);p.b=g===1?int(r,0,11)*5:int(r,0,59);p.duration=g===1?choose(r,[30,60]):int(r,1,g===2?120:300);break;}
  break;
 }
 case 'geometry':for(const f of fields(c).filter(f=>f.type==='select'))p[f.key]=choose(r,f.options)[0];break;
 case 'area':if(c.task==='compare'){const dims=choose(r,[[6,4,8,3],[6,2,4,3],[8,2,4,4],[10,2,5,4]]);[p.a,p.b,p.cols2,p.rows2]=dims;}else{p.a=int(r,1,12);p.b=int(r,1,10);}break;
 case 'graph':p.values=[int(r,1,Math.floor(60/c.key))*c.key,int(r,1,Math.floor(60/c.key))*c.key,int(r,1,Math.floor(60/c.key))*c.key].join(', ');break;
 case 'explain':if(c.task==='fraction'){p.den=int(r,2,12);p.a=int(r,1,p.den-1);}else{p.a=int(r,1,c.task==='groups'?10:c.task==='perimeter'?12:g===1?20:g===2?100:1000);p.b=int(r,1,c.task==='groups'||c.task==='perimeter'?10:g===1?20:g===2?100:1000);}break;
 case 'error':if(c.task==='fraction'){p.den=choose(r,[3,5,7,9,11]);p.a=int(r,1,p.den-1);}else if(c.task==='time'){p.a=int(r,1,12);p.b=int(r,1,11)*5;}else if(c.task==='perimeter'){[p.a,p.b]=choose(r,[[6,4],[7,3],[8,5],[5,2]]);}else{p.a=int(r,10,99);if(c.task==='place'&&p.a%10===Math.floor(p.a/10))p.a=p.a===99?98:p.a+1;p.b=int(r,1,Math.min(fieldSmall-100,small)||40);}break;
 }
 return p;
}
export const formatTime=(h,m)=>`${h||12}:${String(m).padStart(2,'0')}`;
export const add12Time=(h,m,duration)=>{const total=((Number(h)%12)*60+Number(m)+Number(duration))%720;return [Math.floor(total/60)||12,total%60];};
export const formatSeconds=total=>{const seconds=Math.max(0,Number(total)||0),minutes=Math.floor(seconds/60),remaining=seconds%60;return minutes?`${minutes} min ${remaining} s`:`${remaining} s`;};
export const wholeNumberText=value=>String(value).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
export function numberlineQuestion(task,start,change){
 if(task==='point')return 'Fill in the missing number on the number line.';
 return `What is ${wholeNumberText(change)} ${task==='add'?'more':'less'} than ${wholeNumberText(start)}?`;
}
export function sequenceValues(c){
 const values=[Number(c.a)];
 for(let i=1;i<9;i++)values.push(values[i-1]+(c.patternType==='alternating'&&i%2===0?Number(c.b2):Number(c.b)));
 return values;
}
export function sequenceBlankIndices(missing){return Number(missing)===4?[1,3,6,8]:Number(missing)===3?[2,5,8]:[3,8];}

// Each teaching step has its own before/after model. Future answers are not
// rendered by the pupil interface; an exchange never changes the model's value.
export const placeName=p=>p===1?'ones':p===10?'tens':p===100?'hundreds':p===1000?'thousands':'ten thousands';
export const placeQuantity=(n,p)=>`${n} ${n===1?placeName(p).replace(/s$/,''):placeName(p)}`;
export function hundredMoves(start,delta){
 if(!Number.isInteger(start)||start<0||start>100||!Number.isInteger(delta)||start+delta<0||start+delta>100)throw Error('Keep the movement between 0 and 100.');
 const direction=Math.sign(delta),amount=Math.abs(delta),moves=[];let n=start;
 for(let i=0;i<Math.floor(amount/10);i++){n+=direction*10;moves.push(n);}
 for(let i=0;i<amount%10;i++){n+=direction;moves.push(n);}
 return moves;
}
export function placePowers(grade,n=0){const ps=[1,10];while(ps.at(-1)<Math.max(10**grade,n))ps.push(ps.at(-1)*10);if(ps.at(-1)>Math.max(10**grade,n))ps.pop();return ps.reverse();}
export function numberWords(n){
 const ones=['zero','one','two','three','four','five','six','seven','eight','nine'],teens=['ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
 const under100=v=>v<10?ones[v]:v<20?teens[v-10]:tens[Math.floor(v/10)]+(v%10?'-'+ones[v%10]:'');
 const under1000=v=>v<100?under100(v):ones[Math.floor(v/100)]+' hundred'+(v%100?' and '+under100(v%100):'');
 if(n<1000)return under1000(n);const rem=n%1000;return under1000(Math.floor(n/1000))+' thousand'+(rem?rem<100?' and '+under100(rem):', '+under1000(rem):'');
}
export function placeChangePlan(raw){
 const c=validate(raw);if(!['more','less'].includes(c.task))throw Error('Choose a more-than or less-than task.');
 const target=c.task==='more'?c.a+c.b:c.a-c.b,ps=placePowers(c.grade,Math.max(c.a,target)),initial=ps.map(p=>Math.floor(c.a/p)%10),counts=[...initial],units=ps.map(p=>Math.floor(c.b/p)%10),steps=[];
 const push=(step,change)=>{const before=[...counts];change();steps.push({...step,before,after:[...counts]});};
 if(c.task==='more'){
  push({kind:'add',units,places:units.flatMap((n,i)=>n?[i]:[]),caption:`Add ${c.b}. New pieces are shown in green.`},()=>units.forEach((n,i)=>counts[i]+=n));
  for(let i=ps.length-1;i>0;i--)while(counts[i]>=10)push({kind:'group',from:i,to:i-1,caption:`Group 10 ${placeName(ps[i])} into 1 ${placeName(ps[i-1]).replace(/s$/,'')}. The value stays the same.`},()=>{counts[i]-=10;counts[i-1]++;});
 }else{
  for(let i=ps.length-1;i>=0;i--){if(!units[i])continue;
   if(counts[i]<units[i]){let donor=i-1;while(counts[donor]===0)donor--;for(let k=donor;k<i;k++)push({kind:'split',from:k,to:k+1,caption:`Split 1 ${placeName(ps[k]).replace(/s$/,'')} into 10 ${placeName(ps[k+1])}. The value stays the same.`},()=>{counts[k]--;counts[k+1]+=10;});}
   push({kind:'take',from:i,amount:units[i],caption:`Take away ${placeQuantity(units[i],ps[i])}.`},()=>counts[i]-=units[i]);
  }
 }
 return {ps,initial,steps,final:[...counts],target};
}
export function operationPlan(c){
 const add=c.task==='add',sub=c.task==='subtract',smallDiv=['share','group'].includes(c.task),div=c.task==='divide-column';
 const multiplicand=c.task==='multiply'?c.b:c.a,multiplier=c.task==='multiply'?c.a:c.b;
 const largest=smallDiv?1:div?c.a:add?Math.max(c.a,c.b,c.a+c.b):sub?c.a:Math.max(multiplicand,multiplicand*multiplier);
 const ps=[1];while(ps.at(-1)*10<=largest)ps.push(ps.at(-1)*10);
 const digits=n=>ps.map(p=>Math.floor(n/p)%10),clone=x=>JSON.parse(JSON.stringify(x));
 const state={top:smallDiv?[c.a]:digits(div||add||sub?c.a:multiplicand),lower:add||sub?digits(c.b):ps.map(()=>0),carry:ps.map(()=>0),result:ps.map(()=>null),revised:ps.map(()=>null),groups:[],work:[],remainder:null};
 const steps=[];
 function push(step,change){const before=clone(state);change();steps.push({...step,before,after:clone(state)});}
 const name=i=>placeName(ps[i]);
 const record=(i,n)=>push({kind:'record',focus:i,title:`Record the ${name(i)} digit`,prompt:`How many ${name(i)} remain in this column? Write the digit.`,label:'Digit to write',expected:n,button:'Record digit',equation:`Write ${n} in the ${name(i)} column.`},()=>{state.result[i]=n;});
 if(smallDiv){
  const q=c.a/c.b,sharing=c.task==='share';
  push({kind:'distribute',focus:0,title:sharing?'Share into equal groups':'Make equal groups',prompt:sharing?`Share ${c.a} counters among ${c.b} groups. How many counters go in each group?`:`Make groups of ${c.b} from ${c.a} counters. How many groups can you make?`,label:sharing?'Counters in each group':'Number of groups',expected:q,button:sharing?'Check and share':'Check and group',equation:sharing?`${c.b} equal groups of ${q} counters use all ${c.a} counters.`:`${q} groups of ${c.b} counters use all ${c.a} counters.`},()=>{state.groups=Array.from({length:sharing?c.b:q},()=>[sharing?q:c.b]);state.top[0]=0;});
  push({kind:'record',focus:0,title:'Write the division answer',prompt:sharing?'Write the number of counters in each group.':'Write the number of groups.',label:'Division answer',expected:q,button:'Record answer',equation:`${c.a} ÷ ${c.b} = ${q}.`},()=>{state.result[0]=q;});
 }else if(div){
  state.groups=Array.from({length:c.b},()=>ps.map(()=>0));
  for(let i=ps.length-1;i>=0;i--){
   const available=state.top[i],q=Math.floor(available/c.b),r=available%c.b;
   const product=q*c.b,next=i>0?state.top[i-1]+r*10:null;
   const inputs=[{key:`q-${i}`,place:i,label:`${name(i)} quotient digit`,expected:q}];
   if(product>=10)inputs.push({key:`product-${i}-${i+1}`,place:i+1,label:`${name(i)} step: product ${name(i+1)} digit`,expected:Math.floor(product/10)});
   inputs.push({key:`product-${i}-${i}`,place:i,label:`${name(i)} step: product ${name(i)} digit`,expected:product%10});
   if(i>0){
    if(next>=10)inputs.push({key:`next-${i}-${i}`,place:i,label:`${name(i)} step: next number tens digit`,expected:Math.floor(next/10)});
    inputs.push({key:`next-${i}-${i-1}`,place:i-1,label:`${name(i)} step: next number ones digit`,expected:next%10});
   }
   push({kind:'division-place',focus:i,available,q,product,left:r,next,inputs,title:`Divide the ${name(i)} by ${c.b}`,prompt:`Fill the highlighted quotient and product boxes${i>0?', then subtract and bring down the next digit':''}. Press Check Step to share the discs.`,button:'Check Step',equation:`${available} ÷ ${c.b}: ${q} in each group; ${q} × ${c.b} = ${product}; ${available} − ${product} = ${r}.${i>0?` ${r?`Exchange ${placeQuantity(r,ps[i])} for ${placeQuantity(r*10,ps[i-1])}. `:''}Bring down the next digit to make ${next} ${name(i-1)}.`:''}`},()=>{
    for(const g of state.groups)g[i]=q;
    state.result[i]=q;state.top[i]=r;
    state.work.push({place:ps[i],available,q,used:product,left:r});
    if(i>0){state.top[i]=0;state.top[i-1]=next;}
   });
  }
  const inputs=[{key:'remainder-bottom',place:0,label:'Bottom remainder',expected:state.top[0]}];
  if(state.top[0])inputs.push({key:'remainder-top',place:0,label:'Top remainder R',expected:state.top[0]});
  push({kind:'remainder',focus:0,inputs,title:'Complete the remainder',prompt:`Fill the bottom remainder box${state.top[0]?' and the top R box':''}. Write 0 when there is no remainder.`,button:'Check Step',equation:`${Math.floor(c.a/c.b)} × ${c.b} + ${c.a%c.b} = ${c.a}. The remainder is smaller than ${c.b}.`},()=>{state.remainder=state.top[0];});
 }else if(add){
  for(let i=0;i<ps.length;i++){
   const incoming=state.carry[i],first=state.top[i]-incoming,second=state.lower[i],total=first+second+incoming,carryOut=Math.floor(total/10),digit=total%10;
   push({kind:'addition-place',focus:i,first,second,incoming,total,carryOut,digit,expected:total,title:`Add the ${name(i)}`,prompt:`${placeQuantity(first,ps[i])} + ${placeQuantity(second,ps[i])}${incoming?' + '+placeQuantity(incoming,ps[i])+' regrouped':''} = ?`,equation:`${first} + ${second}${incoming?' + '+incoming:''} = ${total} ${name(i)}.${carryOut?` Rename ${placeQuantity(carryOut*10,ps[i])} as ${placeQuantity(carryOut,ps[i+1])}.`:''} Write ${digit} in the ${name(i)} column.`},()=>{
    state.top[i]=digit;state.lower[i]=0;state.carry[i]=0;state.result[i]=digit;
    if(carryOut&&i<ps.length-1){state.top[i+1]+=carryOut;state.carry[i+1]+=carryOut;state.revised[i+1]=carryOut;}
   });
  }
 }else if(sub){
  for(let i=0;i<ps.length;i++){
   if(state.top[i]<state.lower[i]){
    let donor=i+1;while(state.top[donor]===0)donor++;
    for(let k=donor;k>i;k--){
     const high=state.top[k],low=state.top[k-1];
     push({kind:'exchange',focus:k,target:k-1,amount:1,received:10,title:`Rename a ${name(k).replace(/s$/,'')}`,prompt:`Rename ${placeQuantity(high,ps[k])} and ${placeQuantity(low,ps[k-1])} as ${placeQuantity(high-1,ps[k])} and ${placeQuantity(low+10,ps[k-1])}.`,label:`${name(k-1)} received`,expected:10,equation:`1 ${name(k).replace(/s$/,'')} = 10 ${name(k-1)}. The total value stays the same.`},()=>{state.top[k]--;state.top[k-1]+=10;state.revised[k]=state.top[k];state.revised[k-1]=state.top[k-1];});
    }
   }
   const top=state.top[i],bottom=state.lower[i],n=top-bottom;
   push({kind:'subtraction-place',focus:i,amount:bottom,expected:n,title:`Subtract the ${name(i)}`,prompt:`${placeQuantity(top,ps[i])} − ${placeQuantity(bottom,ps[i])} = ?`,equation:`${top} − ${bottom} = ${n} ${name(i)}. Write ${n} in the ${name(i)} column.`},()=>{state.top[i]=n;state.lower[i]=0;state.result[i]=n;});
  }
 }else{
  // Uncle Joe: check the answer digit and outgoing carry together for each place.
  const bases=digits(multiplicand);
  for(let i=0;i<ps.length;i++){
   const baseDigit=bases[i],incoming=state.carry[i],groupedTotal=baseDigit*multiplier,total=groupedTotal+incoming,digit=total%10,carryOut=Math.floor(total/10),finalCarry=ps[i]>multiplicand&&incoming>0;
   const inputs=[{key:`digit-${i}`,place:i,label:`${name(i)} answer digit`,expected:digit}];
   if(carryOut)inputs.push({key:`carry-${i+1}`,place:i+1,label:`Carry to ${name(i+1)}`,expected:carryOut});
   push({kind:'multiplication-place',focus:i,baseDigit,incoming,groupedTotal,total,digit,carryOut,finalCarry,inputs,title:finalCarry?`Write the final ${name(i)} digit`:`Multiply the ${name(i)} by ${multiplier}`,prompt:finalCarry?`Write the carried digit in the ${name(i)} column.`:`Multiply ${placeQuantity(baseDigit,ps[i])} by ${multiplier}.${incoming?` Add the carried ${incoming}.`:''} Enter the answer digit${carryOut?' and the carry digit above the next column':''}, then Check Digit.`,equation:finalCarry?`Write the carried ${digit} in the ${name(i)} column.`:`${baseDigit} × ${multiplier} = ${groupedTotal} ${name(i)}.${incoming?` Add ${incoming} carried ${name(i)} to make ${total}.`:''}${carryOut?` Regroup ${placeQuantity(carryOut*10,ps[i])} as ${placeQuantity(carryOut,ps[i+1])}.`:''} Write ${digit} in the ${name(i)} column.`},()=>{
    state.top[i]=digit;state.carry[i]=0;state.result[i]=digit;
    if(carryOut)state.carry[i+1]=carryOut;
   });
  }
 }
 return {ps,steps,final:clone(state),smallDiv,multiplicand,multiplier,division:div};
}
export function checkOperationStep(step,input){
 if(step.inputs)return !!input&&typeof input==='object'&&step.inputs.every(f=>typeof input[f.key]!=='boolean'&&/^\d$/.test(String(input[f.key]??''))&&Number(input[f.key])===f.expected);
 return typeof input!=='boolean'&&input!==null&&input!==undefined&&String(input).trim()!==''&&Number.isInteger(Number(input))&&Number(input)===step.expected;
}
export function lesson(config,r=Math.random){
 const c=generatedConfig(config,r),{engine:e,task:t,a,b}=c;let question='',answer=0,type='number',hint='',explanation='',unit='',choices=null;const d={...c};
 switch(e){
 case 'place':if(t==='hundred'){type='explore';answer=null;question='Explore numbers with the hundred chart and flip chart.';hint='Ten more moves up one row. One more moves to the next number.';explanation='';}else if(t==='read'){answer=a;question='What number do these blocks or discs show?';hint='Count each place. Ten ones make one ten; ten tens make one hundred.';explanation=`The columns together make ${a}.`;}else if(t==='digit'){answer=Math.floor(a/c.place)%10*c.place;question=`What is the value of the highlighted digit in ${a}?`;hint=`The highlighted digit is in the ${placeName(c.place)} place.`;explanation=`${Math.floor(a/c.place)%10} × ${c.place} = ${answer}.`;}else{answer=t==='more'?a+b:a-b;question=`${b} ${t==='more'?'more':'less'} than ${a} is …`;hint=t==='more'?`Add ${b}. Group ten smaller pieces when needed.`:`Take away ${b}. Split a larger piece when needed.`;explanation=`${a} ${t==='more'?'+':'−'} ${b} = ${answer}.`;}break;
 case 'operations':{
  const mult=['multiply','multiply-column'].includes(t),div=t==='divide-column';answer=div?[Math.floor(a/b),a%b]:t==='add'?a+b:t==='subtract'?a-b:mult?a*b:a/b;if(div)type='quotient';
  question=t==='add'?`${a} + ${b} = ?`:t==='subtract'?`${a} − ${b} = ?`:t==='multiply-column'?`${a} × ${b} = ?`:div?`${a} ÷ ${b} = ?`:t==='multiply'?`${a} groups of ${b} counters. How many altogether?`:t==='share'?`Share ${a} counters equally among ${b} groups. How many in each group?`:`Make groups of ${b} using ${a} counters. How many groups?`;
  hint=div?'Start at the largest place. Share, record the quotient digit, then exchange any leftover discs into the next smaller place.':t==='add'||t==='subtract'||mult?'Work on the highlighted place. Make the exchange shown, then record its digit.':'Count equal groups. Follow the model one step at a time.';
  explanation=div?`${a} ÷ ${b} = ${answer[0]}${answer[1]?' remainder '+answer[1]:''}. Check: ${answer[0]} × ${b} + ${answer[1]} = ${a}.`:`${a} ${t==='add'?'+':t==='subtract'?'−':mult?'×':'÷'} ${b} = ${answer}.`;break;
 }
 case 'numberline':if(t==='pattern'){const seq=sequenceValues(c),blanks=sequenceBlankIndices(c.missing),signed=n=>n>0?`+${n}`:String(n);type='sequence';answer=seq;d.sequence=seq;d.blanks=blanks;d.ruleText=c.patternType==='alternating'?`Alternate ${signed(c.b)}, then ${signed(c.b2)}.`:`${signed(c.b)} each time.`;question='Complete the number pattern.';hint=c.patternType==='alternating'?'The changes alternate. Compare the first pair, then the second pair.':'Find the change between neighbouring numbers.';explanation=`Rule: ${d.ruleText}`;}else{answer=t==='point'?a:t==='add'?a+b:a-b;question=numberlineQuestion(t,a,b);hint=t==='point'?`Each space increases by ${wholeNumberText(b)}.`:`Start at ${wholeNumberText(a)}. Follow one jump of ${wholeNumberText(b)} ${t==='add'?'more':'less'}, then move the blue marker and write the landing number.`;explanation=t==='point'?`The missing number is ${wholeNumberText(answer)}.`:`${wholeNumberText(a)} ${t==='add'?'+':'−'} ${wholeNumberText(b)} = ${wholeNumberText(answer)}.`;}break;
 case 'bar':answer=t==='whole'?a+b:t==='groups'?a*b:a-b;question=t==='whole'?`A box has ${a} red ${c.context} and ${b} blue ${c.context}. How many ${c.context} altogether?`:t==='part'?`There are ${a} ${c.context}. ${b} are red. How many are blue?`:t==='compare'?`Aisha has ${a} ${c.context}. Ben has ${b}. How many more does Aisha have?`:t==='change'?`Aisha has ${a} ${c.context} and gives away ${b}. How many remain?`:`There are ${a} bags with ${b} ${c.context} in each bag. How many altogether?`;hint=t==='whole'||t==='groups'?'The whole is made of all the parts.':'The missing part is the whole / longer bar minus the known part / shorter bar.';explanation=t==='whole'?`${a} + ${b} = ${answer}.`:t==='groups'?`${a} × ${b} = ${answer}.`:`${a} − ${b} = ${answer}.`;break;
 case 'money':{
  const money=n=>`$${Math.floor(n/100)}.${String(n%100).padStart(2,'0')}`;
  const finish=value=>{answer=value;type=c.format==='mixed'?'money':'number';if(c.format==='dollars')answer=value/100;unit=c.format==='cents'?'cents':c.format==='dollars'?'dollars':'';explanation=c.format==='dollars'?`${answer} dollars.`:`${value} cents = ${money(value)}.`;};
  if(t==='convert'){
   if(c.direction==='cents-to-money'){answer=a;type='money';question=`Convert ${a} cents to dollars and cents.`;explanation=`${a} cents = ${money(a)}.`;}
   else{answer=a;type='number';unit='cents';question=`Convert ${money(a)} to cents.`;explanation=`${money(a)} = ${a} cents.`;}
   hint='100 cents = 1 dollar. Group or ungroup the dollars before working with the remaining cents.';
  }else if(t==='make'){
   const target=Number(c.target);d.a=target;finish(target);question=`Use the coin and note diagrams to make exactly ${money(target)}.`;hint=target===100?'Count in cents until you reach $1.':target===1000?'Make $1 first, then count on to $10.':'Reach the next $1, then the next $10, and continue to $100.';
  }else if(t==='add'){
   finish(a+b);question=`Add ${money(a)} and ${money(b)}.`;hint='Align dollars with dollars and cents with cents. Add the cents first and rename 100 cents as 1 dollar when needed.';
  }else if(t==='subtract'){
   finish(a-b);question=`Subtract ${money(b)} from ${money(a)}.`;hint='Start with the cents. If needed, rename 1 dollar as 100 cents before subtracting.';
  }else if(t==='word'){
   d.correctModel=c.wordType==='compare'?'compare':'part-whole';
   const value=c.wordType==='total'?a+b:a-b;finish(value);
   question=c.wordType==='total'?`A book costs ${money(a)} and a game costs ${money(b)}. What is their total cost?`:c.wordType==='change'?`Mei has ${money(a)}. She spends ${money(b)}. How much money does she have left?`:`A school bag costs ${money(a)}. A pencil case costs ${money(b)}. How much more does the school bag cost?`;
   hint=c.wordType==='compare'?'Choose the comparison model. The difference is the longer amount minus the shorter amount.':'Choose the part–whole model. Decide whether the unknown is the whole or a part.';
  }else{
   finish(a);question='What is the total value of the notes and coins?';hint='Start with the largest value and count on to the smallest value.';
  }
  break;
 }
 case 'fraction':{
  const f=([n,dn])=>`${n}/${dn}`,compareTasks=['unit-compare','like-compare','unlike-compare'],operationTasks=['like-add','like-subtract','unlike-add','unlike-subtract'];
  if(t==='write'){
   type='fraction';answer=[a,c.den];question='What fraction of the whole is shaded?';d.fractions=[[a,c.den]];d.steps=[
    {title:'Check the whole',text:'The whole must be divided into equal parts.'},
    {title:'Find the denominator',text:`Count all ${c.den} equal parts. Write ${c.den} below the fraction line.`},
    {title:'Find the numerator',text:`Count the ${a} shaded ${a===1?'part':'parts'}. Write ${a} above the fraction line.`},
    {title:'Write the fraction',text:`${a} shaded parts out of ${c.den} equal parts is ${a}/${c.den}.`}
   ];hint='Count all equal parts for the denominator, then count shaded parts for the numerator.';explanation=`${a} of ${c.den} equal parts are shaded, so the fraction is ${a}/${c.den}.`;
  }else if(compareTasks.includes(t)){
   type='choice';const fractions=t==='unit-compare'?[[1,c.den],[1,c.den2],...(c.orderMode==='compare'?[]:[[1,c.den3]])]:[[a,c.den],[b,c.den2],...(c.orderMode==='compare'?[]:[[c.cnum,c.den3]])];d.fractions=fractions;
   const relation=(x,y)=>x[0]*y[1]===y[0]*x[1]?'=':x[0]*y[1]>y[0]*x[1]?'>':'<';
   if(c.orderMode==='compare'){
    answer=relation(fractions[0],fractions[1]);choices=['<','=','>'];question=`Compare ${f(fractions[0])} and ${f(fractions[1])}. Choose <, > or =.`;
   }else{
    const descending=c.orderMode==='descending',sorted=[...fractions].sort((x,y)=>(x[0]*y[1]-y[0]*x[1])*(descending?-1:1)),joiner=descending?' > ':' < ';answer=sorted.map(f).join(joiner);
    const permutations=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]].map(order=>order.map(i=>f(fractions[i])).join(joiner));choices=[answer,...permutations.filter(value=>value!==answer)].slice(0,4);question=descending?'Order the fractions from greatest to least.':'Order the fractions from least to greatest.';
   }
   if(t==='unit-compare')d.steps=[{title:'Notice the numerators',text:'Each numerator is 1, so these are unit fractions.'},{title:'Compare the denominators',text:'More equal parts means each single part is smaller.'},{title:'Decide the order',text:`The correct comparison or order is ${answer}.`}];
   else if(t==='like-compare')d.steps=[{title:'Check the denominators',text:`All denominators are ${c.den}, so the parts are the same size.`},{title:'Compare the numerators',text:'More equal parts selected means a greater fraction.'},{title:'Decide the order',text:`The correct comparison or order is ${answer}.`}];
   else{const common=fractions.reduce((value,item)=>fractionLcm(value,item[1]),1),changed=fractions.map(([n,dn])=>[n*(common/dn),common]);d.commonDen=common;d.changedFractions=changed;d.steps=[{title:'Find a common denominator',text:`Use ${common} so every strip has equal-sized parts.`},{title:'Change each fraction',text:`${fractions.map((item,i)=>`${f(item)} = ${f(changed[i])}`).join('; ')}.`},{title:'Compare the numerators',text:'With equal denominators, compare or order the numerators.'},{title:'Decide the order',text:`The correct comparison or order is ${answer}.`}];}
   hint='Show one teaching step at a time, then compare equal-sized parts.';explanation=`The correct comparison or order is ${answer}.`;
  }else if(t==='equivalent'){
   type='fraction';answer=[a*c.factor,c.den*c.factor];d.fractions=[[a,c.den]];d.changedFractions=[answer];d.factor=c.factor;question=`Complete the equivalent fraction: ${a}/${c.den} = ?/${answer[1]}.`;d.steps=[{title:'Keep the same amount',text:`Split every original part into ${c.factor} equal smaller parts.`},{title:'Multiply both numbers',text:`Multiply the numerator and denominator by ${c.factor}.`},{title:'Write the equivalent fraction',text:`${a}/${c.den} = ${answer[0]}/${answer[1]}. The shaded amount is unchanged.`}];hint='Whatever you do to the denominator, do the same to the numerator.';explanation=`${a} × ${c.factor} over ${c.den} × ${c.factor} gives ${answer[0]}/${answer[1]}.`;
  }else if(t==='simplify'){
   type='fraction';const factor=fractionGcd(a,c.den);answer=simplestFraction(a,c.den);d.fractions=[[a,c.den]];d.changedFractions=[answer];d.factor=factor;question=`Simplify ${a}/${c.den} to its simplest form.`;d.steps=[{title:'Find a common factor',text:`${a} and ${c.den} can both be divided by ${factor}.`},{title:'Divide both numbers',text:`${a} ÷ ${factor} = ${answer[0]} and ${c.den} ÷ ${factor} = ${answer[1]}.`},{title:'Write the simplest form',text:`${a}/${c.den} = ${answer[0]}/${answer[1]}. The value is unchanged.`}];hint='Divide the numerator and denominator by the same greatest common factor.';explanation=`Dividing both numbers by ${factor} gives ${answer[0]}/${answer[1]}.`;
  }else if(operationTasks.includes(t)){
   type='fraction';const adding=t.endsWith('add'),unlike=t.startsWith('unlike-'),d2=unlike?c.den2:c.den,common=fractionLcm(c.den,d2),n1=a*(common/c.den),n2=b*(common/d2),raw=[n1+(adding?1:-1)*n2,common],reduced=simplestFraction(...raw);answer=reduced;d.fractions=[[a,c.den],[b,d2]];d.changedFractions=[[n1,common],[n2,common]];d.rawResult=raw;d.resultFraction=reduced;d.commonDen=common;d.operation=adding?'+':'−';question=`${a}/${c.den} ${d.operation} ${b}/${d2} = ?`;
   d.steps=unlike?[{title:'Look at the denominators',text:`The denominators ${c.den} and ${d2} are different.`},{title:'Change to like fractions',text:`Use denominator ${common}: ${a}/${c.den} = ${n1}/${common} and ${b}/${d2} = ${n2}/${common}.`},{title:`${adding?'Add':'Subtract'} the numerators`,text:`${n1} ${d.operation} ${n2} = ${raw[0]}. Keep denominator ${common}.`},{title:'Write the simplest form',text:raw[0]===reduced[0]&&common===reduced[1]?`${raw[0]}/${common} is already in simplest form.`:`${raw[0]}/${common} simplifies to ${reduced[0]}/${reduced[1]}.`}]:[{title:'Check the denominators',text:`Both denominators are ${c.den}, so the parts are the same size.`},{title:`${adding?'Add':'Subtract'} the numerators`,text:`${a} ${d.operation} ${b} = ${raw[0]}.`},{title:'Keep the denominator',text:`The denominator stays ${common}: ${raw[0]}/${common}.`},{title:'Write the simplest form',text:raw[0]===reduced[0]&&common===reduced[1]?`${raw[0]}/${common} is already in simplest form.`:`${raw[0]}/${common} simplifies to ${reduced[0]}/${reduced[1]}.`}];hint='Make equal-sized parts first. Then work with the numerators and keep the common denominator.';explanation=`${a}/${c.den} ${d.operation} ${b}/${d2} = ${reduced[0]}/${reduced[1]}.`;
  }
  break;
 }
 case 'time':{
 if(c.grade===3&&t==='duration'){
   const start=time24Minutes(c.startTime),end=time24Minutes(c.endTime),elapsed=(end-start+1440)%1440;
   type='duration';answer=[Math.floor(elapsed/60),elapsed%60];d.start24=start;d.end24=end;d.time24=start;d.elapsed=elapsed;d.overnight=end<start;
  question=`From ${formatTime24H(start)} to ${formatTime24H(end)}, how long?`;
  hint='Use the 24-hour timeline. Add a period from the start time to the end time, then count the hours and minutes.';
  explanation=`${formatTime24H(start)} to ${formatTime24H(end)} is ${formatDuration(elapsed)}.`;
  }else if(c.grade===3&&['endtime','starttime'].includes(t)){
   const known=time24Minutes(c.clockTime),start=t==='endtime'?known:(known-c.duration+1440)%1440,end=t==='endtime'?(known+c.duration)%1440:known,answerTime=t==='endtime'?end:start;
   type='time24four';answer=formatTime24(answerTime);d.start24=start;d.end24=end;d.time24=answerTime;d.duration=c.duration;d.missing=t==='endtime'?'end':'start';
   question=t==='endtime'?`A lesson starts at ${formatTime24H(start)} and lasts ${formatDuration(c.duration)}. What time does it end?`:`A lesson ends at ${formatTime24H(end)} after ${formatDuration(c.duration)}. What time did it start?`;
   hint=t==='endtime'?'Move forwards on the 24-hour timeline.':'Move backwards on the 24-hour timeline.';
   explanation=t==='endtime'?`${formatTime24H(start)} + ${formatDuration(c.duration)} = ${formatTime24H(end)}.`:`${formatTime24H(end)} − ${formatDuration(c.duration)} = ${formatTime24H(start)}.`;
  }else if(c.grade===3&&t==='seconds'){
   if(c.secondsDirection==='to-seconds'){const total=a*60+b;type='number';answer=total;unit='s';d.seconds=[a,b];d.secondsDirection=c.secondsDirection;question=`A stopwatch shows ${formatSeconds(total)}. How many seconds is that?`;hint='Each minute is 60 seconds. Change the minutes to seconds first.';explanation=`${a} min = ${a*60} s. ${a*60} s + ${b} s = ${total} s.`;}
   else{const minutes=Math.floor(a/60),seconds=a%60;type='durationseconds';answer=[minutes,seconds];d.secondsTotal=a;d.secondsDirection=c.secondsDirection;question=`A stopwatch measures ${a} s. Express it in minutes and seconds.`;hint='Take away groups of 60 seconds. The remainder is the number of seconds.';explanation=`${a} s = ${minutes*60} s + ${seconds} s = ${formatSeconds(a)}.`;}
  }else if(c.grade===2&&t==='convert-duration'){
   if(c.durationDirection==='to-minutes'){const total=a*60+b;type='number';answer=total;unit='min';d.durationDirection=c.durationDirection;d.duration12=[a,b];question=`Convert ${formatDuration(a*60+b)} to minutes.`;hint='Change the hours to minutes first: 1 h = 60 min.';explanation=`${a} h = ${a*60} min. ${a*60} min + ${b} min = ${total} min.`;}
   else{const hours=Math.floor(a/60),minutes=a%60;type='duration';answer=[hours,minutes];d.durationDirection=c.durationDirection;d.totalMinutes=a;question=`Convert ${a} min to hours and minutes.`;hint='Take away one group of 60 min for each hour.';explanation=`${a} min = ${hours*60} min + ${minutes} min = ${formatDuration(a)}.`;}
  }else if(c.grade!==3&&t==='duration'){
   const start=[a,b],end=add12Time(a,b,c.duration);type='duration';answer=[Math.floor(c.duration/60),c.duration%60];d.start12=start;d.end12=end;d.duration=c.duration;
   question=`From ${formatTime(...start)} to ${formatTime(...end)}, how long?`;
   hint=c.grade===1?'Count one half-hour or one whole hour on the clock.':'Move forwards from the start time to the end time. Group 60 minutes as 1 hour.';
   explanation=`${formatTime(...start)} to ${formatTime(...end)} is ${formatDuration(c.duration)}.`;
  }else if(c.grade===3&&t==='twelvehour'){
   const total=time24Minutes(c.clockTime),time12=clockPartsFrom24(total),meridiem=total<720?'a.m.':'p.m.';type='timeampm';answer=[time12[0],time12[1],meridiem];d.time24=total;d.source24=total;d.sky=skyFor24(total);d.time12=time12;d.meridiem=meridiem;
   question=`Write ${formatTime24H(total)} in 12-hour notation and choose a.m. or p.m.`;
   hint='For 0000 h to 1159 h, use a.m. For 1200 h to 2359 h, use p.m. Then change the hour to the 12-hour clock.';
   explanation=`${formatTime24H(total)} is ${formatTime(...time12)} ${meridiem} In the 24-hour system, 0000 h is 12:00 a.m. and 1200 h is 12:00 p.m.`;
  }else if(c.grade===3&&t==='twentyfour'){
   const value=analogueTo24Minutes(a,b,c.sky);type='time24four';answer=formatTime24Digits(value);d.time24=value;d.sky=c.sky;
   question='Look at the analogue clock and the sky clue. Write the time in 24-hour notation.';
   hint='Write four digits: two for the hour and two for the minute. Do not use a colon. The unit h is already shown.';
   explanation=`The hour hand is at ${a} and the minute hand shows ${b} minutes. ${c.sky==='morning'?'The morning sun gives a time from 0600 h to 1159 h.':c.sky==='afternoon'?'The afternoon sun gives a time from 1200 h to 1759 h.':c.sky==='night'?'The night moon gives a time from 1800 h to 2359 h.':'The moon and owl give an early-morning time from 0000 h to 0559 h.'} So the 24-hour time is ${formatTime24H(value)}.`;
  }else if(t==='ampm'){
   const value=analogueTo24Minutes(a,b,c.sky),meridiem=c.sky==='morning'||c.sky==='overnight'?'a.m.':'p.m.';type='timeampm';answer=[a,b,meridiem];d.time24=value;d.sky=c.sky;d.meridiem=meridiem;d.time12=[a,b];
   question='Look at the analogue clock and the forest sky clue. Write the time in 12-hour notation and choose a.m. or p.m.';
   hint=c.grade===1?'Read the clock in five-minute steps, then use the clear forest sky clue to choose a.m. or p.m.':'Write the hour and minute with a colon. Then use the forest sky clue to choose a.m. or p.m.';
   explanation=`The clock shows ${formatTime(a,b)}. ${c.sky==='morning'?'The morning sun means a.m.':c.sky==='afternoon'?'The afternoon sun means p.m.':c.sky==='night'?'The night moon means p.m.':'The moon and owl show early morning, so it is a.m.'} So the time is ${formatTime(a,b)} ${meridiem}`;
  }else if(['read','set','later'].includes(t)){
   const end=[Math.floor(((a%12*60+b+c.duration)%720)/60)||12,(b+c.duration)%60];d.end=end;
   type='time';answer=t==='later'?end:[a,b];
   question=t==='read'?'What time does this clock show?':t==='set'?`Set the clock to ${formatTime(a,b)}. Then enter that time.`:`It is ${formatTime(a,b)}. What time will it be ${c.duration} minutes later?`;
   hint=c.grade===1?'The short hand shows the hour. Count 5, 10, 15 … 55 around the clock for the minutes.':'The short hand shows the hour. Count in fives, then count the remaining small minute marks.';
   explanation=`The time is ${formatTime(...answer)}.`;
  }else{
   const start=time24Minutes(c.clockTime),end=(start+c.duration)%1440;d.start24=start;d.end24=end;d.time24=t==='later'?end:start;d.sky=skyFor24(d.time24);
   if(t==='duration'){
    type='duration';answer=[Math.floor(c.duration/60),c.duration%60];
    question=`From ${formatTime24H(start)} to ${formatTime24H(end)}, how long?`;
    hint='Read the start and end times in 24-hour notation. Move forwards, crossing midnight if needed.';
    explanation=`${formatTime24H(start)} to ${formatTime24H(end)} is ${formatDuration(c.duration)}.`;
   }else{
    type='time24four';answer=formatTime24(d.time24);
    question=t==='read'?'What time does this clock show? Write it in 24-hour notation.':t==='set'?`Set the clock to ${formatTime24H(start)}. Then enter that time.`:`It is ${formatTime24H(start)}. What time will it be ${c.duration} minutes later?`;
    hint='Use the short hand, long hand and sky clue. Write four digits only; the unit h is already shown.';
    explanation=`The time is ${formatTime24H(d.time24)}.`;
   }
  }
  break;
 }
 case 'geometry':type='choice';answer=t==='shape'?c.shape==='quarter'?'Quarter-circle':c.shape==='semicircle'?'Semicircle':c.shape[0].toUpperCase()+c.shape.slice(1):t==='solid'?c.solid[0].toUpperCase()+c.solid.slice(1):t==='sides'?c.shape==='circle'?'0':c.shape==='triangle'?'3':c.shape==='quarter'?'2':c.shape==='semicircle'?'1':'4':t==='angle'?c.angle==='right'?'Right angle':c.angle==='less'?'Less than a right angle':'Greater than a right angle':c.lines[0].toUpperCase()+c.lines.slice(1);question=t==='shape'?'Name the shape.':t==='sides'?'How many straight sides does this shape have?':t==='solid'?'Name this 3D shape.':t==='angle'?'Compare the marked angle with a right angle.':'How are the two lines related?';choices=t==='shape'?fields(c)[0].options.map(o=>o[1]):t==='solid'?['Cube','Cuboid','Cone','Cylinder','Sphere']:t==='sides'?['0','1','2','3','4']:t==='angle'?['Less than a right angle','Right angle','Greater than a right angle']:['Parallel','Perpendicular','Neither'];hint=t==='sides'?'Count only the straight edges.':t==='lines'?'Parallel lines keep the same distance apart. Perpendicular lines meet at a right angle.':t==='angle'?'Use the right-angle corner as a reference.':'Look at the sides, corners and faces.';explanation=`${answer}.`;break;
 case 'area':type=t==='compare'?'choice':'number';answer=t==='area'?a*b:t==='perimeter'?2*(a+b):2*(a+b)===2*(c.cols2+c.rows2)?'Same perimeter':2*(a+b)>2*(c.cols2+c.rows2)?'First is greater':'Second is greater';unit=t==='area'?'cm²':t==='perimeter'?'cm':'';question=t==='area'?'Find the area. Each small square is 1 cm².':t==='perimeter'?'Find the distance all the way around the rectangle.':'These rectangles have the same area. Compare their perimeters.';choices=t==='compare'?['First is greater','Same perimeter','Second is greater']:null;hint=t==='area'?'Count rows × columns.':`Add all four sides. The opposite sides are equal.`;explanation=t==='area'?`${a} × ${b} = ${answer} cm².`:t==='perimeter'?`${a} + ${b} + ${a} + ${b} = ${answer} cm.`:`Both areas are ${a*b} cm². Their perimeters are ${2*(a+b)} cm and ${2*(c.cols2+c.rows2)} cm.`;break;
 case 'graph':d.labels=c.labels.split(',').map(s=>s.trim());d.values=c.values.split(',').map(s=>Number(s.trim()));answer=t==='read'?d.values[c.category]:t==='total'?d.values.reduce((x,y)=>x+y,0):Math.abs(d.values[0]-d.values[1]);question=t==='read'?`How many ${d.labels[c.category]} are shown?`:t==='total'?'How many items are shown altogether?':`What is the difference between ${d.labels[0]} and ${d.labels[1]}?`;hint=`Each ${c.graphType==='picture'?'picture':'tick interval'} represents ${c.key} items. Read the key before counting.`;explanation=t==='read'?`${d.values[c.category]/c.key} × ${c.key} = ${answer}.`:t==='total'?`${d.values.join(' + ')} = ${answer}.`:`${Math.max(d.values[0],d.values[1])} − ${Math.min(d.values[0],d.values[1])} = ${answer}.`;break;
 case 'explain':type='reason';answer=t==='add'?a+b:t==='groups'?a*b:t==='perimeter'?2*(a+b):a;d.reasons=t==='add'?['The two parts make one whole.',`I add ${a} and ${b}.`,`The whole is ${answer}.`]:t==='groups'?[`There are ${a} equal groups.`,`Each group has ${b} counters.`,`I multiply ${a} by ${b} to get ${answer}.`]:t==='perimeter'?['Perimeter is the distance around the outside.',`I add ${a} + ${b} + ${a} + ${b}.`,`The perimeter is ${answer} cm.`]:[`The whole has ${c.den} equal parts.`,`${a} parts are shaded.`,`The shaded fraction is ${a}/${c.den}.`];d.distractor=t==='add'?'I subtract one part from the other.':t==='groups'?'I add the number of groups to the group size.':t==='perimeter'?'I multiply the length by the width.':'The denominator counts only unshaded parts.';question='Build an explanation. Choose the three correct statements in order.';hint='Start with the model, then describe the operation, then give the conclusion.';explanation=d.reasons.join(' ');break;
 case 'error':
 type=t==='fraction'?'fraction':t==='time'?'time':'number';answer=t==='place'?a:t==='add'?a+b:t==='fraction'?[a,c.den]:t==='time'?[a,b]:2*(a+b);
 d.wrong=t==='place'?String((a%10)*10+Math.floor(a/10)):t==='add'?String(a+b+10):t==='fraction'?`${a}/${c.den-a}`:t==='time'?formatTime(a,b/5):`${a*b} cm`;
 d.errorChoices=t==='place'?['The tens and ones have been swapped.','The discs are all worth one.','The answer is already correct.']:t==='add'?['An extra ten was added.','The numbers should be multiplied.','The answer is already correct.']:t==='fraction'?['The denominator counted only unshaded parts.','The numerator should count every part.','The answer is already correct.']:t==='time'?['The minute-hand number was read as minutes.','The hour hand gives the minutes.','The answer is already correct.']:['Area was used instead of perimeter.','The unit should be cm².','The answer is already correct.'];d.errorReason=d.errorChoices[0];
 question=t==='place'?`A pupil reads the discs as ${d.wrong}. Find the error and correct the number.`:t==='add'?`A pupil writes ${a} + ${b} = ${d.wrong}. Find the error and correct the sum.`:t==='fraction'?`A pupil says the shaded fraction is ${d.wrong}. Find the error and correct it.`:t==='time'?`A pupil reads this clock as ${d.wrong}. Find the error and correct the time.`:`A pupil says the perimeter is ${d.wrong}. Find the error and correct it.`;hint=t==='perimeter'?'Perimeter is the outside distance. Area counts inside squares.':t==='fraction'?'The denominator counts all equal parts, including the shaded parts.':t==='time'?'Each numbered space is five minutes.':'Check each place value and recompute carefully.';explanation=`${d.errorReason} ${t==='fraction'?`${a}/${c.den}`:t==='time'?formatTime(a,b):answer} is correct.`;break;
 }
 return {question,answer,type,hint,explanation,unit,choices,data:d};
}
export function checkAnswer(l,input,interaction={}){
 const whole=x=>typeof x!=='boolean'&&x!==''&&x!==null&&x!==undefined&&Number.isInteger(Number(x))&&Number(x)>=0;
 let ok=false;
 if(l.type==='number')ok=whole(input)&&Number(input)===l.answer;
 if(l.type==='choice')ok=input===l.answer;
 if(l.type==='fraction')ok=Array.isArray(input)&&input.length===2&&input.every(whole)&&Number(input[1])>0&&Number(input[0])*l.answer[1]===l.answer[0]*Number(input[1]);
 if(l.type==='money')ok=Array.isArray(input)&&input.length===2&&input.every(whole)&&Number(input[1])<100&&Number(input[0])*100+Number(input[1])===l.answer;
 if(l.type==='time')ok=Array.isArray(input)&&input.length===2&&input.every(whole)&&Number(input[0])>=1&&Number(input[0])<=12&&Number(input[1])<60&&Number(input[0])===l.answer[0]&&Number(input[1])===l.answer[1];
 if(l.type==='timeampm')ok=Array.isArray(input)&&input.length===3&&input.slice(0,2).every(whole)&&Number(input[0])>=1&&Number(input[0])<=12&&Number(input[1])<60&&Number(input[0])===l.answer[0]&&Number(input[1])===l.answer[1]&&input[2]===l.answer[2];
 if(l.type==='time24')ok=Array.isArray(input)&&input.length===2&&input.every(whole)&&Number(input[0])<24&&Number(input[1])<60&&Number(input[0])===l.answer[0]&&Number(input[1])===l.answer[1];
 if(l.type==='time24four')ok=/^\d{4}$/.test(String(input??''))&&String(input)===l.answer;
 if(l.type==='duration')ok=Array.isArray(input)&&input.length===2&&input.every(whole)&&Number(input[1])<60&&Number(input[0])===l.answer[0]&&Number(input[1])===l.answer[1];
 if(l.type==='durationseconds')ok=Array.isArray(input)&&input.length===2&&input.every(whole)&&Number(input[1])<60&&Number(input[0])===l.answer[0]&&Number(input[1])===l.answer[1];
 if(l.type==='quotient')ok=Array.isArray(input)&&input.length===2&&input.every(whole)&&Number(input[0])===l.answer[0]&&Number(input[1])===l.answer[1]&&Number(input[1])<l.data.b;
 if(l.type==='reason')ok=Array.isArray(input)&&input.length===3&&input.every((v,i)=>v===l.data.reasons[i]);
 if(l.type==='sequence')ok=Array.isArray(input)&&input.length===l.answer.length&&l.data.blanks.every(i=>whole(input[i])&&Number(input[i])===l.answer[i]);
 const c=l.data;
 if(c.engine==='fraction'&&l.type==='fraction')ok=Array.isArray(input)&&input.length===2&&input.every(whole)&&Number(input[0])===l.answer[0]&&Number(input[1])===l.answer[1];
 if(c.engine==='operations')ok=ok&&interaction.operationComplete===true;
 if(c.engine==='money'&&c.task==='make')ok=ok&&interaction.money===l.answer;
 if(c.engine==='money'&&c.task==='word')ok=ok&&interaction.moneyModel===c.correctModel;
 if(c.engine==='time'&&c.task==='set')ok=ok&&Array.isArray(interaction.clock)&&interaction.clock[0]===c.a&&interaction.clock[1]===c.b;
 if(c.engine==='numberline'&&['add','subtract'].includes(c.task))ok=ok&&interaction.numberlineMarker===l.answer;
 if(c.engine==='error')ok=ok&&interaction.errorReason===c.errorReason;
 return ok;
}

export function activityHTML(template,raw){const c=validate(raw),json=JSON.stringify(c).replace(/</g,'\\u003c');return template.replace(/(<script id="saved-config" type="application\/json">)[\s\S]*?(<\/script>)/,(_all,pre,post)=>pre+json+post);}
