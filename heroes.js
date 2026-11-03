// Persistent characters, mutually exclusive talent choices and timed abilities.
const tiers=[3,7,12,18];
const talent=(name,effect,value)=>({name,effect,value});
export const HEROES=[
{id:'avelin',name:'Авелин',title:'Капитан последнего знамени',icon:'⚑',unlock:0,cost:{gold:80},effect:'power',base:.08,perLevel:.004,ability:'Знамя рассвета',abilityText:'Вся армия сильнее на 45% на 30 секунд.',abilityCost:{food:50},cooldown:150,duration:30,buff:'power',buffValue:.45,lore:'Она была последней, кто покинул горящий столичный мост. Теперь Авелин собирает армию, которая однажды вернётся по нему домой.',talents:[
[talent('Железная дисциплина','power',.12),talent('Хлеб для легиона','upkeep',.2)],
[talent('Щиты над головами','loss',.12),talent('Школа знаменосцев','xp',.25)],
[talent('Строй непобедимых','militia',.4),talent('Запасы на зиму','food',.3)],
[talent('Клятва возвращения','power',.25),talent('Никого не оставим','loss',.2)]]},
{id:'rowan',name:'Рован',title:'Следопыт без границ',icon:'♧',unlock:2,cost:{gold:160,wood:80},effect:'nature',base:.15,perLevel:.008,ability:'Тайные тропы',abilityText:'Получить провизию: 120 +20 за каждую землю.',abilityCost:{gold:30},cooldown:120,lore:'Рован не рисует карты: он запоминает запах дождя на каждой дороге. Иногда он приводит отряд туда, где лес ещё только вырастет.',talents:[
[talent('Язык леса','wood',.25),talent('Полевая кухня','food',.25)],
[talent('Тропа под корнями','expedition',.15),talent('Терпеливые стрелки','archer',.25)],
[talent('Лесная засада','archer',.4),talent('Запасной маршрут','loss',.15)],
[talent('Стрела за горизонтом','archer',.6),talent('Зелёное королевство','nature',.35)]]},
{id:'borin',name:'Борин',title:'Мастер расколотого горна',icon:'⚒',unlock:4,cost:{gold:450,iron:40},effect:'iron',base:.2,perLevel:.01,ability:'Песня молота',abilityText:'Получить железо: 80 +15 за каждую землю.',abilityCost:{wood:70},cooldown:150,lore:'Его клан выковал замки на вратах под горой. Борин знает и то, как их открыть. За поясом он носит молот отца и ключ, который никто не узнаёт.',talents:[
[talent('Глубинные жилы','iron',.3),talent('Экономный мастер','cost',.08)],
[talent('Рунная броня','militia',.3),talent('Литые противовесы','siege',.3)],
[talent('Кузница без огня','iron',.4),talent('Договор гильдий','gold',.3)],
[talent('Молот созидания','all',.25),talent('Оружие титанов','siege',.6)]]},
{id:'mira',name:'Мира',title:'Астроном погасшего неба',icon:'✧',unlock:6,cost:{gold:900,mana:70},effect:'mana',base:.2,perLevel:.012,ability:'Сошедшая звезда',abilityText:'Вся армия сильнее на 35%, маги — ещё на 50% на 40 секунд.',abilityCost:{mana:45},cooldown:180,duration:40,buff:'power',buffValue:.35,lore:'Мира помнит созвездия, исчезнувшие до её рождения. В каждом осколке эфира она ищет координаты солнца — и иногда слышит оттуда ответ.',talents:[
[talent('Ясное небо','mana',.3),talent('Звёздные расчёты','xp',.3)],
[talent('Астральные стрелы','mage',.35),talent('Небесная механика','siege',.3)],
[talent('Созвездие башни','power',.2),talent('Письма свету','mana',.45)],
[talent('Дочь сверхновой','mage',.7),talent('Свет сквозь века','prestige',.2)]]},
{id:'khar',name:'Кхар',title:'Вождь открытой степи',icon:'♞',unlock:9,cost:{gold:1800,food:350,iron:180},effect:'rider',base:.25,perLevel:.015,ability:'Ни шагу назад',abilityText:'Потери армии ниже на 40% в течение 30 секунд.',abilityCost:{food:100},cooldown:180,duration:30,buff:'loss',buffValue:.4,lore:'Племена избрали его вождём после битвы, в которой он отказался от короны. Он всё ещё не признаёт титулов, но его имя скандируют перед атакой.',talents:[
[talent('Дети седла','rider',.3),talent('Котлы кочевников','food',.35)],
[talent('Быстрее бури','expedition',.15),talent('Боевой клич','power',.15)],
[talent('Стальной табун','rider',.5),talent('Братство степи','upkeep',.3)],
[talent('Всадники конца ночи','rider',.8),talent('Все кланы едины','power',.25)]]},
{id:'seren',name:'Серен',title:'Хранительница забытых имён',icon:'☽',unlock:12,cost:{gold:3500,mana:350},effect:'loss',base:.08,perLevel:.004,ability:'Помнящие путь домой',abilityText:'Вернуть 30 +5 за землю ополченцев. Это новые войска, а не восстановление точных прошлых потерь.',abilityCost:{mana:100},cooldown:240,lore:'Она записывает имена тех, кого больше некому помнить. Пока имя не стёрто из её книги, история человека не окончена.',talents:[
[talent('Тихая стража','loss',.1),talent('Неугасающие свечи','mana',.3)],
[talent('Память ветеранов','xp',.4),talent('Мёртвые не устают','upkeep',.25)],
[talent('Книга возвращений','militia',.5),talent('Клятва хранительницы','loss',.15)],
[talent('Имя останется','prestige',.25),talent('Свет поминальных огней','power',.3)]]},
{id:'dara',name:'Дара',title:'Купчиха тысячи дорог',icon:'⚖',unlock:16,cost:{gold:6500,wood:1500},effect:'gold',base:.2,perLevel:.012,ability:'Долги старой империи',abilityText:'Получить золото: 300 +80 за каждую землю.',abilityCost:{food:120},cooldown:180,lore:'У Дары есть долговая расписка каждого живого короля и трёх мёртвых. Она утверждает, что деньги — лишь ещё одна форма памяти.',talents:[
[talent('Золотая речь','gold',.3),talent('Свои люди в гильдиях','cost',.1)],
[talent('Сеть факторий','all',.15),talent('Караванный договор','expedition',.15)],
[talent('Имперская монополия','gold',.45),talent('Пайки для всех','food',.4)],
[talent('Казна без дна','all',.3),talent('Вклад в вечность','prestige',.3)]]},
{id:'orian',name:'Ориан',title:'Путник из завтрашнего дня',icon:'⌛',unlock:20,cost:{gold:12000,mana:1200},effect:'expedition',base:.12,perLevel:.005,ability:'Украденная минута',abilityText:'Сократить оставшееся время обеих экспедиций на 60 секунд.',abilityCost:{mana:160},cooldown:240,lore:'Он знает, какая дверь скрипнет следующей. Но когда его спрашивают, вернётся ли солнце, Ориан впервые не находит слов.',talents:[
[talent('Часы разведчика','expedition',.12),talent('Бесконечный урок','xp',.4)],
[talent('Петля производства','all',.15),talent('Ритм горнила','click',.4)],
[talent('Мгновение до удара','power',.2),talent('Не случившиеся раны','loss',.15)],
[talent('Наследник времени','prestige',.3),talent('День, который наступит','all',.3)]]}
];
export const TALENT_LEVELS=tiers;
export const HERO_EFFECTS={power:'сила армии',upkeep:'снижение содержания',nature:'дерево и провизия',gold:'золото',wood:'дерево',iron:'железо',food:'провизия',mana:'эфир',cost:'скидка на здания',xp:'опыт героев',expedition:'ускорение экспедиций',loss:'снижение потерь',militia:'сила ополчения',archer:'сила лучников',rider:'сила всадников',siege:'сила машин',mage:'сила магов',all:'вся добыча',click:'сила клика',prestige:'награда возрождения'};
export function hydrateHeroes(s){if(!s||s.v!==2||!s.meta)return s;s.meta.heroes??={};s.meta.best??=s.lands||0;s.party??=[];s.heroCooldowns??={};s.heroBuffs??=[];return s;}
export function heroLevelXP(level){return Math.ceil(70*level**1.6);}
export function heroBonus(s,effect){let n=0;for(const id of s.party||[]){const h=HEROES.find(h=>h.id===id),p=s.meta.heroes[id];if(!h||!p)continue;if(h.effect===effect)n+=h.base+h.perLevel*(p.level-1);for(const [tier,choice]of Object.entries(p.choices)){const t=h.talents[+tier]?.[choice];if(t?.effect===effect)n+=t.value;}}for(const b of s.heroBuffs||[]){const h=HEROES.find(h=>h.id===b.id);if(h?.buff===effect)n+=h.buffValue;if(h?.id==='mira'&&effect==='mage')n+=.5;}return n;}
export function hireHero(s,id){const h=HEROES.find(h=>h.id===id);if(!h||!s.race||s.meta.heroes[id]||Math.max(s.lands,s.meta.best)<h.unlock||Object.entries(h.cost).some(([k,v])=>s.resources[k]<v))return false;for(const[k,v]of Object.entries(h.cost))s.resources[k]-=v;s.meta.heroes[id]={level:1,xp:0,choices:{}};if(s.party.length<2)s.party.push(id);return true;}
export function assignHero(s,id){if(!s.meta.heroes[id])return false;if(s.party.includes(id)){s.party=s.party.filter(x=>x!==id);s.heroBuffs=s.heroBuffs.filter(b=>b.id!==id);}else if(s.party.length<2)s.party.push(id);else return false;return true;}
export function chooseTalent(s,id,tier,choice){const h=HEROES.find(h=>h.id===id),p=s.meta.heroes[id];if(!h||!p||!Number.isInteger(tier)||!Number.isInteger(choice)||!h.talents[tier]?.[choice]||p.level<tiers[tier]||p.choices[tier]!==undefined)return false;p.choices[tier]=choice;return true;}
export function respecHero(s,id){const p=s.meta.heroes[id];if(!p||!Object.keys(p.choices).length||s.resources.gold<200*p.level)return false;s.resources.gold-=200*p.level;p.choices={};return true;}
export function gainHeroXP(s,xp){const amount=Math.floor(xp*(1+heroBonus(s,'xp')));for(const id of s.party){const p=s.meta.heroes[id];if(p.level>=20)continue;p.xp+=amount;while(p.level<20&&p.xp>=heroLevelXP(p.level)){p.xp-=heroLevelXP(p.level);p.level++;}if(p.level===20)p.xp=0;}}
export function heroAbility(s,id){const h=HEROES.find(h=>h.id===id);if(!h||!s.race||!s.party.includes(id)||(s.heroCooldowns[id]||0)>0||Object.entries(h.abilityCost).some(([k,v])=>s.resources[k]<v))return false;for(const[k,v]of Object.entries(h.abilityCost))s.resources[k]-=v;s.heroCooldowns[id]=h.cooldown;if(h.duration)s.heroBuffs.push({id,remaining:h.duration});if(id==='rowan')s.resources.food+=120+s.lands*20;if(id==='borin')s.resources.iron+=80+s.lands*15;if(id==='seren')s.units.militia+=30+s.lands*5;if(id==='dara')s.resources.gold+=300+s.lands*80;if(id==='orian')for(const x of s.expeditions)x.remaining=Math.max(0,x.remaining-60);return true;}
export function tickHeroes(s,dt){s.meta.best=Math.max(s.meta.best,s.lands);for(const id in s.heroCooldowns)s.heroCooldowns[id]=Math.max(0,s.heroCooldowns[id]-dt);for(const b of s.heroBuffs)b.remaining-=dt;s.heroBuffs=s.heroBuffs.filter(b=>b.remaining>0&&s.party.includes(b.id));}
export function validHeroes(s){try{const known=id=>HEROES.some(h=>h.id===id),unique=a=>new Set(a).size===a.length;if(!s.meta.heroes||typeof s.meta.heroes!=='object'||Array.isArray(s.meta.heroes)||!Number.isInteger(s.meta.best)||s.meta.best<0||s.meta.best>24||!Array.isArray(s.party)||s.party.length>2||!unique(s.party)||s.party.some(id=>!s.meta.heroes[id]||!known(id)))return false;for(const[id,p]of Object.entries(s.meta.heroes)){if(!known(id)||!Number.isInteger(p.level)||p.level<1||p.level>20||!Number.isFinite(p.xp)||p.xp<0||p.xp>=heroLevelXP(p.level)||typeof p.choices!=='object'||!p.choices||Array.isArray(p.choices))return false;for(const[tier,choice]of Object.entries(p.choices))if(!/^[0-3]$/.test(tier)||![0,1].includes(choice)||p.level<tiers[+tier])return false;}if(!s.heroCooldowns||typeof s.heroCooldowns!=='object'||Array.isArray(s.heroCooldowns)||Object.entries(s.heroCooldowns).some(([id,n])=>!known(id)||!Number.isFinite(n)||n<0||n>240)||!Array.isArray(s.heroBuffs)||!unique(s.heroBuffs.map(b=>b.id))||s.heroBuffs.some(b=>!s.party.includes(b.id)||!known(b.id)||!Number.isFinite(b.remaining)||b.remaining<=0||b.remaining>40))return false;return true;}catch{return false;}}
