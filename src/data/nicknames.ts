export interface NickMorphemes {
  prefixes: string[];
  cores: string[];
  suffixes: string[];
}

export interface NickPhraseParts {
  adjectives: string[];
  animals: string[];
  suffixes: string[];
}

export const nickMorphemesLatin: NickMorphemes = {
  prefixes: [
    'neo',
    'dark',
    'night',
    'frost',
    'wild',
    'silver',
    'luna',
    'nord',
    'void',
    'grim',
    'urban',
    'wolf',
    'lycan'
  ],
  cores: [
    'fen',
    'lup',
    'varg',
    'howl',
    'shade',
    'rune',
    'drift',
    'dusk',
    'ember',
    'byte',
    'glitch',
    'sova',
    'volk',
    'zver'
  ],
  suffixes: ['ix', 'ax', 'on', 'or', 'ur', 'ar', 'io', 'ne', 'sk', 'zen', 'ly', 'ro', 'rin', 'tor', 'nik']
}

export const nickMorphemesCyrillic: NickMorphemes = {
  prefixes: ['нео', 'серо', 'лун', 'норд', 'тень', 'дикий', 'сталь', 'мороз'],
  cores: ['волк', 'клык', 'след', 'вой', 'мрак', 'лес', 'ночь', 'дым', 'звер'],
  suffixes: ['икс', 'ар', 'ор', 'ен', 'рин', 'тор', 'ник', 'лис']
}

export const nickPhraseParts: NickPhraseParts = {
  adjectives: [
    'серый',
    'ночной',
    'лунный',
    'лесной',
    'дикий',
    'стальной',
    'морозный',
    'туманный',
    'северный',
    'теневой'
  ],
  animals: [
    'волк',
    'рысь',
    'ворон',
    'сокол',
    'лисица',
    'медведь',
    'зверь',
    'шакал',
    'барс',
    'койот'
  ],
  suffixes: ['', '', 'XL', 'Prime', 'Zero', 'Spirit', 'Rogue', 'Edge', 'Shadow', 'Nova', 'Core', 'Rush', 'Hunt', 'Night', 'One']
}
