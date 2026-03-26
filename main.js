
const SAVE_KEY = 'xiuxian_v12_save';
const LEGACY_KEYS = ['xiuxian_v11_save', 'xiuxian_v10_save', 'xiuxian_v9_save', 'xiuxian_v8_save', 'xiuxian_v7_save', 'xiuxian_v6_save', 'xiuxian_v5_save'];

const ROOTS = [
  { name: '废灵根', bonus: 0.75, desc: '修得慢，但不是不能修。' },
  { name: '下品灵根', bonus: 0.92, desc: '修得有点费劲，但至少不是在逆天。' },
  { name: '中品灵根', bonus: 1.06, desc: '正常修士的体面起步。' },
  { name: '上品灵根', bonus: 1.24, desc: '灵气亲和更高，练起来更顺。' },
  { name: '天品灵根', bonus: 1.52, desc: '别人打坐，你像插了电。' }
];

const REALMS = [
  { key: '炼气一层', need: 100 },
  { key: '炼气二层', need: 180 },
  { key: '炼气三层', need: 300 },
  { key: '炼气四层', need: 460 },
  { key: '炼气五层', need: 680 },
  { key: '炼气六层', need: 960 },
  { key: '炼气七层', need: 1320 },
  { key: '炼气八层', need: 1760 },
  { key: '炼气九层', need: 2300 },
  { key: '筑基初期', need: 3100 },
  { key: '筑基中期', need: 4200 },
  { key: '筑基后期', need: 5600 },
  { key: '筑基圆满', need: 7600 },
  { key: '金丹初期', need: 9800 },
  { key: '金丹中期', need: 12600 },
  { key: '金丹后期', need: 16200 },
  { key: '元婴初期', need: 20800 },
  { key: '元婴中期', need: 26800 },
  { key: '元婴后期', need: 34800 },
  { key: '化神初期', need: 43800 }
];

const ITEM_DEFS = {
  spiritHerb: { id: 'spiritHerb', name: '灵草', type: 'material', desc: '基础药材，炼丹常客。' },
  redFruit: { id: 'redFruit', name: '赤霞果', type: 'material', desc: '偏火属性灵果，适合冲修为。' },
  dewLeaf: { id: 'dewLeaf', name: '露华叶', type: 'material', desc: '温养经脉，做疗伤丹不错。' },
  beastCore: { id: 'beastCore', name: '妖核碎片', type: 'material', desc: '打怪掉的核心材料。' },
  thunderStone: { id: 'thunderStone', name: '残雷石', type: 'material', desc: '挨雷的味道全浓缩在里头。' },
  seaCrystal: { id: 'seaCrystal', name: '海魄晶', type: 'material', desc: '海眼地图产物，偏后期。' },
  qiPill: { id: 'qiPill', name: '聚气丹', type: 'consumable', desc: '服用后立即获得修为。' },
  healPill: { id: 'healPill', name: '回春丹', type: 'consumable', desc: '回复生命，战斗里很有用。' },
  insightPill: { id: 'insightPill', name: '凝神丹', type: 'consumable', desc: '下次突破更稳一点。' },
  thunderCharm: { id: 'thunderCharm', name: '避雷符', type: 'consumable', desc: '渡劫时保命，不用最好，真用到时会感谢现在的自己。' }
};

const TECHNIQUES = {
  basic: { id: 'basic', name: '吐纳诀', desc: '最基础的入门心法，胜在稳定。', cult: 1.0, atk: 1.0, def: 1.0, afk: 1.0, crit: 0.02 },
  qingmu: { id: 'qingmu', name: '青木长生诀', desc: '修炼更稳，也会稍微回一点气血。', cult: 1.18, atk: 1.0, def: 1.06, afk: 1.08, crit: 0.03 },
  liehuo: { id: 'liehuo', name: '烈火炼气法', desc: '战斗爆发高，修炼也快，就是比较莽。', cult: 1.22, atk: 1.18, def: 0.96, afk: 1.02, crit: 0.08 },
  xuanshui: { id: 'xuanshui', name: '玄水静心经', desc: '防守稳，突破更舒服。', cult: 1.04, atk: 0.96, def: 1.16, afk: 1.06, crit: 0.02 },
  leiting: { id: 'leiting', name: '雷引锻骨篇', desc: '偏打怪和扛打，雷鸣窟会很喜欢你。', cult: 1.08, atk: 1.12, def: 1.10, afk: 1.10, crit: 0.05 },
  yufeng: { id: 'yufeng', name: '御风游身诀', desc: '跑图与探索更好用，挂机也效率更高。', cult: 0.98, atk: 1.02, def: 1.00, afk: 1.22, crit: 0.04 }
};

const SKILLS = {
  slash: { id: 'slash', name: '剑气斩', cd: 2, desc: '对单体造成较高伤害。', use(state, stats) {
    let dmg = Math.max(1, Math.floor(stats.atk * 1.45 - state.enemy.def * 0.45 + Math.random() * 8));
    if (Math.random() < stats.crit + 0.05) dmg = Math.floor(dmg * 1.55);
    state.enemyHp = Math.max(0, state.enemyHp - dmg);
    return `你使出【剑气斩】，造成 ${dmg} 点伤害。`;
  }},
  guard: { id: 'guard', name: '护体诀', cd: 3, desc: '给自己加一层护盾，吃下一次攻击更舒服。', use(state, stats) {
    state.shield = Math.floor(stats.def * 1.8 + 18);
    return `你运转【护体诀】，获得 ${state.shield} 点护盾。`;
  }},
  thunder: { id: 'thunder', name: '雷击术', cd: 4, desc: '高爆发雷系法术，雷鸣窟会更爽。', use(state, stats) {
    const bonus = state.enemy.map === 'thunder' ? 1.25 : 1;
    let dmg = Math.max(1, Math.floor((stats.atk * 1.8 + 16) * bonus - state.enemy.def * 0.35 + Math.random() * 10));
    state.enemyHp = Math.max(0, state.enemyHp - dmg);
    return `你打出【雷击术】，轰出 ${dmg} 点伤害${bonus > 1 ? '（雷域加成）' : ''}。`;
  }}
};

const EQUIPMENT_DEFS = {
  woodSword: { id: 'woodSword', slot: 'weapon', rank: '凡器', name: '青藤木剑', stats: { atk: 6, power: 8, cult: 0.02 }, desc: '入门木剑，至少比赤手空拳讲究。' },
  bronzeSword: { id: 'bronzeSword', slot: 'weapon', rank: '法器', name: '流光短剑', stats: { atk: 14, power: 18, crit: 0.03 }, desc: '短而利落，适合割开尴尬。' },
  ironSpear: { id: 'ironSpear', slot: 'weapon', rank: '法器', name: '裂锋铁枪', stats: { atk: 22, power: 26 }, desc: '打怪更凶。' },
  thunderBlade: { id: 'thunderBlade', slot: 'weapon', rank: '灵器', name: '玄雷刃', stats: { atk: 32, power: 38, crit: 0.04 }, desc: '劈别人很有电感。' },

  clothRobe: { id: 'clothRobe', slot: 'robe', rank: '凡器', name: '青布法衣', stats: { hp: 20, def: 2, power: 6 }, desc: '总比穿常服抗揍一点。' },
  cloudRobe: { id: 'cloudRobe', slot: 'robe', rank: '法器', name: '流云法袍', stats: { hp: 48, def: 5, cult: 0.04, power: 12 }, desc: '灵气运转顺了，腰板也直一点。' },
  thunderRobe: { id: 'thunderRobe', slot: 'robe', rank: '灵器', name: '玄雷法袍', stats: { hp: 76, def: 9, power: 20 }, desc: '面对雷系怪更像回事。' },

  ironRing: { id: 'ironRing', slot: 'ring', rank: '法器', name: '守心戒', stats: { cult: 0.05, power: 10, break: 5 }, desc: '稳心态，稳突破。' },
  stormRing: { id: 'stormRing', slot: 'ring', rank: '灵器', name: '暴岚环', stats: { atk: 10, crit: 0.05, power: 16 }, desc: '打架时脾气比较大。' },

  jadeCharm: { id: 'jadeCharm', slot: 'talisman', rank: '法器', name: '青玉护符', stats: { hp: 24, def: 3, afk: 0.05, power: 8 }, desc: '探索和挂机都能加一口气。' },
  seaCrown: { id: 'seaCrown', slot: 'talisman', rank: '灵器', name: '海眼灵冠', stats: { hp: 42, atk: 8, afk: 0.08, power: 18 }, desc: '海图后期装备，带点灵潮味。' }
};

const MONSTERS = {
  bambooRat: { id: 'bambooRat', name: '灵尾竹鼠', map: 'bamboo', hp: 58, atk: 10, def: 2, speed: 1.0, exp: 55, stone: 10, drops: ['spiritHerb', 'redFruit'], dropChance: 0.55, gearChance: 0.03 },
  vineWolf: { id: 'vineWolf', name: '藤纹妖狼', map: 'bamboo', hp: 82, atk: 14, def: 4, speed: 1.0, exp: 78, stone: 14, drops: ['beastCore', 'spiritHerb'], dropChance: 0.58, gearChance: 0.08, gearPool: ['bronzeSword','clothRobe'] },

  valleyCrow: { id: 'valleyCrow', name: '裂喙黑鸦', map: 'valley', hp: 120, atk: 20, def: 6, speed: 1.05, exp: 112, stone: 20, drops: ['dewLeaf', 'beastCore'], dropChance: 0.6, gearChance: 0.1, gearPool: ['cloudRobe','ironRing'] },
  swampPython: { id: 'swampPython', name: '黑沼蟒妖', map: 'valley', hp: 168, atk: 24, def: 7, speed: 0.95, exp: 145, stone: 28, drops: ['dewLeaf', 'beastCore', 'redFruit'], dropChance: 0.65, gearChance: 0.14, gearPool: ['ironSpear','jadeCharm'] },

  thunderBat: { id: 'thunderBat', name: '残雷蝠', map: 'thunder', hp: 240, atk: 36, def: 10, speed: 1.08, exp: 210, stone: 42, drops: ['thunderStone', 'beastCore'], dropChance: 0.68, gearChance: 0.15, gearPool: ['thunderRobe','stormRing'] },
  thunderApe: { id: 'thunderApe', name: '裂甲雷猿', map: 'thunder', hp: 320, atk: 46, def: 14, speed: 1.0, exp: 286, stone: 58, drops: ['thunderStone', 'beastCore', 'dewLeaf'], dropChance: 0.72, gearChance: 0.2, gearPool: ['thunderBlade','thunderRobe'] },

  tideSpirit: { id: 'tideSpirit', name: '潮汐灵', map: 'sea', hp: 420, atk: 58, def: 18, speed: 1.04, exp: 380, stone: 82, drops: ['seaCrystal', 'thunderStone', 'dewLeaf'], dropChance: 0.76, gearChance: 0.18, gearPool: ['seaCrown','stormRing'] },
  abyssCrab: { id: 'abyssCrab', name: '深甲海蟹', map: 'sea', hp: 560, atk: 68, def: 24, speed: 0.92, exp: 480, stone: 110, drops: ['seaCrystal', 'beastCore'], dropChance: 0.82, gearChance: 0.24, gearPool: ['seaCrown','thunderBlade'] }
};

const MAPS = {
  bamboo: {
    id: 'bamboo',
    name: '青竹林',
    rec: 0,
    desc: '前期最友好的练级图。怪不算狠，灵草很多，适合边走边捡。',
    afkBase: { exp: 16, stone: 5 },
    dropsNote: '主要掉落：灵草、赤霞果、妖核碎片。前期练级养老图。',
    monsters: ['bambooRat', 'vineWolf'],
    layout: [
      ['S','.', 'M','T','.'],
      ['.','#', '.', '.', 'H'],
      ['.','M', '.', '#', '.'],
      ['H','.', 'T','M', '.'],
      ['.','.', '.', '.', 'B']
    ]
  },
  valley: {
    id: 'valley',
    name: '黑风谷',
    rec: 5,
    desc: '中期常驻图，怪的强度明显上来，但露华叶和装备开始像样。',
    afkBase: { exp: 28, stone: 9 },
    dropsNote: '主要掉落：露华叶、妖核碎片、法器级装备。筑基期很适合泡在这里。',
    monsters: ['valleyCrow', 'swampPython'],
    layout: [
      ['S','M','.', 'T','H'],
      ['.','#', '.', '.', '.'],
      ['M','.', 'B', '#', '.'],
      ['H','.', 'M', '.', 'T'],
      ['.','.', '.', 'M', '.']
    ]
  },
  thunder: {
    id: 'thunder',
    name: '雷鸣窟',
    rec: 9,
    desc: '高风险高收益地图。残雷石和雷系装备都从这儿出，但怪也是真咬人。',
    afkBase: { exp: 44, stone: 14 },
    dropsNote: '主要掉落：残雷石、妖核碎片、雷系灵器。适合冲筑基、金丹的狠人。',
    monsters: ['thunderBat', 'thunderApe'],
    layout: [
      ['S','.', 'M','H','T'],
      ['.','#', '.', '.', '.'],
      ['M','.', '#', 'B', '.'],
      ['H','.', 'M', '.', 'T'],
      ['.','M', '.', '.', '.']
    ]
  },
  sea: {
    id: 'sea',
    name: '星沉海眼',
    rec: 14,
    desc: '后期图，海魄晶和高阶装备会在这里掉，但怪一巴掌也会教你做人。',
    afkBase: { exp: 62, stone: 20 },
    dropsNote: '主要掉落：海魄晶、残雷石、海眼灵冠等后期掉落。推荐金丹以后再来碰瓷。',
    monsters: ['tideSpirit', 'abyssCrab'],
    layout: [
      ['S','.', 'M','T','H'],
      ['.','#', '.', '.', '.'],
      ['M','.', 'B', '#', 'M'],
      ['H','.', 'M', '.', 'T'],
      ['.','.', '.', 'M', '.']
    ]
  }
};

let game = {};
let currentView = 'overview';
let gameTimer = null;
let battleTimer = null;
let battleState = { active: false, auto: false, enemy: null, enemyHp: 0, playerHp: 0, feed: [], shield: 0, skillCd: { slash: 0, guard: 0, thunder: 0 } };

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function pct(v) { return `${Math.round(v * 100)}%`; }
function formatNum(n) { return Math.floor(n).toLocaleString('zh-CN'); }

function getRootByName(name) { return ROOTS.find((r) => r.name === name) || ROOTS[2]; }
function getRealm() { return REALMS[game.realmIndex]; }
function getTechnique() { return TECHNIQUES[game.activeTechnique] || TECHNIQUES.basic; }
function getMapData(id = game.currentMapId) { return MAPS[id] || MAPS.bamboo; }
function getMapState(id = game.currentMapId) {
  if (!game.mapStates[id]) game.mapStates[id] = createMapState(id);
  return game.mapStates[id];
}
function createMapState(id) { return { pos: { x: 0, y: 0 }, visited: { '0,0': true }, consumed: {} }; }
function getEquipmentDef(id) { return EQUIPMENT_DEFS[id]; }
function getEquippedDefs() { return Object.values(game.equipped || {}).filter(Boolean).map(getEquipmentDef).filter(Boolean); }
function getEquipStat(key) { return getEquippedDefs().reduce((sum, item) => sum + (item.stats[key] || 0), 0); }

function calcPlayerStats() {
  const tech = getTechnique();
  const baseAtk = 12 + game.realmIndex * 4.5;
  const baseDef = 4 + game.realmIndex * 2.3;
  const baseHp = 110 + game.realmIndex * 24 + (game.rootBonus * 20);
  const atk = Math.floor((baseAtk + getEquipStat('atk')) * tech.atk);
  const def = Math.floor((baseDef + getEquipStat('def')) * tech.def);
  const maxHp = Math.floor(baseHp + getEquipStat('hp'));
  const crit = clamp((tech.crit || 0) + getEquipStat('crit'), 0.02, 0.4);
  const afk = 1 + (getEquipStat('afk') || 0) + (tech.afk - 1);
  const cult = game.rootBonus * tech.cult + getEquipStat('cult');
  const breakBonus = (getEquipStat('break') || 0) + (game.breakthroughBonus || 0);
  const power = Math.floor(atk * 1.8 + def * 1.2 + maxHp * 0.18 + game.realmIndex * 6 + getEquipStat('power'));
  return { atk, def, maxHp, crit, afk, cult, breakBonus, power };
}

function createNewGame(meta = {}) {
  const root = meta.rootName ? getRootByName(meta.rootName) : randomFrom(ROOTS);
  const realmIndex = clamp(meta.realmIndex || 0, 0, REALMS.length - 1);
  const inheritedInventory = meta.inventory || {};
  return {
    version: 12,
    name: meta.name || '无名修士',
    rootName: root.name,
    rootBonus: root.bonus,
    realmIndex,
    exp: meta.exp || 0,
    stone: meta.stone || 120,
    life: meta.life || 180,
    cultivating: false,
    activeTechnique: meta.activeTechnique || 'basic',
    learnedTechniques: Array.from(new Set(['basic', ...(meta.learnedTechniques || [])])),
    inventory: {
      spiritHerb: 3, redFruit: 2, dewLeaf: 1, beastCore: 0, thunderStone: 0, seaCrystal: 0,
      qiPill: 2, healPill: 2, insightPill: 0, thunderCharm: 0,
      ...inheritedInventory
    },
    equipmentBag: Array.from(new Set(['woodSword', 'clothRobe', ...(meta.equipmentBag || [])])),
    equipped: { weapon: null, robe: null, ring: null, talisman: null, ...(meta.equipped || {}) },
    breakthroughBonus: meta.breakthroughBonus || 0,
    currentMapId: meta.currentMapId || 'bamboo',
    afkMapId: meta.afkMapId || null,
    afkActive: !!meta.afkActive,
    mapStates: meta.mapStates || { bamboo: createMapState('bamboo') },
    stats: {
      exploreCount: 0, killCount: 0, killExp: 0, steps: 0, battlesWon: 0, battlesLost: 0,
      autoHeals: 0, eliteKills: 0,
      ...meta.stats
    },
    journal: {
      maps: meta.journal?.maps || ['青竹林'],
      monsters: meta.journal?.monsters || [],
      gears: meta.journal?.gears || ['青藤木剑', '青布法衣'],
      skills: meta.journal?.skills || []
    },
    logs: meta.logs || [],
    lastSeen: Date.now()
  };
}

function normalizeGame() {
  const fresh = createNewGame();
  game = {
    ...fresh,
    ...game,
    inventory: { ...fresh.inventory, ...(game.inventory || {}) },
    equipped: { ...fresh.equipped, ...(game.equipped || {}) },
    learnedTechniques: Array.from(new Set(['basic', ...((game.learnedTechniques || []))])),
    equipmentBag: Array.isArray(game.equipmentBag) ? Array.from(new Set(game.equipmentBag)) : fresh.equipmentBag.slice(),
    mapStates: game.mapStates || fresh.mapStates,
    stats: { ...fresh.stats, ...(game.stats || {}) },
    journal: { ...fresh.journal, ...(game.journal || {}) },
    logs: Array.isArray(game.logs) ? game.logs.slice(0, 120) : []
  };
  Object.keys(MAPS).forEach((id) => {
    if (!game.mapStates[id]) game.mapStates[id] = createMapState(id);
    game.mapStates[id].visited = game.mapStates[id].visited || { '0,0': true };
    game.mapStates[id].consumed = game.mapStates[id].consumed || {};
    game.mapStates[id].pos = game.mapStates[id].pos || { x: 0, y: 0 };
  });
  game.realmIndex = clamp(Number(game.realmIndex) || 0, 0, REALMS.length - 1);
  game.exp = Number(game.exp) || 0;
  game.stone = Number(game.stone) || 0;
  game.life = Number(game.life) || 1;
  game.breakthroughBonus = Number(game.breakthroughBonus) || 0;
  if (!MAPS[game.currentMapId]) game.currentMapId = 'bamboo';
  if (game.afkMapId && !MAPS[game.afkMapId]) game.afkMapId = null;
  autoEquipBest(false);
}

function importLegacySave(raw) {
  try {
    const old = JSON.parse(raw);
    const carriedInventory = {};
    ['spiritHerb', 'redFruit', 'dewLeaf', 'beastCore', 'thunderStone', 'seaCrystal', 'qiPill', 'healPill', 'insightPill', 'thunderCharm'].forEach((key) => {
      if (old.inventory && Number(old.inventory[key]) > 0) carriedInventory[key] = Number(old.inventory[key]);
    });
    const realmIndex = clamp(Number(old.realmIndex) || 0, 0, REALMS.length - 3);
    const learnedTechniques = [];
    const oldTechs = Array.isArray(old.learnedTechniques) ? old.learnedTechniques : [];
    ['qingmu','liehuo','xuanshui','leiting','yufeng'].forEach((id) => { if (oldTechs.includes(id)) learnedTechniques.push(id); });
    const bag = ['woodSword', 'clothRobe'];
    const possible = ['bronzeSword','cloudRobe','ironRing','jadeCharm','thunderRobe','thunderBlade','stormRing','seaCrown'];
    possible.forEach((id) => {
      if ((old.equipmentBag || []).includes(id)) bag.push(id);
      if (old.equipped && Object.values(old.equipped).includes(id)) bag.push(id);
    });
    return createNewGame({
      name: old.name || '无名修士',
      rootName: old.rootName || old.root || randomFrom(ROOTS).name,
      realmIndex,
      stone: Math.max(160, Math.floor((old.stone || 0) * 0.7)),
      life: Math.max(180, (old.life || 100) + 60),
      inventory: carriedInventory,
      learnedTechniques,
      activeTechnique: learnedTechniques[0] || 'basic',
      equipmentBag: bag,
      breakthroughBonus: Number(old.breakthroughBuff || old.breakthroughBonus) || 0
    });
  } catch (err) {
    return null;
  }
}

function addLog(text, type = 'muted') {
  game.logs.unshift({ text, type, time: Date.now() });
  game.logs = game.logs.slice(0, 120);
  renderLogs();
}
function addCombatFeed(text) {
  battleState.feed.unshift(text);
  battleState.feed = battleState.feed.slice(0, 24);
  renderCombatPanel();
}
function addJournalMap(name) { if (!game.journal.maps.includes(name)) game.journal.maps.push(name); }
function addJournalMonster(name) { if (!game.journal.monsters.includes(name)) game.journal.monsters.push(name); }
function addJournalGear(name) { if (!game.journal.gears.includes(name)) game.journal.gears.push(name); }
function addJournalSkill(name) { if (!game.journal.skills.includes(name)) game.journal.skills.push(name); }
function addItem(itemId, amount = 1) { game.inventory[itemId] = (game.inventory[itemId] || 0) + amount; }
function addEquipment(id) { if (!game.equipmentBag.includes(id)) game.equipmentBag.push(id); addJournalGear(EQUIPMENT_DEFS[id].name); }
function getInventoryAmount(itemId) { return Number(game.inventory[itemId] || 0); }
function spendItem(itemId, amount = 1) {
  if (getInventoryAmount(itemId) < amount) return false;
  game.inventory[itemId] -= amount;
  return true;
}
function gainExp(amount, source = '修炼') {
  game.exp += amount;
  if (source === '打怪') game.stats.killExp += amount;
}

function usePotion(itemId, inBattle = false) {
  const item = ITEM_DEFS[itemId];
  if (!item || getInventoryAmount(itemId) <= 0) {
    addLog(`你翻了翻储物袋，发现${item ? item.name : '这玩意'}并不在。`, 'warn');
    return;
  }
  spendItem(itemId, 1);
  if (itemId === 'qiPill') {
    const gain = 180 + Math.floor(game.realmIndex * 12);
    gainExp(gain, '丹药');
    addLog(`你服下聚气丹，修为 +${gain}。`, 'good');
    addCombatFeed(`你服用聚气丹，修为小涨一截。`);
  } else if (itemId === 'healPill') {
    const stats = calcPlayerStats();
    const heal = Math.floor(stats.maxHp * 0.35);
    if (battleState.active && inBattle) {
      battleState.playerHp = clamp(battleState.playerHp + heal, 0, stats.maxHp);
      addCombatFeed(`你吞下一枚回春丹，生命恢复 ${heal}。`);
      animateHit('playerHpBar');
    } else {
      game.life = clamp(game.life + heal, 0, stats.maxHp);
      addLog(`你服下回春丹，生命恢复 ${heal}。`, 'good');
    }
  } else if (itemId === 'insightPill') {
    game.breakthroughBonus += 12;
    addLog('你服下凝神丹，下一次突破成功率 +12%。', 'rare');
  } else if (itemId === 'thunderCharm') {
    game.breakthroughBonus += 8;
    addLog('你捏碎避雷符，心里莫名安稳，下一次突破成功率 +8%。', 'rare');
  }
  updateUI();
}

function autoEquipBest(showLog = true) {
  ['weapon', 'robe', 'ring', 'talisman'].forEach((slot) => {
    const candidates = game.equipmentBag.map((id) => EQUIPMENT_DEFS[id]).filter((item) => item && item.slot === slot);
    if (!candidates.length) return;
    candidates.sort((a, b) => equipmentScore(b) - equipmentScore(a));
    game.equipped[slot] = candidates[0].id;
  });
  if (showLog) addLog('你把能穿的最好装备都套上了。现在看起来终于像个会打怪的人了。', 'good');
}
function equipmentScore(item) {
  return (item.stats.power || 0) + (item.stats.atk || 0) * 1.4 + (item.stats.def || 0) * 1.2 + (item.stats.hp || 0) * 0.12 + (item.stats.cult || 0) * 140 + (item.stats.afk || 0) * 120 + (item.stats.crit || 0) * 300;
}
function equipItem(id) {
  const item = EQUIPMENT_DEFS[id];
  if (!item) return;
  game.equipped[item.slot] = id;
  addLog(`你装备了【${item.name}】。`, 'good');
  updateUI();
}

function setView(viewId) {
  currentView = viewId;
  document.querySelectorAll('.view').forEach((el) => el.classList.remove('active'));
  const view = document.getElementById(`view-${viewId}`);
  if (view) view.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === viewId));
  if (['maps','explore'].includes(viewId)) renderMapPanels();
  if (viewId === 'inventory') renderInventory();
  if (viewId === 'equipment') renderEquipment();
  if (viewId === 'afk') renderAfkPanel();
  if (viewId === 'journal') renderJournal();
  if (viewId === 'techniques') renderTechniques();
  if (viewId === 'skills') renderSkills();
}

function selectMap(id) {
  const map = MAPS[id];
  if (!map) return;
  if (game.realmIndex < map.rec) addLog(`${map.name} 推荐境界更高，你现在进去，怪会把你当外卖。`, 'warn');
  game.currentMapId = id;
  addJournalMap(map.name);
  addLog(`你将当前地图切换为【${map.name}】。`, 'rare');
  renderMapPanels();
  updateUI();
}
function selectAfkMap(id) {
  game.afkMapId = id;
  addLog(`挂机地图已切换为【${MAPS[id].name}】。`, 'good');
  renderAfkPanel();
  updateUI();
}
function toggleAfk(id = game.afkMapId || game.currentMapId) {
  if (!id) return;
  game.afkMapId = id;
  game.afkActive = !game.afkActive;
  addLog(game.afkActive ? `你开始在【${MAPS[game.afkMapId].name}】挂机。` : '你停止了地图挂机。', game.afkActive ? 'rare' : 'muted');
  updateUI();
}
function toggleCultivation() {
  game.cultivating = !game.cultivating;
  addLog(game.cultivating ? '你开始打坐修炼，灵气缓缓入体。' : '你停止修炼，准备出去找点更刺激的经验。', game.cultivating ? 'good' : 'muted');
  updateUI();
}

function breakthrough() {
  const realm = getRealm();
  if (game.realmIndex >= REALMS.length - 1) {
    addLog('你已经碰到当前版本上限了，再往上修就是第十三版的事。', 'warn');
    return;
  }
  if (game.exp < realm.need) {
    addLog(`修为不足，突破 ${realm.key} 还差 ${realm.need - Math.floor(game.exp)}。`, 'warn');
    return;
  }
  const stats = calcPlayerStats();
  let rate = 0.55 + game.rootBonus * 0.08 + stats.breakBonus / 100;
  if (game.realmIndex >= 9) rate -= 0.05;
  if (game.realmIndex >= 13) rate -= 0.08;
  rate = clamp(rate, 0.18, 0.92);
  if (Math.random() < rate) {
    game.realmIndex += 1;
    game.exp = 0;
    game.breakthroughBonus = 0;
    addLog(`突破成功！你踏入【${getRealm().key}】。人还是这个人，气场已经不是了。`, 'rare');
  } else {
    const lose = Math.floor(realm.need * 0.22);
    game.exp = Math.max(0, game.exp - lose);
    addLog(`突破失败，修为回落 ${lose}。你没碎，就是面子碎了一点。`, 'danger');
  }
  updateUI();
}

function movePlayer(dx, dy) {
  const map = getMapData();
  const state = getMapState();
  const nx = state.pos.x + dx;
  const ny = state.pos.y + dy;
  if (nx < 0 || ny < 0 || nx >= 5 || ny >= 5) {
    addLog('你试图往地图外走。修仙可以逆天，但不能越界。', 'warn');
    return;
  }
  if (map.layout[ny][nx] === '#') {
    addLog('前方有阻隔，走不过去。', 'warn');
    return;
  }
  state.pos = { x: nx, y: ny };
  state.visited[`${nx},${ny}`] = true;
  game.stats.steps += 1;
  game.stats.exploreCount += 1;
  inspectTile(true);
  updateUI();
}

function inspectTile(fromMove = false) {
  const map = getMapData();
  const state = getMapState();
  const key = `${state.pos.x},${state.pos.y}`;
  const tile = map.layout[state.pos.y][state.pos.x];
  let text = '';
  if (tile === 'S') {
    text = '你回到了入口，四周还算安全。';
  } else if (tile === 'T' && !state.consumed[key]) {
    state.consumed[key] = true;
    const drops = ['spiritHerb', 'redFruit', 'dewLeaf', 'beastCore'];
    if (map.id === 'thunder') drops.push('thunderStone');
    if (map.id === 'sea') drops.push('seaCrystal');
    const item = randomFrom(drops);
    const amount = 1 + (Math.random() < 0.35 ? 1 : 0);
    addItem(item, amount);
    game.stone += 12 + Math.floor(Math.random() * 18);
    text = `你在遗留宝箱里翻到 ${ITEM_DEFS[item].name} ×${amount}，顺手还捞了些灵石。`;
    addLog(text, 'rare');
  } else if (tile === 'H' && !state.consumed[key]) {
    state.consumed[key] = true;
    addItem('spiritHerb', 2);
    if (Math.random() < 0.55) addItem('dewLeaf', 1);
    text = '你采到几株药材，闻着就很值钱。';
    addLog(text, 'good');
  } else if (tile === 'M') {
    text = '前方灵压波动明显，附近大概率有东西在喘气。';
    if (fromMove || Math.random() < 0.78) startBattle(randomMonsterOnMap(map.id));
  } else if (tile === 'B') {
    text = '这里的气息明显更凶，精英怪大概就在附近活动。';
    if (fromMove || Math.random() < 0.84) startBattle(randomMonsterOnMap(map.id, true));
  } else {
    if (fromMove && Math.random() < 0.34) {
      if (Math.random() < 0.58) startBattle(randomMonsterOnMap(map.id));
      else {
        const item = map.id === 'sea' ? 'seaCrystal' : (map.id === 'thunder' ? 'thunderStone' : 'spiritHerb');
        addItem(item, 1);
        text = `你在路边捡到 ${ITEM_DEFS[item].name} ×1。`;
        addLog(text, 'good');
      }
    } else {
      text = '这格暂时没什么异样，风吹草动都显得很努力。';
    }
  }
  document.getElementById('tileEventPanel').innerHTML = `<div class="tip-item">${text || '你四下打量，没有额外发现。'}</div>`;
  renderMapPanels();
}

function quickExplore() {
  const dirs = [[0,-1], [1,0], [0,1], [-1,0]];
  const valid = dirs.filter(([dx, dy]) => {
    const s = getMapState();
    const m = getMapData();
    const nx = s.pos.x + dx, ny = s.pos.y + dy;
    return nx >= 0 && ny >= 0 && nx < 5 && ny < 5 && m.layout[ny][nx] !== '#';
  });
  if (!valid.length) {
    addLog('你站在角落里转了一圈，发现自己像在原地修仙。', 'warn');
    return;
  }
  const [dx, dy] = randomFrom(valid);
  movePlayer(dx, dy);
}
function tryEncounter() {
  const map = getMapData();
  startBattle(randomMonsterOnMap(map.id));
}

function randomMonsterOnMap(mapId, elite = false) {
  const pool = MAPS[mapId].monsters;
  const id = elite && pool.length > 1 ? pool[pool.length - 1] : randomFrom(pool);
  const base = MONSTERS[id];
  const enemy = JSON.parse(JSON.stringify(base));
  if (elite) {
    enemy.name = `精英·${enemy.name}`;
    enemy.hp = Math.floor(enemy.hp * 1.45);
    enemy.atk = Math.floor(enemy.atk * 1.22);
    enemy.def = Math.floor(enemy.def * 1.18);
    enemy.exp = Math.floor(enemy.exp * 1.55);
    enemy.stone = Math.floor(enemy.stone * 1.6);
    enemy.gearChance = Math.min(0.45, (enemy.gearChance || 0.1) + 0.14);
    enemy.dropChance = Math.min(0.95, (enemy.dropChance || 0.6) + 0.16);
    enemy.isElite = true;
  }
  return enemy;
}

function resetSkillCooldowns() { battleState.skillCd = { slash: 0, guard: 0, thunder: 0 }; }
function startBattle(monsterDef) {
  if (battleState.active) {
    addLog('你已经在打架了，不能一边挨打一边再点一只。', 'warn');
    return;
  }
  const stats = calcPlayerStats();
  battleState.active = true;
  battleState.enemy = JSON.parse(JSON.stringify(monsterDef));
  battleState.enemyHp = monsterDef.hp;
  battleState.playerHp = clamp(game.life || stats.maxHp, 1, stats.maxHp);
  battleState.feed = [`你遭遇了【${monsterDef.name}】！`];
  battleState.shield = 0;
  resetSkillCooldowns();
  document.getElementById('battleStateText').textContent = '战斗中';
  addJournalMonster(monsterDef.name.replace('精英·',''));
  renderCombatPanel();
  addLog(`你遭遇了【${monsterDef.name}】。`, monsterDef.isElite ? 'rare' : 'danger');
  if (battleState.auto) startBattleLoop();
}
function startBattleLoop() {
  if (battleTimer) clearInterval(battleTimer);
  battleTimer = setInterval(() => {
    if (!battleState.active || !battleState.auto) {
      clearInterval(battleTimer);
      battleTimer = null;
      return;
    }
    autoBattleAction();
  }, 700);
}
function autoBattleAction() {
  if (!battleState.active) return;
  if (battleState.playerHp < calcPlayerStats().maxHp * 0.45 && getInventoryAmount('healPill') > 0) {
    usePotion('healPill', true);
    enemyActionIfAlive();
    return;
  }
  if (battleState.skillCd.thunder === 0) {
    castSkill('thunder', true);
  } else if (battleState.skillCd.slash === 0) {
    castSkill('slash', true);
  } else {
    battleRound();
  }
}
function tickSkillCd() {
  Object.keys(battleState.skillCd).forEach((id) => {
    if (battleState.skillCd[id] > 0) battleState.skillCd[id] -= 1;
  });
}
function toggleAutoBattle() {
  battleState.auto = !battleState.auto;
  document.getElementById('autoBattleText').textContent = `自动战斗：${battleState.auto ? '开' : '关'}`;
  addLog(`自动战斗已${battleState.auto ? '开启' : '关闭'}。`, battleState.auto ? 'good' : 'muted');
  if (battleState.auto && battleState.active) startBattleLoop();
}
function playerAttack() {
  if (!battleState.active) {
    addLog('前方并没有敌人。你这一拳打在空气里，空气表示不理解。', 'warn');
    return;
  }
  battleRound();
}
function castSkill(id, fromAuto = false) {
  if (!battleState.active) return;
  const skill = SKILLS[id];
  if (!skill) return;
  if (battleState.skillCd[id] > 0) {
    if (!fromAuto) addLog(`【${skill.name}】还在冷却：${battleState.skillCd[id]} 回合。`, 'warn');
    return;
  }
  const stats = calcPlayerStats();
  const msg = skill.use(battleState, stats);
  addJournalSkill(skill.name);
  battleState.skillCd[id] = skill.cd;
  addCombatFeed(msg);
  animateHit('monsterHpBar');
  if (battleState.enemyHp <= 0) {
    handleBattleWin();
    return;
  }
  enemyActionIfAlive();
}
function battleRound() {
  const p = calcPlayerStats();
  const e = battleState.enemy;
  if (!e) return;
  let pDmg = Math.max(1, Math.floor(p.atk - e.def * 0.55 + Math.random() * 8));
  let crit = false;
  if (Math.random() < p.crit) {
    pDmg = Math.floor(pDmg * 1.65);
    crit = true;
  }
  battleState.enemyHp = Math.max(0, battleState.enemyHp - pDmg);
  addCombatFeed(`你对【${e.name}】造成 ${pDmg} 点伤害${crit ? '（暴击）' : ''}。`);
  animateHit('monsterHpBar');
  if (battleState.enemyHp <= 0) {
    handleBattleWin();
    return;
  }
  enemyActionIfAlive();
}
function enemyActionIfAlive() {
  const p = calcPlayerStats();
  const e = battleState.enemy;
  if (!e || battleState.enemyHp <= 0) return;
  let eDmg = Math.max(1, Math.floor(e.atk - p.def * 0.45 + Math.random() * 7));
  if (battleState.shield > 0) {
    const blocked = Math.min(battleState.shield, eDmg);
    eDmg -= blocked;
    battleState.shield -= blocked;
    addCombatFeed(`护盾替你挡掉 ${blocked} 点伤害。`);
  }
  battleState.playerHp = Math.max(0, battleState.playerHp - eDmg);
  addCombatFeed(`【${e.name}】反击，打了你 ${eDmg} 点。`);
  animateHit('playerHpBar');
  tickSkillCd();
  if (battleState.playerHp <= 0) {
    handleBattleLose();
    return;
  }
  renderCombatPanel();
}

function autoHealAfterBattle(reason = '战后回气') {
  const stats = calcPlayerStats();
  game.life = stats.maxHp;
  game.stats.autoHeals += 1;
  addLog(`战斗结束后自动回血：已回到满血。${reason} 这下不用打完一架还蹲地上喘半天。`, 'good');
}
function handleBattleWin() {
  const e = battleState.enemy;
  const stats = calcPlayerStats();
  const exp = e.exp;
  const stone = e.stone + Math.floor(Math.random() * 8);
  gainExp(exp, '打怪');
  game.stone += stone;
  game.stats.killCount += 1;
  game.stats.battlesWon += 1;
  if (e.isElite) game.stats.eliteKills += 1;
  addCombatFeed(`你击败了【${e.name}】！修为 +${exp}，灵石 +${stone}。`);
  addLog(`你击败了【${e.name}】，修为 +${exp}，灵石 +${stone}。`, e.isElite ? 'rare' : 'good');

  if (Math.random() < (e.dropChance || 0.55)) {
    const itemId = randomFrom(e.drops);
    const amount = 1 + (Math.random() < 0.28 ? 1 : 0);
    addItem(itemId, amount);
    addCombatFeed(`掉落：${ITEM_DEFS[itemId].name} ×${amount}`);
    addLog(`掉落：${ITEM_DEFS[itemId].name} ×${amount}。`, 'rare');
  }
  if (Math.random() < (e.gearChance || 0.05) && e.gearPool?.length) {
    const gear = randomFrom(e.gearPool);
    addEquipment(gear);
    addCombatFeed(`你捡到装备【${EQUIPMENT_DEFS[gear].name}】！`);
    addLog(`你捡到装备【${EQUIPMENT_DEFS[gear].name}】。`, 'rare');
  }
  stopBattle('win');
}
function handleBattleLose() {
  game.stats.battlesLost += 1;
  game.stone = Math.max(0, game.stone - 18);
  addCombatFeed('你败了，勉强遁走，脸还在，灵石没了点。');
  addLog('你在战斗中落败，损失少量灵石，但人没事。第十二版战后会自动给你回满血。', 'danger');
  stopBattle('lose');
}
function runAway() {
  if (!battleState.active) return;
  if (Math.random() < 0.72) {
    addCombatFeed('你成功脱身。跑得很狼狈，但跑掉了就是赢家。');
    addLog('你从战斗中撤离。第十二版撤退后也会自动回血。', 'muted');
    stopBattle('escape');
  } else {
    addCombatFeed('你想跑，但对面更快，反手就是一下。');
    battleState.playerHp = Math.max(1, battleState.playerHp - 12);
    animateHit('playerHpBar');
    renderCombatPanel();
  }
}
function stopBattle(result = 'end') {
  battleState.active = false;
  battleState.enemy = null;
  battleState.enemyHp = 0;
  battleState.shield = 0;
  if (battleTimer) {
    clearInterval(battleTimer);
    battleTimer = null;
  }
  autoHealAfterBattle(result === 'win' ? '赢完自动回气。' : result === 'lose' ? '输了也给你回上来，别直接下线。' : '撤退完也顺手回满。');
  document.getElementById('battleStateText').textContent = '空闲';
  renderCombatPanel();
  updateUI();
}
function animateHit(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('hit-flash');
  void el.offsetWidth;
  el.classList.add('hit-flash');
}

function gameTick() {
  const stats = calcPlayerStats();
  const maxHp = stats.maxHp;

  if (game.cultivating) {
    const gain = Math.max(2, Math.floor(6 * stats.cult + game.realmIndex * 0.35));
    gainExp(gain, '修炼');
  }

  if (!battleState.active) {
    game.life = clamp((game.life || maxHp) + Math.max(1, Math.floor(maxHp * 0.012)), 0, maxHp);
  }

  if (game.afkActive && game.afkMapId) {
    const map = MAPS[game.afkMapId];
    const afkExp = Math.max(6, Math.floor(map.afkBase.exp * stats.afk * (1 + game.realmIndex * 0.015)));
    const afkStone = Math.max(2, Math.floor(map.afkBase.stone * stats.afk));
    gainExp(afkExp, '挂机');
    game.stone += afkStone;
    if (Math.random() < 0.28) {
      const monster = randomMonsterOnMap(game.afkMapId);
      if (Math.random() < 0.72) {
        gainExp(Math.floor(monster.exp * 0.42), '挂机');
        game.stone += Math.floor(monster.stone * 0.38);
        game.stats.killCount += 1;
        game.stats.battlesWon += 1;
        if (Math.random() < 0.22) {
          const itemId = randomFrom(monster.drops);
          addItem(itemId, 1);
          addLog(`挂机于【${map.name}】时顺手收获 ${ITEM_DEFS[itemId].name} ×1。`, 'good');
        }
      } else {
        game.life = Math.max(1, game.life - Math.floor(maxHp * 0.06));
        addLog(`你在【${map.name}】挂机时遇到点小麻烦，掉了些气血。`, 'warn');
      }
    }
  }

  updateUI();
}

function handleOfflineGain() {
  const now = Date.now();
  const diffSec = Math.min(60 * 60 * 8, Math.max(0, Math.floor((now - (game.lastSeen || now)) / 1000)));
  if (!diffSec) return;
  const stats = calcPlayerStats();
  let totalExp = 0;
  let totalStone = 0;
  if (game.cultivating) totalExp += Math.floor(diffSec * Math.max(2, 6 * stats.cult + game.realmIndex * 0.35));
  if (game.afkActive && game.afkMapId) {
    const map = MAPS[game.afkMapId];
    totalExp += Math.floor(diffSec * 0.55 * map.afkBase.exp * stats.afk);
    totalStone += Math.floor(diffSec * 0.22 * map.afkBase.stone * stats.afk);
    if (diffSec > 600) {
      const monster = randomMonsterOnMap(game.afkMapId);
      if (Math.random() < 0.8) {
        totalExp += Math.floor(monster.exp * 2.4);
        totalStone += Math.floor(monster.stone * 2.2);
      }
    }
  }
  if (totalExp > 0 || totalStone > 0) {
    gainExp(totalExp, '离线');
    game.stone += totalStone;
    addLog(`离线期间共获得修为 +${formatNum(totalExp)}，灵石 +${formatNum(totalStone)}。`, 'rare');
  }
  game.lastSeen = now;
}

function saveGame() {
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  addLog('第十二版存档成功。战后自动回血也一起写进了存档里。', 'good');
}
function loadGame() {
  const direct = localStorage.getItem(SAVE_KEY);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    handleOfflineGain();
    addLog('第十二版读档成功。你从上次断开的地方接着修。', 'rare');
    updateUI();
    return;
  }
  for (const key of LEGACY_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) {
      const imported = importLegacySave(raw);
      if (imported) {
        game = imported;
        normalizeGame();
        addLog(`已从旧版本存档 ${key} 迁入第十二版。你的人还在，手感还升级了。`, 'rare');
        updateUI();
        return;
      }
    }
  }
  addLog('没有找到可读取的存档。这里现在比你的储物袋还空。', 'warn');
}
function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  game = createNewGame();
  normalizeGame();
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。第十二版上线，打完架终于会自动回血。`, 'rare');
  updateUI();
}
function init() {
  const direct = localStorage.getItem(SAVE_KEY);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    handleOfflineGain();
    addLog('你从第十二版存档中苏醒，战斗、技能、挂机和地图系统已经就位。', 'rare');
  } else {
    let imported = null;
    for (const key of LEGACY_KEYS) {
      const raw = localStorage.getItem(key);
      if (raw) {
        imported = importLegacySave(raw);
        if (imported) break;
      }
    }
    game = imported || createNewGame();
    normalizeGame();
    if (imported) addLog('旧存档已迁入第十二版，地图战斗和技能手感会按新平衡重算。', 'rare');
    else addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第十二版已开启：战后自动回血、键盘移动、主动技能和精英房都已接入。', 'muted');
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

function renderOverview() {
  const stats = calcPlayerStats();
  document.getElementById('heroRealm').textContent = getRealm().key;
  document.getElementById('techBadge').textContent = `功法：${getTechnique().name}`;
  document.getElementById('weaponBadge').textContent = `武器：${game.equipped.weapon ? EQUIPMENT_DEFS[game.equipped.weapon].name : '未装备'}`;
  document.getElementById('afkBadge').textContent = `挂机：${game.afkActive && game.afkMapId ? MAPS[game.afkMapId].name : '未开启'}`;
  const realm = getRealm();
  const percent = clamp(game.exp / realm.need, 0, 1);
  document.getElementById('expBar').style.width = `${percent * 100}%`;
  document.getElementById('expText').textContent = `${formatNum(game.exp)} / ${formatNum(realm.need)}`;

  document.getElementById('heroStats').innerHTML = `
    <div class="hero-stat"><span>攻击</span><strong>${stats.atk}</strong></div>
    <div class="hero-stat"><span>防御</span><strong>${stats.def}</strong></div>
    <div class="hero-stat"><span>生命上限</span><strong>${stats.maxHp}</strong></div>
    <div class="hero-stat"><span>暴击</span><strong>${pct(stats.crit)}</strong></div>
    <div class="hero-stat"><span>修炼倍率</span><strong>${stats.cult.toFixed(2)}</strong></div>
    <div class="hero-stat"><span>挂机倍率</span><strong>${stats.afk.toFixed(2)}</strong></div>
    <div class="hero-stat"><span>战力</span><strong>${stats.power}</strong></div>
    <div class="hero-stat"><span>自动回血次数</span><strong>${game.stats.autoHeals}</strong></div>
  `;

  const need = Math.max(0, realm.need - Math.floor(game.exp));
  const bestMap = bestMapForRealm();
  const goalItems = [
    `<div class="tip-item">下一次突破目标：<b>${REALMS[clamp(game.realmIndex + 1, 0, REALMS.length - 1)].key}</b><small>还差 ${need} 修为。修炼能补，打怪也能补，终于不用只坐着吸空气了。</small></div>`,
    `<div class="tip-item">当前最适合的地图：<b>${bestMap.name}</b><small>${bestMap.dropsNote}</small></div>`,
    `<div class="tip-item">当前建议：<b>${stats.atk >= stats.def ? '主动刷怪，利用战后自动回血循环拉经验' : '先补法衣和回春丹，减少翻车概率'}</b><small>第十二版打完自动回满血，适合连续压怪。</small></div>`
  ];
  document.getElementById('goalPanel').innerHTML = goalItems.join('');

  const dropNotes = Object.values(MAPS).map((map) => `<div class="tip-item"><b>${map.name}</b><small>${map.dropsNote}</small></div>`).join('');
  document.getElementById('dropNotesPanel').innerHTML = dropNotes;

  const map = getMapData();
  const state = getMapState();
  const tile = map.layout[state.pos.y][state.pos.x];
  const tileText = tileToText(tile);
  document.getElementById('mapHintPanel').innerHTML = `
    <div class="tip-item">当前所在：<b>${map.name}</b><small>${map.desc}</small></div>
    <div class="tip-item">当前格子：<b>${tileText}</b><small>坐标 (${state.pos.x + 1}, ${state.pos.y + 1})。多走几格，怪和宝都会主动找上门。</small></div>
  `;
}

function renderMapPanels() {
  const mapList = document.getElementById('mapList');
  if (mapList) {
    mapList.innerHTML = Object.values(MAPS).map((map) => {
      const selected = map.id === game.currentMapId;
      const recommend = game.realmIndex >= map.rec ? '可应对' : '略危险';
      return `
        <div class="info-card">
          <div class="card-top">
            <div>
              <h3>${map.name}</h3>
              <div class="rank">推荐：${REALMS[map.rec]?.key || '高阶'} · 当前判定：${recommend}</div>
            </div>
            <span class="tiny-tag ${selected ? 'rare' : ''}">${selected ? '当前地图' : '可切换'}</span>
          </div>
          <p>${map.desc}</p>
          <div class="note-line"><span class="label">掉落注释：</span>${map.dropsNote}</div>
          <div class="meta-grid">
            <div class="meta-chip">挂机修为：约 ${map.afkBase.exp}/秒</div>
            <div class="meta-chip">挂机灵石：约 ${map.afkBase.stone}/秒</div>
            <div class="meta-chip">怪群：${map.monsters.map((id) => MONSTERS[id].name).join('、')}</div>
            <div class="meta-chip">地图亮点：${map.layout.flat().includes('B') ? '含精英点' : '常规探索'}</div>
          </div>
          <div class="card-actions">
            <button class="inline-btn" onclick="selectMap('${map.id}')">设为当前地图</button>
            <button class="inline-btn" onclick="selectAfkMap('${map.id}')">设为挂机地图</button>
            <button class="inline-btn" onclick="toggleAfk('${map.id}')">${game.afkActive && game.afkMapId === map.id ? '停止挂机' : '在此挂机'}</button>
          </div>
        </div>`;
    }).join('');
  }
  const map = getMapData();
  const state = getMapState();
  document.getElementById('mapDetailPanel').innerHTML = `
    <div class="tip-item"><b>${map.name}</b><small>${map.desc}</small></div>
    <div class="tip-item">掉落注释：<small>${map.dropsNote}</small></div>
    <div class="tip-item">当前位置：<small>(${state.pos.x + 1}, ${state.pos.y + 1}) · ${tileToText(map.layout[state.pos.y][state.pos.x])}</small></div>
    <div class="tip-item">探索提示：<small>踩到 <b>M</b> 更容易遇怪，<b>T</b> 能开箱，<b>H</b> 能捡药，<b>B</b> 是精英点。战后会自动回血，适合连续刷。</small></div>
  `;
  renderMiniMap();
}

function renderMiniMap() {
  const map = getMapData();
  const state = getMapState();
  document.getElementById('miniMapName').textContent = map.name;
  const html = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const tile = map.layout[y][x];
      const key = `${x},${y}`;
      const visited = !!state.visited[key];
      const isPlayer = state.pos.x === x && state.pos.y === y;
      const classes = ['map-cell'];
      if (visited) classes.push('visited');
      if (isPlayer) classes.push('player');
      if (tile === 'M') classes.push('monster');
      if (tile === 'T') classes.push('treasure');
      if (tile === 'H') classes.push('herb');
      if (tile === 'B') classes.push('boss');
      const label = tile === '#' ? '岩' : (tile === 'S' ? '起' : (visited || isPlayer ? tile : '·'));
      html.push(`<div class="${classes.join(' ')}">${label}</div>`);
    }
  }
  document.getElementById('miniMap').innerHTML = html.join('');
  document.getElementById('currentMapSide').textContent = map.name;
  document.getElementById('playerPosSide').textContent = `${state.pos.x + 1}, ${state.pos.y + 1}`;
  document.getElementById('afkMapSide').textContent = game.afkMapId ? MAPS[game.afkMapId].name : '未设置';
}
function tileToText(tile) {
  return {
    'S': '入口安全点',
    '.': '普通道路',
    'M': '怪物活动点',
    'T': '宝箱 / 残藏点',
    'H': '药材采集点',
    'B': '精英气息点',
    '#': '阻隔地形'
  }[tile] || '未知地块';
}

function renderSkills() {
  const stats = calcPlayerStats();
  document.getElementById('skillList').innerHTML = Object.values(SKILLS).map((skill) => `
    <div class="info-card">
      <div class="card-top">
        <div>
          <h3>${skill.name}</h3>
          <div class="rank">冷却 ${skill.cd} 回合</div>
        </div>
        <span class="tiny-tag ${battleState.skillCd[skill.id] === 0 ? 'rare' : ''}">${battleState.skillCd[skill.id] === 0 ? '可用' : `冷却 ${battleState.skillCd[skill.id]}`}</span>
      </div>
      <p>${skill.desc}</p>
      <div class="meta-grid">
        <div class="meta-chip">当前攻击参考：${stats.atk}</div>
        <div class="meta-chip">当前防御参考：${stats.def}</div>
      </div>
      <div class="card-actions">
        <button class="inline-btn" onclick="castSkill('${skill.id}')">在战斗中释放</button>
      </div>
    </div>
  `).join('');
}

function renderInventory() {
  const entries = Object.entries(game.inventory)
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => {
      const typeA = ITEM_DEFS[a[0]].type;
      const typeB = ITEM_DEFS[b[0]].type;
      return typeA.localeCompare(typeB) || ITEM_DEFS[a[0]].name.localeCompare(ITEM_DEFS[b[0]].name);
    });
  document.getElementById('inventoryList').innerHTML = entries.length ? entries.map(([id, amount]) => {
    const item = ITEM_DEFS[id];
    return `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h4>${item.name} ×${amount}</h4>
            <div class="rank">${item.type === 'consumable' ? '消耗品' : '材料'}</div>
          </div>
        </div>
        <p>${item.desc}</p>
        <div class="card-actions">
          ${item.type === 'consumable' ? `<button class="inline-btn" onclick="usePotion('${id}')">使用</button>` : ''}
        </div>
      </div>`;
  }).join('') : `<div class="empty-text">背包暂时挺空。说明你要么很会花，要么还没开始捡。</div>`;
}

function renderTechniques() {
  document.getElementById('techniqueList').innerHTML = Object.values(TECHNIQUES).map((tech) => {
    const learned = game.learnedTechniques.includes(tech.id);
    const active = game.activeTechnique === tech.id;
    const unlockCost = 80 + Object.keys(TECHNIQUES).indexOf(tech.id) * 55;
    return `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h3>${tech.name}</h3>
            <div class="rank">${learned ? '已领悟' : `需 ${unlockCost} 灵石参悟`}</div>
          </div>
          <span class="tiny-tag ${active ? 'gold' : ''}">${active ? '当前功法' : '可切换'}</span>
        </div>
        <p>${tech.desc}</p>
        <div class="meta-grid">
          <div class="meta-chip">修炼倍率：${tech.cult.toFixed(2)}</div>
          <div class="meta-chip">攻击倍率：${tech.atk.toFixed(2)}</div>
          <div class="meta-chip">防御倍率：${tech.def.toFixed(2)}</div>
          <div class="meta-chip">挂机倍率：${tech.afk.toFixed(2)}</div>
        </div>
        <div class="card-actions">
          ${!learned ? `<button class="inline-btn" onclick="unlockTechnique('${tech.id}', ${unlockCost})">参悟</button>` : ''}
          ${learned && !active ? `<button class="inline-btn" onclick="switchTechnique('${tech.id}')">切换</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}
function unlockTechnique(id, cost) {
  if (game.learnedTechniques.includes(id)) return;
  if (game.stone < cost) {
    addLog(`灵石不足，参悟【${TECHNIQUES[id].name}】还差 ${cost - game.stone}。`, 'warn');
    return;
  }
  game.stone -= cost;
  game.learnedTechniques.push(id);
  addLog(`你参悟了【${TECHNIQUES[id].name}】。现在练法终于不只一套。`, 'rare');
  updateUI();
}
function switchTechnique(id) {
  if (!game.learnedTechniques.includes(id)) return;
  game.activeTechnique = id;
  addLog(`你切换为【${TECHNIQUES[id].name}】。`, 'good');
  updateUI();
}

function renderEquipment() {
  const equipped = game.equipped;
  document.getElementById('equippedPanel').innerHTML = `
    <h3>当前装备</h3>
    <div class="tip-stack">
      ${['weapon', 'robe', 'ring', 'talisman'].map((slot) => {
        const id = equipped[slot];
        const item = id ? EQUIPMENT_DEFS[id] : null;
        return `<div class="tip-item"><b>${slotLabel(slot)}</b><small>${item ? `${item.name} · ${item.rank}` : '未装备'}</small></div>`;
      }).join('')}
    </div>
  `;
  document.getElementById('equipmentList').innerHTML = game.equipmentBag.map((id) => {
    const item = EQUIPMENT_DEFS[id];
    const active = game.equipped[item.slot] === id;
    const statsText = Object.entries(item.stats).map(([k, v]) => `${statLabel(k)} ${typeof v === 'number' && v < 1 ? '+' + pct(v) : '+' + v}`).join(' · ');
    return `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h4>${item.name}</h4>
            <div><span class="rank">${item.rank}</span> · <span class="slot">${slotLabel(item.slot)}</span></div>
          </div>
          <span class="tiny-tag ${active ? 'gold' : ''}">${active ? '已穿戴' : '背包中'}</span>
        </div>
        <p>${item.desc}</p>
        <div class="note-line">${statsText}</div>
        <div class="card-actions">
          ${!active ? `<button class="inline-btn" onclick="equipItem('${id}')">装备</button>` : ''}
        </div>
      </div>`;
  }).join('');
}
function slotLabel(slot) { return { weapon: '武器', robe: '法袍', ring: '戒指', talisman: '护符' }[slot] || slot; }
function statLabel(key) { return { atk: '攻击', def: '防御', hp: '生命', power: '战力', cult: '修炼倍率', afk: '挂机倍率', crit: '暴击', break: '突破' }[key] || key; }

function renderAfkPanel() {
  document.getElementById('afkPanel').innerHTML = Object.values(MAPS).map((map) => `
    <div class="info-card">
      <div class="card-top">
        <div>
          <h3>${map.name}</h3>
          <div class="rank">${game.afkMapId === map.id ? '当前挂机图' : '可挂机地图'}</div>
        </div>
        <span class="tiny-tag ${game.afkActive && game.afkMapId === map.id ? 'rare' : ''}">${game.afkActive && game.afkMapId === map.id ? '挂机中' : '待命'}</span>
      </div>
      <p>${map.dropsNote}</p>
      <div class="meta-grid">
        <div class="meta-chip">预计挂机修为：${map.afkBase.exp}/秒</div>
        <div class="meta-chip">预计挂机灵石：${map.afkBase.stone}/秒</div>
      </div>
      <div class="card-actions">
        <button class="inline-btn" onclick="selectAfkMap('${map.id}')">设为挂机图</button>
        <button class="inline-btn" onclick="toggleAfk('${map.id}')">${game.afkActive && game.afkMapId === map.id ? '停止挂机' : '开始挂机'}</button>
      </div>
    </div>
  `).join('');
}

function renderJournal() {
  document.getElementById('journalMaps').innerHTML = game.journal.maps.length ? `<ul class="list-bullets">${game.journal.maps.map((x) => `<li>${x}</li>`).join('')}</ul>` : `<div class="empty-text">还没发现任何地图。</div>`;
  document.getElementById('journalMonsters').innerHTML = game.journal.monsters.length ? `<ul class="list-bullets">${game.journal.monsters.map((x) => `<li>${x}</li>`).join('')}</ul>` : `<div class="empty-text">你的图鉴目前对怪物还算单纯。</div>`;
  document.getElementById('journalGear').innerHTML = game.journal.gears.length ? `<ul class="list-bullets">${game.journal.gears.map((x) => `<li>${x}</li>`).join('')}</ul>` : `<div class="empty-text">装备图鉴还是空的。</div>`;
  document.getElementById('journalStats').innerHTML = `
    <ul class="list-bullets">
      <li>累计探索步数：${game.stats.steps}</li>
      <li>累计探索次数：${game.stats.exploreCount}</li>
      <li>累计击杀：${game.stats.killCount}</li>
      <li>精英击杀：${game.stats.eliteKills}</li>
      <li>打怪获得修为：${formatNum(game.stats.killExp)}</li>
      <li>战斗胜利：${game.stats.battlesWon}</li>
      <li>战斗失败：${game.stats.battlesLost}</li>
      <li>战后自动回血：${game.stats.autoHeals}</li>
      <li>技能使用记录：${game.journal.skills.join('、') || '暂无'}</li>
    </ul>`;
}

function renderCombatPanel() {
  const stats = calcPlayerStats();
  document.getElementById('playerBattleStats').textContent = `攻 ${stats.atk} / 防 ${stats.def}`;
  const pHp = battleState.active ? battleState.playerHp : game.life;
  const pMax = stats.maxHp;
  document.getElementById('playerHpBar').style.width = `${clamp((pHp / pMax) * 100, 0, 100)}%`;
  document.getElementById('playerHpText').textContent = `${Math.floor(pHp)} / ${pMax}${battleState.shield > 0 ? ` · 护盾 ${battleState.shield}` : ''}`;

  if (battleState.active && battleState.enemy) {
    const e = battleState.enemy;
    document.getElementById('monsterBattleName').textContent = e.name;
    document.getElementById('monsterBattleStats').textContent = `攻 ${e.atk} / 防 ${e.def}`;
    document.getElementById('monsterHpBar').style.width = `${clamp((battleState.enemyHp / e.hp) * 100, 0, 100)}%`;
    document.getElementById('monsterHpText').textContent = `${Math.floor(battleState.enemyHp)} / ${e.hp}`;
  } else {
    document.getElementById('monsterBattleName').textContent = '暂无敌人';
    document.getElementById('monsterBattleStats').textContent = '等待遭遇';
    document.getElementById('monsterHpBar').style.width = '0%';
    document.getElementById('monsterHpText').textContent = '0 / 0';
  }
  document.getElementById('autoBattleText').textContent = `自动战斗：${battleState.auto ? '开' : '关'}`;
  document.getElementById('combatFeed').innerHTML = battleState.feed.length ? battleState.feed.map((row) => `<div class="feed-row">${row}</div>`).join('') : `<div class="empty-text">当前还没有战斗记录。先去地图里踩两步，怪就会自己找你聊天。</div>`;
  document.getElementById('skillCooldownPanel').innerHTML = Object.values(SKILLS).map((skill) => `<div class="cooldown-chip">${skill.name}：${battleState.skillCd[skill.id] > 0 ? `${battleState.skillCd[skill.id]} 回合` : '可用'}</div>`).join('');
}

function renderLogs() {
  const logPanel = document.getElementById('logPanel');
  if (!logPanel) return;
  logPanel.innerHTML = game.logs.length ? game.logs.map((log) => `<div class="log-item ${log.type || 'muted'}">${log.text}</div>`).join('') : `<div class="empty-text">日志还空着。说明你还没开始折腾世界。</div>`;
}

function bestMapForRealm() {
  const entries = Object.values(MAPS).sort((a, b) => a.rec - b.rec);
  let best = entries[0];
  entries.forEach((map) => { if (game.realmIndex >= map.rec) best = map; });
  return best;
}

function updateTopBar() {
  const stats = calcPlayerStats();
  document.getElementById('nameTop').textContent = game.name;
  document.getElementById('rootTop').textContent = game.rootName;
  document.getElementById('realmTop').textContent = getRealm().key;
  document.getElementById('expTop').textContent = `${formatNum(game.exp)} / ${formatNum(getRealm().need)}`;
  document.getElementById('lifeTop').textContent = `${Math.floor(game.life)} / ${stats.maxHp}`;
  document.getElementById('stoneTop').textContent = formatNum(game.stone);
  document.getElementById('powerTop').textContent = formatNum(stats.power);
  document.getElementById('afkTop').textContent = game.afkActive && game.afkMapId ? MAPS[game.afkMapId].name : '未开启';
  document.getElementById('cultivationBtnText').textContent = game.cultivating ? '停止修炼' : '开始修炼';
  document.getElementById('cultivationInlineText').textContent = game.cultivating ? '停止修炼' : '开始修炼';
}
function updateUI() {
  updateTopBar();
  renderOverview();
  renderMapPanels();
  renderSkills();
  renderInventory();
  renderTechniques();
  renderEquipment();
  renderAfkPanel();
  renderJournal();
  renderCombatPanel();
  renderLogs();
}

window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  }
});
window.addEventListener('keydown', (e) => {
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  if (battleState.active) {
    if (e.key === '1') playerAttack();
    if (e.key === '2') castSkill('slash');
    if (e.key === '3') castSkill('guard');
    if (e.key === '4') castSkill('thunder');
    if (e.key === '5') usePotion('healPill', true);
    if (e.key === 'Escape') runAway();
    return;
  }
  if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') movePlayer(0,-1);
  if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') movePlayer(0,1);
  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') movePlayer(-1,0);
  if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') movePlayer(1,0);
  if (e.key === 'Enter') inspectTile();
});

window.onload = init;



/* ===== 第十三版附加系统：炼丹 / 商店 / 灵宠 / 轮回 ===== */
const SAVE_KEY_V13 = 'xiuxian_v13_save';

ITEM_DEFS.petEgg = { id: 'petEgg', name: '灵宠蛋', type: 'consumable', desc: '孵化后随机获得一只灵宠。' };
ITEM_DEFS.petSnack = { id: 'petSnack', name: '灵兽零嘴', type: 'consumable', desc: '给灵宠吃，提升亲密度。' };

const PET_DEFS = {
  fox: { id: 'fox', name: '寻宝灵狐', desc: '偏探索和挂机，逛图比你还积极。', atk: 4, def: 2, hp: 18, crit: 0.01, afk: 0.08, cult: 0.02, power: 12 },
  wolf: { id: 'wolf', name: '青鬃妖狼', desc: '偏战斗，干架的时候很有存在感。', atk: 10, def: 4, hp: 26, crit: 0.02, afk: 0.03, cult: 0.00, power: 18 },
  hawk: { id: 'hawk', name: '雷纹隼', desc: '偏爆发和地图侦查，看到怪比你还快。', atk: 7, def: 2, hp: 14, crit: 0.04, afk: 0.05, cult: 0.01, power: 15 },
  turtle: { id: 'turtle', name: '玄甲龟', desc: '偏防御和生存，跟着它会踏实很多。', atk: 2, def: 9, hp: 42, crit: 0.00, afk: 0.06, cult: 0.02, power: 16 }
};

const RECIPES = {
  qiPill: {
    id: 'qiPill', name: '聚气丹', cost: { spiritHerb: 2, redFruit: 1 }, rate: 0.82,
    desc: '基础修为丹，前中期都不嫌多。'
  },
  healPill: {
    id: 'healPill', name: '回春丹', cost: { spiritHerb: 1, dewLeaf: 2 }, rate: 0.84,
    desc: '回血刚需，尤其打不过又不想跑的时候。'
  },
  insightPill: {
    id: 'insightPill', name: '凝神丹', cost: { spiritHerb: 1, beastCore: 1, dewLeaf: 1 }, rate: 0.68,
    desc: '突破前来一颗，心态会稳很多。'
  },
  thunderCharm: {
    id: 'thunderCharm', name: '避雷符', cost: { thunderStone: 2, beastCore: 1 }, rate: 0.7,
    desc: '雷图和后期突破都很需要。'
  },
  petSnack: {
    id: 'petSnack', name: '灵兽零嘴', cost: { redFruit: 1, beastCore: 1 }, rate: 0.88,
    desc: '拿来哄灵宠的，动物和人一样都会被零嘴收买。'
  }
};

const SHOP_ITEMS = [
  { id: 'spiritHerb', price: 18 },
  { id: 'redFruit', price: 20 },
  { id: 'dewLeaf', price: 22 },
  { id: 'beastCore', price: 30 },
  { id: 'thunderStone', price: 40 },
  { id: 'qiPill', price: 66 },
  { id: 'healPill', price: 62 },
  { id: 'insightPill', price: 88 },
  { id: 'thunderCharm', price: 96 },
  { id: 'petEgg', price: 320 },
  { id: 'petSnack', price: 76 }
];

const createNewGameV12 = createNewGame;
createNewGame = function(meta = {}) {
  const g = createNewGameV12(meta);
  g.version = 13;
  g.soulMarks = Number(meta.soulMarks) || 0;
  g.rebirthCount = Number(meta.rebirthCount) || 1;
  g.alchemyCount = Number(meta.alchemyCount) || 0;
  g.petsOwned = Array.isArray(meta.petsOwned) ? meta.petsOwned.slice() : [];
  g.activePet = meta.activePet || g.petsOwned[0] || null;
  g.petBond = meta.petBond || {};
  g.inventory.petEgg = g.inventory.petEgg || 0;
  g.inventory.petSnack = g.inventory.petSnack || 0;
  return g;
};

function ensureV13State() {
  if (!game || typeof game !== 'object') return;
  if (!Number.isFinite(game.soulMarks)) game.soulMarks = 0;
  if (!Number.isFinite(game.rebirthCount)) game.rebirthCount = 1;
  if (!Number.isFinite(game.alchemyCount)) game.alchemyCount = 0;
  if (!Array.isArray(game.petsOwned)) game.petsOwned = [];
  if (!game.petBond || typeof game.petBond !== 'object') game.petBond = {};
  if (!game.activePet || !game.petsOwned.includes(game.activePet)) game.activePet = game.petsOwned[0] || null;
  if (!game.inventory) game.inventory = {};
  if (!Number.isFinite(game.inventory.petEgg)) game.inventory.petEgg = 0;
  if (!Number.isFinite(game.inventory.petSnack)) game.inventory.petSnack = 0;
  game.version = 13;
}

const normalizeGameV12 = normalizeGame;
normalizeGame = function() {
  normalizeGameV12();
  ensureV13State();
};

function getActivePet() {
  ensureV13State();
  return game.activePet ? PET_DEFS[game.activePet] : null;
}
function getPetBond(petId = game.activePet) {
  ensureV13State();
  if (!petId) return 0;
  return Number(game.petBond[petId] || 0);
}

const calcPlayerStatsV12 = calcPlayerStats;
calcPlayerStats = function() {
  const stats = calcPlayerStatsV12();
  ensureV13State();
  const pet = getActivePet();
  const bond = getPetBond();
  const soulMarks = game.soulMarks || 0;
  if (pet) {
    stats.atk += pet.atk + bond * 2;
    stats.def += pet.def + Math.floor(bond * 1.2);
    stats.maxHp += pet.hp + bond * 6;
    stats.crit = clamp(stats.crit + pet.crit + bond * 0.004, 0.02, 0.55);
    stats.afk += pet.afk + bond * 0.01;
    stats.cult += pet.cult + soulMarks * 0.015;
    stats.power += pet.power + bond * 9 + soulMarks * 12;
  } else {
    stats.cult += soulMarks * 0.015;
    stats.power += soulMarks * 10;
  }
  stats.atk += soulMarks * 2;
  stats.def += Math.floor(soulMarks * 1.5);
  stats.maxHp += soulMarks * 10;
  stats.breakBonus += soulMarks;
  return stats;
};

const renderOverviewV12 = renderOverview;
renderOverview = function() {
  renderOverviewV12();
  const activePet = getActivePet();
  const heroStats = document.getElementById('heroStats');
  if (heroStats) {
    heroStats.insertAdjacentHTML('beforeend', `
      <div class="hero-stat"><span>轮回印</span><strong>${game.soulMarks}</strong></div>
      <div class="hero-stat"><span>灵宠</span><strong>${activePet ? activePet.name : '暂无'}</strong></div>
    `);
  }
  const goalPanel = document.getElementById('goalPanel');
  if (goalPanel) {
    goalPanel.insertAdjacentHTML('beforeend', `<div class="tip-item"><b>轮回提示</b><small>当前已轮回 ${game.rebirthCount} 世，轮回印 ${game.soulMarks}。这一世不管成败，都能给下一世留点底子。</small></div>`);
  }
};

const usePotionV12 = usePotion;
usePotion = function(itemId, inBattle = false) {
  if (itemId === 'petEgg') {
    if (getInventoryAmount('petEgg') <= 0) {
      addLog('你摸了摸储物袋，灵宠蛋并不在。', 'warn');
      return;
    }
    spendItem('petEgg', 1);
    acquireRandomPet(true);
    updateUI();
    return;
  }
  if (itemId === 'petSnack') {
    if (getInventoryAmount('petSnack') <= 0) {
      addLog('灵兽零嘴已经吃完了。灵宠看你的眼神开始有点复杂。', 'warn');
      return;
    }
    if (!game.activePet) {
      addLog('你现在还没有灵宠，零嘴只能先自己忍住别吃。', 'warn');
      return;
    }
    spendItem('petSnack', 1);
    game.petBond[game.activePet] = getPetBond(game.activePet) + 1;
    addLog(`你喂了【${PET_DEFS[game.activePet].name}】一份灵兽零嘴，亲密度 +1。`, 'good');
    updateUI();
    return;
  }
  usePotionV12(itemId, inBattle);
};

function acquireRandomPet(fromEgg = false, forcedId = null) {
  ensureV13State();
  const pool = Object.keys(PET_DEFS).filter((id) => !game.petsOwned.includes(id));
  if (!pool.length) {
    addLog('你已经把当前版本能收的灵宠都收齐了。现在更像开宠物店。', 'rare');
    addItem('petSnack', 1);
    return;
  }
  const id = forcedId || randomFrom(pool);
  game.petsOwned.push(id);
  if (!game.activePet) game.activePet = id;
  if (!game.petBond[id]) game.petBond[id] = 1;
  addLog(`${fromEgg ? '灵宠蛋孵化' : '奇遇收服'}获得了【${PET_DEFS[id].name}】！`, 'rare');
}

const handleBattleWinV12 = handleBattleWin;
handleBattleWin = function() {
  const enemy = battleState.enemy ? { ...battleState.enemy } : null;
  const wasElite = !!battleState.enemy?.isElite;
  handleBattleWinV12();
  ensureV13State();
  if (enemy) {
    const chance = wasElite ? 0.22 : 0.06;
    if (Math.random() < chance) acquireRandomPet(false);
    if (Math.random() < 0.18) {
      addItem('petSnack', 1);
      addLog('你在战利品里翻到一份灵兽零嘴。看来连怪都知道养宠要花钱。', 'good');
    }
  }
  updateUI();
};

function craftRecipe(id) {
  ensureV13State();
  const recipe = RECIPES[id];
  if (!recipe) return;
  const enough = Object.entries(recipe.cost).every(([itemId, amount]) => getInventoryAmount(itemId) >= amount);
  if (!enough) {
    addLog(`材料不足，无法炼制【${recipe.name}】。`, 'warn');
    return;
  }
  Object.entries(recipe.cost).forEach(([itemId, amount]) => spendItem(itemId, amount));
  const bonus = game.realmIndex * 0.008 + game.soulMarks * 0.01;
  const rate = clamp(recipe.rate + bonus, 0.35, 0.98);
  if (Math.random() < rate) {
    addItem(recipe.id, 1);
    game.alchemyCount += 1;
    addLog(`你炼成了【${recipe.name}】。这炉总算没炸。`, 'good');
  } else {
    game.alchemyCount += 1;
    if (Math.random() < 0.35) addItem('spiritHerb', 1);
    addLog(`你炼制【${recipe.name}】失败，屋里香味有了，成品没有。`, 'warn');
  }
  updateUI();
}

function buyShopItem(id, price) {
  ensureV13State();
  if (game.stone < price) {
    addLog(`灵石不足，购买【${ITEM_DEFS[id].name}】还差 ${price - game.stone}。`, 'warn');
    return;
  }
  game.stone -= price;
  addItem(id, 1);
  addLog(`你在商店买下了【${ITEM_DEFS[id].name}】。`, 'good');
  updateUI();
}

function sellInventoryItem(id) {
  const amount = getInventoryAmount(id);
  if (amount <= 0) {
    addLog(`你没有【${ITEM_DEFS[id].name}】可以卖。`, 'warn');
    return;
  }
  const sellPrice = Math.max(4, Math.floor((SHOP_ITEMS.find((x) => x.id === id)?.price || 16) * 0.45));
  spendItem(id, 1);
  game.stone += sellPrice;
  addLog(`你卖掉了【${ITEM_DEFS[id].name}】×1，获得 ${sellPrice} 灵石。`, 'muted');
  updateUI();
}

function setActivePet(id) {
  if (!game.petsOwned.includes(id)) return;
  game.activePet = id;
  addLog(`你让【${PET_DEFS[id].name}】跟在身边。终于不是一个人修仙了。`, 'good');
  updateUI();
}
function feedPet(id) {
  if (!game.petsOwned.includes(id)) return;
  if (!spendItem('petSnack', 1)) {
    addLog('灵兽零嘴不足，灵宠盯着你看了一会儿，像是在说“画饼没用”。', 'warn');
    return;
  }
  game.petBond[id] = getPetBond(id) + 1;
  addLog(`你喂了【${PET_DEFS[id].name}】一份灵兽零嘴，亲密度 +1。`, 'good');
  updateUI();
}

function calculateRebirthGain() {
  const base = 1 + Math.floor(game.realmIndex / 4);
  const kills = Math.floor(game.stats.killCount / 25);
  const elites = game.stats.eliteKills * 2;
  return base + kills + elites;
}
function reincarnateV13() {
  ensureV13State();
  const gain = calculateRebirthGain();
  const keepPet = game.activePet || game.petsOwned[0] || null;
  const keepInventory = {};
  ['qiPill','healPill','insightPill','petSnack','petEgg'].forEach((id) => {
    if (getInventoryAmount(id) > 0) keepInventory[id] = Math.min(getInventoryAmount(id), 2);
  });
  const next = createNewGame({
    stone: 120 + Math.floor(game.stone * 0.12),
    inventory: keepInventory,
    soulMarks: game.soulMarks + gain,
    rebirthCount: game.rebirthCount + 1,
    petsOwned: keepPet ? [keepPet] : [],
    activePet: keepPet || null,
    petBond: keepPet ? { [keepPet]: Math.max(1, Math.floor(getPetBond(keepPet) / 2)) } : {}
  });
  game = next;
  normalizeGame();
  addLog(`你选择轮回重生，获得轮回印 +${gain}。下一世重新开始，但底子更厚了。`, 'rare');
  updateUI();
}

function renderAlchemy() {
  const panel = document.getElementById('alchemyPanel');
  if (!panel) return;
  panel.innerHTML = Object.values(RECIPES).map((recipe) => {
    const costText = Object.entries(recipe.cost).map(([id, amount]) => `${ITEM_DEFS[id].name}×${amount}`).join('、');
    const rate = clamp(recipe.rate + game.realmIndex * 0.008 + game.soulMarks * 0.01, 0.35, 0.98);
    return `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h3>${recipe.name}</h3>
            <div class="rank">炼制成功率：${Math.round(rate * 100)}%</div>
          </div>
          <span class="tiny-tag gold">已炼 ${game.alchemyCount} 次</span>
        </div>
        <p>${recipe.desc}</p>
        <div class="note-line"><span class="label">材料：</span>${costText}</div>
        <div class="card-actions">
          <button class="inline-btn" onclick="craftRecipe('${recipe.id}')">炼制</button>
        </div>
      </div>`;
  }).join('');
}

function renderShop() {
  const panel = document.getElementById('shopPanel');
  if (!panel) return;
  const buyCards = SHOP_ITEMS.map((item) => `
    <div class="info-card">
      <div class="card-top">
        <div>
          <h3>${ITEM_DEFS[item.id].name}</h3>
          <div class="rank">售价：${item.price} 灵石</div>
        </div>
      </div>
      <p>${ITEM_DEFS[item.id].desc}</p>
      <div class="card-actions">
        <button class="inline-btn" onclick="buyShopItem('${item.id}', ${item.price})">购买</button>
      </div>
    </div>`).join('');
  const sellable = ['spiritHerb','redFruit','dewLeaf','beastCore','thunderStone','seaCrystal'];
  const sellCards = sellable.filter((id) => getInventoryAmount(id) > 0).map((id) => {
    const price = Math.max(4, Math.floor((SHOP_ITEMS.find((x) => x.id === id)?.price || 16) * 0.45));
    return `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h3>${ITEM_DEFS[id].name} ×${getInventoryAmount(id)}</h3>
            <div class="rank">回收价：${price} 灵石 / 个</div>
          </div>
        </div>
        <p>${ITEM_DEFS[id].desc}</p>
        <div class="card-actions">
          <button class="inline-btn" onclick="sellInventoryItem('${id}')">出售 1 个</button>
        </div>
      </div>`;
  }).join('');
  panel.innerHTML = `
    <div class="info-card rebirth-highlight">
      <h3>商店提示</h3>
      <p>灵石终于有地方稳定花了。药不够就买，材料不够也买，甚至还能直接买灵宠蛋。</p>
      <div class="small-grid">
        <div class="meta-chip">当前灵石：${formatNum(game.stone)}</div>
        <div class="meta-chip">轮回印：${game.soulMarks}</div>
      </div>
    </div>
    ${buyCards}
    ${sellCards || `<div class="empty-text">你现在没什么可卖的，商人看你的眼神都带着点失望。</div>`}
  `;
}

function renderPets() {
  const panel = document.getElementById('petPanel');
  if (!panel) return;
  if (!game.petsOwned.length) {
    panel.innerHTML = `
      <div class="info-card">
        <h3>暂无灵宠</h3>
        <p>你现在还是单人修仙。可以去商店买灵宠蛋，也可以打怪碰碰运气。</p>
        <div class="card-actions">
          <button class="inline-btn" onclick="setView('shop')">去商店买蛋</button>
        </div>
      </div>`;
    return;
  }
  panel.innerHTML = game.petsOwned.map((id) => {
    const pet = PET_DEFS[id];
    const active = game.activePet === id;
    const bond = getPetBond(id);
    return `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h3>${pet.name}</h3>
            <div class="rank">亲密度：${bond} · ${active ? '当前出战' : '待命中'}</div>
          </div>
          <span class="tiny-tag ${active ? 'gold' : ''}">${active ? '跟随中' : '可切换'}</span>
        </div>
        <p>${pet.desc}</p>
        <div class="pet-badges">
          <span class="pet-badge">攻击 +${pet.atk + bond * 2}</span>
          <span class="pet-badge">防御 +${pet.def + Math.floor(bond * 1.2)}</span>
          <span class="pet-badge">生命 +${pet.hp + bond * 6}</span>
          <span class="pet-badge">挂机 +${Math.round((pet.afk + bond * 0.01) * 100)}%</span>
        </div>
        <div class="card-actions">
          ${!active ? `<button class="inline-btn" onclick="setActivePet('${id}')">设为跟随</button>` : ''}
          <button class="inline-btn" onclick="feedPet('${id}')">喂零嘴</button>
        </div>
      </div>`;
  }).join('');
}

function renderRebirth() {
  const panel = document.getElementById('rebirthPanel');
  if (!panel) return;
  const nextGain = calculateRebirthGain();
  const activePet = getActivePet();
  panel.innerHTML = `
    <div class="info-card rebirth-highlight">
      <div class="card-top">
        <div>
          <h3>轮回总览</h3>
          <div class="rank">第 ${game.rebirthCount} 世 · 当前轮回印 ${game.soulMarks}</div>
        </div>
      </div>
      <p>轮回印会给你持续提供属性和修炼加成。说白了，就是你这几世的苦终于不算白吃。</p>
      <div class="small-grid">
        <div class="meta-chip">本次轮回预计获得：${nextGain}</div>
        <div class="meta-chip">当前境界：${getRealm().key}</div>
        <div class="meta-chip">击杀数：${game.stats.killCount}</div>
        <div class="meta-chip">精英击杀：${game.stats.eliteKills}</div>
      </div>
      <p class="note-line">${activePet ? `当前会尽量带走一只灵宠：【${activePet.name}】。` : '当前没有灵宠继承。'}</p>
      <div class="card-actions">
        <button class="inline-btn" onclick="reincarnateV13()">开始轮回</button>
      </div>
    </div>
  `;
}

const setViewV12 = setView;
setView = function(viewId) {
  setViewV12(viewId);
  if (viewId === 'alchemy') renderAlchemy();
  if (viewId === 'shop') renderShop();
  if (viewId === 'pets') renderPets();
  if (viewId === 'rebirth') renderRebirth();
};

const renderInventoryV12 = renderInventory;
renderInventory = function() {
  const entries = Object.entries(game.inventory).filter(([, amount]) => amount > 0);
  document.getElementById('inventoryList').innerHTML = entries.length ? entries.sort((a,b) => ITEM_DEFS[a[0]].name.localeCompare(ITEM_DEFS[b[0]].name)).map(([id, amount]) => {
    const item = ITEM_DEFS[id];
    const usable = ['consumable'].includes(item.type);
    return `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h4>${item.name} ×${amount}</h4>
            <div class="rank">${item.type === 'consumable' ? '可使用' : '材料'}</div>
          </div>
        </div>
        <p>${item.desc}</p>
        <div class="card-actions">
          ${usable ? `<button class="inline-btn" onclick="usePotion('${id}')">使用</button>` : ''}
          ${['spiritHerb','redFruit','dewLeaf','beastCore','thunderStone','seaCrystal'].includes(id) ? `<button class="inline-btn" onclick="sellInventoryItem('${id}')">卖 1 个</button>` : ''}
        </div>
      </div>`;
  }).join('') : `<div class="empty-text">背包暂时挺空。说明你要么很会花，要么还没开始捡。</div>`;
};

const renderJournalV12 = renderJournal;
renderJournal = function() {
  renderJournalV12();
  const statsBox = document.getElementById('journalStats');
  if (statsBox) {
    statsBox.innerHTML += `
      <ul class="list-bullets">
        <li>炼丹次数：${game.alchemyCount}</li>
        <li>轮回次数：${game.rebirthCount}</li>
        <li>轮回印：${game.soulMarks}</li>
        <li>已收灵宠：${game.petsOwned.length ? game.petsOwned.map((id) => PET_DEFS[id].name).join('、') : '暂无'}</li>
      </ul>
    `;
  }
};

const updateUIV12 = updateUI;
updateUI = function() {
  ensureV13State();
  updateUIV12();
  renderAlchemy();
  renderShop();
  renderPets();
  renderRebirth();
  document.title = '凡尘问道录 · 第十三版';
};

function bootFromStorageV13() {
  const direct = localStorage.getItem(SAVE_KEY_V13);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    handleOfflineGain();
    addLog('你从第十三版存档中苏醒。炼丹、灵宠、轮回和商店都已经就位。', 'rare');
    return true;
  }
  const prior = localStorage.getItem(SAVE_KEY);
  if (prior) {
    game = JSON.parse(prior);
    normalizeGame();
    addLog('已从第十二版存档迁入第十三版。系统多了，人还是你这个人。', 'rare');
    return true;
  }
  for (const key of LEGACY_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) {
      const imported = importLegacySave(raw);
      if (imported) {
        game = imported;
        normalizeGame();
        addLog(`已从旧版本存档 ${key} 迁入第十三版。`, 'rare');
        return true;
      }
    }
  }
  return false;
}

function saveGame() {
  ensureV13State();
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V13, JSON.stringify(game));
  addLog('第十三版存档成功。你这世的灵宠和丹炉终于也被一起记住了。', 'good');
}
function loadGame() {
  if (!bootFromStorageV13()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}
function resetGame() {
  localStorage.removeItem(SAVE_KEY_V13);
  game = createNewGame();
  normalizeGame();
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。第十三版上线，修仙终于回到“炼、买、养、转世”四件套。`, 'rare');
  updateUI();
}

function initV13() {
  const hasSave = bootFromStorageV13();
  if (!hasSave) {
    game = createNewGame();
    normalizeGame();
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第十三版已开启：探索打怪之外，炼丹、商店、灵宠与轮回全部回归。', 'muted');
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V13, JSON.stringify(game));
  }
});

window.craftRecipe = craftRecipe;
window.buyShopItem = buyShopItem;
window.sellInventoryItem = sellInventoryItem;
window.setActivePet = setActivePet;
window.feedPet = feedPet;
window.reincarnateV13 = reincarnateV13;

window.onload = initV13;



/* ===== 第十四版附加系统：经验后期加压 / 10 地图 / 10 境界 / 商店扩容 / 装备品级与升级 ===== */
const SAVE_KEY_V14 = 'xiuxian_v14_save';

const QUALITY_MULTIPLIER = {
  '凡器': 0,
  '法器': 0.05,
  '灵器': 0.1,
  '宝器': 0.16,
  '玄器': 0.24,
  '地器': 0.34,
  '天器': 0.46,
  '圣器': 0.62
};

// 后期经验曲线提高
for (let i = 10; i < REALMS.length; i++) {
  REALMS[i].need = Math.floor(REALMS[i].need * (1.18 + (i - 10) * 0.035));
}
REALMS.push(
  { key: '化神中期', need: 62000 },
  { key: '化神后期', need: 88000 },
  { key: '化神圆满', need: 124000 },
  { key: '炼虚初期', need: 176000 },
  { key: '炼虚中期', need: 248000 },
  { key: '炼虚后期', need: 346000 },
  { key: '合体初期', need: 482000 },
  { key: '合体中期', need: 666000 },
  { key: '合体后期', need: 916000 },
  { key: '大乘初期', need: 1250000 }
);

Object.assign(ITEM_DEFS, {
  spiritIron: { id: 'spiritIron', name: '灵铁', type: 'material', desc: '强化法器很常用的基础矿材。' },
  starSand: { id: 'starSand', name: '星砂', type: 'material', desc: '高阶地图常见炼器粉料。' },
  frostMarrow: { id: 'frostMarrow', name: '寒髓', type: 'material', desc: '霜系地图的核心素材。' },
  flameCore: { id: 'flameCore', name: '炎核', type: 'material', desc: '熔岩地图的热核材料。' },
  voidCrystal: { id: 'voidCrystal', name: '虚晶', type: 'material', desc: '偏后期的高纯材料，适合高品质装备。' },
  dragonBone: { id: 'dragonBone', name: '龙骨片', type: 'material', desc: '高阶妖兽掉落，用来升顶级装。' },
  skySilk: { id: 'skySilk', name: '天丝', type: 'material', desc: '法袍升级常用材料。' },
  lotusSeed: { id: 'lotusSeed', name: '灵莲子', type: 'material', desc: '高阶丹药和恢复型道具常用。' },
  shadowOre: { id: 'shadowOre', name: '影矿', type: 'material', desc: '阴影矿脉里挖出来的偏暗系材料。' },
  sunGold: { id: 'sunGold', name: '曜金', type: 'material', desc: '很贵，很闪，也真的很强。' },
  upgradeStone: { id: 'upgradeStone', name: '淬器石', type: 'material', desc: '第十四版装备升级核心道具。' }
});

Object.assign(EQUIPMENT_DEFS, {
  flameHalberd: { id: 'flameHalberd', slot: 'weapon', rank: '宝器', name: '赤炎战戟', stats: { atk: 52, power: 66, crit: 0.05 }, desc: '火图掉落，打架时脾气比人还大。' },
  frostMirror: { id: 'frostMirror', slot: 'talisman', rank: '宝器', name: '寒镜符', stats: { hp: 62, def: 10, break: 8, power: 38 }, desc: '更适合防守和突破。' },
  voidSpear: { id: 'voidSpear', slot: 'weapon', rank: '玄器', name: '破虚枪', stats: { atk: 74, power: 94, crit: 0.06 }, desc: '中后段爆发武器。' },
  starRobe: { id: 'starRobe', slot: 'robe', rank: '玄器', name: '星辉法袍', stats: { hp: 128, def: 16, cult: 0.08, power: 52 }, desc: '让修炼和生存都更体面。' },
  dragonRing: { id: 'dragonRing', slot: 'ring', rank: '地器', name: '龙纹环', stats: { atk: 24, crit: 0.08, break: 10, power: 72 }, desc: '真正开始有大后期味道的戒指。' },
  sunCrown: { id: 'sunCrown', slot: 'talisman', rank: '天器', name: '曜日冠', stats: { hp: 160, atk: 22, afk: 0.12, power: 88 }, desc: '适合后期一边挂机一边压怪。' },
  heavenArmor: { id: 'heavenArmor', slot: 'robe', rank: '圣器', name: '天阙甲', stats: { hp: 220, def: 28, power: 120 }, desc: '谁穿谁硬。' }
});

Object.assign(MONSTERS, {
  mistBoar: { id: 'mistBoar', name: '雾牙野猪', map: 'mist', hp: 760, atk: 88, def: 28, speed: 1.0, exp: 620, stone: 135, drops: ['spiritIron', 'dewLeaf'], dropChance: 0.78, gearChance: 0.2, gearPool: ['flameHalberd','frostMirror'] },
  jadeMoth: { id: 'jadeMoth', name: '青翅玉蛾', map: 'mist', hp: 680, atk: 94, def: 24, speed: 1.1, exp: 590, stone: 126, drops: ['starSand', 'lotusSeed'], dropChance: 0.74, gearChance: 0.18, gearPool: ['frostMirror'] },

  frostWolf: { id: 'frostWolf', name: '寒牙狼妖', map: 'frost', hp: 980, atk: 118, def: 36, speed: 1.02, exp: 840, stone: 168, drops: ['frostMarrow', 'spiritIron'], dropChance: 0.8, gearChance: 0.22, gearPool: ['starRobe','dragonRing'] },
  iceSnake: { id: 'iceSnake', name: '霜鳞蟒', map: 'frost', hp: 1160, atk: 132, def: 42, speed: 0.94, exp: 920, stone: 186, drops: ['frostMarrow', 'lotusSeed'], dropChance: 0.82, gearChance: 0.24, gearPool: ['starRobe'] },

  emberBat: { id: 'emberBat', name: '烬火蝠', map: 'flame', hp: 1380, atk: 156, def: 48, speed: 1.06, exp: 1120, stone: 220, drops: ['flameCore', 'upgradeStone'], dropChance: 0.82, gearChance: 0.24, gearPool: ['flameHalberd','dragonRing'] },
  magmaHound: { id: 'magmaHound', name: '熔犬', map: 'flame', hp: 1640, atk: 176, def: 56, speed: 1.0, exp: 1260, stone: 248, drops: ['flameCore', 'sunGold'], dropChance: 0.84, gearChance: 0.26, gearPool: ['flameHalberd'] },

  voidMantis: { id: 'voidMantis', name: '虚刃螳', map: 'void', hp: 1960, atk: 208, def: 64, speed: 1.08, exp: 1520, stone: 290, drops: ['voidCrystal', 'shadowOre'], dropChance: 0.84, gearChance: 0.26, gearPool: ['voidSpear','starRobe'] },
  riftTiger: { id: 'riftTiger', name: '裂界虎机', map: 'void', hp: 2280, atk: 234, def: 72, speed: 1.0, exp: 1720, stone: 320, drops: ['voidCrystal', 'dragonBone'], dropChance: 0.86, gearChance: 0.3, gearPool: ['voidSpear','dragonRing'] },

  cloudCrane: { id: 'cloudCrane', name: '流云鹤妖', map: 'sky', hp: 2580, atk: 256, def: 82, speed: 1.04, exp: 1980, stone: 360, drops: ['skySilk', 'lotusSeed'], dropChance: 0.86, gearChance: 0.28, gearPool: ['sunCrown','starRobe'] },
  skyLion: { id: 'skyLion', name: '裂空狮', map: 'sky', hp: 2960, atk: 282, def: 90, speed: 1.0, exp: 2240, stone: 398, drops: ['skySilk', 'sunGold'], dropChance: 0.88, gearChance: 0.32, gearPool: ['sunCrown','heavenArmor'] },

  duskCrow: { id: 'duskCrow', name: '暮影乌', map: 'shadow', hp: 3340, atk: 318, def: 100, speed: 1.08, exp: 2560, stone: 448, drops: ['shadowOre', 'voidCrystal'], dropChance: 0.88, gearChance: 0.3, gearPool: ['voidSpear','sunCrown'] },
  nightBeast: { id: 'nightBeast', name: '夜瘴兽', map: 'shadow', hp: 3780, atk: 346, def: 112, speed: 0.98, exp: 2860, stone: 486, drops: ['shadowOre', 'dragonBone'], dropChance: 0.9, gearChance: 0.34, gearPool: ['heavenArmor','dragonRing'] },

  sunHawk: { id: 'sunHawk', name: '曜羽鹰', map: 'sun', hp: 4220, atk: 382, def: 124, speed: 1.08, exp: 3280, stone: 540, drops: ['sunGold', 'skySilk'], dropChance: 0.9, gearChance: 0.32, gearPool: ['sunCrown','heavenArmor'] },
  goldenBull: { id: 'goldenBull', name: '鎏金蛮牛', map: 'sun', hp: 4700, atk: 418, def: 138, speed: 0.94, exp: 3640, stone: 590, drops: ['sunGold', 'dragonBone'], dropChance: 0.92, gearChance: 0.36, gearPool: ['heavenArmor'] },

  bloodLotus: { id: 'bloodLotus', name: '血莲妖', map: 'blood', hp: 5240, atk: 452, def: 150, speed: 1.02, exp: 4080, stone: 648, drops: ['lotusSeed', 'shadowOre'], dropChance: 0.92, gearChance: 0.34, gearPool: ['dragonRing','sunCrown'] },
  scarletWyrm: { id: 'scarletWyrm', name: '赤脊蛟', map: 'blood', hp: 5860, atk: 488, def: 164, speed: 0.98, exp: 4520, stone: 720, drops: ['dragonBone', 'flameCore'], dropChance: 0.94, gearChance: 0.38, gearPool: ['heavenArmor','flameHalberd'] },

  starDeer: { id: 'starDeer', name: '踏星鹿', map: 'star', hp: 6540, atk: 526, def: 178, speed: 1.04, exp: 5120, stone: 810, drops: ['starSand', 'voidCrystal'], dropChance: 0.94, gearChance: 0.36, gearPool: ['voidSpear','sunCrown'] },
  meteorGolem: { id: 'meteorGolem', name: '陨晶傀', map: 'star', hp: 7300, atk: 572, def: 194, speed: 0.9, exp: 5800, stone: 900, drops: ['starSand', 'sunGold', 'upgradeStone'], dropChance: 0.96, gearChance: 0.4, gearPool: ['heavenArmor','sunCrown'] },

  dragonSpirit: { id: 'dragonSpirit', name: '龙脉残灵', map: 'dragon', hp: 8120, atk: 628, def: 210, speed: 1.02, exp: 6640, stone: 1020, drops: ['dragonBone', 'sunGold'], dropChance: 0.96, gearChance: 0.4, gearPool: ['heavenArmor','dragonRing'] },
  ancientDragon: { id: 'ancientDragon', name: '古龙骸影', map: 'dragon', hp: 9040, atk: 688, def: 230, speed: 0.96, exp: 7520, stone: 1180, drops: ['dragonBone', 'voidCrystal', 'upgradeStone'], dropChance: 0.98, gearChance: 0.45, gearPool: ['heavenArmor','heavenBlade','sunCrown'] }
});

// some maps need a weapon id previously missing in pools? ensure heavenBlade exists
if (!EQUIPMENT_DEFS.heavenBlade) {
  EQUIPMENT_DEFS.heavenBlade = { id: 'heavenBlade', slot: 'weapon', rank: '圣器', name: '问天断刃', stats: { atk: 124, power: 160, crit: 0.1 }, desc: '真正的大后期武器，拿上它就不像善茬。' };
}

Object.assign(MAPS, {
  mist: { id: 'mist', name: '迷雾荒原', rec: 16, desc: '元婴初期后的过渡图，材料开始明显升级。', afkBase: { exp: 88, stone: 28 }, dropsNote: '主要掉落：灵铁、星砂、灵莲子。后段过渡图。', monsters: ['mistBoar','jadeMoth'], layout: [['S','M','.','T','H'],['.','#','.','.','.'],['M','.','B','#','.'],['H','.','M','.','T'],['.','.','.','M','.']] },
  frost: { id: 'frost', name: '寒渊谷', rec: 17, desc: '偏寒系地图，产寒髓和高品质防装。', afkBase: { exp: 104, stone: 34 }, dropsNote: '主要掉落：寒髓、灵铁、高阶法袍与戒指。', monsters: ['frostWolf','iceSnake'], layout: [['S','.','M','H','T'],['.','#','.','.','.'],['M','.','#','B','.'],['H','.','M','.','T'],['.','M','.','.','.']] },
  flame: { id: 'flame', name: '熔火岭', rec: 18, desc: '火系地图，怪脾气爆，掉落也爆。', afkBase: { exp: 126, stone: 42 }, dropsNote: '主要掉落：炎核、曜金、淬器石、宝器武器。', monsters: ['emberBat','magmaHound'], layout: [['S','M','.','T','H'],['.','#','.','.','.'],['M','.','B','#','M'],['H','.','M','.','T'],['.','.','.','M','.']] },
  void: { id: 'void', name: '破界裂原', rec: 19, desc: '空间裂隙到处都是，怪和掉落都比较诡异。', afkBase: { exp: 154, stone: 52 }, dropsNote: '主要掉落：虚晶、影矿、龙骨片、玄器武器。', monsters: ['voidMantis','riftTiger'], layout: [['S','.','M','T','H'],['.','#','.','.','.'],['M','.','#','B','M'],['H','.','M','.','T'],['.','.','.','M','.']] },
  sky: { id: 'sky', name: '天穹云阶', rec: 20, desc: '高空地图，掉落更偏修炼和挂机效率。', afkBase: { exp: 188, stone: 62 }, dropsNote: '主要掉落：天丝、曜金、天器法袍与护符。', monsters: ['cloudCrane','skyLion'], layout: [['S','M','.','T','H'],['.','#','.','.','.'],['M','.','B','#','.'],['H','.','M','.','T'],['.','.','.','M','.']] },
  shadow: { id: 'shadow', name: '沉影矿脉', rec: 21, desc: '怪偏阴狠，但装备成长会很舒服。', afkBase: { exp: 228, stone: 74 }, dropsNote: '主要掉落：影矿、虚晶、地器与天器级装备。', monsters: ['duskCrow','nightBeast'], layout: [['S','.','M','H','T'],['.','#','.','.','.'],['M','.','#','B','M'],['H','.','M','.','T'],['.','.','.','M','.']] },
  sun: { id: 'sun', name: '曜日原', rec: 22, desc: '偏阳刚的顶级练级图，资源很多，怪也很会抽你。', afkBase: { exp: 276, stone: 88 }, dropsNote: '主要掉落：曜金、天丝、圣器胚子。', monsters: ['sunHawk','goldenBull'], layout: [['S','M','.','T','H'],['.','#','.','.','.'],['M','.','B','#','.'],['H','.','M','.','T'],['.','.','.','M','.']] },
  blood: { id: 'blood', name: '血莲潭', rec: 23, desc: '高风险图，打赢了是真的香，打输了也是真的疼。', afkBase: { exp: 334, stone: 104 }, dropsNote: '主要掉落：灵莲子、龙骨片、炎核与高爆发装备。', monsters: ['bloodLotus','scarletWyrm'], layout: [['S','.','M','T','H'],['.','#','.','.','.'],['M','.','#','B','M'],['H','.','M','.','T'],['.','.','.','M','.']] },
  star: { id: 'star', name: '星陨台', rec: 24, desc: '真正的大后期图之一，经验和装备都开始像样得离谱。', afkBase: { exp: 402, stone: 122 }, dropsNote: '主要掉落：星砂、虚晶、淬器石、天器圣器装备。', monsters: ['starDeer','meteorGolem'], layout: [['S','M','.','T','H'],['.','#','.','.','.'],['M','.','B','#','M'],['H','.','M','.','T'],['.','.','.','M','.']] },
  dragon: { id: 'dragon', name: '龙骨禁地', rec: 25, desc: '版本最高阶地图。连空气都在提醒你该认真一点。', afkBase: { exp: 486, stone: 148 }, dropsNote: '主要掉落：龙骨片、曜金、虚晶、圣器武器与防具。', monsters: ['dragonSpirit','ancientDragon'], layout: [['S','.','M','T','H'],['.','#','.','.','.'],['M','.','#','B','M'],['H','.','M','.','T'],['.','.','.','M','.']] }
});

SHOP_ITEMS.push(
  { id: 'seaCrystal', price: 58, category: 'material' },
  { id: 'spiritIron', price: 72, category: 'upgrade' },
  { id: 'starSand', price: 84, category: 'upgrade' },
  { id: 'frostMarrow', price: 98, category: 'upgrade' },
  { id: 'flameCore', price: 108, category: 'upgrade' },
  { id: 'voidCrystal', price: 136, category: 'upgrade' },
  { id: 'dragonBone', price: 178, category: 'upgrade' },
  { id: 'skySilk', price: 128, category: 'upgrade' },
  { id: 'lotusSeed', price: 92, category: 'material' },
  { id: 'shadowOre', price: 112, category: 'upgrade' },
  { id: 'sunGold', price: 186, category: 'upgrade' },
  { id: 'upgradeStone', price: 96, category: 'upgrade' }
);
SHOP_ITEMS.forEach((item) => { if (!item.category) item.category = ['qiPill','healPill','insightPill','thunderCharm','petEgg','petSnack'].includes(item.id) ? 'special' : 'material'; });

const createNewGameV13 = createNewGame;
createNewGame = function(meta = {}) {
  const g = createNewGameV13(meta);
  g.version = 14;
  g.gearUpgrade = meta.gearUpgrade || {};
  ['spiritIron','starSand','frostMarrow','flameCore','voidCrystal','dragonBone','skySilk','lotusSeed','shadowOre','sunGold','upgradeStone'].forEach((id) => {
    if (!Number.isFinite(g.inventory[id])) g.inventory[id] = 0;
  });
  return g;
};

function ensureV14State() {
  ensureV13State();
  if (!game.gearUpgrade || typeof game.gearUpgrade !== 'object') game.gearUpgrade = {};
  ['spiritIron','starSand','frostMarrow','flameCore','voidCrystal','dragonBone','skySilk','lotusSeed','shadowOre','sunGold','upgradeStone'].forEach((id) => {
    if (!Number.isFinite(game.inventory[id])) game.inventory[id] = 0;
  });
  game.version = 14;
}
const normalizeGameV13 = normalizeGame;
normalizeGame = function() {
  normalizeGameV13();
  ensureV14State();
};

function getUpgradeLevel(id) {
  ensureV14State();
  return Number(game.gearUpgrade[id] || 0);
}
function qualityBonus(rank) {
  return QUALITY_MULTIPLIER[rank] || 0;
}
const getEquipStatV13 = getEquipStat;
getEquipStat = function(key) {
  return getEquippedDefs().reduce((sum, item) => {
    const base = item.stats[key] || 0;
    const mul = 1 + qualityBonus(item.rank) + getUpgradeLevel(item.id) * 0.12;
    return sum + (typeof base === 'number' ? base * mul : 0);
  }, 0);
};
const equipmentScoreV13 = equipmentScore;
equipmentScore = function(item) {
  const lv = getUpgradeLevel(item.id);
  return equipmentScoreV13(item) * (1 + qualityBonus(item.rank) + lv * 0.1);
};

function getUpgradeCost(id) {
  const item = EQUIPMENT_DEFS[id];
  const lv = getUpgradeLevel(id);
  let mat = 'upgradeStone';
  if (['凡器','法器'].includes(item.rank)) mat = 'spiritIron';
  else if (item.rank === '灵器') mat = 'starSand';
  else if (item.rank === '宝器') mat = 'frostMarrow';
  else if (item.rank === '玄器') mat = 'voidCrystal';
  else if (item.rank === '地器') mat = 'skySilk';
  else if (item.rank === '天器') mat = 'sunGold';
  else if (item.rank === '圣器') mat = 'dragonBone';
  return {
    stone: 60 + lv * 55 + Math.floor((QUALITY_MULTIPLIER[item.rank] || 0) * 220),
    mat,
    amount: 1 + Math.floor(lv / 3)
  };
}
function upgradeEquipment(id) {
  ensureV14State();
  if (!game.equipmentBag.includes(id) && !Object.values(game.equipped).includes(id)) {
    addLog('这件装备你都没拿到，空气升级法暂未实装。', 'warn');
    return;
  }
  const item = EQUIPMENT_DEFS[id];
  const lv = getUpgradeLevel(id);
  if (lv >= 12) {
    addLog(`【${item.name}】已经升到当前上限 +12 了，再抡就是和版本组对着干。`, 'warn');
    return;
  }
  const cost = getUpgradeCost(id);
  if (game.stone < cost.stone || getInventoryAmount(cost.mat) < cost.amount) {
    addLog(`升级【${item.name}】材料不足：需要 ${cost.stone} 灵石、${ITEM_DEFS[cost.mat].name}×${cost.amount}。`, 'warn');
    return;
  }
  game.stone -= cost.stone;
  spendItem(cost.mat, cost.amount);
  let chance = 0.86 - lv * 0.035 - qualityBonus(item.rank) * 0.15 + game.soulMarks * 0.003;
  chance = clamp(chance, 0.38, 0.94);
  if (Math.random() < chance) {
    game.gearUpgrade[id] = lv + 1;
    addLog(`你将【${item.name}】成功升到了 +${lv + 1}。现在它终于更像是你的老伙计了。`, 'rare');
  } else {
    if (Math.random() < 0.45 && game.gearUpgrade[id] > 0) game.gearUpgrade[id] = lv - 1;
    addLog(`【${item.name}】升级失败。器没碎，但气氛碎了一点。`, 'danger');
  }
  autoEquipBest(false);
  updateUI();
}

const bestMapForRealmV13 = bestMapForRealm;
bestMapForRealm = function() {
  const entries = Object.values(MAPS).sort((a, b) => a.rec - b.rec);
  let best = entries[0];
  entries.forEach((map) => { if (game.realmIndex >= map.rec) best = map; });
  return best;
};

const selectMapV13 = selectMap;
selectMap = function(id) {
  const map = MAPS[id];
  if (!map) return;
  if (game.realmIndex < map.rec) {
    addLog(`【${map.name}】尚未解锁，需要至少达到【${REALMS[map.rec]?.key || '更高境界'}】。`, 'warn');
    return;
  }
  selectMapV13(id);
};
const selectAfkMapV13 = selectAfkMap;
selectAfkMap = function(id) {
  const map = MAPS[id];
  if (!map) return;
  if (game.realmIndex < map.rec) {
    addLog(`挂机地图【${map.name}】尚未解锁，需要达到【${REALMS[map.rec]?.key || '更高境界'}】。`, 'warn');
    return;
  }
  selectAfkMapV13(id);
};
const toggleAfkV13 = toggleAfk;
toggleAfk = function(id = game.afkMapId || game.currentMapId) {
  const map = MAPS[id];
  if (!map) return;
  if (game.realmIndex < map.rec) {
    addLog(`你还不能在【${map.name}】挂机。先把境界往上抬。`, 'warn');
    return;
  }
  toggleAfkV13(id);
};

const gainExpV13 = gainExp;
gainExp = function(amount, source = '修炼') {
  // 后期获取经验打折，制造明显难度爬坡
  let final = amount;
  if (game.realmIndex >= 16) final *= 0.82;
  if (game.realmIndex >= 20) final *= 0.72;
  if (game.realmIndex >= 23) final *= 0.62;
  gainExpV13(Math.max(1, Math.floor(final)), source);
};

const renderOverviewV13 = renderOverview;
renderOverview = function() {
  renderOverviewV13();
  const goalPanel = document.getElementById('goalPanel');
  if (goalPanel) {
    goalPanel.insertAdjacentHTML('beforeend', `<div class="tip-item"><b>后期难度提醒</b><small>从元婴后段开始，经验增长会被压一层。后面更多靠高阶地图、装备升级和挂机图切换来抬效率。</small></div>`);
  }
};

const renderMapPanelsV13 = renderMapPanels;
renderMapPanels = function() {
  const mapList = document.getElementById('mapList');
  if (mapList) {
    mapList.innerHTML = Object.values(MAPS).sort((a,b)=>a.rec-b.rec).map((map) => {
      const selected = map.id === game.currentMapId;
      const unlocked = game.realmIndex >= map.rec;
      const required = REALMS[map.rec]?.key || `更高境界(${map.rec})`;
      return `
        <div class="info-card">
          <div class="card-top">
            <div>
              <h3>${map.name}</h3>
              <div class="rank">解锁境界：${required} · 当前状态：${unlocked ? '已解锁' : '未解锁'}</div>
            </div>
            <span class="tiny-tag ${selected ? 'rare' : (unlocked ? '' : 'danger')}">${selected ? '当前地图' : (unlocked ? '可切换' : '锁定中')}</span>
          </div>
          <p>${map.desc}</p>
          <div class="note-line"><span class="label">掉落注释：</span>${map.dropsNote}</div>
          <div class="meta-grid">
            <div class="meta-chip ${unlocked ? '' : 'locked'}">挂机修为：约 ${map.afkBase.exp}/秒</div>
            <div class="meta-chip ${unlocked ? '' : 'locked'}">挂机灵石：约 ${map.afkBase.stone}/秒</div>
            <div class="meta-chip">怪群：${map.monsters.map((id) => MONSTERS[id].name).join('、')}</div>
            <div class="meta-chip">地图亮点：${map.layout.flat().includes('B') ? '含精英点' : '常规探索'}</div>
          </div>
          ${!unlocked ? `<div class="locked-note">未解锁：需要达到【${required}】后才能进入，挂机也同理。</div>` : ''}
          <div class="card-actions">
            <button class="inline-btn" onclick="selectMap('${map.id}')">${selected ? '继续探索' : '设为当前地图'}</button>
            <button class="inline-btn" onclick="selectAfkMap('${map.id}')">设为挂机地图</button>
            <button class="inline-btn" onclick="toggleAfk('${map.id}')">${game.afkActive && game.afkMapId === map.id ? '停止挂机' : '在此挂机'}</button>
          </div>
        </div>`;
    }).join('');
  }
  const map = getMapData();
  const state = getMapState();
  document.getElementById('mapDetailPanel').innerHTML = `
    <div class="tip-item"><b>${map.name}</b><small>${map.desc}</small></div>
    <div class="tip-item">掉落注释：<small>${map.dropsNote}</small></div>
    <div class="tip-item">当前位置：<small>(${state.pos.x + 1}, ${state.pos.y + 1}) · ${tileToText(map.layout[state.pos.y][state.pos.x])}</small></div>
    <div class="tip-item">解锁要求：<small>${REALMS[map.rec]?.key || '高阶境界'}。第十四版开始，地图和挂机都按境界解锁，后面不能再乱跳图了。</small></div>
  `;
  renderMiniMap();
};

const renderAfkPanelV13 = renderAfkPanel;
renderAfkPanel = function() {
  document.getElementById('afkPanel').innerHTML = Object.values(MAPS).sort((a,b)=>a.rec-b.rec).map((map) => {
    const unlocked = game.realmIndex >= map.rec;
    const required = REALMS[map.rec]?.key || `更高境界(${map.rec})`;
    return `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h3>${map.name}</h3>
            <div class="rank">${game.afkMapId === map.id ? '当前挂机图' : '可挂机地图'}</div>
          </div>
          <span class="tiny-tag ${game.afkActive && game.afkMapId === map.id ? 'rare' : (unlocked ? '' : 'danger')}">${game.afkActive && game.afkMapId === map.id ? '挂机中' : (unlocked ? '待命' : '未解锁')}</span>
        </div>
        <p>${map.dropsNote}</p>
        <div class="meta-grid">
          <div class="meta-chip ${unlocked ? '' : 'locked'}">预计挂机修为：${map.afkBase.exp}/秒</div>
          <div class="meta-chip ${unlocked ? '' : 'locked'}">预计挂机灵石：${map.afkBase.stone}/秒</div>
        </div>
        ${!unlocked ? `<div class="locked-note">挂机未开放：需要达到【${required}】。</div>` : ''}
        <div class="card-actions">
          <button class="inline-btn" onclick="selectAfkMap('${map.id}')">设为挂机图</button>
          <button class="inline-btn" onclick="toggleAfk('${map.id}')">${game.afkActive && game.afkMapId === map.id ? '停止挂机' : '开始挂机'}</button>
        </div>
      </div>
    `;
  }).join('');
};

const renderEquipmentV13 = renderEquipment;
renderEquipment = function() {
  const equipped = game.equipped;
  document.getElementById('equippedPanel').innerHTML = `
    <h3>当前装备</h3>
    <div class="tip-stack">
      ${['weapon', 'robe', 'ring', 'talisman'].map((slot) => {
        const id = equipped[slot];
        const item = id ? EQUIPMENT_DEFS[id] : null;
        return `<div class="tip-item"><b>${slotLabel(slot)}</b><small>${item ? `${item.name} · ${item.rank} · +${getUpgradeLevel(id)}` : '未装备'}</small></div>`;
      }).join('')}
    </div>
  `;
  document.getElementById('equipmentList').innerHTML = game.equipmentBag.map((id) => {
    const item = EQUIPMENT_DEFS[id];
    const active = game.equipped[item.slot] === id;
    const lv = getUpgradeLevel(id);
    const cost = getUpgradeCost(id);
    const statsText = Object.entries(item.stats).map(([k, v]) => {
      const mul = 1 + qualityBonus(item.rank) + lv * 0.12;
      const final = typeof v === 'number' ? (v < 1 ? pct(v * mul) : Math.floor(v * mul)) : v;
      return `${statLabel(k)} +${final}`;
    }).join(' · ');
    return `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h4>${item.name}</h4>
            <div>
              <span class="quality-badge">${item.rank}</span>
              <span class="slot">${slotLabel(item.slot)}</span>
              <span class="upgrade-badge">+${lv}</span>
            </div>
          </div>
          <span class="tiny-tag ${active ? 'gold' : ''}">${active ? '已穿戴' : '背包中'}</span>
        </div>
        <p>${item.desc}</p>
        <div class="note-line">${statsText}</div>
        <div class="small-grid">
          <div class="meta-chip">升级需灵石：${cost.stone}</div>
          <div class="meta-chip">材料：${ITEM_DEFS[cost.mat].name}×${cost.amount}</div>
        </div>
        <div class="card-actions">
          ${!active ? `<button class="inline-btn" onclick="equipItem('${id}')">装备</button>` : ''}
          <button class="inline-btn" onclick="upgradeEquipment('${id}')">升级</button>
        </div>
      </div>`;
  }).join('');
};

const renderShopV13 = renderShop;
renderShop = function() {
  const panel = document.getElementById('shopPanel');
  if (!panel) return;
  const groups = {
    material: '基础材料',
    special: '丹药 / 特殊',
    upgrade: '升级素材'
  };
  const buyCards = Object.entries(groups).map(([category, title]) => {
    const items = SHOP_ITEMS.filter((item) => item.category === category);
    if (!items.length) return '';
    return `
      <div class="section-divider">${title}</div>
      ${items.map((item) => `
        <div class="info-card">
          <div class="card-top">
            <div>
              <h3>${ITEM_DEFS[item.id].name}</h3>
              <div class="rank">售价：${item.price} 灵石</div>
            </div>
          </div>
          <p>${ITEM_DEFS[item.id].desc}</p>
          <div class="card-actions">
            <button class="inline-btn" onclick="buyShopItem('${item.id}', ${item.price})">购买</button>
          </div>
        </div>`).join('')}
    `;
  }).join('');
  const sellable = Object.keys(ITEM_DEFS).filter((id) => getInventoryAmount(id) > 0 && ITEM_DEFS[id].type === 'material');
  const sellCards = sellable.map((id) => {
    const price = Math.max(4, Math.floor((SHOP_ITEMS.find((x) => x.id === id)?.price || 18) * 0.45));
    return `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h3>${ITEM_DEFS[id].name} ×${getInventoryAmount(id)}</h3>
            <div class="rank">回收价：${price} 灵石 / 个</div>
          </div>
        </div>
        <p>${ITEM_DEFS[id].desc}</p>
        <div class="card-actions">
          <button class="inline-btn" onclick="sellInventoryItem('${id}')">出售 1 个</button>
        </div>
      </div>`;
  }).join('');
  panel.innerHTML = `
    <div class="info-card rebirth-highlight">
      <h3>商店提示</h3>
      <p>第十四版开始，商店不只卖药草，还开始卖强化用材料。后段想提装备，钱包和矿包都得一起努力。</p>
      <div class="small-grid">
        <div class="meta-chip">当前灵石：${formatNum(game.stone)}</div>
        <div class="meta-chip">轮回印：${game.soulMarks}</div>
      </div>
    </div>
    ${buyCards}
    <div class="section-divider">出售材料</div>
    ${sellCards || `<div class="empty-text">你现在没什么可卖的，商人看你的眼神都带着点失望。</div>`}
  `;
};

const renderJournalV13 = renderJournal;
renderJournal = function() {
  renderJournalV13();
  const statsBox = document.getElementById('journalStats');
  if (statsBox) {
    statsBox.innerHTML += `
      <ul class="list-bullets">
        <li>已解锁地图数：${Object.values(MAPS).filter((map) => game.realmIndex >= map.rec).length}</li>
        <li>装备升级总层数：${Object.values(game.gearUpgrade || {}).reduce((a,b)=>a+b,0)}</li>
      </ul>
    `;
  }
};

const updateUIV13 = updateUI;
updateUI = function() {
  ensureV14State();
  updateUIV13();
  document.title = '凡尘问道录 · 第十四版';
};

function bootFromStorageV14() {
  const direct = localStorage.getItem(SAVE_KEY_V14);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    handleOfflineGain();
    addLog('你从第十四版存档中苏醒。后期地图、装备升级和新商店都已经就位。', 'rare');
    return true;
  }
  const prior = localStorage.getItem(SAVE_KEY_V13);
  if (prior) {
    game = JSON.parse(prior);
    normalizeGame();
    addLog('已从第十三版存档迁入第十四版。地图与挂机改为按境界解锁，后段路更长了。', 'rare');
    return true;
  }
  const prior2 = localStorage.getItem(SAVE_KEY);
  if (prior2) {
    game = JSON.parse(prior2);
    normalizeGame();
    addLog('已从更早版本存档迁入第十四版。', 'rare');
    return true;
  }
  for (const key of LEGACY_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) {
      const imported = importLegacySave(raw);
      if (imported) {
        game = imported;
        normalizeGame();
        addLog(`已从旧版本存档 ${key} 迁入第十四版。`, 'rare');
        return true;
      }
    }
  }
  return false;
}

function saveGame() {
  ensureV14State();
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V14, JSON.stringify(game));
  addLog('第十四版存档成功。你的高阶地图、装备升级和新商店库存都一起被记住了。', 'good');
}
function loadGame() {
  if (!bootFromStorageV14()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}
function resetGame() {
  localStorage.removeItem(SAVE_KEY_V14);
  game = createNewGame();
  normalizeGame();
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。第十四版上线，后段修仙终于开始真正拉长。`, 'rare');
  updateUI();
}
function initV14() {
  const hasSave = bootFromStorageV14();
  if (!hasSave) {
    game = createNewGame();
    normalizeGame();
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第十四版已开启：后期经验更难，地图扩成 14 张，境界继续拉长，装备也可以升级。', 'muted');
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.upgradeEquipment = upgradeEquipment;
window.onload = initV14;
window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V14, JSON.stringify(game));
  }
});


/* ===== 第十五版：装备词条 / 洗练 / 套装 / 宗门 ===== */
const SAVE_KEY_V15 = 'xiuxian_v15_save';

ITEM_DEFS.rerollStone = { id: 'rerollStone', name: '洗练石', type: 'material', desc: '用于重洗装备词条。赌狗最爱。' };
if (!SHOP_ITEMS.find((x) => x.id === 'rerollStone')) SHOP_ITEMS.push({ id: 'rerollStone', price: 128, category: 'upgrade' });

const AFFIX_POOLS = {
  weapon: [
    { key: 'atk', label: '锋芒', min: 4, max: 16 },
    { key: 'power', label: '破势', min: 6, max: 20 },
    { key: 'crit', label: '会心', min: 0.01, max: 0.05 },
    { key: 'break', label: '断关', min: 2, max: 8 }
  ],
  robe: [
    { key: 'hp', label: '厚甲', min: 18, max: 72 },
    { key: 'def', label: '护身', min: 3, max: 14 },
    { key: 'cult', label: '聚灵', min: 0.01, max: 0.06 },
    { key: 'afk', label: '养息', min: 0.01, max: 0.05 }
  ],
  ring: [
    { key: 'crit', label: '灵慧', min: 0.01, max: 0.05 },
    { key: 'break', label: '问心', min: 3, max: 10 },
    { key: 'atk', label: '攻伐', min: 3, max: 12 },
    { key: 'power', label: '凝势', min: 5, max: 18 }
  ],
  talisman: [
    { key: 'hp', label: '庇身', min: 14, max: 64 },
    { key: 'afk', label: '游息', min: 0.01, max: 0.06 },
    { key: 'cult', label: '清明', min: 0.01, max: 0.05 },
    { key: 'def', label: '镇压', min: 2, max: 10 }
  ]
};

const SET_DEFS_V15 = {
  '雷鸣套': {
    items: ['thunderBlade','thunderRobe','stormRing'],
    bonuses: {
      2: { atk: 18, crit: 0.04 },
      3: { power: 28, afk: 0.06 }
    }
  },
  '海眼套': {
    items: ['seaCrown','starRobe','voidSpear'],
    bonuses: {
      2: { hp: 88, afk: 0.08 },
      3: { def: 12, cult: 0.06 }
    }
  },
  '曜日套': {
    items: ['sunCrown','heavenArmor','flameHalberd'],
    bonuses: {
      2: { atk: 24, power: 34 },
      3: { break: 12, crit: 0.05 }
    }
  },
  '龙魂套': {
    items: ['dragonRing','heavenBlade','frostMirror'],
    bonuses: {
      2: { hp: 96, def: 14 },
      3: { power: 44, cult: 0.08 }
    }
  }
};

const ITEM_SET_TAG_V15 = {};
Object.entries(SET_DEFS_V15).forEach(([setName, def]) => def.items.forEach((id) => ITEM_SET_TAG_V15[id] = setName));

const SECTS_V15 = {
  none: {
    id: 'none',
    name: '散修',
    unlockRealm: 0,
    desc: '自由是自由，就是没人给你发工资。',
    bonus: { },
    task: { stone: 0, contribution: 0 }
  },
  qinglan: {
    id: 'qinglan',
    name: '青岚宗',
    unlockRealm: 9,
    desc: '偏修炼与探索，宗风温和，但长老催修为时也一点不温和。',
    bonus: { cult: 0.10, afk: 0.08, hp: 36 },
    task: { stone: 70, contribution: 16 }
  },
  chiyan: {
    id: 'chiyan',
    name: '赤炎门',
    unlockRealm: 10,
    desc: '偏战斗与爆发，门内气氛大概就是“先打了再说”。',
    bonus: { atk: 16, power: 24, crit: 0.03 },
    task: { stone: 86, contribution: 18 }
  },
  xuanshui: {
    id: 'xuanshui',
    name: '玄水阁',
    unlockRealm: 10,
    desc: '偏稳与恢复，适合怕翻车但又想打得久一点的人。',
    bonus: { def: 12, hp: 88, breakBonus: 8 },
    task: { stone: 78, contribution: 18 }
  },
  tianji: {
    id: 'tianji',
    name: '天机台',
    unlockRealm: 13,
    desc: '偏商店、突破与综合收益，玩得像个控盘修士。',
    bonus: { cult: 0.06, afk: 0.10, breakBonus: 12, power: 18 },
    task: { stone: 92, contribution: 20 }
  }
};

const SECT_EXCHANGE_V15 = {
  qinglan: [
    { type: 'item', id: 'spiritHerb', cost: 12 },
    { type: 'item', id: 'qiPill', cost: 18 },
    { type: 'item', id: 'petSnack', cost: 24 }
  ],
  chiyan: [
    { type: 'item', id: 'flameCore', cost: 26 },
    { type: 'item', id: 'thunderStone', cost: 18 },
    { type: 'gear', id: 'flameHalberd', cost: 72 }
  ],
  xuanshui: [
    { type: 'item', id: 'dewLeaf', cost: 12 },
    { type: 'item', id: 'healPill', cost: 20 },
    { type: 'gear', id: 'frostMirror', cost: 68 }
  ],
  tianji: [
    { type: 'item', id: 'insightPill', cost: 24 },
    { type: 'item', id: 'rerollStone', cost: 26 },
    { type: 'item', id: 'upgradeStone', cost: 22 }
  ]
};

function ensureV15State() {
  ensureV14State();
  if (!game.gearAffixes || typeof game.gearAffixes !== 'object') game.gearAffixes = {};
  if (!game.sectId) game.sectId = 'none';
  if (!Number.isFinite(game.sectContribution)) game.sectContribution = 0;
  if (!Number.isFinite(game.sectTaskCount)) game.sectTaskCount = 0;
  if (!game.journal) game.journal = {};
  if (!Array.isArray(game.journal.sets)) game.journal.sets = [];
  const gearIds = Array.from(new Set([...(game.equipmentBag || []), ...Object.values(game.equipped || {}).filter(Boolean)]));
  gearIds.forEach((id) => ensureGearAffixes(id));
  game.version = 15;
}

function getAffixRollCount(itemId) {
  const item = EQUIPMENT_DEFS[itemId];
  if (!item) return 0;
  if (['凡器'].includes(item.rank)) return 1;
  if (['法器','灵器'].includes(item.rank)) return 2;
  return 3;
}
function ensureGearAffixes(itemId) {
  if (!itemId || !EQUIPMENT_DEFS[itemId]) return;
  if (!game.gearAffixes[itemId] || !Array.isArray(game.gearAffixes[itemId]) || !game.gearAffixes[itemId].length) {
    game.gearAffixes[itemId] = rollAffixesForItem(itemId);
  }
}
function scaleAffixValue(template, rank) {
  const q = 1 + (QUALITY_MULTIPLIER[rank] || 0) * 1.5;
  const raw = template.min + Math.random() * (template.max - template.min);
  const v = raw * q;
  return template.key === 'crit' || template.key === 'cult' || template.key === 'afk'
    ? +v.toFixed(3)
    : Math.floor(v);
}
function rollAffixesForItem(itemId) {
  const item = EQUIPMENT_DEFS[itemId];
  if (!item) return [];
  const pool = [...AFFIX_POOLS[item.slot]];
  const count = getAffixRollCount(itemId);
  const out = [];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const template = pool.splice(idx, 1)[0];
    out.push({
      key: template.key,
      label: template.label,
      value: scaleAffixValue(template, item.rank)
    });
  }
  return out;
}
function getGearAffixes(itemId) {
  ensureV15State();
  ensureGearAffixes(itemId);
  return game.gearAffixes[itemId] || [];
}
function getAffixStat(itemId, key) {
  const lv = getUpgradeLevel(itemId);
  return getGearAffixes(itemId).reduce((sum, affix) => {
    if (affix.key !== key) return sum;
    const value = affix.value * (1 + lv * 0.05);
    return sum + value;
  }, 0);
}
function formatAffix(affix, itemId) {
  const scaled = affix.value * (1 + getUpgradeLevel(itemId) * 0.05);
  const value = ['crit','cult','afk'].includes(affix.key) ? `${Math.round(scaled * 100)}%` : Math.floor(scaled);
  return `${affix.label} +${value}`;
}
function getEquippedSetCounts() {
  const counts = {};
  Object.values(game.equipped || {}).filter(Boolean).forEach((id) => {
    const tag = ITEM_SET_TAG_V15[id];
    if (!tag) return;
    counts[tag] = (counts[tag] || 0) + 1;
  });
  return counts;
}
function getSetBonusStats() {
  const counts = getEquippedSetCounts();
  const total = {};
  Object.entries(counts).forEach(([setName, count]) => {
    const def = SET_DEFS_V15[setName];
    if (!def) return;
    Object.entries(def.bonuses).forEach(([need, stats]) => {
      if (count >= Number(need)) {
        Object.entries(stats).forEach(([k,v]) => {
          total[k] = (total[k] || 0) + v;
        });
      }
    });
    if (count >= 2 && !game.journal.sets.includes(setName)) game.journal.sets.push(setName);
  });
  return total;
}
function getCurrentSectV15() {
  ensureV15State();
  return SECTS_V15[game.sectId] || SECTS_V15.none;
}

const getEquipStatV14 = getEquipStat;
getEquipStat = function(key) {
  ensureV15State();
  let total = getEquipStatV14(key);
  Object.values(game.equipped || {}).filter(Boolean).forEach((id) => {
    total += getAffixStat(id, key) || 0;
  });
  const setStats = getSetBonusStats();
  total += setStats[key] || 0;
  return total;
};

const equipmentScoreV14 = equipmentScore;
equipmentScore = function(item) {
  const affixScore = getGearAffixes(item.id).reduce((sum, a) => {
    if (a.key === 'atk') return sum + a.value * 1.5;
    if (a.key === 'def') return sum + a.value * 1.2;
    if (a.key === 'hp') return sum + a.value * 0.14;
    if (a.key === 'power') return sum + a.value;
    if (a.key === 'crit') return sum + a.value * 280;
    if (a.key === 'cult') return sum + a.value * 160;
    if (a.key === 'afk') return sum + a.value * 140;
    if (a.key === 'break') return sum + a.value * 9;
    return sum;
  }, 0);
  const setTag = ITEM_SET_TAG_V15[item.id];
  const setScore = setTag ? 18 : 0;
  return equipmentScoreV14(item) + affixScore + setScore;
};

const calcPlayerStatsV14 = calcPlayerStats;
calcPlayerStats = function() {
  ensureV15State();
  const stats = calcPlayerStatsV14();
  const sect = getCurrentSectV15();
  const bonus = sect.bonus || {};
  stats.atk += bonus.atk || 0;
  stats.def += bonus.def || 0;
  stats.maxHp += bonus.hp || 0;
  stats.power += bonus.power || 0;
  stats.crit = clamp(stats.crit + (bonus.crit || 0), 0.02, 0.75);
  stats.cult += bonus.cult || 0;
  stats.afk += bonus.afk || 0;
  stats.breakBonus += bonus.breakBonus || 0;
  return stats;
};

const addEquipmentV14 = addEquipment;
addEquipment = function(id) {
  addEquipmentV14(id);
  ensureV15State();
  ensureGearAffixes(id);
};

function getWashCost(itemId) {
  const item = EQUIPMENT_DEFS[itemId];
  return {
    stone: 90 + getUpgradeLevel(itemId) * 45 + Math.floor((QUALITY_MULTIPLIER[item.rank] || 0) * 180),
    rerollStone: 1 + (['玄器','地器','天器','圣器'].includes(item.rank) ? 1 : 0)
  };
}
function rerollEquipmentAffixes(itemId) {
  ensureV15State();
  const item = EQUIPMENT_DEFS[itemId];
  if (!item) return;
  const cost = getWashCost(itemId);
  if (game.stone < cost.stone || getInventoryAmount('rerollStone') < cost.rerollStone) {
    addLog(`洗练【${item.name}】所需不足：灵石 ${cost.stone}，洗练石 ×${cost.rerollStone}。`, 'warn');
    return;
  }
  game.stone -= cost.stone;
  spendItem('rerollStone', cost.rerollStone);
  game.gearAffixes[itemId] = rollAffixesForItem(itemId);
  addLog(`你重洗了【${item.name}】的词条。赌命运这事，装备也没能躲过去。`, 'rare');
  updateUI();
}

function getActiveSetDescriptions() {
  const counts = getEquippedSetCounts();
  return Object.entries(counts).map(([name, count]) => {
    const def = SET_DEFS_V15[name];
    if (!def) return null;
    const active = [];
    Object.entries(def.bonuses).forEach(([need, stats]) => {
      if (count >= Number(need)) {
        const text = Object.entries(stats).map(([k,v]) => `${statLabel(k)} +${['crit','cult','afk'].includes(k) ? Math.round(v * 100) + '%' : v}`).join(' · ');
        active.push(`${need}件：${text}`);
      }
    });
    return {
      name,
      count,
      text: active
    };
  }).filter(Boolean);
}

function joinSectV15(id) {
  ensureV15State();
  const sect = SECTS_V15[id];
  if (!sect || id === 'none') return;
  if (game.realmIndex < sect.unlockRealm) {
    addLog(`加入【${sect.name}】至少需要达到【${REALMS[sect.unlockRealm].key}】。`, 'warn');
    return;
  }
  game.sectId = id;
  addLog(`你加入了【${sect.name}】。从今天起，终于有人管你了。`, 'good');
  updateUI();
}
function performSectTaskV15() {
  ensureV15State();
  const sect = getCurrentSectV15();
  if (sect.id === 'none') {
    addLog('你现在还是散修，没人给你发宗门任务。', 'warn');
    return;
  }
  const rewardStone = sect.task.stone + Math.floor(game.realmIndex * 3);
  const rewardContrib = sect.task.contribution + Math.floor(game.realmIndex * 0.5);
  game.stone += rewardStone;
  game.sectContribution += rewardContrib;
  game.sectTaskCount += 1;
  if (Math.random() < 0.45) {
    const bonusItem = sect.id === 'qinglan' ? 'spiritHerb'
      : sect.id === 'chiyan' ? 'flameCore'
      : sect.id === 'xuanshui' ? 'dewLeaf'
      : 'rerollStone';
    addItem(bonusItem, 1);
    addLog(`你完成了【${sect.name}】的宗门任务，灵石 +${rewardStone}，贡献 +${rewardContrib}，额外拿到 ${ITEM_DEFS[bonusItem].name} ×1。`, 'good');
  } else {
    addLog(`你完成了【${sect.name}】的宗门任务，灵石 +${rewardStone}，贡献 +${rewardContrib}。`, 'good');
  }
  updateUI();
}
function exchangeSectItemV15(type, id, cost) {
  ensureV15State();
  if (game.sectContribution < cost) {
    addLog(`宗门贡献不足，还差 ${cost - game.sectContribution}。`, 'warn');
    return;
  }
  game.sectContribution -= cost;
  if (type === 'item') {
    addItem(id, 1);
    addLog(`你用宗门贡献换到了【${ITEM_DEFS[id].name}】。`, 'rare');
  } else if (type === 'gear') {
    addEquipment(id);
    addLog(`你从宗门库房领到了【${EQUIPMENT_DEFS[id].name}】。`, 'rare');
  }
  updateUI();
}

function renderSectV15() {
  const panel = document.getElementById('sectPanel');
  if (!panel) return;
  ensureV15State();
  const current = getCurrentSectV15();
  const joinCards = Object.values(SECTS_V15).filter((s) => s.id !== 'none').map((sect) => `
    <div class="info-card sect-card">
      <div class="card-top">
        <div>
          <h3>${sect.name}</h3>
          <div class="rank">加入境界：${REALMS[sect.unlockRealm].key}</div>
        </div>
        <span class="tiny-tag ${game.sectId === sect.id ? 'gold' : ''}">${game.sectId === sect.id ? '当前宗门' : '可加入'}</span>
      </div>
      <p>${sect.desc}</p>
      <div class="sect-badges">
        ${Object.entries(sect.bonus).map(([k,v]) => `<span class="sect-pill">${statLabel(k)} +${['crit','cult','afk'].includes(k) ? Math.round(v * 100) + '%' : v}</span>`).join('') || '<span class="sect-pill">无固定加成</span>'}
      </div>
      <div class="card-actions">
        ${game.sectId !== sect.id ? `<button class="inline-btn" onclick="joinSectV15('${sect.id}')">加入</button>` : ''}
      </div>
    </div>
  `).join('');
  const exchange = current.id !== 'none'
    ? (SECT_EXCHANGE_V15[current.id] || []).map((row) => `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h4>${row.type === 'item' ? ITEM_DEFS[row.id].name : EQUIPMENT_DEFS[row.id].name}</h4>
            <div class="rank">所需贡献：${row.cost}</div>
          </div>
        </div>
        <p>${row.type === 'item' ? ITEM_DEFS[row.id].desc : EQUIPMENT_DEFS[row.id].desc}</p>
        <div class="card-actions">
          <button class="inline-btn" onclick="exchangeSectItemV15('${row.type}','${row.id}',${row.cost})">兑换</button>
        </div>
      </div>
    `).join('')
    : `<div class="empty-text">你还没加入宗门，宗门库房暂时不打算搭理你。</div>`;

  panel.innerHTML = `
    <div class="info-card sect-highlight">
      <div class="card-top">
        <div>
          <h3>当前身份：${current.name}</h3>
          <div class="rank">宗门贡献：${game.sectContribution} · 完成任务：${game.sectTaskCount}</div>
        </div>
      </div>
      <p>${current.desc}</p>
      <div class="contrib-grid">
        <span class="sect-pill">当前加成已直接计入角色面板</span>
        ${current.id !== 'none' ? `<span class="sect-pill">任务奖励：灵石 ${current.task.stone}+ / 贡献 ${current.task.contribution}+</span>` : '<span class="sect-pill">散修状态：没有固定宗门福利</span>'}
      </div>
      <div class="card-actions">
        ${current.id !== 'none' ? `<button class="inline-btn" onclick="performSectTaskV15()">执行宗门任务</button>` : ''}
      </div>
    </div>
    <div class="section-divider">可加入宗门</div>
    ${joinCards}
    <div class="section-divider">宗门兑换</div>
    ${exchange}
  `;
}

const renderOverviewV14 = renderOverview;
renderOverview = function() {
  renderOverviewV14();
  ensureV15State();
  const goalPanel = document.getElementById('goalPanel');
  if (goalPanel) {
    goalPanel.insertAdjacentHTML('beforeend', `<div class="tip-item"><b>宗门 / 套装提示</b><small>第十五版开始，装备会掉词条并可洗练，还能凑套装。加入宗门后，主面板会直接吃宗门加成。</small></div>`);
  }
  const mapHintPanel = document.getElementById('mapHintPanel');
  if (mapHintPanel) {
    mapHintPanel.insertAdjacentHTML('beforeend', `<div class="tip-item"><b>当前宗门</b><small>${getCurrentSectV15().name} · 贡献 ${game.sectContribution}</small></div>`);
  }
};

const renderEquipmentV14 = renderEquipment;
renderEquipment = function() {
  ensureV15State();
  const equipped = game.equipped;
  const activeSets = getActiveSetDescriptions();
  document.getElementById('equippedPanel').innerHTML = `
    <h3>当前装备</h3>
    <div class="tip-stack">
      ${['weapon', 'robe', 'ring', 'talisman'].map((slot) => {
        const id = equipped[slot];
        const item = id ? EQUIPMENT_DEFS[id] : null;
        const setTag = id ? ITEM_SET_TAG_V15[id] : null;
        return `<div class="tip-item"><b>${slotLabel(slot)}</b><small>${item ? `${item.name} · ${item.rank} · +${getUpgradeLevel(id)}${setTag ? ` · ${setTag}` : ''}` : '未装备'}</small></div>`;
      }).join('')}
      <div class="tip-item"><b>当前套装</b><small>${activeSets.length ? activeSets.map((s) => `${s.name}(${s.count})`).join('、') : '暂无激活'}</small></div>
    </div>
  `;
  document.getElementById('equipmentList').innerHTML = game.equipmentBag.map((id) => {
    const item = EQUIPMENT_DEFS[id];
    const active = game.equipped[item.slot] === id;
    const lv = getUpgradeLevel(id);
    const cost = getUpgradeCost(id);
    const washCost = getWashCost(id);
    const setTag = ITEM_SET_TAG_V15[id];
    const affixes = getGearAffixes(id);
    const statsText = Object.entries(item.stats).map(([k, v]) => {
      const mul = 1 + qualityBonus(item.rank) + lv * 0.12;
      const final = typeof v === 'number' ? (v < 1 ? pct(v * mul) : Math.floor(v * mul)) : v;
      return `${statLabel(k)} +${final}`;
    }).join(' · ');
    return `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h4>${item.name}</h4>
            <div>
              <span class="quality-badge">${item.rank}</span>
              <span class="slot">${slotLabel(item.slot)}</span>
              <span class="upgrade-badge">+${lv}</span>
              ${setTag ? `<span class="set-pill">${setTag}</span>` : ''}
            </div>
          </div>
          <span class="tiny-tag ${active ? 'gold' : ''}">${active ? '已穿戴' : '背包中'}</span>
        </div>
        <p>${item.desc}</p>
        <div class="note-line">${statsText}</div>
        <div class="affix-list">
          ${affixes.map((affix) => `<span class="affix-pill">${formatAffix(affix, id)}</span>`).join('')}
        </div>
        <div class="small-grid">
          <div class="meta-chip">升级需灵石：${cost.stone}</div>
          <div class="meta-chip">升级材料：${ITEM_DEFS[cost.mat].name}×${cost.amount}</div>
          <div class="meta-chip">洗练需灵石：${washCost.stone}</div>
          <div class="meta-chip">洗练石：×${washCost.rerollStone}</div>
        </div>
        <div class="card-actions">
          ${!active ? `<button class="inline-btn" onclick="equipItem('${id}')">装备</button>` : ''}
          <button class="inline-btn" onclick="upgradeEquipment('${id}')">升级</button>
          <button class="inline-btn" onclick="rerollEquipmentAffixes('${id}')">洗练</button>
        </div>
      </div>`;
  }).join('');
  const panel = document.getElementById('equippedPanel');
  if (panel && activeSets.length) {
    panel.insertAdjacentHTML('beforeend', `
      <div class="set-list">
        ${activeSets.map((s) => `<span class="set-pill">${s.name} ${s.count}件</span>`).join('')}
      </div>
      ${activeSets.map((s) => `<div class="tip-item"><b>${s.name}</b><small>${s.text.join(' ｜ ')}</small></div>`).join('')}
    `);
  }
};

const renderShopV14 = renderShop;
renderShop = function() {
  renderShopV14();
  const panel = document.getElementById('shopPanel');
  if (panel) {
    panel.insertAdjacentHTML('afterbegin', `<div class="info-card sect-highlight"><h3>第十五版提醒</h3><p>洗练石已经上架。装备词条赌一赌，战力能不能飞起来，就看今天脸色了。</p></div>`);
  }
};

const renderJournalV14 = renderJournal;
renderJournal = function() {
  renderJournalV14();
  const statsBox = document.getElementById('journalStats');
  if (statsBox) {
    statsBox.innerHTML += `
      <ul class="list-bullets">
        <li>宗门：${getCurrentSectV15().name}</li>
        <li>宗门贡献：${game.sectContribution}</li>
        <li>激活过的套装：${game.journal.sets.length ? game.journal.sets.join('、') : '暂无'}</li>
      </ul>`;
  }
};

const setViewV14 = setView;
setView = function(viewId) {
  setViewV14(viewId);
  if (viewId === 'sect') renderSectV15();
};

const updateUIV14 = updateUI;
updateUI = function() {
  ensureV15State();
  updateUIV14();
  renderSectV15();
  document.title = '凡尘问道录 · 第十五版';
};

function bootFromStorageV15() {
  const direct = localStorage.getItem(SAVE_KEY_V15);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    ensureV15State();
    handleOfflineGain();
    addLog('你从第十五版存档中苏醒。装备词条、洗练、套装和宗门都已经就位。', 'rare');
    return true;
  }
  const prior = localStorage.getItem(SAVE_KEY_V14);
  if (prior) {
    game = JSON.parse(prior);
    normalizeGame();
    ensureV15State();
    addLog('已从第十四版存档迁入第十五版。装备开始掉词条，宗门也终于把你收编了。', 'rare');
    return true;
  }
  if (typeof bootFromStorageV14 === 'function' && bootFromStorageV14()) {
    ensureV15State();
    return true;
  }
  return false;
}
function saveGame() {
  ensureV15State();
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V15, JSON.stringify(game));
  addLog('第十五版存档成功。装备词条、套装和宗门贡献都被一起记住了。', 'good');
}
function loadGame() {
  if (!bootFromStorageV15()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}
function resetGame() {
  localStorage.removeItem(SAVE_KEY_V15);
  game = createNewGame();
  normalizeGame();
  ensureV15State();
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。第十五版上线，修仙终于开始讲词条、套装和宗门关系了。`, 'rare');
  updateUI();
}
function initV15() {
  const hasSave = bootFromStorageV15();
  if (!hasSave) {
    game = createNewGame();
    normalizeGame();
    ensureV15State();
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第十五版已开启：装备会掉词条、能洗练、能凑套装，宗门系统也正式接进主循环。', 'muted');
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.rerollEquipmentAffixes = rerollEquipmentAffixes;
window.joinSectV15 = joinSectV15;
window.performSectTaskV15 = performSectTaskV15;
window.exchangeSectItemV15 = exchangeSectItemV15;
window.onload = initV15;
window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V15, JSON.stringify(game));
  }
});



/* ===== 第十六版：地图事件链 / Boss 房间 / 隐藏地图 ===== */
const SAVE_KEY_V16 = 'xiuxian_v16_save';

ITEM_DEFS.shadowMoss = { id: 'shadowMoss', name: '影苔', type: 'material', desc: '隐藏地图常见材料，看着不值钱，炼丹时倒挺会装。' };
ITEM_DEFS.moonShard = { id: 'moonShard', name: '月碎片', type: 'material', desc: '从秘境深处剥落的灵性残片。' };
ITEM_DEFS.secretKey = { id: 'secretKey', name: '秘门残钥', type: 'material', desc: '打开隐藏地图入口的关键凭证。' };

MONSTERS.bambooKing = { id: 'bambooKing', name: '古竹妖王', map: 'bamboo', hp: 220, atk: 34, def: 10, speed: 0.95, exp: 320, stone: 88, drops: ['spiritHerb','beastCore','secretKey'], dropChance: 0.9, gearChance: 0.3, gearPool: ['cloudRobe','ironRing'], isBossRoom: true, sourceMapId: 'bamboo', unlockHiddenMapId: 'grotto' };
MONSTERS.valleyLord = { id: 'valleyLord', name: '黑羽祭司', map: 'valley', hp: 360, atk: 48, def: 15, speed: 1.0, exp: 520, stone: 124, drops: ['dewLeaf','beastCore','secretKey'], dropChance: 0.92, gearChance: 0.35, gearPool: ['jadeCharm','ironSpear'], isBossRoom: true, sourceMapId: 'valley', unlockHiddenMapId: 'altar' };
MONSTERS.thunderLord = { id: 'thunderLord', name: '雷髓蜥王', map: 'thunder', hp: 540, atk: 72, def: 24, speed: 1.0, exp: 860, stone: 188, drops: ['thunderStone','secretKey','moonShard'], dropChance: 0.94, gearChance: 0.42, gearPool: ['thunderBlade','thunderRobe'], isBossRoom: true, sourceMapId: 'thunder', unlockHiddenMapId: 'rift' };
MONSTERS.seaQueen = { id: 'seaQueen', name: '沉月海妖', map: 'sea', hp: 720, atk: 92, def: 30, speed: 1.02, exp: 1260, stone: 262, drops: ['seaCrystal','moonShard','secretKey'], dropChance: 0.96, gearChance: 0.5, gearPool: ['seaCrown','stormRing'], isBossRoom: true, sourceMapId: 'sea', unlockHiddenMapId: 'moon' };

MONSTERS.mistFox = { id: 'mistFox', name: '雾隐灵狐', map: 'grotto', hp: 260, atk: 38, def: 11, speed: 1.06, exp: 360, stone: 96, drops: ['shadowMoss','spiritHerb'], dropChance: 0.72, gearChance: 0.18, gearPool: ['cloudRobe','jadeCharm'] };
MONSTERS.rootSpirit = { id: 'rootSpirit', name: '古根木灵', map: 'grotto', hp: 340, atk: 44, def: 16, speed: 0.94, exp: 430, stone: 112, drops: ['shadowMoss','moonShard'], dropChance: 0.76, gearChance: 0.22, gearPool: ['ironRing','stormRing'] };

MONSTERS.crowAdept = { id: 'crowAdept', name: '鸦祭行者', map: 'altar', hp: 390, atk: 50, def: 18, speed: 1.02, exp: 560, stone: 136, drops: ['dewLeaf','shadowMoss'], dropChance: 0.78, gearChance: 0.24, gearPool: ['jadeCharm','ironSpear'] };
MONSTERS.bloodCrow = { id: 'bloodCrow', name: '血羽噬鸦', map: 'altar', hp: 460, atk: 58, def: 20, speed: 1.08, exp: 650, stone: 150, drops: ['beastCore','moonShard'], dropChance: 0.8, gearChance: 0.26, gearPool: ['stormRing','thunderRobe'] };

MONSTERS.riftSpark = { id: 'riftSpark', name: '裂隙雷灵', map: 'rift', hp: 620, atk: 86, def: 28, speed: 1.05, exp: 980, stone: 220, drops: ['thunderStone','moonShard'], dropChance: 0.82, gearChance: 0.3, gearPool: ['thunderBlade','stormRing'] };
MONSTERS.skyWorm = { id: 'skyWorm', name: '空脊雷蚓', map: 'rift', hp: 700, atk: 94, def: 32, speed: 0.96, exp: 1120, stone: 248, drops: ['thunderStone','shadowMoss','secretKey'], dropChance: 0.86, gearChance: 0.34, gearPool: ['thunderRobe','seaCrown'] };

MONSTERS.moonEel = { id: 'moonEel', name: '沉月鳗灵', map: 'moon', hp: 820, atk: 104, def: 34, speed: 1.04, exp: 1420, stone: 290, drops: ['seaCrystal','moonShard'], dropChance: 0.88, gearChance: 0.36, gearPool: ['seaCrown','thunderBlade'] };
MONSTERS.abyssSailor = { id: 'abyssSailor', name: '海魇残魂', map: 'moon', hp: 940, atk: 116, def: 40, speed: 0.98, exp: 1680, stone: 330, drops: ['seaCrystal','shadowMoss','secretKey'], dropChance: 0.9, gearChance: 0.4, gearPool: ['seaCrown','stormRing'] };

MAPS.grotto = {
  id: 'grotto',
  name: '竹影洞天',
  rec: 6,
  hidden: true,
  desc: '古竹妖王守着的隐秘洞天。雾多、草灵多，也更容易撞见奇怪东西。',
  afkBase: { exp: 34, stone: 11 },
  dropsNote: '主要掉落：影苔、灵草、月碎片。属于青竹林的隐藏延伸图。',
  monsters: ['mistFox', 'rootSpirit'],
  layout: [
    ['S','.','M','T','H'],
    ['.','#','.','.','.'],
    ['M','.','B','#','.'],
    ['H','.','M','.','T'],
    ['.','.','.','M','.']
  ]
};
MAPS.altar = {
  id: 'altar',
  name: '鸦祭古台',
  rec: 10,
  hidden: true,
  desc: '黑风谷深处祭台显形后的区域。诡异、压抑，但掉落确实更值钱。',
  afkBase: { exp: 48, stone: 15 },
  dropsNote: '主要掉落：影苔、月碎片、法器/灵器级装备。黑风谷后续秘图。',
  monsters: ['crowAdept', 'bloodCrow'],
  layout: [
    ['S','M','.','T','H'],
    ['.','#','.','.','.'],
    ['M','.','B','#','.'],
    ['H','.','M','.','T'],
    ['.','.','.','M','.']
  ]
};
MAPS.rift = {
  id: 'rift',
  name: '裂雷密隙',
  rec: 14,
  hidden: true,
  desc: '雷髓蜥王死后才显露的裂隙空间，像是专门给雷系疯子练手用的。',
  afkBase: { exp: 72, stone: 23 },
  dropsNote: '主要掉落：残雷石、月碎片、秘门残钥。雷鸣窟隐藏强图。',
  monsters: ['riftSpark', 'skyWorm'],
  layout: [
    ['S','.','M','T','H'],
    ['.','#','.','.','.'],
    ['M','.','B','#','M'],
    ['H','.','M','.','T'],
    ['.','.','.','M','.']
  ]
};
MAPS.moon = {
  id: 'moon',
  name: '沉月暗潮',
  rec: 18,
  hidden: true,
  desc: '海妖死后潮汐反转形成的秘境。景色很美，怪也确实想要你的命。',
  afkBase: { exp: 98, stone: 32 },
  dropsNote: '主要掉落：海魄晶、月碎片、秘门残钥。星沉海眼的隐藏后段图。',
  monsters: ['moonEel', 'abyssSailor'],
  layout: [
    ['S','.','M','T','H'],
    ['.','#','.','.','.'],
    ['M','.','B','#','M'],
    ['H','.','M','.','T'],
    ['.','.','.','M','.']
  ]
};

const MAP_EVENT_CHAINS_V16 = {
  bamboo: [
    { need: 8, title: '古竹低语', desc: '你在竹林中听见断续的低语，像是有人在井底背诵旧口诀。', reward: 'stone', value: 60 },
    { need: 16, title: '枯井回音', desc: '井壁背后传来兽吼与灵气交错的震动，Boss 房间入口开始松动。', reward: 'bossRoom' }
  ],
  valley: [
    { need: 10, title: '黑羽残祭', desc: '黑风谷的鸦羽越堆越多，你开始怀疑这地方不只是怪多。', reward: 'item', item: 'dewLeaf', count: 2 },
    { need: 20, title: '祭台裂开', desc: '山壁后露出祭台暗门，Boss 房间已经可进入。', reward: 'bossRoom' }
  ],
  thunder: [
    { need: 12, title: '残雷矿脉', desc: '你踩到一片持续嗡鸣的裂石层，里面埋着更深的雷气。', reward: 'item', item: 'thunderStone', count: 2 },
    { need: 24, title: '雷髓深处', desc: '洞窟深处出现一扇被电光包裹的石门，Boss 房间已经可进入。', reward: 'bossRoom' }
  ],
  sea: [
    { need: 14, title: '潮声异变', desc: '潮汐开始逆拍，像是有东西在水下学你呼吸。', reward: 'item', item: 'seaCrystal', count: 1 },
    { need: 28, title: '沉月回廊', desc: '海眼边缘出现一条月色回廊，Boss 房间已经可进入。', reward: 'bossRoom' }
  ]
};

const MAP_BOSS_V16 = {
  bamboo: 'bambooKing',
  valley: 'valleyLord',
  thunder: 'thunderLord',
  sea: 'seaQueen'
};

function ensureV16State() {
  ensureV15State();
  if (!game.mapChain || typeof game.mapChain !== 'object') game.mapChain = {};
  if (!Array.isArray(game.hiddenMapsUnlocked)) game.hiddenMapsUnlocked = [];
  if (!game.bossRooms || typeof game.bossRooms !== 'object') game.bossRooms = {};
  if (!Number.isFinite(game.stats.bossRoomWins)) game.stats.bossRoomWins = 0;
  if (!Array.isArray(game.journal.hiddenMaps)) game.journal.hiddenMaps = [];
  Object.keys(MAP_EVENT_CHAINS_V16).forEach((mapId) => {
    if (!game.mapChain[mapId]) {
      game.mapChain[mapId] = { explores: 0, stage: 0, bossUnlocked: false };
    }
  });
  Object.keys(MAP_BOSS_V16).forEach((mapId) => {
    if (!game.bossRooms[mapId]) {
      game.bossRooms[mapId] = { unlocked: false, cleared: false, wins: 0 };
    }
  });
  game.version = 16;
}

function isHiddenMapUnlockedV16(mapId) {
  const map = MAPS[mapId];
  if (!map?.hidden) return true;
  return game.hiddenMapsUnlocked.includes(mapId);
}

function getChainStateV16(mapId) {
  ensureV16State();
  return game.mapChain[mapId];
}

function getNextChainStageV16(mapId) {
  const state = getChainStateV16(mapId);
  const chain = MAP_EVENT_CHAINS_V16[mapId] || [];
  return chain[state.stage] || null;
}

function unlockHiddenMapV16(mapId) {
  ensureV16State();
  if (!mapId || game.hiddenMapsUnlocked.includes(mapId)) return false;
  game.hiddenMapsUnlocked.push(mapId);
  if (!game.journal.hiddenMaps.includes(MAPS[mapId].name)) game.journal.hiddenMaps.push(MAPS[mapId].name);
  addLog(`你发现了隐藏地图【${MAPS[mapId].name}】！这下探索终于开始有“深处”了。`, 'rare');
  return true;
}

function applyChainRewardV16(mapId, stageData) {
  if (!stageData) return;
  if (stageData.reward === 'stone') {
    game.stone += stageData.value || 0;
    addLog(`地图事件【${stageData.title}】完成，灵石 +${stageData.value || 0}。`, 'good');
  } else if (stageData.reward === 'item') {
    addItem(stageData.item, stageData.count || 1);
    addLog(`地图事件【${stageData.title}】完成，获得 ${ITEM_DEFS[stageData.item].name} ×${stageData.count || 1}。`, 'good');
  } else if (stageData.reward === 'bossRoom') {
    game.mapChain[mapId].bossUnlocked = true;
    game.bossRooms[mapId].unlocked = true;
    addLog(`【${MAPS[mapId].name}】的 Boss 房间已开启。现在可以正儿八经去敲门了。`, 'gold');
  }
}

function maybeProgressMapChainV16(mapId) {
  const nextStage = getNextChainStageV16(mapId);
  const state = getChainStateV16(mapId);
  if (nextStage && state.explores >= nextStage.need) {
    return true;
  }
  return false;
}

function advanceMapEventChainV16(mapId) {
  ensureV16State();
  const state = getChainStateV16(mapId);
  const nextStage = getNextChainStageV16(mapId);
  if (!nextStage) {
    addLog(`【${MAPS[mapId].name}】当前版本的事件链已经推到底了。`, 'muted');
    return;
  }
  if (state.explores < nextStage.need) {
    addLog(`【${MAPS[mapId].name}】事件链推进还差 ${nextStage.need - state.explores} 次探索。`, 'warn');
    return;
  }
  applyChainRewardV16(mapId, nextStage);
  state.stage += 1;
  renderMapPanels();
  updateUI();
}

function enterBossRoomV16(mapId) {
  ensureV16State();
  const room = game.bossRooms[mapId];
  if (!room?.unlocked) {
    addLog('Boss 房间还没开，先把地图事件链往前推。', 'warn');
    return;
  }
  if (room.cleared) {
    addLog('这个 Boss 房间你已经打穿了，剩下的是回味和刷脸。', 'muted');
    return;
  }
  const bossId = MAP_BOSS_V16[mapId];
  const boss = JSON.parse(JSON.stringify(MONSTERS[bossId]));
  boss.isBossRoom = true;
  startBattle(boss);
  addCombatFeed(`你踏入【${MAPS[mapId].name}】的 Boss 房间。这里的空气都在劝你慎重点。`);
}

const movePlayerV15 = movePlayer;
movePlayer = function(dx, dy) {
  const beforeMap = game.currentMapId;
  const beforePos = JSON.stringify(getMapState(beforeMap).pos);
  movePlayerV15(dx, dy);
  ensureV16State();
  const afterPos = JSON.stringify(getMapState(beforeMap).pos);
  if (beforeMap === game.currentMapId && beforePos !== afterPos && !MAPS[beforeMap].hidden) {
    game.mapChain[beforeMap].explores += 1;
  }
};

const inspectTileV15 = inspectTile;
inspectTile = function(fromMove = false) {
  const mapId = game.currentMapId;
  inspectTileV15(fromMove);
  ensureV16State();
  if (fromMove && !MAPS[mapId].hidden) {
    const nextStage = getNextChainStageV16(mapId);
    if (nextStage && game.mapChain[mapId].explores >= nextStage.need) {
      addLog(`【${MAPS[mapId].name}】的地图事件【${nextStage.title}】已可推进。去探索页看一眼。`, 'rare');
    }
  }
  renderMapPanels();
};

const selectMapV15 = selectMap;
selectMap = function(id) {
  ensureV16State();
  if (!isHiddenMapUnlockedV16(id)) {
    addLog(`【${MAPS[id].name}】仍然隐藏着。先把对应主地图的 Boss 房间打穿。`, 'warn');
    return;
  }
  selectMapV15(id);
};

const selectAfkMapV15 = selectAfkMap;
selectAfkMap = function(id) {
  ensureV16State();
  if (!isHiddenMapUnlockedV16(id)) {
    addLog('隐藏地图还没解锁，先别想着把人丢进去挂机。', 'warn');
    return;
  }
  selectAfkMapV15(id);
};

const toggleAfkV15 = toggleAfk;
toggleAfk = function(id = game.afkMapId || game.currentMapId) {
  ensureV16State();
  if (id && !isHiddenMapUnlockedV16(id)) {
    addLog('隐藏地图尚未解锁，不能在里面挂机。', 'warn');
    return;
  }
  toggleAfkV15(id);
};

const handleBattleWinV15 = handleBattleWin;
handleBattleWin = function() {
  const enemyCopy = battleState.enemy ? JSON.parse(JSON.stringify(battleState.enemy)) : null;
  handleBattleWinV15();
  ensureV16State();
  if (enemyCopy?.isBossRoom && enemyCopy.sourceMapId) {
    const mapId = enemyCopy.sourceMapId;
    game.bossRooms[mapId].cleared = true;
    game.bossRooms[mapId].wins += 1;
    game.stats.bossRoomWins += 1;
    addItem('secretKey', 1);
    addLog(`你打穿了【${MAPS[mapId].name}】的 Boss 房间，额外获得【秘门残钥】×1。`, 'gold');
    if (enemyCopy.unlockHiddenMapId) unlockHiddenMapV16(enemyCopy.unlockHiddenMapId);
  }
};

const renderMapPanelsV15 = renderMapPanels;
renderMapPanels = function() {
  ensureV16State();
  renderMapPanelsV15();

  const mapList = document.getElementById('mapList');
  if (mapList) {
    const baseMaps = Object.keys(MAP_EVENT_CHAINS_V16);
    const existingCards = Array.from(mapList.children);
    existingCards.forEach((card) => {
      const h3 = card.querySelector('h3');
      if (!h3) return;
      const mapId = Object.keys(MAPS).find((id) => MAPS[id].name === h3.textContent.trim());
      if (!mapId || !baseMaps.includes(mapId)) return;
      const state = game.mapChain[mapId];
      const nextStage = getNextChainStageV16(mapId);
      const room = game.bossRooms[mapId];
      const extra = document.createElement('div');
      extra.className = 'note-line';
      extra.innerHTML = `<span class="label">事件链：</span>已探索 ${state.explores} 次 · 已推进 ${state.stage}/${MAP_EVENT_CHAINS_V16[mapId].length} 阶 · Boss 房间 ${room.cleared ? '已通关' : room.unlocked ? '已开启' : '未开启'}${nextStage ? ` · 下一步：${nextStage.title}` : ' · 当前已完成'}`;
      card.appendChild(extra);
      if (room.unlocked && !room.cleared) {
        const btnRow = document.createElement('div');
        btnRow.className = 'card-actions';
        btnRow.innerHTML = `<button class="inline-btn" onclick="enterBossRoomV16('${mapId}')">进入 Boss 房间</button>`;
        card.appendChild(btnRow);
      }
    });
  }

  const hiddenPanel = document.getElementById('hiddenMapPanel');
  if (hiddenPanel) {
    const hiddenMaps = Object.values(MAPS).filter((m) => m.hidden);
    hiddenPanel.innerHTML = hiddenMaps.map((map) => {
      const unlocked = isHiddenMapUnlockedV16(map.id);
      return `
        <div class="info-card hidden-map-card">
          <div class="card-top">
            <div>
              <h3>${map.name}</h3>
              <div class="rank">${unlocked ? `推荐：${REALMS[map.rec]?.key || '高阶'}` : '未解锁隐藏地图'}</div>
            </div>
            <span class="secret-pill">${unlocked ? '已发现' : '隐藏中'}</span>
          </div>
          <p>${unlocked ? map.desc : '现在只看得到一点模糊轮廓。得先打穿对应主地图的 Boss 房间。'}</p>
          <div class="note-line"><span class="label">掉落注释：</span>${unlocked ? map.dropsNote : '？？？'}</div>
          <div class="card-actions">
            ${unlocked ? `<button class="inline-btn" onclick="selectMap('${map.id}')">进入此图</button><button class="inline-btn" onclick="selectAfkMap('${map.id}')">设为挂机图</button>` : ''}
          </div>
        </div>`;
    }).join('');
  }

  const currentMap = getMapData();
  const chainPanel = document.getElementById('eventChainPanel');
  if (chainPanel) {
    if (MAP_EVENT_CHAINS_V16[currentMap.id]) {
      const state = game.mapChain[currentMap.id];
      const chain = MAP_EVENT_CHAINS_V16[currentMap.id];
      chainPanel.innerHTML = chain.map((stage, idx) => {
        const done = state.stage > idx;
        const ready = state.stage === idx && state.explores >= stage.need;
        const locked = state.stage === idx && state.explores < stage.need;
        return `
          <div class="chain-step ${done ? 'done' : ready ? 'ready' : 'locked'}">
            <div class="card-top">
              <div>
                <h4>${idx + 1}. ${stage.title}</h4>
                <div class="rank">需求探索：${stage.need} 次</div>
              </div>
              <span class="tiny-tag ${done ? 'gold' : ready ? 'rare' : ''}">${done ? '已完成' : ready ? '可推进' : `当前 ${state.explores}/${stage.need}`}</span>
            </div>
            <p>${stage.desc}</p>
            ${ready ? `<div class="card-actions"><button class="inline-btn" onclick="advanceMapEventChainV16('${currentMap.id}')">推进事件</button></div>` : ''}
          </div>`;
      }).join('');
    } else {
      chainPanel.innerHTML = `<div class="tip-item">当前地图没有额外事件链，或者它本身就是隐藏地图。先刷主图再说。</div>`;
    }
  }

  const bossPanel = document.getElementById('bossRoomPanel');
  if (bossPanel) {
    if (MAP_EVENT_CHAINS_V16[currentMap.id]) {
      const room = game.bossRooms[currentMap.id];
      const bossId = MAP_BOSS_V16[currentMap.id];
      const boss = MONSTERS[bossId];
      bossPanel.innerHTML = `
        <div class="info-card boss-room-card">
          <div class="card-top">
            <div>
              <h3>${boss.name}</h3>
              <div class="rank">Boss 房间状态：${room.cleared ? '已通关' : room.unlocked ? '已开启' : '未开启'}</div>
            </div>
          </div>
          <p>${boss.name} 藏在【${currentMap.name}】事件链深处。打赢以后会开隐藏地图。</p>
          <div class="boss-room-note">掉落倾向：额外灵石、专属材料、秘门残钥，以及一张通往隐藏地图的邀请函。</div>
          <div class="card-actions">
            ${room.unlocked && !room.cleared ? `<button class="inline-btn" onclick="enterBossRoomV16('${currentMap.id}')">进入 Boss 房间</button>` : ''}
          </div>
        </div>
      `;
    } else {
      bossPanel.innerHTML = `<div class="tip-item">隐藏地图不再继续套 Boss 房间，先把资源榨干再说。</div>`;
    }
  }
};

const renderMiniMapV15 = renderMiniMap;
renderMiniMap = function() {
  renderMiniMapV15();
  const map = getMapData();
  const room = game.bossRooms?.[map.id];
  if (room?.unlocked && !room.cleared) {
    const miniName = document.getElementById('miniMapName');
    if (miniName) miniName.textContent = `${map.name} · Boss 房间已开`;
  } else if (MAPS[map.id]?.hidden) {
    const miniName = document.getElementById('miniMapName');
    if (miniName) miniName.textContent = `${map.name} · 隐藏地图`;
  }
};

const tileToTextV15 = tileToText;
tileToText = function(tile) {
  if (tile === 'B') return '精英 / Boss 房间入口点';
  return tileToTextV15(tile);
};

const renderJournalV15 = renderJournal;
renderJournal = function() {
  renderJournalV15();
  const statsBox = document.getElementById('journalStats');
  if (statsBox) {
    statsBox.innerHTML += `
      <ul class="list-bullets">
        <li>Boss 房间通关：${game.stats.bossRoomWins || 0}</li>
        <li>隐藏地图发现：${(game.journal.hiddenMaps || []).length ? game.journal.hiddenMaps.join('、') : '暂无'}</li>
      </ul>`;
  }
};

const updateUIV15 = updateUI;
updateUI = function() {
  ensureV16State();
  updateUIV15();
  document.title = '凡尘问道录 · 第十六版';
  const brandP = document.querySelector('.brand p');
  if (brandP) brandP.textContent = '第十六版 · 地图事件链、Boss 房间、隐藏地图';
};

function bootFromStorageV16() {
  const direct = localStorage.getItem(SAVE_KEY_V16);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    ensureV16State();
    handleOfflineGain();
    addLog('你从第十六版存档中苏醒。地图事件、Boss 房间和隐藏地图都还在。', 'rare');
    return true;
  }
  const prior = localStorage.getItem(SAVE_KEY_V15);
  if (prior) {
    game = JSON.parse(prior);
    normalizeGame();
    ensureV16State();
    addLog('已从第十五版存档迁入第十六版。探索现在终于会越走越深了。', 'rare');
    return true;
  }
  if (typeof bootFromStorageV15 === 'function' && bootFromStorageV15()) {
    ensureV16State();
    return true;
  }
  return false;
}
function saveGame() {
  ensureV16State();
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V16, JSON.stringify(game));
  addLog('第十六版存档成功。地图事件、Boss 房间进度和隐藏地图解锁都一起记下了。', 'good');
}
function loadGame() {
  if (!bootFromStorageV16()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}
function resetGame() {
  localStorage.removeItem(SAVE_KEY_V16);
  game = createNewGame();
  normalizeGame();
  ensureV16State();
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。第十六版上线，地图终于开始藏东西了。`, 'rare');
  updateUI();
}
function initV16() {
  const hasSave = bootFromStorageV16();
  if (!hasSave) {
    game = createNewGame();
    normalizeGame();
    ensureV16State();
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第十六版已开启：地图事件链会推进，Boss 房间会解锁，隐藏地图也终于有了。', 'muted');
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.advanceMapEventChainV16 = advanceMapEventChainV16;
window.enterBossRoomV16 = enterBossRoomV16;
window.onload = initV16;
window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V16, JSON.stringify(game));
  }
});



/* ===== 第十七版：轮回天赋树 / 永久成长 / 开局流派 ===== */
const SAVE_KEY_V17 = 'xiuxian_v17_save';

const REBIRTH_TALENTS_V17 = {
  marrow: { id: 'marrow', name: '玄骨', max: 10, desc: '永久提高生命与防御。', cost: 1 },
  blade: { id: 'blade', name: '战意', max: 10, desc: '永久提高攻击，打怪会明显更顺。', cost: 1 },
  sea: { id: 'sea', name: '灵海', max: 10, desc: '永久提高修炼效率。', cost: 1 },
  stride: { id: 'stride', name: '神行', max: 10, desc: '永久提高挂机效率。', cost: 1 },
  insight: { id: 'insight', name: '悟性', max: 10, desc: '永久提高突破成功率。', cost: 1 },
  beast: { id: 'beast', name: '灵契', max: 10, desc: '永久提高灵宠亲密成长与基础加成。', cost: 1 }
};

const OPENING_STYLES_V17 = {
  balanced: {
    id: 'balanced',
    name: '平衡开局',
    desc: '稳扎稳打，适合第一次开新世的常规路线。',
    rewards: '灵石 +40，回春丹 ×1'
  },
  sword: {
    id: 'sword',
    name: '剑修开局',
    desc: '武器更强，前期刷怪会很顺，属于上来就想狠狠干人的类型。',
    rewards: '流光短剑、烈火炼气法、灵石 +20'
  },
  alchemy: {
    id: 'alchemy',
    name: '丹修开局',
    desc: '材料和丹药更充足，适合走炼丹和稳修路线。',
    rewards: '灵草 +5，赤霞果 +4，聚气丹 ×2，青木长生诀'
  },
  beast: {
    id: 'beast',
    name: '御兽开局',
    desc: '更适合尽快接灵宠线，下一世开局就能朝“不是一个人挨打”努力。',
    rewards: '灵宠蛋 ×1，灵兽零嘴 ×3，御风游身诀'
  },
  merchant: {
    id: 'merchant',
    name: '商道开局',
    desc: '钱和杂项资源更充足，适合商店和买卖流。',
    rewards: '灵石 +160，露华叶 +2，凝神丹 ×1'
  }
};

const createNewGameV16 = createNewGame;
createNewGame = function(meta = {}) {
  const g = createNewGameV16(meta);
  if (!g.rebirthTalents) g.rebirthTalents = {};
  Object.keys(REBIRTH_TALENTS_V17).forEach((id) => {
    if (!Number.isFinite(g.rebirthTalents[id])) g.rebirthTalents[id] = 0;
  });
  if (!g.openingStyle) g.openingStyle = meta.openingStyle || 'balanced';
  if (!g.journal) g.journal = {};
  if (!Array.isArray(g.journal.styles)) g.journal.styles = [];
  if (!Array.isArray(g.journal.talents)) g.journal.talents = [];
  if (typeof g.openingStyleApplied !== 'boolean') g.openingStyleApplied = false;
  g.version = 17;
  return g;
};

function ensureV17State() {
  game = game || {};
  if (!game.rebirthTalents) game.rebirthTalents = {};
  Object.keys(REBIRTH_TALENTS_V17).forEach((id) => {
    if (!Number.isFinite(game.rebirthTalents[id])) game.rebirthTalents[id] = 0;
  });
  if (!game.openingStyle) game.openingStyle = 'balanced';
  if (!game.journal) game.journal = {};
  if (!Array.isArray(game.journal.styles)) game.journal.styles = [];
  if (!Array.isArray(game.journal.talents)) game.journal.talents = [];
  if (typeof game.openingStyleApplied !== 'boolean') game.openingStyleApplied = false;
  if (!Number.isFinite(game.soulMarks)) game.soulMarks = 0;
  if (!Number.isFinite(game.rebirthCount)) game.rebirthCount = 1;
  game.version = 17;
}

function getTalentLevelV17(id) {
  ensureV17State();
  return Math.max(0, Math.floor(game.rebirthTalents[id] || 0));
}
function getSpentSoulMarksV17() {
  ensureV17State();
  return Object.keys(REBIRTH_TALENTS_V17).reduce((sum, id) => sum + getTalentLevelV17(id) * REBIRTH_TALENTS_V17[id].cost, 0);
}
function getAvailableSoulMarksV17() {
  ensureV17State();
  return Math.max(0, game.soulMarks - getSpentSoulMarksV17());
}
function getPermanentBonusV17() {
  ensureV17State();
  return {
    hp: getTalentLevelV17('marrow') * 22 + Math.floor(game.rebirthCount * 4),
    def: getTalentLevelV17('marrow'),
    atk: getTalentLevelV17('blade') * 4,
    cult: getTalentLevelV17('sea') * 0.05,
    afk: getTalentLevelV17('stride') * 0.05,
    breakBonus: getTalentLevelV17('insight') * 4,
    petBond: getTalentLevelV17('beast') * 2
  };
}
function maybeRecordTalentUnlockV17(id) {
  const talent = REBIRTH_TALENTS_V17[id];
  if (talent && !game.journal.talents.includes(talent.name)) game.journal.talents.push(talent.name);
}
function buyRebirthTalentV17(id) {
  ensureV17State();
  const talent = REBIRTH_TALENTS_V17[id];
  if (!talent) return;
  const current = getTalentLevelV17(id);
  if (current >= talent.max) {
    addLog(`【${talent.name}】已经点到当前上限。再点就不礼貌了。`, 'muted');
    return;
  }
  if (getAvailableSoulMarksV17() < talent.cost) {
    addLog(`轮回印不足，无法继续点【${talent.name}】。`, 'warn');
    return;
  }
  game.rebirthTalents[id] = current + 1;
  maybeRecordTalentUnlockV17(id);
  addLog(`你为【${talent.name}】点了 1 级。永久成长正在悄悄回本。`, 'good');
  updateUI();
}
function resetRebirthTalentsV17() {
  ensureV17State();
  Object.keys(REBIRTH_TALENTS_V17).forEach((id) => game.rebirthTalents[id] = 0);
  addLog('你重置了轮回天赋树。轮回印已经全额退回，只是心也跟着空了一下。', 'rare');
  updateUI();
}
function selectOpeningStyleV17(id) {
  ensureV17State();
  if (!OPENING_STYLES_V17[id]) return;
  game.openingStyle = id;
  if (!game.journal.styles.includes(OPENING_STYLES_V17[id].name)) game.journal.styles.push(OPENING_STYLES_V17[id].name);
  addLog(`你将下一世的开局流派设为【${OPENING_STYLES_V17[id].name}】。`, 'good');
  updateUI();
}
function applyOpeningStyleOnceV17(targetGame) {
  const g = targetGame || game;
  if (!g || g.openingStyleApplied) return;
  const style = OPENING_STYLES_V17[g.openingStyle] || OPENING_STYLES_V17.balanced;
  g.openingStyleApplied = true;
  if (!g.journal) g.journal = {};
  if (!Array.isArray(g.journal.styles)) g.journal.styles = [];
  if (!g.journal.styles.includes(style.name)) g.journal.styles.push(style.name);
  const bonus = getPermanentBonusV17();

  g.stone += 20 + Math.floor(bonus.atk * 1.5);
  if (style.id === 'balanced') {
    g.stone += 40;
    g.inventory.healPill = (g.inventory.healPill || 0) + 1;
  } else if (style.id === 'sword') {
    g.stone += 20;
    if (!g.equipmentBag.includes('bronzeSword')) g.equipmentBag.push('bronzeSword');
    if (!g.learnedTechniques.includes('liehuo')) g.learnedTechniques.push('liehuo');
    g.activeTechnique = 'liehuo';
  } else if (style.id === 'alchemy') {
    g.inventory.spiritHerb = (g.inventory.spiritHerb || 0) + 5;
    g.inventory.redFruit = (g.inventory.redFruit || 0) + 4;
    g.inventory.qiPill = (g.inventory.qiPill || 0) + 2;
    if (!g.learnedTechniques.includes('qingmu')) g.learnedTechniques.push('qingmu');
    g.activeTechnique = 'qingmu';
  } else if (style.id === 'beast') {
    g.inventory.petEgg = (g.inventory.petEgg || 0) + 1;
    g.inventory.petSnack = (g.inventory.petSnack || 0) + 3;
    if (!g.learnedTechniques.includes('yufeng')) g.learnedTechniques.push('yufeng');
    g.activeTechnique = 'yufeng';
  } else if (style.id === 'merchant') {
    g.stone += 160;
    g.inventory.dewLeaf = (g.inventory.dewLeaf || 0) + 2;
    g.inventory.insightPill = (g.inventory.insightPill || 0) + 1;
  }
}

const calcPlayerStatsV16 = calcPlayerStats;
calcPlayerStats = function() {
  ensureV17State();
  const stats = calcPlayerStatsV16();
  const p = getPermanentBonusV17();
  stats.atk += p.atk;
  stats.def += p.def;
  stats.maxHp += p.hp;
  stats.cult += p.cult;
  stats.afk += p.afk;
  stats.breakBonus += p.breakBonus;
  stats.power = Math.floor(stats.atk * 1.8 + stats.def * 1.2 + stats.maxHp * 0.18 + game.realmIndex * 6 + getEquipStat('power') + game.soulMarks * 1.4 + getSpentSoulMarksV17() * 3);
  return stats;
};

const getPetBondV16 = getPetBond;
getPetBond = function(id) {
  return getPetBondV16(id) + getPermanentBonusV17().petBond;
};

const renderOverviewV16 = renderOverview;
renderOverview = function() {
  renderOverviewV16();
  const goalPanel = document.getElementById('goalPanel');
  if (goalPanel) {
    const p = getPermanentBonusV17();
    const style = OPENING_STYLES_V17[game.openingStyle] || OPENING_STYLES_V17.balanced;
    goalPanel.insertAdjacentHTML('afterbegin', `
      <div class="tip-item"><b>永久成长</b><small>轮回印可用：${getAvailableSoulMarksV17()} ｜ 永久攻击 +${p.atk} ｜ 永久生命 +${p.hp} ｜ 修炼倍率 +${p.cult.toFixed(2)} ｜ 挂机倍率 +${p.afk.toFixed(2)} ｜ 当前开局流派：${style.name}</small></div>
    `);
  }
};

function renderOriginPanelV17() {
  const panel = document.getElementById('originPanel');
  if (!panel) return;
  ensureV17State();
  const styleCards = Object.values(OPENING_STYLES_V17).map((style) => `
    <div class="info-card talent-card">
      <div class="card-top">
        <div>
          <h3>${style.name}</h3>
          <div class="rank">${game.openingStyle === style.id ? '当前选择' : '可作为下一世开局'}</div>
        </div>
        <span class="tiny-tag ${game.openingStyle === style.id ? 'gold' : ''}">${game.openingStyle === style.id ? '已选中' : '待命'}</span>
      </div>
      <p>${style.desc}</p>
      <div class="origin-pills">
        <span class="origin-pill">${style.rewards}</span>
      </div>
      <div class="card-actions">
        ${game.openingStyle !== style.id ? `<button class="inline-btn" onclick="selectOpeningStyleV17('${style.id}')">设为下一世流派</button>` : `<button class="inline-btn" onclick="setView('rebirth')">去轮回页</button>`}
      </div>
    </div>
  `).join('');

  panel.innerHTML = `
    <div class="info-card highlight-box">
      <h3>开局流派说明</h3>
      <p>流派会在<strong>下一次重开 / 轮回</strong>时生效，不会直接改掉你这一世已经长出来的东西。</p>
      <p class="note-line">当前已选：<span class="label">${(OPENING_STYLES_V17[game.openingStyle] || OPENING_STYLES_V17.balanced).name}</span></p>
    </div>
    <div class="origin-grid">${styleCards}</div>
  `;
}

const renderRebirthV16 = renderRebirth;
renderRebirth = function() {
  renderRebirthV16();
  const panel = document.getElementById('rebirthPanel');
  if (!panel) return;
  ensureV17State();
  const p = getPermanentBonusV17();
  const talentCards = Object.values(REBIRTH_TALENTS_V17).map((talent) => {
    const level = getTalentLevelV17(talent.id);
    return `
      <div class="info-card talent-card">
        <div class="card-top">
          <div>
            <h3>${talent.name}</h3>
            <div class="rank">等级 ${level}/${talent.max}</div>
          </div>
          <span class="tiny-tag">${talent.cost} 印 / 级</span>
        </div>
        <p>${talent.desc}</p>
        <div class="talent-pills">
          <span class="talent-pill">可用轮回印：${getAvailableSoulMarksV17()}</span>
          <span class="talent-pill">当前已投入：${level}</span>
        </div>
        <div class="card-actions">
          <button class="inline-btn" onclick="buyRebirthTalentV17('${talent.id}')">升级天赋</button>
        </div>
      </div>
    `;
  }).join('');
  panel.insertAdjacentHTML('beforeend', `
    <div class="info-card highlight-box">
      <h3>轮回天赋树</h3>
      <p>轮回印不再只是数字，现在可以直接点进永久成长里。终于不是单纯看着它好看了。</p>
      <div class="small-grid">
        <div class="meta-chip">总轮回印：${game.soulMarks}</div>
        <div class="meta-chip">可分配：${getAvailableSoulMarksV17()}</div>
        <div class="meta-chip">轮回次数：${game.rebirthCount}</div>
        <div class="meta-chip">当前流派：${(OPENING_STYLES_V17[game.openingStyle] || OPENING_STYLES_V17.balanced).name}</div>
      </div>
      <div class="card-actions">
        <button class="inline-btn" onclick="resetRebirthTalentsV17()">重置天赋树</button>
        <button class="inline-btn" onclick="setView('origin')">去选开局流派</button>
      </div>
    </div>
    <div class="permanent-grid">
      <div class="info-card"><h3>永久成长总览</h3>
        <div class="small-grid">
          <div class="meta-chip">攻击 +${p.atk}</div>
          <div class="meta-chip">生命 +${p.hp}</div>
          <div class="meta-chip">防御 +${p.def}</div>
          <div class="meta-chip">修炼倍率 +${p.cult.toFixed(2)}</div>
          <div class="meta-chip">挂机倍率 +${p.afk.toFixed(2)}</div>
          <div class="meta-chip">突破成功率 +${p.breakBonus}%</div>
        </div>
      </div>
      <div class="info-card"><h3>下一世开局</h3>
        <p>${(OPENING_STYLES_V17[game.openingStyle] || OPENING_STYLES_V17.balanced).desc}</p>
        <div class="origin-pills"><span class="origin-pill">${(OPENING_STYLES_V17[game.openingStyle] || OPENING_STYLES_V17.balanced).rewards}</span></div>
      </div>
    </div>
    <div class="talent-grid">${talentCards}</div>
  `);
};

const setViewV16 = setView;
setView = function(viewId) {
  setViewV16(viewId);
  if (viewId === 'origin') renderOriginPanelV17();
  if (viewId === 'rebirth') renderRebirth();
};

const renderJournalV16 = renderJournal;
renderJournal = function() {
  renderJournalV16();
  const statsBox = document.getElementById('journalStats');
  if (statsBox) {
    statsBox.innerHTML += `
      <ul class="list-bullets">
        <li>已选流派：${game.journal.styles && game.journal.styles.length ? game.journal.styles.join('、') : '暂无'}</li>
        <li>已点天赋：${game.journal.talents && game.journal.talents.length ? game.journal.talents.join('、') : '暂无'}</li>
      </ul>
    `;
  }
};

function reincarnateV17() {
  ensureV17State();
  const gain = calculateRebirthGain() + Math.floor((game.stats.bossRoomWins || 0) * 0.6) + Math.floor(((game.journal.hiddenMaps || []).length || 0) * 0.8);
  const keepPet = game.activePet || game.petsOwned[0] || null;
  const keepInventory = {};
  ['qiPill','healPill','insightPill','petSnack','petEgg'].forEach((id) => {
    if (getInventoryAmount(id) > 0) keepInventory[id] = Math.min(getInventoryAmount(id), 2);
  });
  const next = createNewGame({
    stone: 120 + Math.floor(game.stone * 0.12),
    inventory: keepInventory,
    soulMarks: game.soulMarks + gain,
    rebirthCount: game.rebirthCount + 1,
    petsOwned: keepPet ? [keepPet] : [],
    activePet: keepPet || null,
    petBond: keepPet ? { [keepPet]: Math.max(1, Math.floor(getPetBond(keepPet) / 2)) } : {},
    rebirthTalents: { ...game.rebirthTalents },
    openingStyle: game.openingStyle
  });
  game = next;
  normalizeGame();
  ensureV17State();
  applyOpeningStyleOnceV17(game);
  addLog(`你选择轮回重生，获得轮回印 +${gain}。天赋树、永久成长和开局流派都会继续陪着你。`, 'rare');
  updateUI();
}

function bootFromStorageV17() {
  const direct = localStorage.getItem(SAVE_KEY_V17);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    ensureV17State();
    handleOfflineGain();
    addLog('你从第十七版存档中苏醒。轮回天赋树、永久成长和开局流派都还在。', 'rare');
    return true;
  }
  if (typeof bootFromStorageV16 === 'function' && bootFromStorageV16()) {
    ensureV17State();
    addLog('已从第十六版存档迁入第十七版。轮回印现在终于可以真正花出去了。', 'rare');
    return true;
  }
  return false;
}

const updateUIV16 = updateUI;
updateUI = function() {
  ensureV17State();
  updateUIV16();
  renderOriginPanelV17();
  document.title = '凡尘问道录 · 第十七版';
  const brandP = document.querySelector('.brand p');
  if (brandP) brandP.textContent = '第十七版 · 轮回天赋树、永久成长、开局流派';
};

function saveGame() {
  ensureV17State();
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V17, JSON.stringify(game));
  addLog('第十七版存档成功。轮回天赋树、永久成长和开局流派都一起锁进了这一世。', 'good');
}
function loadGame() {
  if (!bootFromStorageV17()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}
function resetGame() {
  localStorage.removeItem(SAVE_KEY_V17);
  const selectedStyle = (game && game.openingStyle) ? game.openingStyle : 'balanced';
  game = createNewGame({ openingStyle: selectedStyle });
  normalizeGame();
  ensureV17State();
  applyOpeningStyleOnceV17(game);
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。并以【${OPENING_STYLES_V17[selectedStyle].name}】开局。`, 'rare');
  updateUI();
}
function initV17() {
  const hasSave = bootFromStorageV17();
  if (!hasSave) {
    game = createNewGame({ openingStyle: 'balanced' });
    normalizeGame();
    ensureV17State();
    applyOpeningStyleOnceV17(game);
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第十七版已开启：轮回印终于能点天赋树，永久成长也真正成形了。', 'muted');
  } else {
    ensureV17State();
    if (!game.openingStyleApplied) applyOpeningStyleOnceV17(game);
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.buyRebirthTalentV17 = buyRebirthTalentV17;
window.resetRebirthTalentsV17 = resetRebirthTalentsV17;
window.selectOpeningStyleV17 = selectOpeningStyleV17;
window.reincarnateV13 = reincarnateV17;
window.onload = initV17;
window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V17, JSON.stringify(game));
  }
});



/* ===== 第十八版附加系统：灵宠技能 / 资质 / 进阶 ===== */
const SAVE_KEY_V18 = 'xiuxian_v18_save';

ITEM_DEFS.petCrystal = { id: 'petCrystal', name: '灵契晶', type: 'material', desc: '灵宠进阶时会用到的稳定材料，脸再黑也得靠它。' };
if (!SHOP_ITEMS.find((x) => x.id === 'petCrystal')) SHOP_ITEMS.push({ id: 'petCrystal', price: 138 });

const PET_APTITUDE_DEFS = {
  common: { id: 'common', name: '凡品', mult: 0.92, className: 'tier-common', desc: '能养，但上限一般。' },
  good: { id: 'good', name: '良品', mult: 1.00, className: 'tier-good', desc: '正常灵宠水平。' },
  rare: { id: 'rare', name: '上品', mult: 1.12, className: 'tier-rare', desc: '已经算是挺顺眼的资质。' },
  epic: { id: 'epic', name: '卓品', mult: 1.28, className: 'tier-epic', desc: '越养越像主角。' },
  legend: { id: 'legend', name: '天品', mult: 1.46, className: 'tier-legend', desc: '这已经不是宠物，是同事。' }
};

const PET_SKILL_DEFS = {
  fox: {
    id: 'fox',
    name: '狐影寻财',
    cd: 3,
    desc: '造成灵巧伤害，并提高本场战斗的掉落收益。',
    use() {
      const stats = calcPlayerStats();
      const mult = getPetCombatMultiplier('fox');
      const dmg = Math.max(1, Math.floor(10 + stats.power * 0.18 * mult));
      battleState.enemyHp = Math.max(0, battleState.enemyHp - dmg);
      battleState.petLootBonus = (battleState.petLootBonus || 0) + 0.14 + getPetEvolution('fox') * 0.04;
      return `【狐影寻财】发动，${PET_DEFS.fox.name} 造成 ${dmg} 点伤害，并提高了本场搜刮效率。`;
    }
  },
  wolf: {
    id: 'wolf',
    name: '裂喉扑杀',
    cd: 3,
    desc: '高额单体撕咬，并削弱敌方部分防御。',
    use() {
      const stats = calcPlayerStats();
      const mult = getPetCombatMultiplier('wolf');
      const dmg = Math.max(1, Math.floor(14 + stats.atk * 0.36 * mult));
      battleState.enemyHp = Math.max(0, battleState.enemyHp - dmg);
      if (battleState.enemy) battleState.enemy.def = Math.max(0, battleState.enemy.def - (2 + getPetEvolution('wolf')));
      return `【裂喉扑杀】发动，${PET_DEFS.wolf.name} 撕出 ${dmg} 点伤害，还顺手咬掉了对手一点防御。`;
    }
  },
  hawk: {
    id: 'hawk',
    name: '雷羽穿云',
    cd: 4,
    desc: '快速贯穿打击，伤害较高，并让你下一轮技能冷却更舒服。',
    use() {
      const stats = calcPlayerStats();
      const mult = getPetCombatMultiplier('hawk');
      const dmg = Math.max(1, Math.floor(12 + stats.atk * 0.31 * mult));
      battleState.enemyHp = Math.max(0, battleState.enemyHp - dmg);
      if (battleState.skillCd.thunder > 0) battleState.skillCd.thunder -= 1;
      if (battleState.skillCd.slash > 0) battleState.skillCd.slash -= 1;
      return `【雷羽穿云】发动，${PET_DEFS.hawk.name} 造成 ${dmg} 点伤害，并缩短了你的技能冷却。`;
    }
  },
  turtle: {
    id: 'turtle',
    name: '玄甲守护',
    cd: 4,
    desc: '恢复生命并套上护盾，主打一个稳。',
    use() {
      const stats = calcPlayerStats();
      const mult = getPetCombatMultiplier('turtle');
      const shield = Math.floor((18 + stats.def * 1.6) * mult);
      const heal = Math.floor((12 + stats.maxHp * 0.08) * (1 + getPetEvolution('turtle') * 0.18));
      battleState.shield = (battleState.shield || 0) + shield;
      battleState.playerHp = Math.min(stats.maxHp, battleState.playerHp + heal);
      return `【玄甲守护】发动，${PET_DEFS.turtle.name} 为你恢复 ${heal} 点生命并增加 ${shield} 点护盾。`;
    }
  }
};

const createNewGameV17 = createNewGame;
createNewGame = function(meta = {}) {
  const g = createNewGameV17(meta);
  g.version = 18;
  g.petAptitude = { ...(meta.petAptitude || {}) };
  g.petEvolution = { ...(meta.petEvolution || {}) };
  g.petSkillUse = { ...(meta.petSkillUse || {}) };
  g.inventory.petCrystal = Number(meta.inventory?.petCrystal || g.inventory.petCrystal || 0);
  return g;
};

function rollPetAptitude() {
  const r = Math.random();
  if (r < 0.28) return 'common';
  if (r < 0.58) return 'good';
  if (r < 0.82) return 'rare';
  if (r < 0.95) return 'epic';
  return 'legend';
}
function ensurePetMeta(id) {
  if (!id) return;
  if (!game.petAptitude[id]) game.petAptitude[id] = rollPetAptitude();
  if (!Number.isFinite(game.petEvolution[id])) game.petEvolution[id] = 0;
  if (!Number.isFinite(game.petSkillUse[id])) game.petSkillUse[id] = 0;
}
function ensureV18State() {
  ensureV17State();
  if (!game.petAptitude || typeof game.petAptitude !== 'object') game.petAptitude = {};
  if (!game.petEvolution || typeof game.petEvolution !== 'object') game.petEvolution = {};
  if (!game.petSkillUse || typeof game.petSkillUse !== 'object') game.petSkillUse = {};
  if (!Number.isFinite(game.inventory.petCrystal)) game.inventory.petCrystal = 0;
  (game.petsOwned || []).forEach((id) => ensurePetMeta(id));
  game.version = 18;
}
const normalizeGameV17 = normalizeGame;
normalizeGame = function() {
  normalizeGameV17();
  ensureV18State();
};

function getPetAptitudeKey(id = game.activePet) {
  ensureV18State();
  if (!id) return 'good';
  ensurePetMeta(id);
  return game.petAptitude[id] || 'good';
}
function getPetAptitudeMeta(id = game.activePet) {
  return PET_APTITUDE_DEFS[getPetAptitudeKey(id)] || PET_APTITUDE_DEFS.good;
}
function getPetEvolution(id = game.activePet) {
  ensureV18State();
  if (!id) return 0;
  ensurePetMeta(id);
  return Number(game.petEvolution[id] || 0);
}
function getPetSkillUses(id = game.activePet) {
  ensureV18State();
  if (!id) return 0;
  ensurePetMeta(id);
  return Number(game.petSkillUse[id] || 0);
}
function getPetCombatMultiplier(id = game.activePet) {
  const apt = getPetAptitudeMeta(id).mult;
  const evo = getPetEvolution(id);
  return apt * (1 + evo * 0.22);
}
function petStageName(stage) {
  return ['幼生体', '成长期', '成熟体', '灵变体'][stage] || '未知形态';
}
function getPetSkillDef(id = game.activePet) {
  if (!id) return null;
  return PET_SKILL_DEFS[id] || null;
}
function getPetEvolutionCost(id) {
  const stage = getPetEvolution(id);
  if (stage >= 3) return null;
  const cost = [
    { petCrystal: 1, petSnack: 2, beastCore: 1 },
    { petCrystal: 2, petSnack: 3, beastCore: 3, thunderStone: 1 },
    { petCrystal: 4, petSnack: 4, seaCrystal: 2, thunderStone: 2 }
  ][stage];
  return cost || null;
}

const acquireRandomPetV17 = acquireRandomPet;
acquireRandomPet = function(fromEgg = false, forcedId = null) {
  const before = new Set(game.petsOwned || []);
  acquireRandomPetV17(fromEgg, forcedId);
  const gained = (game.petsOwned || []).find((id) => !before.has(id)) || null;
  if (gained) {
    ensurePetMeta(gained);
    addLog(`【${PET_DEFS[gained].name}】天生资质：${getPetAptitudeMeta(gained).name}。`, 'rare');
  }
};

const calcPlayerStatsV17 = calcPlayerStats;
calcPlayerStats = function() {
  const stats = calcPlayerStatsV17();
  ensureV18State();
  const pet = getActivePet();
  if (!pet) return stats;
  const bond = getPetBond();
  const mult = getPetCombatMultiplier();
  const evo = getPetEvolution();
  const extraAtkBase = pet.atk + bond * 2;
  const extraDefBase = pet.def + Math.floor(bond * 1.2);
  const extraHpBase = pet.hp + bond * 6;
  stats.atk += Math.floor(extraAtkBase * (mult - 1)) + evo * 3;
  stats.def += Math.floor(extraDefBase * (mult - 1)) + evo * 2;
  stats.maxHp += Math.floor(extraHpBase * (mult - 1)) + evo * 18;
  stats.crit = clamp(stats.crit + pet.crit * (mult - 1) + evo * 0.01, 0.02, 0.68);
  stats.afk += pet.afk * (mult - 1) + evo * 0.03;
  stats.cult += pet.cult * (mult - 1) + evo * 0.02;
  stats.power += Math.floor((pet.power + bond * 9) * (mult - 1)) + evo * 26;
  return stats;
};

const resetSkillCooldownsV17 = resetSkillCooldowns;
resetSkillCooldowns = function() {
  resetSkillCooldownsV17();
  battleState.petSkillCd = 0;
  battleState.petLootBonus = 0;
};
const tickSkillCdV17 = tickSkillCd;
tickSkillCd = function() {
  tickSkillCdV17();
  if (!Number.isFinite(battleState.petSkillCd)) battleState.petSkillCd = 0;
  if (battleState.petSkillCd > 0) battleState.petSkillCd -= 1;
};

const startBattleV17 = startBattle;
startBattle = function(monsterDef) {
  startBattleV17(monsterDef);
  ensureV18State();
  battleState.petLootBonus = 0;
  battleState.petSkillCd = 0;
  const pet = getActivePet();
  if (!battleState.active || !pet) return;
  if (pet.id === 'hawk') {
    const opening = Math.max(1, Math.floor((8 + calcPlayerStats().atk * 0.2) * getPetCombatMultiplier('hawk')));
    battleState.enemyHp = Math.max(0, battleState.enemyHp - opening);
    addCombatFeed(`【雷纹隼】先手俯冲，开场就打了 ${opening} 点伤害。`);
    if (battleState.enemyHp <= 0) {
      handleBattleWin();
      return;
    }
  }
  if (pet.id === 'turtle') {
    const shield = Math.floor((16 + calcPlayerStats().def * 1.2) * getPetCombatMultiplier('turtle'));
    battleState.shield = (battleState.shield || 0) + shield;
    addCombatFeed(`【玄甲龟】开场撑起护甲，为你提供 ${shield} 点护盾。`);
  }
  renderCombatPanel();
};

function castPetSkill(fromAuto = false) {
  ensureV18State();
  if (!battleState.active || !battleState.enemy) {
    if (!fromAuto) addLog('当前没有战斗，灵宠也不知道该对着谁发力。', 'warn');
    return;
  }
  const pet = getActivePet();
  if (!pet) {
    if (!fromAuto) addLog('你现在没有跟随灵宠，按钮点得很认真，灵宠栏却空着。', 'warn');
    return;
  }
  const skill = getPetSkillDef(pet.id);
  if (!skill) return;
  if (battleState.petSkillCd > 0) {
    if (!fromAuto) addLog(`【${skill.name}】还在冷却：${battleState.petSkillCd} 回合。`, 'warn');
    return;
  }
  const msg = skill.use();
  battleState.petSkillCd = Math.max(1, skill.cd - Math.floor(getPetEvolution(pet.id) / 2));
  game.petSkillUse[pet.id] = getPetSkillUses(pet.id) + 1;
  addCombatFeed(msg);
  animateHit('monsterHpBar');
  if (battleState.enemyHp <= 0) {
    handleBattleWin();
    return;
  }
  enemyActionIfAlive();
}

const autoBattleActionV17 = autoBattleAction;
autoBattleAction = function() {
  const pet = getActivePet();
  if (battleState.active && pet && battleState.petSkillCd === 0) {
    if (pet.id === 'turtle' && battleState.playerHp < calcPlayerStats().maxHp * 0.68) {
      castPetSkill(true);
      return;
    }
    if (pet.id !== 'turtle') {
      castPetSkill(true);
      return;
    }
  }
  autoBattleActionV17();
};

const handleBattleWinV17 = handleBattleWin;
handleBattleWin = function() {
  const enemy = battleState.enemy ? { ...battleState.enemy } : null;
  const lootBonus = battleState.petLootBonus || 0;
  handleBattleWinV17();
  ensureV18State();
  if (enemy && Math.random() < (enemy.isElite ? 0.24 : 0.08)) {
    addItem('petCrystal', 1);
    addLog('你在战利品里摸到一块【灵契晶】。这下灵宠进阶材料终于有着落了。', 'rare');
  }
  if (enemy && lootBonus > 0 && game.activePet) {
    const extraStone = Math.max(1, Math.floor(lootBonus * 100 * (enemy.isElite ? 1.2 : 0.8)));
    game.stone += extraStone;
    addLog(`【${PET_DEFS[game.activePet].name}】顺手额外搜刮到 ${extraStone} 灵石。`, 'good');
    if (Math.random() < Math.min(0.4, lootBonus)) {
      const itemId = randomFrom(enemy.drops || ['spiritHerb']);
      addItem(itemId, 1);
      addLog(`灵宠技能额外带回 ${ITEM_DEFS[itemId].name} ×1。`, 'rare');
    }
  }
  updateUI();
};

function evolvePet(id) {
  ensureV18State();
  if (!game.petsOwned.includes(id)) return;
  const stage = getPetEvolution(id);
  if (stage >= 3) {
    addLog(`【${PET_DEFS[id].name}】已经进阶到当前版本上限。再进就要让版本号继续上班了。`, 'muted');
    return;
  }
  const bond = getPetBond(id);
  const needBond = [3, 6, 10][stage];
  if (bond < needBond) {
    addLog(`【${PET_DEFS[id].name}】亲密度不足，当前 ${bond}，进阶至少需要 ${needBond}。`, 'warn');
    return;
  }
  const cost = getPetEvolutionCost(id);
  if (!cost) return;
  const enough = Object.entries(cost).every(([itemId, amount]) => getInventoryAmount(itemId) >= amount);
  if (!enough) {
    const costText = Object.entries(cost).map(([itemId, amount]) => `${ITEM_DEFS[itemId].name}×${amount}`).join('、');
    addLog(`灵宠进阶材料不足，需要：${costText}。`, 'warn');
    return;
  }
  Object.entries(cost).forEach(([itemId, amount]) => spendItem(itemId, amount));
  game.petEvolution[id] = stage + 1;
  addLog(`【${PET_DEFS[id].name}】完成进阶，当前形态：${petStageName(stage + 1)}。这下它看你的眼神都更专业了。`, 'gold');
  updateUI();
}

const renderPetsV17 = renderPets;
renderPets = function() {
  const panel = document.getElementById('petPanel');
  if (!panel) return;
  ensureV18State();
  if (!game.petsOwned.length) {
    renderPetsV17();
    return;
  }
  panel.innerHTML = game.petsOwned.map((id) => {
    const pet = PET_DEFS[id];
    const active = game.activePet === id;
    const bond = getPetBond(id);
    const apt = getPetAptitudeMeta(id);
    const evo = getPetEvolution(id);
    const mult = getPetCombatMultiplier(id);
    const skill = getPetSkillDef(id);
    const cost = getPetEvolutionCost(id);
    const costText = cost ? Object.entries(cost).map(([itemId, amount]) => `${ITEM_DEFS[itemId].name}×${amount}`).join('、') : '已达上限';
    return `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h3>${pet.name}</h3>
            <div class="rank">亲密度：${bond} · ${petStageName(evo)}${active ? ' · 当前出战' : ''}</div>
          </div>
          <span class="aptitude-pill ${apt.className}">${apt.name}资质</span>
        </div>
        <p>${pet.desc}</p>
        <div class="evo-stars">
          ${[0,1,2,3].map((n) => `<span class="evo-star">${n <= evo ? '★' : '☆'} ${n === 0 ? '初生' : `进阶${n}`}</span>`).join('')}
        </div>
        <div class="pet-badges">
          <span class="pet-badge">总倍率 ×${mult.toFixed(2)}</span>
          <span class="pet-badge">攻击 +${pet.atk + bond * 2 + Math.floor((pet.atk + bond * 2) * (mult - 1)) + evo * 3}</span>
          <span class="pet-badge">防御 +${pet.def + Math.floor(bond * 1.2) + Math.floor((pet.def + Math.floor(bond * 1.2)) * (mult - 1)) + evo * 2}</span>
          <span class="pet-badge">生命 +${pet.hp + bond * 6 + Math.floor((pet.hp + bond * 6) * (mult - 1)) + evo * 18}</span>
          <span class="pet-badge">挂机 +${Math.round(((pet.afk + bond * 0.01) * mult + evo * 0.03) * 100)}%</span>
        </div>
        <div class="pet-meta-grid">
          <div class="pet-meta-chip">资质说明：${apt.desc}</div>
          <div class="pet-meta-chip">技能使用：${getPetSkillUses(id)} 次</div>
          <div class="pet-meta-chip">下次进阶材料：${costText}</div>
          <div class="pet-meta-chip">当前技能：${skill ? skill.name : '暂无'}</div>
        </div>
        <div class="skill-card">
          <h4>${skill ? skill.name : '暂无技能'}</h4>
          <p>${skill ? `${skill.desc}｜基础冷却 ${skill.cd} 回合。进阶越高，冷却越舒服。` : '当前没有可用技能。'}</p>
        </div>
        <div class="card-actions">
          ${!active ? `<button class="inline-btn" onclick="setActivePet('${id}')">设为跟随</button>` : `<button class="inline-btn" onclick="castPetSkill()">战斗中放技</button>`}
          <button class="inline-btn" onclick="feedPet('${id}')">喂零嘴</button>
          <button class="inline-btn" onclick="evolvePet('${id}')">进阶</button>
        </div>
      </div>
    `;
  }).join('');
};

const renderOverviewV17 = renderOverview;
renderOverview = function() {
  renderOverviewV17();
  const goalPanel = document.getElementById('goalPanel');
  const activePet = getActivePet();
  if (goalPanel && activePet) {
    const apt = getPetAptitudeMeta(activePet.id);
    goalPanel.insertAdjacentHTML('beforeend', `<div class="tip-item"><b>灵宠养成</b><small>当前跟随：${activePet.name} · ${apt.name}资质 · ${petStageName(getPetEvolution(activePet.id))}。想让它更能打，喂零嘴和攒灵契晶会比嘴上夸有用。</small></div>`);
  }
};

const renderJournalV17 = renderJournal;
renderJournal = function() {
  renderJournalV17();
  const statsBox = document.getElementById('journalStats');
  if (statsBox) {
    const petRows = game.petsOwned.length ? game.petsOwned.map((id) => `${PET_DEFS[id].name}（${getPetAptitudeMeta(id).name}/${petStageName(getPetEvolution(id))}）`).join('、') : '暂无';
    statsBox.innerHTML += `<ul class="list-bullets"><li>灵宠技能总使用：${Object.values(game.petSkillUse || {}).reduce((s, n) => s + (Number(n) || 0), 0)}</li><li>灵宠概况：${petRows}</li></ul>`;
  }
};

const renderShopV17 = renderShop;
renderShop = function() {
  renderShopV17();
  const panel = document.getElementById('shopPanel');
  if (panel) {
    panel.insertAdjacentHTML('afterbegin', `
      <div class="info-card rebirth-highlight">
        <h3>灵宠培养提示</h3>
        <p>第十八版开始，商店会卖【灵契晶】。灵宠想进阶，光靠嘴上说“你很棒”已经不够了。</p>
      </div>
    `);
  }
};

const renderCombatPanelV17 = renderCombatPanel;
renderCombatPanel = function() {
  renderCombatPanelV17();
  const petBtn = document.getElementById('petSkillText');
  if (!petBtn) return;
  ensureV18State();
  const pet = getActivePet();
  if (!pet) {
    petBtn.textContent = '灵宠技：未跟随';
    return;
  }
  const skill = getPetSkillDef(pet.id);
  if (!skill) {
    petBtn.textContent = '灵宠技：暂无';
    return;
  }
  petBtn.textContent = `灵宠技：${skill.name}${battleState.petSkillCd > 0 ? `(${battleState.petSkillCd})` : ''}`;
};

function bootFromStorageV18() {
  const direct = localStorage.getItem(SAVE_KEY_V18);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    ensureV18State();
    handleOfflineGain();
    addLog('你从第十八版存档中苏醒。灵宠现在不仅有脾气，还有资质、技能和进阶路线。', 'rare');
    return true;
  }
  if (typeof bootFromStorageV17 === 'function' && bootFromStorageV17()) {
    ensureV18State();
    addLog('已从第十七版存档迁入第十八版。灵宠系统已经正式长大成人。', 'rare');
    return true;
  }
  return false;
}

const updateUIV17 = updateUI;
updateUI = function() {
  ensureV18State();
  updateUIV17();
  renderPets();
  document.title = '凡尘问道录 · 第十八版';
  const brandP = document.querySelector('.brand p');
  if (brandP) brandP.textContent = '第十八版 · 灵宠技能、资质、进阶';
};

function saveGame() {
  ensureV18State();
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V18, JSON.stringify(game));
  addLog('第十八版存档成功。灵宠资质、技能使用和进阶进度都一起记下了。', 'good');
}
function loadGame() {
  if (!bootFromStorageV18()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}
function resetGame() {
  localStorage.removeItem(SAVE_KEY_V18);
  const selectedStyle = (game && game.openingStyle) ? game.openingStyle : 'balanced';
  game = createNewGame({ openingStyle: selectedStyle });
  normalizeGame();
  ensureV18State();
  applyOpeningStyleOnceV17(game);
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。灵宠线现在也正式升级了。`, 'rare');
  updateUI();
}
function initV18() {
  const hasSave = bootFromStorageV18();
  if (!hasSave) {
    game = createNewGame({ openingStyle: 'balanced' });
    normalizeGame();
    ensureV18State();
    applyOpeningStyleOnceV17(game);
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第十八版已开启：灵宠拥有资质、能在战斗中放技能，也终于可以进阶了。', 'muted');
  } else {
    ensureV18State();
    if (!game.openingStyleApplied) applyOpeningStyleOnceV17(game);
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.castPetSkill = castPetSkill;
window.evolvePet = evolvePet;
window.onload = initV18;
window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V18, JSON.stringify(game));
  }
});


/* =====================
   V19 PATCH
   剧情主线、宗门阵营冲突、多个大结局
===================== */

const SAVE_KEY_V19 = 'xiuxian_v19_save';

const MAINLINE_CHAPTERS_V19 = [
  {
    id: 'bamboo_sign',
    title: '第一章 · 竹林异兆',
    desc: '青竹林里开始出现不该属于这片地界的灵压痕迹。你第一次意识到，这世界的怪未必只是给你刷经验的。',
    needRealm: 1,
    check() { return (getMapState('bamboo').visited && Object.keys(getMapState('bamboo').visited).length >= 6) || game.stats.exploreCount >= 4; },
    reward() {
      game.storyMain.progress = 1;
      addItem('spiritHerb', 2);
      game.stone += 40;
      addLog('你沿着竹林异兆追出第一条线索，灵石 +40，灵草 +2。主线真正开始了。', 'rare');
    }
  },
  {
    id: 'valley_letter',
    title: '第二章 · 谷中密信',
    desc: '黑风谷散修尸身旁留下了一封密信，字里行间都在暗示四宗内部有人已经先动手了。',
    needRealm: 5,
    check() { return game.stats.killCount >= 18 && game.currentMapId !== null; },
    reward() {
      game.storyMain.progress = 2;
      gainExp(420, '主线');
      game.stone += 60;
      addLog('你拿到了黑风谷里的密信，修为 +420，灵石 +60。四宗之争不再只是传闻。', 'rare');
    }
  },
  {
    id: 'thunder_oath',
    title: '第三章 · 雷窟旧约',
    desc: '雷鸣窟深处的残碑记着一份旧约：四宗曾联手封过某种东西，而那东西正在松动。',
    needRealm: 9,
    check() { return game.stats.battlesWon >= 15 && (game.hiddenMapsUnlocked || []).length >= 1; },
    reward() {
      game.storyMain.progress = 3;
      game.breakthroughBonus += 10;
      addItem('thunderStone', 2);
      addLog('你在雷窟残碑前确认了旧约内容。突破成功率 +10%，残雷石 +2。', 'gold');
    }
  },
  {
    id: 'sea_split',
    title: '第四章 · 海眼分裂',
    desc: '星沉海眼开始分裂出不同灵潮。青岚、赤炎、玄水、天机台都开始派人试探彼此底线。',
    needRealm: 14,
    check() { return !!game.sectId && game.sectId !== 'none' && game.sectTaskCount >= 2; },
    reward() {
      game.storyMain.progress = 4;
      game.conflictMain.unlocked = true;
      game.sectContribution += 40;
      addLog('你被卷入真正的宗门局里。阵营冲突已解锁，宗门贡献 +40。', 'gold');
    }
  },
  {
    id: 'four_sects',
    title: '第五章 · 四宗风起',
    desc: '表面的任务和兑换都还在继续，但所有人都知道，真正的站队已经开始了。',
    needRealm: 16,
    check() { return (game.conflictMain.actions || 0) >= 3; },
    reward() {
      game.storyMain.progress = 5;
      game.stone += 120;
      if (game.sectId !== 'none') game.sectContribution += 55;
      addLog('你正式被卷进四宗风起的正中央。灵石 +120，宗门贡献大涨。', 'gold');
    }
  },
  {
    id: 'heaven_game',
    title: '第六章 · 问天之局',
    desc: '所有矛盾都不只是为了一场宗门内斗。真正的问天之局，终于把你本人也算进去了。',
    needRealm: 18,
    check() {
      const c = game.conflictMain;
      return Math.max(c.orthodox, c.flame, c.water, c.tianji) >= 60;
    },
    reward() {
      game.storyMain.progress = 6;
      game.storyMain.completed = true;
      game.soulMarks += 3;
      addLog('你看穿了问天之局背后的真正走向。主线暂时完结，轮回印 +3。', 'gold');
    }
  }
];

const ENDINGS_V19 = {
  orthodox: {
    id: 'orthodox',
    name: '守正问天',
    desc: '你站在正统一侧，把动乱压成了通往更高处的台阶。',
    check() {
      return game.storyMain.completed && ['qinglan', 'xuanshui'].includes(game.sectId) && game.conflictMain.orthodox >= 70;
    },
    reward: 6
  },
  flame: {
    id: 'flame',
    name: '赤焰称王',
    desc: '你没有劝火熄灭，而是亲手把火抬到了最高处。',
    check() {
      return game.storyMain.completed && game.sectId === 'chiyan' && game.conflictMain.flame >= 70;
    },
    reward: 7
  },
  scheme: {
    id: 'scheme',
    name: '天机执局',
    desc: '你不是站在台前的人，但最后所有人都发现局是你布的。',
    check() {
      return game.storyMain.completed && game.sectId === 'tianji' && game.conflictMain.tianji >= 70 && ((game.journal.hiddenMaps || []).length >= 2);
    },
    reward: 8
  },
  lone: {
    id: 'lone',
    name: '散修远行',
    desc: '你没有把自己绑死在任何一面旗上，最后只是带着答案离开。',
    check() {
      return game.storyMain.progress >= 5 && game.sectId === 'none' && game.rebirthCount >= 2 && ((game.journal.hiddenMaps || []).length >= 2);
    },
    reward: 6
  },
  beast: {
    id: 'beast',
    name: '万灵同行',
    desc: '你没把修行当成一个人的路，而是带着灵宠和自己的世界一起走到了最后。',
    check() {
      return game.storyMain.progress >= 5 && (game.petsOwned || []).length >= 3 && !!game.activePet;
    },
    reward: 5
  }
};

function ensureV19State() {
  if (!game.storyMain || typeof game.storyMain !== 'object') {
    game.storyMain = { progress: 0, completed: false };
  }
  if (!game.conflictMain || typeof game.conflictMain !== 'object') {
    game.conflictMain = {
      unlocked: false,
      orthodox: 0,
      flame: 0,
      water: 0,
      tianji: 0,
      actions: 0,
      route: '未站队'
    };
  }
  if (!Array.isArray(game.endingArchive)) game.endingArchive = [];
  if (!Array.isArray(game.journal.endings)) game.journal.endings = [];
}

function getCurrentChapterV19() {
  ensureV19State();
  return MAINLINE_CHAPTERS_V19[game.storyMain.progress] || null;
}

function getConflictLeaderV19() {
  ensureV19State();
  const entries = [
    ['orthodox', game.conflictMain.orthodox],
    ['flame', game.conflictMain.flame],
    ['water', game.conflictMain.water],
    ['tianji', game.conflictMain.tianji]
  ].sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

function conflictNameV19(id) {
  return {
    orthodox: '青岚/玄水正盟',
    flame: '赤炎主战派',
    water: '玄水守序派',
    tianji: '天机中枢派'
  }[id] || '未定';
}

function advanceStoryV19() {
  ensureV19State();
  const chapter = getCurrentChapterV19();
  if (!chapter) {
    addLog('当前版本的主线已经推进到头了。后面的坑，得等你下一次继续点版本号。', 'muted');
    return;
  }
  if (game.realmIndex < chapter.needRealm) {
    addLog(`境界不足，推进【${chapter.title}】至少需要达到 ${REALMS[chapter.needRealm].key}。`, 'warn');
    return;
  }
  if (!chapter.check()) {
    addLog(`【${chapter.title}】的条件还没满足。先去刷图、打怪、做宗门任务或推进阵营。`, 'warn');
    return;
  }
  chapter.reward();
  updateUI();
}

function performConflictActionV19(type) {
  ensureV19State();
  if (!game.conflictMain.unlocked) {
    addLog('你现在还没真正卷进四宗冲突。先去推进主线。', 'warn');
    return;
  }
  if (type === 'orthodox') {
    game.conflictMain.orthodox += 18 + (['qinglan', 'xuanshui'].includes(game.sectId) ? 8 : 0);
    game.sectContribution += game.sectId !== 'none' ? 16 : 0;
    gainExp(260, '阵营');
    addLog('你选择援护正盟，压住了局势的一角。主线和宗门都开始把你当回事。', 'good');
  } else if (type === 'flame') {
    game.conflictMain.flame += 20 + (game.sectId === 'chiyan' ? 10 : 0);
    game.stone += 90;
    game.breakthroughBonus += 4;
    addLog('你推动了更激进的一派，火势更高，收益也更直接。', 'warn');
  } else if (type === 'water') {
    game.conflictMain.water += 18 + (game.sectId === 'xuanshui' ? 10 : 0);
    game.life = Math.min(calcPlayerStats().maxHp, game.life + 50);
    game.sectContribution += game.sectId !== 'none' ? 12 : 0;
    addLog('你替守序派稳住了后方，伤势也顺手养回来不少。', 'good');
  } else if (type === 'tianji') {
    game.conflictMain.tianji += 22 + (game.sectId === 'tianji' ? 12 : 0);
    game.stone += 60;
    addItem('insightPill', 1);
    addLog('你暗中拨动天机线，台前的人还在吵，台后的局已经换了。', 'rare');
  }
  game.conflictMain.actions += 1;
  game.conflictMain.route = conflictNameV19(getConflictLeaderV19());
  updateUI();
}

function claimEndingV19(id) {
  ensureV19State();
  const ending = ENDINGS_V19[id];
  if (!ending) return;
  if (game.endingArchive.includes(id)) {
    addLog(`结局【${ending.name}】已经收录过了。你这是打算反复看彩蛋。`, 'muted');
    return;
  }
  if (!ending.check()) {
    addLog(`还达不成【${ending.name}】。主线、宗门、阵营或灵宠条件至少差了一块。`, 'warn');
    return;
  }
  game.endingArchive.push(id);
  if (!game.journal.endings.includes(ending.name)) game.journal.endings.push(ending.name);
  game.soulMarks += ending.reward;
  addLog(`你达成了结局【${ending.name}】！轮回印 +${ending.reward}。这一世，终于算是有个说法了。`, 'gold');
  updateUI();
}

function renderStoryV19() {
  const panel = document.getElementById('storyPanel');
  if (!panel) return;
  ensureV19State();
  const chapter = getCurrentChapterV19();
  const completedRows = MAINLINE_CHAPTERS_V19.slice(0, game.storyMain.progress).map((c) => `<span class="story-pill">${c.title}</span>`).join('');
  panel.innerHTML = `
    <div class="info-card story-highlight">
      <div class="card-top">
        <div>
          <h3>主线总览</h3>
          <div class="rank">当前进度：${game.storyMain.progress} / ${MAINLINE_CHAPTERS_V19.length} ${game.storyMain.completed ? '· 已完成当前版本主线' : ''}</div>
        </div>
        <span class="tiny-tag gold">${game.storyMain.completed ? '主线已完' : '主线进行中'}</span>
      </div>
      <p>第十九版开始，地图、宗门和阵营都被主线串起来了。你终于不再只是“哪里亮了点哪里”。</p>
      <div class="badge-line">${completedRows || '<span class="story-pill">尚未完成任何章节</span>'}</div>
    </div>
    ${chapter ? `
      <div class="info-card">
        <div class="card-top">
          <div>
            <h3>${chapter.title}</h3>
            <div class="rank">推进要求：${REALMS[chapter.needRealm].key}</div>
          </div>
        </div>
        <p>${chapter.desc}</p>
        <div class="route-box">
          <p>推进建议：</p>
          <p>· 多跑主地图、继续打怪、做宗门任务、适当刷隐藏图。</p>
          <p>· 主线后半段会和阵营冲突直接绑死。</p>
        </div>
        <div class="card-actions">
          <button class="inline-btn" onclick="advanceStoryV19()">推进本章</button>
        </div>
      </div>
    ` : `
      <div class="info-card">
        <h3>主线暂告一段落</h3>
        <p>你已经走到第十九版当前主线尽头。现在可以去阵营页和结局页，看看这一世会落到什么说法上。</p>
      </div>
    `}
  `;
}

function renderConflictV19() {
  const panel = document.getElementById('conflictPanel');
  if (!panel) return;
  ensureV19State();
  panel.innerHTML = `
    <div class="info-card conflict-highlight">
      <div class="card-top">
        <div>
          <h3>阵营总览</h3>
          <div class="rank">当前主导：${game.conflictMain.route}</div>
        </div>
        <span class="tiny-tag rare">${game.conflictMain.unlocked ? '已解锁' : '未解锁'}</span>
      </div>
      <p>四宗现在不只是发任务和送加成。你每一次站队，都会把结局往某一面推。</p>
      <div class="badge-line">
        <span class="conflict-pill">正盟 ${game.conflictMain.orthodox}</span>
        <span class="conflict-pill">炎脉 ${game.conflictMain.flame}</span>
        <span class="conflict-pill">玄水 ${game.conflictMain.water}</span>
        <span class="conflict-pill">天机 ${game.conflictMain.tianji}</span>
      </div>
      <div class="small-grid">
        <div class="meta-chip">累计站队：${game.conflictMain.actions}</div>
        <div class="meta-chip">当前宗门：${getCurrentSectV15 ? getCurrentSectV15().name : '无'}</div>
      </div>
    </div>
    <div class="conflict-grid">
      <div class="info-card">
        <h3>援护正盟</h3>
        <p>偏向青岚 / 玄水的守序路线。更适合走“守正问天”。</p>
        <div class="card-actions"><button class="inline-btn" onclick="performConflictActionV19('orthodox')">执行</button></div>
      </div>
      <div class="info-card">
        <h3>推动炎脉</h3>
        <p>更激进，也更直接。适合想把火势一路抬到结局的人。</p>
        <div class="card-actions"><button class="inline-btn" onclick="performConflictActionV19('flame')">执行</button></div>
      </div>
      <div class="info-card">
        <h3>稳住玄水</h3>
        <p>偏守成与后方秩序，收益没那么炸，但活得更像个能活到后面的修士。</p>
        <div class="card-actions"><button class="inline-btn" onclick="performConflictActionV19('water')">执行</button></div>
      </div>
      <div class="info-card">
        <h3>暗拨天机</h3>
        <p>不一定站在最前，但很可能站在最后面笑。适合喜欢控局的人。</p>
        <div class="card-actions"><button class="inline-btn" onclick="performConflictActionV19('tianji')">执行</button></div>
      </div>
    </div>
  `;
}

function renderEndingsV19() {
  const panel = document.getElementById('endingPanel');
  if (!panel) return;
  ensureV19State();
  const archiveText = game.endingArchive.length ? game.endingArchive.map((id) => ENDINGS_V19[id].name).join('、') : '暂无';
  panel.innerHTML = `
    <div class="info-card ending-highlight">
      <div class="card-top">
        <div>
          <h3>结局图鉴</h3>
          <div class="rank">已收录：${archiveText}</div>
        </div>
        <span class="tiny-tag gold">轮回印奖励型</span>
      </div>
      <p>第十九版的结局不再只是一句文案，会直接给轮回印，让你下一世更有底气。</p>
    </div>
    <div class="ending-grid">
      ${Object.values(ENDINGS_V19).map((ending) => `
        <div class="info-card">
          <div class="card-top">
            <div>
              <h3>${ending.name}</h3>
              <div class="rank">奖励轮回印：${ending.reward}</div>
            </div>
            <span class="tiny-tag ${game.endingArchive.includes(ending.id) ? 'gold' : (ending.check() ? 'rare' : '')}">${game.endingArchive.includes(ending.id) ? '已收录' : (ending.check() ? '可达成' : '条件不足')}</span>
          </div>
          <p>${ending.desc}</p>
          <div class="card-actions">
            <button class="inline-btn" onclick="claimEndingV19('${ending.id}')">达成结局</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

const renderOverviewV18 = renderOverview;
renderOverview = function() {
  renderOverviewV18();
  ensureV19State();
  const goalPanel = document.getElementById('goalPanel');
  if (goalPanel) {
    const chapter = getCurrentChapterV19();
    goalPanel.insertAdjacentHTML('beforeend', `<div class="tip-item"><b>主线 / 阵营提示</b><small>${chapter ? `当前主线：${chapter.title}` : '当前主线已暂时完结'} ｜ 当前主导阵营：${game.conflictMain.route}。第十九版开始，你的每个选择都更像是在给自己写结局。</small></div>`);
  }
};

const renderSectV18 = renderSectV15;
renderSectV15 = function() {
  renderSectV18();
  const panel = document.getElementById('sectPanel');
  if (panel) {
    panel.insertAdjacentHTML('beforeend', `
      <div class="info-card conflict-highlight">
        <h3>第十九版阵营提醒</h3>
        <p>宗门现在不只是提供加成和兑换。你的宗门归属会直接影响主线推进和最终结局。</p>
        <div class="card-actions">
          <button class="inline-btn" onclick="setView('conflict')">去看阵营冲突</button>
          <button class="inline-btn" onclick="setView('story')">去看主线</button>
        </div>
      </div>
    `);
  }
};

const renderRebirthV18 = renderRebirth;
renderRebirth = function() {
  renderRebirthV18();
  const panel = document.getElementById('rebirthPanel');
  if (panel) {
    panel.insertAdjacentHTML('beforeend', `
      <div class="info-card ending-highlight">
        <h3>第十九版总结</h3>
        <p>主线、阵营和结局都已经接入轮回成长。现在轮回不只是为了刷数值，也是为了多看几种人生。</p>
        <div class="small-grid">
          <div class="meta-chip">已收录结局：${game.endingArchive.length}</div>
          <div class="meta-chip">轮回印：${game.soulMarks}</div>
        </div>
      </div>
    `);
  }
};

const renderJournalV18 = renderJournal;
renderJournal = function() {
  renderJournalV18();
  const statsBox = document.getElementById('journalStats');
  if (statsBox) {
    statsBox.innerHTML += `<ul class="list-bullets"><li>主线进度：${game.storyMain.progress}/${MAINLINE_CHAPTERS_V19.length}</li><li>阵营主导：${game.conflictMain.route}</li><li>已收录结局：${game.journal.endings.length ? game.journal.endings.join('、') : '暂无'}</li></ul>`;
  }
};

const setViewV18 = setView;
setView = function(viewId) {
  setViewV18(viewId);
  if (viewId === 'story') renderStoryV19();
  if (viewId === 'conflict') renderConflictV19();
  if (viewId === 'endings') renderEndingsV19();
};

function bootFromStorageV19() {
  const direct = localStorage.getItem(SAVE_KEY_V19);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    ensureV18State();
    ensureV19State();
    handleOfflineGain();
    addLog('你从第十九版存档中苏醒。主线、阵营和结局都已经开始算账了。', 'rare');
    return true;
  }
  if (typeof bootFromStorageV18 === 'function' && bootFromStorageV18()) {
    ensureV19State();
    addLog('已从第十八版存档迁入第十九版。现在这世界终于会认真给你的选择记账了。', 'rare');
    return true;
  }
  return false;
}

const updateUIV18 = updateUI;
updateUI = function() {
  ensureV19State();
  updateUIV18();
  renderStoryV19();
  renderConflictV19();
  renderEndingsV19();
  document.title = '凡尘问道录 · 第十九版';
  const brandP = document.querySelector('.brand p');
  if (brandP) brandP.textContent = '第十九版 · 剧情主线、宗门阵营冲突、多个大结局';
};

function saveGame() {
  ensureV19State();
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V19, JSON.stringify(game));
  addLog('第十九版存档成功。主线分支、阵营立场和结局收录都一起封进玉简里了。', 'good');
}
function loadGame() {
  if (!bootFromStorageV19()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}
function resetGame() {
  localStorage.removeItem(SAVE_KEY_V19);
  const selectedStyle = (game && game.openingStyle) ? game.openingStyle : 'balanced';
  game = createNewGame({ openingStyle: selectedStyle });
  normalizeGame();
  ensureV18State();
  ensureV19State();
  applyOpeningStyleOnceV17(game);
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。这次不只是变强，你还得选自己的路。`, 'rare');
  updateUI();
}
function initV19() {
  const hasSave = bootFromStorageV19();
  if (!hasSave) {
    game = createNewGame({ openingStyle: 'balanced' });
    normalizeGame();
    ensureV18State();
    ensureV19State();
    applyOpeningStyleOnceV17(game);
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第十九版已开启：剧情主线、宗门阵营冲突和多个大结局已经正式接入主循环。', 'muted');
  } else {
    ensureV19State();
    if (!game.openingStyleApplied) applyOpeningStyleOnceV17(game);
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.advanceStoryV19 = advanceStoryV19;
window.performConflictActionV19 = performConflictActionV19;
window.claimEndingV19 = claimEndingV19;
window.onload = initV19;
window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V19, JSON.stringify(game));
  }
});




/* ===== 第二十版：内容信息完善、去版本更新标注、响应式 UI、日志可见 ===== */
const SAVE_KEY_V20 = 'xiuxian_v20_save';

function ensureV20State() {
  if (!game || typeof game !== 'object') return;
  if (!Array.isArray(game.logs)) game.logs = [];
  if (!game.uiInfo) {
    game.uiInfo = {
      lastResponsiveNote: false
    };
  }
}

function sanitizeVersionLabelsV20() {
  const targets = [
    '.brand p',
    '#view-overview p',
    '#view-story',
    '#view-conflict',
    '#view-endings',
    '#view-sect',
    '#view-rebirth'
  ];
  targets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      if (!node || !node.innerHTML) return;
      node.innerHTML = node.innerHTML
        .replace(/第十九版开始，/g, '')
        .replace(/第十九版的/g, '')
        .replace(/第十九版总结/g, '当前总结')
        .replace(/第十九版阵营提醒/g, '阵营提醒')
        .replace(/第十九版/g, '');
    });
  });
}

const renderLogsV19 = renderLogs;
renderLogs = function() {
  renderLogsV19();
  const logPanelMain = document.getElementById('logPanelMain');
  if (!logPanelMain) return;
  logPanelMain.innerHTML = game.logs.length
    ? game.logs.map((log) => `<div class="log-item ${log.type || 'muted'}">${log.text}</div>`).join('')
    : `<div class="empty-text">这里还没有新的记录。先去跑图、打怪、炼丹或推主线，日志就会自己热闹起来。</div>`;
};

const renderOverviewV19 = renderOverview;
renderOverview = function() {
  renderOverviewV19();
  const goalPanel = document.getElementById('goalPanel');
  if (!goalPanel) return;
  const chapter = typeof getCurrentMainChapterV19 === 'function' ? getCurrentMainChapterV19() : null;
  const hiddenCount = (game.journal?.hiddenMaps || []).length || 0;
  const endings = (game.journal?.endings || []).length || 0;
  const sectName = typeof getSectInfo === 'function' ? getSectInfo().name : (game.sectId || '散修');
  const conflictRoute = game.conflictMain?.route || '尚未定势';
  goalPanel.insertAdjacentHTML('beforeend', `
    <div class="tip-item">
      <b>当前情报总览</b>
      <div class="info-pairs" style="margin-top:10px;">
        <div class="info-pair"><span>主线阶段</span>${chapter ? chapter.title : '当前主线已暂告一段落'}</div>
        <div class="info-pair"><span>所属宗门</span>${sectName}</div>
        <div class="info-pair"><span>阵营主导</span>${conflictRoute}</div>
        <div class="info-pair"><span>隐藏地图 / 结局</span>${hiddenCount} 张 / ${endings} 个</div>
      </div>
    </div>
  `);
};

const renderMapPanelsV19 = renderMapPanels;
renderMapPanels = function() {
  renderMapPanelsV19();
  const mapDetailPanel = document.getElementById('mapDetailPanel');
  if (!mapDetailPanel) return;
  const map = getMapData();
  const isHidden = !!map.hidden;
  const roomOpen = typeof isBossRoomUnlockedV16 === 'function' ? isBossRoomUnlockedV16(map.id) : false;
  mapDetailPanel.insertAdjacentHTML('beforeend', `
    <div class="tip-item">
      <b>地图补充信息</b>
      <small>是否隐藏地图：${isHidden ? '是' : '否'} ｜ Boss 房间：${roomOpen ? '已开放' : '未开放'} ｜ 挂机状态：${game.afkActive && game.afkMapId === map.id ? '当前正在挂机' : '未在此挂机'}</small>
    </div>
  `);
};

const setViewV19 = setView;
setView = function(viewId) {
  setViewV19(viewId);
  if (viewId === 'logs') renderLogs();
};

function bootFromStorageV20() {
  const direct = localStorage.getItem(SAVE_KEY_V20);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    if (typeof ensureV18State === 'function') ensureV18State();
    if (typeof ensureV19State === 'function') ensureV19State();
    ensureV20State();
    handleOfflineGain();
    addLog('你从最近一次存档中醒来。界面已经调整成更容易看日志和信息的版本。', 'rare');
    return true;
  }
  if (typeof bootFromStorageV19 === 'function' && bootFromStorageV19()) {
    ensureV20State();
    addLog('已从旧存档迁入当前版本。页面结构和信息展示已做整理，阅读会顺很多。', 'rare');
    return true;
  }
  return false;
}

const updateUIV19 = updateUI;
updateUI = function() {
  ensureV20State();
  updateUIV19();
  renderLogs();
  sanitizeVersionLabelsV20();
  document.title = '凡尘问道录 · 第二十版';
  const brandP = document.querySelector('.brand p');
  if (brandP) brandP.textContent = '主线、宗门阵营冲突、多个大结局';
};

function saveGame() {
  ensureV20State();
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V20, JSON.stringify(game));
  addLog('当前版本存档成功。你整理过的信息、主线与日志都会完整保留。', 'good');
}
function loadGame() {
  if (!bootFromStorageV20()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}
function resetGame() {
  localStorage.removeItem(SAVE_KEY_V20);
  const selectedStyle = (game && game.openingStyle) ? game.openingStyle : 'balanced';
  game = createNewGame({ openingStyle: selectedStyle });
  normalizeGame();
  if (typeof ensureV18State === 'function') ensureV18State();
  if (typeof ensureV19State === 'function') ensureV19State();
  ensureV20State();
  if (typeof applyOpeningStyleOnceV17 === 'function') applyOpeningStyleOnceV17(game);
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。这次界面和信息也会更清楚，不容易迷路。`, 'rare');
  updateUI();
}
function initV20() {
  const hasSave = bootFromStorageV20();
  if (!hasSave) {
    game = createNewGame({ openingStyle: 'balanced' });
    normalizeGame();
    if (typeof ensureV18State === 'function') ensureV18State();
    if (typeof ensureV19State === 'function') ensureV19State();
    ensureV20State();
    if (typeof applyOpeningStyleOnceV17 === 'function') applyOpeningStyleOnceV17(game);
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('当前版本已开启：页面信息更完整，响应式更稳，日志也终于不用再躲在角落里。', 'muted');
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.saveGame = saveGame;
window.loadGame = loadGame;
window.resetGame = resetGame;
window.onload = initV20;
window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V20, JSON.stringify(game));
  }
});


/* ===== V21 战斗与经验平衡补丁 ===== */
const SAVE_KEY_V21 = 'xiuxian_v21_save';

function ensureV21State() {
  if (!game || typeof game !== 'object') return;
  game.version = Math.max(Number(game.version) || 0, 21);
  game.balanceProfile = 'v21';
}

// 提高后段境界所需经验，避免推进过快
REALMS.forEach((realm, index) => {
  if (realm._v21_balanced) return;
  if (index >= 8) realm.need = Math.floor(realm.need * 1.18);
  if (index >= 12) realm.need = Math.floor(realm.need * 1.22);
  if (index >= 16) realm.need = Math.floor(realm.need * 1.28);
  if (index >= 20) realm.need = Math.floor(realm.need * 1.36);
  realm._v21_balanced = true;
});

// 玩家综合面板下调，避免后期碾压
const calcPlayerStatsV20 = calcPlayerStats;
calcPlayerStats = function() {
  ensureV21State();
  const stats = calcPlayerStatsV20();
  stats.atk = Math.max(1, Math.floor(stats.atk * 0.86));
  stats.def = Math.max(1, Math.floor(stats.def * 0.90));
  stats.maxHp = Math.max(1, Math.floor(stats.maxHp * 0.92));
  stats.power = Math.max(1, Math.floor(stats.power * 0.90));
  return stats;
};

// 野怪整体强化，地图越高阶越明显
const randomMonsterOnMapV20 = randomMonsterOnMap;
randomMonsterOnMap = function(mapId, elite = false) {
  const enemy = randomMonsterOnMapV20(mapId, elite);
  const map = MAPS[mapId] || getMapData(mapId);
  const rec = Number(map?.rec || 0);

  enemy.hp = Math.floor(enemy.hp * (1.42 + rec * 0.015));
  enemy.atk = Math.floor(enemy.atk * (1.26 + rec * 0.010));
  enemy.def = Math.floor(enemy.def * (1.20 + rec * 0.008));

  // 精英额外更硬一点，但不给太离谱经验
  if (enemy.isElite) {
    enemy.hp = Math.floor(enemy.hp * 1.12);
    enemy.atk = Math.floor(enemy.atk * 1.08);
    enemy.def = Math.floor(enemy.def * 1.06);
    enemy.exp = Math.max(1, Math.floor(enemy.exp * 0.92));
    enemy.stone = Math.max(1, Math.floor(enemy.stone * 0.95));
  } else {
    enemy.exp = Math.max(1, Math.floor(enemy.exp * 0.72));
    enemy.stone = Math.max(1, Math.floor(enemy.stone * 0.90));
  }

  return enemy;
};

// 全局经验结算减速，不同来源减速幅度不同
const gainExpV20 = gainExp;
gainExp = function(amount, source = '修炼') {
  ensureV21State();
  let mult = 0.65;

  if (source === '打怪') mult = 0.68;
  else if (source === '挂机') mult = 0.54;
  else if (source === '离线') mult = 0.46;
  else if (source === '修炼') mult = 0.58;
  else if (source === '丹药') mult = 0.72;
  else if (source === '主线') mult = 0.62;
  else if (source === '阵营') mult = 0.60;

  if (game.realmIndex >= 10) mult *= 0.92;
  if (game.realmIndex >= 15) mult *= 0.88;
  if (game.realmIndex >= 20) mult *= 0.82;

  gainExpV20(Math.max(1, Math.floor(amount * mult)), source);
};

// 主页增加平衡说明
const renderOverviewV20 = renderOverview;
renderOverview = function() {
  renderOverviewV20();
  const goalPanel = document.getElementById('goalPanel');
  if (goalPanel && !goalPanel.innerHTML.includes('第二十一版平衡')) {
    goalPanel.insertAdjacentHTML('beforeend',
      `<div class="tip-item"><b>第二十一版平衡</b><small>野怪整体更硬，后期经验获取更慢。后段推进更依赖装备、技能、地图选择和挂机策略，不再是一脚油门直接通天。</small></div>`
    );
  }
};

// 地图页增加危险度提醒
const renderMapPanelsV20 = renderMapPanels;
renderMapPanels = function() {
  renderMapPanelsV20();
  const mapDetailPanel = document.getElementById('mapDetailPanel');
  const map = getMapData();
  if (mapDetailPanel && map) {
    const danger = map.rec >= 16 ? '很高' : map.rec >= 10 ? '较高' : map.rec >= 5 ? '中等' : '普通';
    mapDetailPanel.insertAdjacentHTML('beforeend',
      `<div class="tip-item"><b>当前图危险度</b><small>${danger}。第21版里，野怪成长明显加强，特别是高阶图和精英格子，不建议裸装硬顶。</small></div>`
    );
  }
};

function bootFromStorageV21() {
  const direct = localStorage.getItem(SAVE_KEY_V21);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    if (typeof ensureV18State === 'function') ensureV18State();
    if (typeof ensureV19State === 'function') ensureV19State();
    if (typeof ensureV20State === 'function') ensureV20State();
    ensureV21State();
    handleOfflineGain();
    addLog('你从第二十一版存档中醒来。战斗和平衡已经按新版本重算。', 'rare');
    return true;
  }
  if (typeof bootFromStorageV20 === 'function' && bootFromStorageV20()) {
    ensureV21State();
    addLog('已从第二十版存档迁入第二十一版。野怪和经验结算已切到新版平衡。', 'rare');
    return true;
  }
  return false;
}

const updateUIV20 = updateUI;
updateUI = function() {
  ensureV21State();
  updateUIV20();
  document.title = '凡尘问道录 · 第二十一版';
  const brandP = document.querySelector('.brand p');
  if (brandP) brandP.textContent = '主线、宗门阵营冲突、多个大结局';
};

function saveGame() {
  ensureV21State();
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V21, JSON.stringify(game));
  addLog('第二十一版存档成功。当前战斗与经验平衡会完整保留。', 'good');
}

function loadGame() {
  if (!bootFromStorageV21()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY_V21);
  const selectedStyle = (game && game.openingStyle) ? game.openingStyle : 'balanced';
  game = createNewGame({ openingStyle: selectedStyle });
  normalizeGame();
  if (typeof ensureV18State === 'function') ensureV18State();
  if (typeof ensureV19State === 'function') ensureV19State();
  if (typeof ensureV20State === 'function') ensureV20State();
  ensureV21State();
  if (typeof applyOpeningStyleOnceV17 === 'function') applyOpeningStyleOnceV17(game);
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。第二十一版的战斗会更疼，经验也更慢。`, 'rare');
  updateUI();
}

function initV21() {
  const hasSave = bootFromStorageV21();
  if (!hasSave) {
    game = createNewGame({ openingStyle: 'balanced' });
    normalizeGame();
    if (typeof ensureV18State === 'function') ensureV18State();
    if (typeof ensureV19State === 'function') ensureV19State();
    if (typeof ensureV20State === 'function') ensureV20State();
    ensureV21State();
    if (typeof applyOpeningStyleOnceV17 === 'function') applyOpeningStyleOnceV17(game);
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第二十一版已开启：野怪更能打，经验增长更克制。终于没那么像在切菜了。', 'muted');
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.saveGame = saveGame;
window.loadGame = loadGame;
window.resetGame = resetGame;
window.onload = initV21;
window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V21, JSON.stringify(game));
  }
});


/* ===== 第二十二版：日志位置优化 / Boss 房触发优化 ===== */
const SAVE_KEY_V22 = 'xiuxian_v22_save';

const BOSS_TRIGGER_RULES_V22 = {
  bamboo: { elites: 1, stage: 2 },
  valley: { elites: 2, stage: 2 },
  thunder: { elites: 2, stage: 2 },
  sea: { elites: 3, stage: 2 }
};

function ensureV22State() {
  ensureV21State();
  if (!game.bossTriggerProgress || typeof game.bossTriggerProgress !== 'object') game.bossTriggerProgress = {};
  Object.keys(BOSS_TRIGGER_RULES_V22).forEach((mapId) => {
    if (!game.bossTriggerProgress[mapId]) {
      game.bossTriggerProgress[mapId] = {
        eliteKills: 0,
        primed: false,
        announced: false
      };
    }
  });
  game.version = 22;
}

function getBossTriggerProgressV22(mapId) {
  ensureV22State();
  return game.bossTriggerProgress[mapId];
}

function refreshBossRoomUnlockV22(mapId, silent = false) {
  ensureV22State();
  const rule = BOSS_TRIGGER_RULES_V22[mapId];
  if (!rule) return false;
  const chain = getChainStateV16(mapId);
  const room = game.bossRooms[mapId];
  const progress = getBossTriggerProgressV22(mapId);

  const stageReady = (chain.stage || 0) >= rule.stage;
  const eliteReady = (progress.eliteKills || 0) >= rule.elites;

  if (stageReady && !progress.primed) {
    progress.primed = true;
  }

  if (stageReady && eliteReady) {
    if (!room.unlocked) {
      room.unlocked = true;
      if (!silent) addLog(`【${MAPS[mapId].name}】Boss 房间已真正开启。事件链和精英清剿都到位了，这次不是误会。`, 'gold');
    }
    return true;
  }

  room.unlocked = false;
  return false;
}

const applyChainRewardV21 = applyChainRewardV16;
applyChainRewardV16 = function(mapId, stageData) {
  applyChainRewardV21(mapId, stageData);
  ensureV22State();
  if (stageData?.reward === 'bossRoom') {
    const progress = getBossTriggerProgressV22(mapId);
    const room = game.bossRooms[mapId];
    progress.primed = true;
    room.unlocked = false;
    const need = BOSS_TRIGGER_RULES_V22[mapId]?.elites || 0;
    addLog(`【${MAPS[mapId].name}】Boss 房线索已经确认，但还需要击败 ${need} 只精英怪才会完全开门。`, 'rare');
  }
};

const startBattleV21 = startBattle;
startBattle = function(monsterDef) {
  if (!monsterDef.sourceMapId) {
    monsterDef = JSON.parse(JSON.stringify(monsterDef));
    monsterDef.sourceMapId = game.currentMapId;
  }
  startBattleV21(monsterDef);
};

const handleBattleWinV21 = handleBattleWin;
handleBattleWin = function() {
  const enemySnapshot = battleState.enemy ? JSON.parse(JSON.stringify(battleState.enemy)) : null;
  handleBattleWinV21();
  ensureV22State();
  if (!enemySnapshot) return;

  const mapId = enemySnapshot.sourceMapId || game.currentMapId;
  if (enemySnapshot.isElite && !enemySnapshot.isBossRoom && BOSS_TRIGGER_RULES_V22[mapId]) {
    const progress = getBossTriggerProgressV22(mapId);
    progress.eliteKills += 1;
    const need = BOSS_TRIGGER_RULES_V22[mapId].elites;
    addLog(`【${MAPS[mapId].name}】Boss 房触发进度：精英击杀 ${progress.eliteKills}/${need}。`, 'good');
    refreshBossRoomUnlockV22(mapId);
  }
};

const advanceMapEventChainV21 = advanceMapEventChainV16;
advanceMapEventChainV16 = function(mapId) {
  advanceMapEventChainV21(mapId);
  ensureV22State();
  refreshBossRoomUnlockV22(mapId, true);
  renderMapPanels();
  updateUI();
};

const renderLogsV21 = renderLogs;
renderLogs = function() {
  renderLogsV21();
  const overview = document.getElementById('logPanelOverview');
  if (overview) {
    overview.innerHTML = game.logs.length
      ? game.logs.slice(0, 8).map((log) => `<div class="hero-log-item ${log.type || 'muted'}">${log.text}</div>`).join('')
      : `<div class="empty-text">这里还没有新的记录。先出去折腾两下，日志自然会自己长出来。</div>`;
  }
};

const renderMapPanelsV21 = renderMapPanels;
renderMapPanels = function() {
  ensureV22State();
  renderMapPanelsV21();

  const mapList = document.getElementById('mapList');
  if (mapList) {
    Array.from(mapList.children).forEach((card) => {
      const title = card.querySelector('h3');
      if (!title) return;
      const mapId = Object.keys(MAPS).find((id) => MAPS[id].name === title.textContent.trim());
      if (!mapId || !BOSS_TRIGGER_RULES_V22[mapId]) return;

      const progress = getBossTriggerProgressV22(mapId);
      const rule = BOSS_TRIGGER_RULES_V22[mapId];
      const room = game.bossRooms[mapId];
      const extra = document.createElement('div');
      extra.className = 'boss-rule-box';
      extra.innerHTML = `
        <b>Boss 房触发机制</b><br>
        先把事件链推进到第 ${rule.stage} 阶，再击败 ${rule.elites} 只精英怪。<br>
        当前进度：事件链 ${Math.min(getChainStateV16(mapId).stage, rule.stage)}/${rule.stage} ｜ 精英 ${progress.eliteKills}/${rule.elites} ｜ 房间状态 ${room.cleared ? '已通关' : room.unlocked ? '已开启' : progress.primed ? '待开门' : '未就绪'}
      `;
      card.appendChild(extra);
    });
  }

  const currentMap = getMapData();
  const bossPanel = document.getElementById('bossRoomPanel');
  if (bossPanel && BOSS_TRIGGER_RULES_V22[currentMap.id]) {
    const progress = getBossTriggerProgressV22(currentMap.id);
    const rule = BOSS_TRIGGER_RULES_V22[currentMap.id];
    const room = game.bossRooms[currentMap.id];
    const bossId = MAP_BOSS_V16[currentMap.id];
    const boss = MONSTERS[bossId];
    const stageNow = Math.min(getChainStateV16(currentMap.id).stage, rule.stage);

    bossPanel.innerHTML = `
      <div class="info-card boss-room-card">
        <div class="card-top">
          <div>
            <h3>${boss.name}</h3>
            <div class="rank">Boss 房间状态：${room.cleared ? '已通关' : room.unlocked ? '已开启' : progress.primed ? '待开门' : '未开启'}</div>
          </div>
        </div>
        <p>${boss.name} 不再是“事件一推完就能进”，现在要先把本图精英清一轮，门才会真正开。</p>
        <div class="boss-progress-grid">
          <div class="progress-note">事件链进度：${stageNow}/${rule.stage}</div>
          <div class="progress-note">精英清剿：${progress.eliteKills}/${rule.elites}</div>
          <div class="progress-note">当前要求：先推进事件，再清精英</div>
          <div class="progress-note">通关奖励：额外灵石、秘门残钥、隐藏地图线索</div>
        </div>
        <div class="card-actions">
          ${room.unlocked && !room.cleared ? `<button class="inline-btn" onclick="enterBossRoomV16('${currentMap.id}')">进入 Boss 房间</button>` : ''}
        </div>
      </div>
    `;
  }
};

const renderOverviewV21 = renderOverview;
renderOverview = function() {
  renderOverviewV21();
  const goalPanel = document.getElementById('goalPanel');
  if (goalPanel && !goalPanel.innerHTML.includes('Boss 房机制')) {
    const currentMap = getMapData();
    if (BOSS_TRIGGER_RULES_V22[currentMap.id]) {
      const progress = getBossTriggerProgressV22(currentMap.id);
      const rule = BOSS_TRIGGER_RULES_V22[currentMap.id];
      goalPanel.insertAdjacentHTML('beforeend', `<div class="tip-item"><b>Boss 房机制</b><small>${currentMap.name} 现在需要事件链推进到第 ${rule.stage} 阶，并额外击败 ${rule.elites} 只精英怪才会正式开门。当前精英进度：${progress.eliteKills}/${rule.elites}。</small></div>`);
    }
  }
};

function bootFromStorageV22() {
  const direct = localStorage.getItem(SAVE_KEY_V22);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    if (typeof ensureV18State === 'function') ensureV18State();
    if (typeof ensureV19State === 'function') ensureV19State();
    if (typeof ensureV20State === 'function') ensureV20State();
    ensureV21State();
    ensureV22State();
    handleOfflineGain();
    addLog('你从第二十二版存档中醒来。日志位置和 Boss 房开门规则都按新版整理好了。', 'rare');
    return true;
  }
  if (typeof bootFromStorageV21 === 'function' && bootFromStorageV21()) {
    ensureV22State();
    addLog('已从第二十一版存档迁入第二十二版。Boss 房触发规则已切到新版。', 'rare');
    return true;
  }
  return false;
}

const updateUIV21 = updateUI;
updateUI = function() {
  ensureV22State();
  updateUIV21();
  document.title = '凡尘问道录 · 第二十二版';
};

function saveGame() {
  ensureV22State();
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V22, JSON.stringify(game));
  addLog('第二十二版存档成功。日志布局和 Boss 房触发进度都会保留。', 'good');
}

function loadGame() {
  if (!bootFromStorageV22()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY_V22);
  const selectedStyle = (game && game.openingStyle) ? game.openingStyle : 'balanced';
  game = createNewGame({ openingStyle: selectedStyle });
  normalizeGame();
  if (typeof ensureV18State === 'function') ensureV18State();
  if (typeof ensureV19State === 'function') ensureV19State();
  if (typeof ensureV20State === 'function') ensureV20State();
  ensureV21State();
  ensureV22State();
  if (typeof applyOpeningStyleOnceV17 === 'function') applyOpeningStyleOnceV17(game);
  addLog(`新一世开启。第二十二版里，仙途日志已经挪到人物面板下，Boss 房也改成了明牌触发。`, 'rare');
  updateUI();
}

function initV22() {
  const hasSave = bootFromStorageV22();
  if (!hasSave) {
    game = createNewGame({ openingStyle: 'balanced' });
    normalizeGame();
    if (typeof ensureV18State === 'function') ensureV18State();
    if (typeof ensureV19State === 'function') ensureV19State();
    if (typeof ensureV20State === 'function') ensureV20State();
    ensureV21State();
    ensureV22State();
    if (typeof applyOpeningStyleOnceV17 === 'function') applyOpeningStyleOnceV17(game);
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第二十二版已开启：仙途日志挪到人物面板下，Boss 房触发也改成了更清晰的进度式开门。', 'muted');
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.saveGame = saveGame;
window.loadGame = loadGame;
window.resetGame = resetGame;
window.onload = initV22;
window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V22, JSON.stringify(game));
  }
});


/* ===== V23 integrated patch: 多怪遭遇 + 灵宠血条共战 + 平衡修正 ===== */
const SAVE_KEY_V23 = 'xiuxian_v23_save';

function ensureV23State() {
  ensureV22State();
  if (!battleState.enemies) battleState.enemies = [];
  if (!Number.isFinite(battleState.petHp)) battleState.petHp = 0;
  if (!Number.isFinite(battleState.petMaxHp)) battleState.petMaxHp = 0;
  if (typeof battleState.petAlive !== 'boolean') battleState.petAlive = false;
  game.version = 23;
}

function getCurrentEnemyV23() {
  const alive = (battleState.enemies || []).filter((e) => e.currentHp > 0);
  return alive[0] || null;
}
function syncCurrentEnemyV23() {
  const e = getCurrentEnemyV23();
  battleState.enemy = e;
  battleState.enemyHp = e ? e.currentHp : 0;
  return e;
}
function commitCurrentEnemyV23() {
  if (battleState.enemy) {
    battleState.enemy.currentHp = Math.max(0, battleState.enemyHp);
  }
}
function livingEnemyCountV23() {
  return (battleState.enemies || []).filter((e) => e.currentHp > 0).length;
}
function allEnemiesDeadV23() {
  return livingEnemyCountV23() === 0;
}

function getPetBattleStatsV23(id = game.activePet) {
  const pet = id ? PET_DEFS[id] : null;
  if (!pet) return null;
  const bond = getPetBond(id);
  const mult = getPetCombatMultiplier(id);
  const evo = getPetEvolution(id);
  return {
    id,
    name: pet.name,
    atk: Math.max(4, Math.floor((pet.atk * 3 + bond * 2 + game.realmIndex * 1.6) * mult + evo * 6)),
    def: Math.max(2, Math.floor((pet.def * 2.5 + Math.floor(bond * 1.5) + game.realmIndex * 1.1) * mult + evo * 4)),
    maxHp: Math.max(30, Math.floor((pet.hp * 6 + bond * 10 + game.realmIndex * 12) * mult + evo * 45))
  };
}
function isPetAliveV23() {
  return !!game.activePet && battleState.petAlive && battleState.petHp > 0;
}

function rollEncounterCountV23(mapId) {
  const rec = Number(MAPS[mapId]?.rec || 0);
  const r = Math.random();
  if (rec <= 4) {
    if (r < 0.50) return 1;
    if (r < 0.82) return 2;
    if (r < 0.95) return 3;
    return 4;
  }
  if (rec <= 10) {
    if (r < 0.34) return 1;
    if (r < 0.62) return 2;
    if (r < 0.84) return 3;
    if (r < 0.95) return 4;
    return 5;
  }
  if (rec <= 16) {
    if (r < 0.22) return 1;
    if (r < 0.46) return 2;
    if (r < 0.72) return 3;
    if (r < 0.90) return 4;
    return 5;
  }
  if (r < 0.14) return 1;
  if (r < 0.32) return 2;
  if (r < 0.58) return 3;
  if (r < 0.82) return 4;
  return 5;
}
function scaleEnemyForPackV23(enemy, count) {
  const hpMul = ({1:1,2:0.88,3:0.79,4:0.73,5:0.68})[count] || 1;
  const atkMul = ({1:1,2:0.95,3:0.90,4:0.86,5:0.82})[count] || 1;
  const defMul = ({1:1,2:0.97,3:0.93,4:0.90,5:0.88})[count] || 1;
  enemy.hp = Math.max(1, Math.floor(enemy.hp * hpMul));
  enemy.atk = Math.max(1, Math.floor(enemy.atk * atkMul));
  enemy.def = Math.max(0, Math.floor(enemy.def * defMul));
  return enemy;
}
function makeEncounterGroupV23(firstEnemy) {
  const mapId = firstEnemy.sourceMapId || game.currentMapId;
  const count = rollEncounterCountV23(mapId);
  const enemies = [JSON.parse(JSON.stringify(firstEnemy))];
  for (let i = 1; i < count; i += 1) {
    const extra = randomMonsterOnMap(mapId, false);
    extra.sourceMapId = mapId;
    enemies.push(JSON.parse(JSON.stringify(extra)));
  }
  return enemies.map((e) => {
    const scaled = scaleEnemyForPackV23(e, count);
    scaled.baseHp = scaled.hp;
    scaled.currentHp = scaled.hp;
    return scaled;
  });
}

const startBattleV22 = startBattle;
startBattle = function(monsterDef) {
  ensureV23State();
  if (battleState.active) {
    addLog('你已经在战斗里了，不能一边挨打一边再开新团。', 'warn');
    return;
  }

  const stats = calcPlayerStats();
  const petStats = getPetBattleStatsV23();
  const isSingle = !!monsterDef.isElite || !!monsterDef.isBossRoom;
  let enemies = [];

  if (monsterDef._encounterGroup && Array.isArray(monsterDef.enemies)) {
    enemies = monsterDef.enemies.map((e) => ({ ...e, baseHp: e.hp, currentHp: e.hp }));
  } else if (!isSingle) {
    const first = JSON.parse(JSON.stringify(monsterDef));
    first.sourceMapId = first.sourceMapId || game.currentMapId;
    enemies = makeEncounterGroupV23(first);
  } else {
    const single = JSON.parse(JSON.stringify(monsterDef));
    single.baseHp = single.hp;
    single.currentHp = single.hp;
    single.sourceMapId = single.sourceMapId || game.currentMapId;
    enemies = [single];
  }

  battleState.active = true;
  battleState.enemies = enemies;
  battleState.playerHp = clamp(game.life || stats.maxHp, 1, stats.maxHp);
  battleState.shield = 0;
  battleState.feed = [];
  battleState.petLootBonus = 0;
  resetSkillCooldowns();
  battleState.petSkillCd = 0;
  if (petStats) {
    battleState.petMaxHp = petStats.maxHp;
    battleState.petHp = petStats.maxHp;
    battleState.petAlive = true;
  } else {
    battleState.petMaxHp = 0;
    battleState.petHp = 0;
    battleState.petAlive = false;
  }

  syncCurrentEnemyV23();

  document.getElementById('battleStateText').textContent = '战斗中';
  const names = enemies.map((e) => e.name).join('、');
  addJournalMonster(enemies[0].name.replace('精英·',''));
  addLog(`你遭遇了 ${enemies.length} 只敌人：${names}。`, enemies.some((e) => e.isElite) ? 'rare' : 'danger');
  addCombatFeed(`你遭遇了 ${enemies.length} 只敌人：${names}。`);

  if (isPetAliveV23()) {
    const pet = getActivePet();
    if (pet.id === 'hawk') {
      const opening = Math.max(1, Math.floor((8 + stats.atk * 0.18) * getPetCombatMultiplier('hawk')));
      battleState.enemyHp = Math.max(0, battleState.enemyHp - opening);
      commitCurrentEnemyV23();
      addCombatFeed(`【雷纹隼】先手俯冲，开场打掉当前目标 ${opening} 点生命。`);
    }
    if (pet.id === 'turtle') {
      const shield = Math.floor((16 + stats.def * 1.2) * getPetCombatMultiplier('turtle'));
      battleState.shield += shield;
      addCombatFeed(`【玄甲龟】开场撑起护甲，为你提供 ${shield} 点护盾。`);
    }
  }

  renderCombatPanel();
  if (battleState.auto) startBattleLoop();
};

function petBasicAttackV23() {
  if (!isPetAliveV23()) return;
  const target = syncCurrentEnemyV23();
  const petStats = getPetBattleStatsV23();
  if (!target || !petStats) return;
  const dmg = Math.max(1, Math.floor(petStats.atk - target.def * 0.28 + Math.random() * 5));
  battleState.enemyHp = Math.max(0, battleState.enemyHp - dmg);
  commitCurrentEnemyV23();
  addCombatFeed(`【${petStats.name}】协同攻击，对【${target.name}】造成 ${dmg} 点伤害。`);
  animateHit('monsterHpBar');
}

const castPetSkillV22 = castPetSkill;
castPetSkill = function(fromAuto = false) {
  ensureV23State();
  if (!battleState.active || !livingEnemyCountV23()) {
    if (!fromAuto) addLog('当前没有可打的敌人，灵宠也暂时没有发挥空间。', 'warn');
    return;
  }
  if (!isPetAliveV23()) {
    if (!fromAuto) addLog('灵宠已经倒下，这场战斗里它只能先歇着。', 'warn');
    return;
  }
  syncCurrentEnemyV23();
  const beforeTarget = getCurrentEnemyV23();
  const pet = getActivePet();
  const skill = getPetSkillDef(pet.id);
  if (!skill) return;
  if (battleState.petSkillCd > 0) {
    if (!fromAuto) addLog(`【${skill.name}】还在冷却：${battleState.petSkillCd} 回合。`, 'warn');
    return;
  }
  const msg = skill.use();
  commitCurrentEnemyV23();
  battleState.petSkillCd = Math.max(1, skill.cd - Math.floor(getPetEvolution(pet.id) / 2));
  game.petSkillUse[pet.id] = getPetSkillUses(pet.id) + 1;
  addCombatFeed(msg);
  animateHit('monsterHpBar');

  if (allEnemiesDeadV23()) {
    handleBattleWin();
    return;
  }
  enemyActionIfAlive();
};

const autoBattleActionV22 = autoBattleAction;
autoBattleAction = function() {
  if (!battleState.active) return;
  if (battleState.playerHp < calcPlayerStats().maxHp * 0.45 && getInventoryAmount('healPill') > 0) {
    usePotion('healPill', true);
    enemyActionIfAlive();
    return;
  }
  if (isPetAliveV23() && battleState.petSkillCd === 0) {
    const pet = getActivePet();
    if (pet.id === 'turtle' && battleState.playerHp < calcPlayerStats().maxHp * 0.68) {
      castPetSkill(true);
      return;
    }
    if (pet.id !== 'turtle') {
      castPetSkill(true);
      return;
    }
  }
  if (battleState.skillCd.thunder === 0) {
    castSkill('thunder', true);
  } else if (battleState.skillCd.slash === 0) {
    castSkill('slash', true);
  } else {
    battleRound();
  }
};

battleRound = function() {
  if (!battleState.active || !livingEnemyCountV23()) return;
  const p = calcPlayerStats();
  const e = syncCurrentEnemyV23();
  if (!e) return;
  let pDmg = Math.max(1, Math.floor(p.atk - e.def * 0.55 + Math.random() * 8));
  let crit = false;
  if (Math.random() < p.crit) {
    pDmg = Math.floor(pDmg * 1.65);
    crit = true;
  }
  battleState.enemyHp = Math.max(0, battleState.enemyHp - pDmg);
  commitCurrentEnemyV23();
  addCombatFeed(`你对【${e.name}】造成 ${pDmg} 点伤害${crit ? '（暴击）' : ''}。`);
  animateHit('monsterHpBar');

  if (battleState.enemyHp <= 0 && allEnemiesDeadV23()) {
    handleBattleWin();
    return;
  }
  if (battleState.enemyHp > 0 || livingEnemyCountV23() > 0) {
    petBasicAttackV23();
  }
  if (allEnemiesDeadV23()) {
    handleBattleWin();
    return;
  }
  enemyActionIfAlive();
};

const castSkillV22 = castSkill;
castSkill = function(id, fromAuto = false) {
  if (!battleState.active || !livingEnemyCountV23()) return;
  const skill = SKILLS[id];
  if (!skill) return;
  if (battleState.skillCd[id] > 0) {
    if (!fromAuto) addLog(`【${skill.name}】还在冷却：${battleState.skillCd[id]} 回合。`, 'warn');
    return;
  }
  syncCurrentEnemyV23();
  const stats = calcPlayerStats();
  const msg = skill.use(battleState, stats);
  commitCurrentEnemyV23();
  addJournalSkill(skill.name);
  battleState.skillCd[id] = skill.cd;
  addCombatFeed(msg);
  animateHit('monsterHpBar');
  if (allEnemiesDeadV23()) {
    handleBattleWin();
    return;
  }
  enemyActionIfAlive();
};

enemyActionIfAlive = function() {
  const enemies = (battleState.enemies || []).filter((e) => e.currentHp > 0);
  if (!enemies.length) return;
  const p = calcPlayerStats();
  const petStats = getPetBattleStatsV23();

  for (const e of enemies) {
    let hitPet = isPetAliveV23() && Math.random() < 0.28;
    if (!isPetAliveV23()) hitPet = false;

    if (hitPet && petStats) {
      let eDmg = Math.max(1, Math.floor(e.atk - petStats.def * 0.36 + Math.random() * 6));
      battleState.petHp = Math.max(0, battleState.petHp - eDmg);
      addCombatFeed(`【${e.name}】转头攻击灵宠，打了【${petStats.name}】${eDmg} 点。`);
      if (battleState.petHp <= 0 && battleState.petAlive) {
        battleState.petAlive = false;
        addCombatFeed(`【${petStats.name}】倒下了，这场战斗里它先退到后面喘口气。`);
        addLog(`灵宠【${petStats.name}】在战斗中倒下，但自动战斗会继续执行。`, 'warn');
      }
    } else {
      let eDmg = Math.max(1, Math.floor(e.atk - p.def * 0.45 + Math.random() * 7));
      if (battleState.shield > 0) {
        const blocked = Math.min(battleState.shield, eDmg);
        eDmg -= blocked;
        battleState.shield -= blocked;
        addCombatFeed(`护盾替你挡掉 ${blocked} 点伤害。`);
      }
      battleState.playerHp = Math.max(0, battleState.playerHp - eDmg);
      addCombatFeed(`【${e.name}】反击，打了你 ${eDmg} 点。`);
    }

    if (battleState.playerHp <= 0) {
      handleBattleLose();
      return;
    }
  }

  tickSkillCd();
  animateHit('playerHpBar');
  renderCombatPanel();
};

const handleBattleWinV22 = handleBattleWin;
handleBattleWin = function() {
  ensureV23State();
  const enemies = (battleState.enemies || []).map((e) => ({ ...e }));
  const count = enemies.length || 1;
  const expMul = ({1:1,2:0.92,3:0.84,4:0.78,5:0.73})[count] || 1;
  const stoneMul = ({1:1,2:0.95,3:0.90,4:0.86,5:0.82})[count] || 1;

  let totalExp = 0;
  let totalStone = 0;
  let elites = 0;
  let extraItems = [];

  enemies.forEach((e) => {
    totalExp += Math.floor((e.exp || 0) * expMul);
    totalStone += Math.floor(((e.stone || 0) + Math.floor(Math.random() * 5)) * stoneMul);
    game.stats.killCount += 1;
    game.stats.battlesWon += 1;
    if (e.isElite) {
      elites += 1;
      game.stats.eliteKills += 1;
    }

    if (Math.random() < (e.dropChance || 0.55) * (count > 1 ? 0.88 : 1)) {
      const itemId = randomFrom(e.drops || ['spiritHerb']);
      const amount = 1 + (Math.random() < 0.20 ? 1 : 0);
      addItem(itemId, amount);
      extraItems.push(`${ITEM_DEFS[itemId].name} ×${amount}`);
    }
    if (Math.random() < (e.gearChance || 0.05) * (count > 1 ? 0.75 : 1) && e.gearPool?.length) {
      const gear = randomFrom(e.gearPool);
      addEquipment(gear);
      extraItems.push(`装备【${EQUIPMENT_DEFS[gear].name}】`);
    }

    if (Math.random() < (e.isElite ? 0.24 : 0.08)) {
      addItem('petCrystal', 1);
      extraItems.push('灵契晶 ×1');
    }

    if (e.isElite && !e.isBossRoom && BOSS_TRIGGER_RULES_V22[e.sourceMapId]) {
      const progress = getBossTriggerProgressV22(e.sourceMapId);
      progress.eliteKills += 1;
      refreshBossRoomUnlockV22(e.sourceMapId, false);
    }

    if (e.isBossRoom && e.sourceMapId) {
      const mapId = e.sourceMapId;
      game.bossRooms[mapId].cleared = true;
      game.bossRooms[mapId].wins += 1;
      game.stats.bossRoomWins += 1;
      addItem('secretKey', 1);
      if (e.unlockHiddenMapId) unlockHiddenMapV16(e.unlockHiddenMapId);
    }
  });

  gainExp(totalExp, '打怪');
  game.stone += totalStone;

  const lootBonus = battleState.petLootBonus || 0;
  if (lootBonus > 0 && game.activePet) {
    const extraStone = Math.max(1, Math.floor(lootBonus * 80 * (count * 0.8)));
    game.stone += extraStone;
    addLog(`【${PET_DEFS[game.activePet].name}】顺手额外搜刮到 ${extraStone} 灵石。`, 'good');
    if (enemies[0] && Math.random() < Math.min(0.5, lootBonus + 0.08)) {
      const pool = enemies.flatMap((e) => e.drops || []);
      const itemId = randomFrom(pool.length ? pool : ['spiritHerb']);
      addItem(itemId, 1);
      extraItems.push(`${ITEM_DEFS[itemId].name} ×1（灵宠带回）`);
    }
  }

  addCombatFeed(`你击败了这波敌群！修为 +${totalExp}，灵石 +${totalStone}。`);
  addLog(`你击败了 ${count} 只敌人，修为 +${totalExp}，灵石 +${totalStone}。`, elites > 0 ? 'rare' : 'good');
  if (extraItems.length) {
    addCombatFeed(`额外收获：${extraItems.join('、')}`);
    addLog(`额外收获：${extraItems.join('、')}。`, 'rare');
  }

  stopBattle('win');
};

const handleBattleLoseV22 = handleBattleLose;
handleBattleLose = function() {
  battleState.petAlive = false;
  handleBattleLoseV22();
};

const stopBattleV22 = stopBattle;
stopBattle = function(result = 'end') {
  battleState.enemies = [];
  battleState.petHp = 0;
  battleState.petMaxHp = 0;
  battleState.petAlive = false;
  stopBattleV22(result);
};

const renderCombatPanelV22 = renderCombatPanel;
renderCombatPanel = function() {
  ensureV23State();
  syncCurrentEnemyV23();
  renderCombatPanelV22();

  const petCard = document.getElementById('petCombatCard');
  const pet = getActivePet();
  const petStats = getPetBattleStatsV23();
  if (petCard && pet && petStats && battleState.active) {
    petCard.style.display = '';
    document.getElementById('petBattleName').textContent = petStats.name;
    document.getElementById('petBattleStats').textContent = `攻 ${petStats.atk} / 防 ${petStats.def}`;
    document.getElementById('petHpBar').style.width = `${Math.max(0, Math.min(100, (battleState.petHp / Math.max(1, battleState.petMaxHp)) * 100))}%`;
    document.getElementById('petHpText').textContent = `${Math.max(0, Math.floor(battleState.petHp))} / ${battleState.petMaxHp}${battleState.petAlive ? '' : ' · 已倒下'}`;
  } else if (petCard) {
    if (pet) {
      petCard.style.display = '';
      document.getElementById('petBattleName').textContent = PET_DEFS[pet.id].name;
      document.getElementById('petBattleStats').textContent = '待命';
      document.getElementById('petHpBar').style.width = '0%';
      document.getElementById('petHpText').textContent = '未进入战斗';
    } else {
      petCard.style.display = '';
      document.getElementById('petBattleName').textContent = '灵宠未出战';
      document.getElementById('petBattleStats').textContent = '待命';
      document.getElementById('petHpBar').style.width = '0%';
      document.getElementById('petHpText').textContent = '当前没有跟随灵宠';
    }
  }

  const alive = livingEnemyCountV23();
  const total = (battleState.enemies || []).length;
  const current = getCurrentEnemyV23();
  if (battleState.active && current) {
    document.getElementById('monsterBattleName').textContent = `${current.name}${total > 1 ? `（剩余 ${alive}/${total}）` : ''}`;
    document.getElementById('monsterBattleStats').textContent = `攻 ${current.atk} / 防 ${current.def}`;
    document.getElementById('monsterHpBar').style.width = `${Math.max(0, Math.min(100, (current.currentHp / current.baseHp) * 100))}%`;
    document.getElementById('monsterHpText').textContent = `${Math.floor(current.currentHp)} / ${current.baseHp}`;
  }

  const groupList = document.getElementById('enemyGroupList');
  if (groupList) {
    if (battleState.active && total > 1) {
      groupList.innerHTML = (battleState.enemies || []).map((e, idx) => {
        const target = current && e === current;
        return `<div class="enemy-chip ${target ? 'target' : ''} ${e.currentHp <= 0 ? 'dead' : ''}">${e.name} · ${Math.max(0, Math.floor(e.currentHp))}/${e.baseHp}</div>`;
      }).join('');
    } else if (battleState.active && current) {
      groupList.innerHTML = `<div class="enemy-chip target">${current.name} · ${Math.max(0, Math.floor(current.currentHp))}/${current.baseHp}</div>`;
    } else {
      groupList.innerHTML = '';
    }
  }

  const petBtn = document.getElementById('petSkillText');
  if (petBtn) {
    if (!pet) {
      petBtn.textContent = '灵宠技：未跟随';
    } else if (!isPetAliveV23() && battleState.active) {
      petBtn.textContent = '灵宠技：已倒下';
    } else {
      const skill = getPetSkillDef(pet.id);
      petBtn.textContent = skill ? `灵宠技：${skill.name}${battleState.petSkillCd > 0 ? `(${battleState.petSkillCd})` : ''}` : '灵宠技：暂无';
    }
  }
};

const renderOverviewV22 = renderOverview;
renderOverview = function() {
  renderOverviewV22();
  const goalPanel = document.getElementById('goalPanel');
  if (goalPanel && !goalPanel.innerHTML.includes('多怪遭遇')) {
    goalPanel.insertAdjacentHTML('beforeend', `<div class="tip-item"><b>多怪遭遇</b><small>普通遭遇现在不一定只来一只，可能会同时来 2 到 5 只。灵宠也会有独立血条一起作战，所以后期不再是你一个人单刷整片地图。</small></div>`);
  }
};

function bootFromStorageV23() {
  const direct = localStorage.getItem(SAVE_KEY_V23);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    if (typeof ensureV18State === 'function') ensureV18State();
    if (typeof ensureV19State === 'function') ensureV19State();
    if (typeof ensureV20State === 'function') ensureV20State();
    ensureV21State();
    ensureV22State();
    ensureV23State();
    handleOfflineGain();
    addLog('你从第二十三版存档中醒来。多怪遭遇、灵宠血条共战和平衡调整都已接入。', 'rare');
    return true;
  }
  if (typeof bootFromStorageV22 === 'function' && bootFromStorageV22()) {
    ensureV23State();
    addLog('已从第二十二版存档迁入第二十三版。群怪战和灵宠共战会按新版逻辑运行。', 'rare');
    return true;
  }
  return false;
}

const updateUIV22 = updateUI;
updateUI = function() {
  ensureV23State();
  updateUIV22();
  document.title = '凡尘问道录 · 第二十三版';
};

function saveGame() {
  ensureV23State();
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V23, JSON.stringify(game));
  addLog('第二十三版存档成功。多怪战、灵宠血条和新平衡都会一起保留。', 'good');
}

function loadGame() {
  if (!bootFromStorageV23()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY_V23);
  const selectedStyle = (game && game.openingStyle) ? game.openingStyle : 'balanced';
  game = createNewGame({ openingStyle: selectedStyle });
  normalizeGame();
  if (typeof ensureV18State === 'function') ensureV18State();
  if (typeof ensureV19State === 'function') ensureV19State();
  if (typeof ensureV20State === 'function') ensureV20State();
  ensureV21State();
  ensureV22State();
  ensureV23State();
  if (typeof applyOpeningStyleOnceV17 === 'function') applyOpeningStyleOnceV17(game);
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。这次普通遭遇会更热闹，灵宠也会真正一起挨打。`, 'rare');
  updateUI();
}

function initV23() {
  const hasSave = bootFromStorageV23();
  if (!hasSave) {
    game = createNewGame({ openingStyle: 'balanced' });
    normalizeGame();
    if (typeof ensureV18State === 'function') ensureV18State();
    if (typeof ensureV19State === 'function') ensureV19State();
    if (typeof ensureV20State === 'function') ensureV20State();
    ensureV21State();
    ensureV22State();
    ensureV23State();
    if (typeof applyOpeningStyleOnceV17 === 'function') applyOpeningStyleOnceV17(game);
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第二十三版已开启：普通遭遇改成多怪同场，灵宠会带血条一起战斗，战斗数值也重新压过了一轮。', 'muted');
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.castPetSkill = castPetSkill;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.resetGame = resetGame;
window.onload = initV23;
window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V23, JSON.stringify(game));
  }
});


/* ===== V24 Day / Night Mode ===== */
const SAVE_KEY_V24 = 'xiuxian_v24_save';
const THEME_KEY_V24 = 'xiuxian_theme_v24';

function getStoredThemeV24() {
  try {
    return localStorage.getItem(THEME_KEY_V24) || 'dark';
  } catch (e) {
    return 'dark';
  }
}

function applyThemeV24(theme = 'dark') {
  const body = document.body;
  if (!body) return;
  const normalized = theme === 'light' ? 'light' : 'dark';
  body.classList.toggle('theme-light', normalized === 'light');
  body.classList.toggle('theme-dark', normalized === 'dark');
  try {
    localStorage.setItem(THEME_KEY_V24, normalized);
  } catch (e) {}
  const btn = document.getElementById('themeToggleText');
  if (btn) btn.textContent = normalized === 'light' ? '白天模式' : '夜间模式';
}

function toggleThemeV24() {
  const next = document.body.classList.contains('theme-light') ? 'dark' : 'light';
  applyThemeV24(next);
  addLog(`界面已切换为${next === 'light' ? '白天' : '夜间'}模式。`, 'good');
}

function bootFromStorageV24() {
  const direct = localStorage.getItem(SAVE_KEY_V24);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    if (typeof ensureV18State === 'function') ensureV18State();
    if (typeof ensureV19State === 'function') ensureV19State();
    if (typeof ensureV20State === 'function') ensureV20State();
    if (typeof ensureV21State === 'function') ensureV21State();
    if (typeof ensureV22State === 'function') ensureV22State();
    if (typeof ensureV23State === 'function') ensureV23State();
    handleOfflineGain();
    addLog('你从第二十四版存档中醒来。白天 / 夜间模式切换已就位。', 'rare');
    return true;
  }
  if (typeof bootFromStorageV23 === 'function' && bootFromStorageV23()) {
    addLog('已从第二十三版存档迁入第二十四版。界面新增白天 / 夜间模式。', 'rare');
    return true;
  }
  return false;
}

const updateUIV23 = updateUI;
updateUI = function() {
  updateUIV23();
  document.title = '凡尘问道录 · 第二十四版';
  applyThemeV24(getStoredThemeV24());
};

function saveGame() {
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V24, JSON.stringify(game));
  addLog('第二十四版存档成功。当前界面模式也会一起记住。', 'good');
}

function loadGame() {
  if (!bootFromStorageV24()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY_V24);
  const selectedStyle = (game && game.openingStyle) ? game.openingStyle : 'balanced';
  game = createNewGame({ openingStyle: selectedStyle });
  normalizeGame();
  if (typeof ensureV18State === 'function') ensureV18State();
  if (typeof ensureV19State === 'function') ensureV19State();
  if (typeof ensureV20State === 'function') ensureV20State();
  if (typeof ensureV21State === 'function') ensureV21State();
  if (typeof ensureV22State === 'function') ensureV22State();
  if (typeof ensureV23State === 'function') ensureV23State();
  if (typeof applyOpeningStyleOnceV17 === 'function') applyOpeningStyleOnceV17(game);
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。这次界面支持白天和夜间模式切换。`, 'rare');
  updateUI();
}

function initV24() {
  applyThemeV24(getStoredThemeV24());
  const hasSave = bootFromStorageV24();
  if (!hasSave) {
    game = createNewGame({ openingStyle: 'balanced' });
    normalizeGame();
    if (typeof ensureV18State === 'function') ensureV18State();
    if (typeof ensureV19State === 'function') ensureV19State();
    if (typeof ensureV20State === 'function') ensureV20State();
    if (typeof ensureV21State === 'function') ensureV21State();
    if (typeof ensureV22State === 'function') ensureV22State();
    if (typeof ensureV23State === 'function') ensureV23State();
    if (typeof applyOpeningStyleOnceV17 === 'function') applyOpeningStyleOnceV17(game);
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第二十四版已开启：UI 新增白天和夜间模式。', 'muted');
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.toggleThemeV24 = toggleThemeV24;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.resetGame = resetGame;
window.onload = initV24;
window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V24, JSON.stringify(game));
  }
});




/* ===== 第二十五版：轮回印与高阶突破改版 ===== */
const SAVE_KEY_V25 = 'xiuxian_v25_save';
const HUASHEN_REALM_INDEX_V25 = 19;

// 把原来的“悟性”改成纯成长向，不再提供永久突破率
if (typeof REBIRTH_TALENTS_V17 !== 'undefined' && REBIRTH_TALENTS_V17.insight) {
  REBIRTH_TALENTS_V17.insight.name = '道心';
  REBIRTH_TALENTS_V17.insight.desc = '永久提高少量攻击与生命。突破率改为临时轮回印注入。';
}

const createNewGameV24 = createNewGame;
createNewGame = function(meta = {}) {
  const g = createNewGameV24(meta);
  g.breakthroughMarkInvest = Number(meta.breakthroughMarkInvest) || 0;
  g.version = 25;
  return g;
};

function ensureV25State() {
  if (!game || typeof game !== 'object') return;
  if (!Number.isFinite(game.breakthroughMarkInvest)) game.breakthroughMarkInvest = 0;
  game.version = 25;
}

// 固定轮回印规则：修到化神及以上，每次轮回只给 1 枚
calculateRebirthGain = function() {
  return game.realmIndex >= HUASHEN_REALM_INDEX_V25 ? 1 : 0;
};

const getSpentSoulMarksV24 = getSpentSoulMarksV17;
getSpentSoulMarksV17 = function() {
  ensureV25State();
  return getSpentSoulMarksV24() + (game.breakthroughMarkInvest || 0);
};

const getPermanentBonusV24 = getPermanentBonusV17;
getPermanentBonusV17 = function() {
  ensureV25State();
  const base = getPermanentBonusV24();
  // 永久突破率归零，改成临时突破印；给 insight 一点基础属性，避免这个天赋变废
  const insightLv = getTalentLevelV17 ? getTalentLevelV17('insight') : 0;
  base.breakBonus = 0;
  base.atk += insightLv * 2;
  base.hp += insightLv * 10;
  return base;
};

function investBreakthroughMarksV25(amount = 1) {
  ensureV25State();
  if (game.realmIndex < HUASHEN_REALM_INDEX_V25) {
    addLog('化神之前的突破暂时不吃轮回印加成。先把境界顶上去。', 'warn');
    return;
  }
  const available = getAvailableSoulMarksV17();
  if (available < amount) {
    addLog(`可用轮回印不足，当前只剩 ${available}。`, 'warn');
    return;
  }
  game.breakthroughMarkInvest += amount;
  addLog(`你向下一次突破注入了 ${amount} 枚轮回印。失败会清空这部分加成，而且印会直接消耗。`, 'rare');
  updateUI();
}
function clearBreakthroughMarksV25() {
  ensureV25State();
  if (game.breakthroughMarkInvest <= 0) {
    addLog('当前没有待注入的突破轮回印。', 'muted');
    return;
  }
  game.breakthroughMarkInvest = 0;
  addLog('你撤回了本次突破预留的轮回印。它们重新回到可分配状态。', 'good');
  updateUI();
}

const breakthroughV24 = breakthrough;
breakthrough = function() {
  const realm = getRealm();
  if (game.realmIndex >= REALMS.length - 1) {
    addLog('你已经摸到当前版本上限了，再往上修得等下一个大版本。', 'warn');
    return;
  }
  if (game.exp < realm.need) {
    addLog(`修为不足，突破 ${realm.key} 还差 ${realm.need - Math.floor(game.exp)}。`, 'warn');
    return;
  }

  const stats = calcPlayerStats();
  let rate = 0.55 + game.rootBonus * 0.08 + stats.breakBonus / 100;

  if (game.realmIndex >= 9) rate -= 0.05;
  if (game.realmIndex >= 13) rate -= 0.08;

  // 化神之后难度明显提高
  if (game.realmIndex >= 19) rate -= 0.14;
  if (game.realmIndex >= 20) rate -= 0.05;
  if (game.realmIndex >= 23) rate -= 0.07;
  if (game.realmIndex >= 26) rate -= 0.08;

  const invest = game.breakthroughMarkInvest || 0;
  const tempBonus = game.realmIndex >= HUASHEN_REALM_INDEX_V25 ? invest * 0.08 : 0;
  rate += tempBonus;
  rate = clamp(rate, 0.08, 0.88);

  const investedNow = invest;
  const tempPct = Math.round(tempBonus * 100);

  if (Math.random() < rate) {
    game.realmIndex += 1;
    game.exp = 0;
    game.breakthroughBonus = 0;
    if (investedNow > 0) {
      game.soulMarks = Math.max(0, game.soulMarks - investedNow);
      game.breakthroughMarkInvest = 0;
      addLog(`突破成功！你踏入【${getRealm().key}】。本次注入的 ${investedNow} 枚轮回印已消耗。`, 'rare');
    } else {
      addLog(`突破成功！你踏入【${getRealm().key}】。人还是这个人，气场已经不是了。`, 'rare');
    }
  } else {
    const loseRatio = game.realmIndex >= HUASHEN_REALM_INDEX_V25 ? 0.32 : 0.22;
    const lose = Math.floor(realm.need * loseRatio);
    game.exp = Math.max(0, game.exp - lose);
    if (investedNow > 0) {
      game.soulMarks = Math.max(0, game.soulMarks - investedNow);
      game.breakthroughMarkInvest = 0;
      addLog(`突破失败，修为回落 ${lose}。临时突破率 +${tempPct}% 已重置，你得重新积攒轮回印。`, 'danger');
    } else {
      addLog(`突破失败，修为回落 ${lose}。化神之后的坎确实更硬。`, 'danger');
    }
  }
  updateUI();
};

const renderRebirthV24 = renderRebirth;
renderRebirth = function() {
  renderRebirthV24();
  ensureV25State();
  const panel = document.getElementById('rebirthPanel');
  if (!panel) return;

  const gain = calculateRebirthGain();
  const afterHuashen = game.realmIndex >= HUASHEN_REALM_INDEX_V25;
  const tempPct = (game.breakthroughMarkInvest || 0) * 8;

  panel.insertAdjacentHTML('afterbegin', `
    <div class="info-card breakthrough-mark-box">
      <div class="card-top">
        <div>
          <h3>轮回印规则调整</h3>
          <div class="rank">化神及以上每次轮回固定获得 1 枚轮回印</div>
        </div>
        <span class="tiny-tag gold">${gain > 0 ? '本次可得 1 枚' : '未到化神，不得印'}</span>
      </div>
      <p>轮回印现在更稀缺。它们仍然能用于永久成长，也能临时注入下一次高阶突破。化神之后突破难很多，临时突破率失败会清空并直接消耗这部分印。</p>
      <div class="small-grid">
        <div class="meta-chip">当前轮回印：${game.soulMarks}</div>
        <div class="meta-chip">可分配：${getAvailableSoulMarksV17()}</div>
        <div class="meta-chip">临时突破印：${game.breakthroughMarkInvest}</div>
        <div class="meta-chip">临时突破率：+${tempPct}%</div>
      </div>
      <div class="card-actions">
        <button class="inline-btn" onclick="investBreakthroughMarksV25()">注入 1 枚</button>
        <button class="inline-btn" onclick="clearBreakthroughMarksV25()">撤回注入</button>
      </div>
      <p class="note-line">${afterHuashen ? '你已到化神及以上，这个机制现在生效。' : '化神之前先安心修，不必急着把轮回印砸进突破。'}</p>
    </div>
  `);
};

const renderOverviewV24 = renderOverview;
renderOverview = function() {
  renderOverviewV24();
  ensureV25State();
  const goalPanel = document.getElementById('goalPanel');
  if (!goalPanel || goalPanel.innerHTML.includes('轮回印新规')) return;
  goalPanel.insertAdjacentHTML('beforeend', `<div class="tip-item"><b>轮回印新规</b><small>现在修到化神及以上每次轮回只给 1 枚轮回印。化神后的突破更难，可临时注入轮回印提升突破率，但失败会清空并消耗这部分印。</small></div>`);
};

function bootFromStorageV25() {
  const direct = localStorage.getItem(SAVE_KEY_V25);
  if (direct) {
    game = JSON.parse(direct);
    normalizeGame();
    ensureV25State();
    handleOfflineGain();
    addLog('你从第二十五版存档中醒来。轮回印和高阶突破规则已切到新版。', 'rare');
    return true;
  }
  if (typeof bootFromStorageV20 === 'function' && bootFromStorageV20()) {
    ensureV25State();
    addLog('已从旧存档迁入第二十五版。轮回印现在更稀缺，化神后的突破也更硬了。', 'rare');
    return true;
  }
  return false;
}

const updateUIV24 = updateUI;
updateUI = function() {
  ensureV25State();
  updateUIV24();
  document.title = '凡尘问道录 · 第二十五版';
};

function saveGame() {
  ensureV25State();
  game.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY_V25, JSON.stringify(game));
  addLog('第二十五版存档成功。轮回印分配和突破注入进度都会被保留。', 'good');
}
function loadGame() {
  if (!bootFromStorageV25()) {
    addLog('没有找到可读取的存档。', 'warn');
    return;
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
}
function resetGame() {
  localStorage.removeItem(SAVE_KEY_V25);
  const selectedStyle = (game && game.openingStyle) ? game.openingStyle : 'balanced';
  game = createNewGame({ openingStyle: selectedStyle });
  normalizeGame();
  ensureV25State();
  if (typeof applyOpeningStyleOnceV17 === 'function') applyOpeningStyleOnceV17(game);
  addLog(`新一世开启，你觉醒灵根：${game.rootName}。第二十五版里，轮回印会更难攒，也更值钱。`, 'rare');
  updateUI();
}
function initV25() {
  const hasSave = bootFromStorageV25();
  if (!hasSave) {
    game = createNewGame({ openingStyle: 'balanced' });
    normalizeGame();
    ensureV25State();
    if (typeof applyOpeningStyleOnceV17 === 'function') applyOpeningStyleOnceV17(game);
    addLog(`你于尘世中醒来，觉醒灵根：${game.rootName}。`, 'rare');
    addLog('第二十五版已开启：化神及以上每次轮回固定 1 枚轮回印，化神后的突破也变得更难了。', 'muted');
  }
  autoEquipBest(false);
  renderCombatPanel();
  updateUI();
  if (!gameTimer) gameTimer = setInterval(gameTick, 1000);
}

window.investBreakthroughMarksV25 = investBreakthroughMarksV25;
window.clearBreakthroughMarksV25 = clearBreakthroughMarksV25;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.resetGame = resetGame;
window.onload = initV25;
window.addEventListener('beforeunload', () => {
  if (game && Object.keys(game).length) {
    game.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY_V25, JSON.stringify(game));
  }
});
