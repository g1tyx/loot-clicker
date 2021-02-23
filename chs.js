/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Comming soon...': '敬请期待...',
    'Crit DMG': '暴击伤害',
    'Crit Chance: +': '暴击率: +',
    'EXP Boost': '经验提升',
    'EXP Buff': '经验增益',
    'Upgrade': '升级',
    'Utility': '通用的',
    'Challenge': '挑战',
    'Loot': '战利品',
    'Shop': '商店',
    'Field': '田野',
    'Setting': '设置',
    'Click': '点击',
    'Export Game': '导出存档',
    'Click)': '点击)',
    'Dmg': '伤害',
    'DMG Boost': '伤害提升',
    'Total Play Time': '累计游戏时间',
    'Total Status': '总状态',
    'Unlock meta world': '解锁元世界',
    'Mastery': '精通',
    'Level': '等级',
    'Hit/s': '击中/秒',
    'token': '令牌',
    'Overall Boost': '整体提高',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    'Tokens can also be obtained by Auto Click': '也可以通过自动点击获得令牌',
    'Token click upgrade applies to automatic clicks, too': '令牌点击升级也适用于自动点击',
    'Token boost obtained with timer based on Level': '基于级别的计时器获得令牌提升',
    'Toggle display tickrate at Status': '切换状态显示的滴答声',
    'Exp boost based on Transcesion Point': '经验提升鲫鱼超越点',
    'Go to meta world!': '进入元世界！',
    'Make some Skill stronger': '使一些技能更强',
    'Enable Low Detail Mod': '启用低细节模式',
    'Dmg boost based on Otherworldy count': '根据异界计数增加伤害',
    'EXP Bottle -': '经验瓶 -',
    'Increase Max Level': '提高最大等级',
    'Inventory': '库存',
    'Lv.': '等级.',
    'Lv': '等级',
    'Import Game': '导入存档',
    'Skill Price -': '技能价格 -',
    'Slime Loot -': '史莱姆战利品 - ',
    'Token Shop': '令牌商店',
    'Low Detail Mod': '低细节模式',
    'Click bought auto to toggle': '点击购买自动切换',
    'Change Notation': '改变符号',
    'Chance to get double loot when defeating a monster': '有机会在打败怪物时获得双倍的战利品',
    'Chance to Discover Mysterious Chest': '发现神秘箱子的几率',
    'Chance to Discover Artifact': '发现藏物的几率',

    //原样
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    "Slime (hp: ": "史莱姆 (生命值",
    "Surprised Slime (hp: ": "惊奇史莱姆 (生命值",
    "Weapon ": "武器 ",
    "Auto": "自动",
    "Auto ": "自动",
    "Monster Kill Stat": "怪物击杀统计",
    "Tick rate: ": "Tick率:",
    "Token (": "令牌 (",
    "Token Boost (": "令牌提升 (",
    "Sword ": "剑 ",
    "Shiny ": "闪光 ",
    "Token Upgrade (": "令牌升级 (",
    "Reset Game (": "重置游戏 (",
    "Player Level (": "玩家等级 (",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    " ": "",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    "\n": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^x?\d+(\.\d+)?[A-Za-z%]{0,2}(\s.C)?\s*$/, //12.34K,23.4 °C
    /^x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /^\s*$/, //纯空格
    /^([\d\.]+) \/$/, //纯空格
    /^\d+(\.\d+)?[A-Za-z]{0,2}.?\(?([+\-]?(\d+(\.\d+)?[A-Za-z]{0,2})?)?$/, //12.34M (+34.34K
    /^(\d+(\.\d+)?[A-Za-z]{0,2}\/s)?.?\(?([+\-]?\d+(\.\d+)?[A-Za-z]{0,2})?\/s\stot$/, //2.74M/s (112.4K/s tot
    /^\d+(\.\d+)?(e[+\-]?\d+)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?$/, //2.177e+6 (+4.01+4
    /^(\d+(\.\d+)?(e[+\-]?\d+)?\/s)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?\/s\stot$/, //2.177e+6/s (+4.01+4/s tot
];
var cnExcludePostfix = [
    /:?\s*x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /:?\s*x?\d+(\.\d+)?[A-Za-z]{0,2}$/, //: 12.34K, x1.5
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^You Have (.+) Transcension Point$/, '你有 $1 超越点'],
    [/^You Have (.+) Skill Point$/, '你有 $1 技能点'],
    [/^You Have (.+) Tokens$/, '你有 $1 令牌'],
    [/^Monster Lv(.+) \((.+)\/$/, '怪物等级 $1 \($2\/'],
    [/^Buy \((.+)  Token$/, '购买 \($1 令牌'],
    [/^Buy \((.+) token$/, '购买 \($1 令牌'],
    [/^Cost: (\d+) RP$/, '成本：$1 皇家点数'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);