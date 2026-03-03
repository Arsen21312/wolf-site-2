export type ScaleType = 'stress' | 'impulse' | 'social' | 'control';

export interface Question {
  id: number;
  text: string;
  scale: ScaleType;
}

export const questions: Question[] = [
  // Стрессоустойчивость (1-6)
  { id: 1, text: "Я легко справляюсь с неожиданными изменениями в планах", scale: 'stress' },
  { id: 2, text: "В критических ситуациях я сохраняю ясность мышления", scale: 'stress' },
  { id: 3, text: "Давление и дедлайны мотивируют меня, а не парализуют", scale: 'stress' },
  { id: 4, text: "После стрессовых событий я быстро восстанавливаюсь", scale: 'stress' },
  { id: 5, text: "Я могу принимать решения в условиях неопределённости", scale: 'stress' },
  { id: 6, text: "Критика и неудачи делают меня сильнее, а не подавляют", scale: 'stress' },
  
  // Импульсивность (7-12)
  { id: 7, text: "Я часто действую под влиянием момента, не обдумывая последствия", scale: 'impulse' },
  { id: 8, text: "Мне сложно дождаться чего-то важного, хочется всего сразу", scale: 'impulse' },
  { id: 9, text: "Я легко отвлекаюсь на новые идеи и бросаю начатое", scale: 'impulse' },
  { id: 10, text: "Мои эмоции управляют моими решениями", scale: 'impulse' },
  { id: 11, text: "Я совершаю покупки спонтанно, не планируя заранее", scale: 'impulse' },
  { id: 12, text: "Я говорю то, что думаю, не фильтруя свои слова", scale: 'impulse' },
  
  // Социальная энергия (13-18)
  { id: 13, text: "Я получаю энергию от общения с людьми", scale: 'social' },
  { id: 14, text: "Мне комфортно быть в центре внимания", scale: 'social' },
  { id: 15, text: "Я легко завожу новые знакомства", scale: 'social' },
  { id: 16, text: "Одиночество быстро истощает меня", scale: 'social' },
  { id: 17, text: "Я предпочитаю работать в команде, а не в одиночку", scale: 'social' },
  { id: 18, text: "После общения с людьми я чувствую прилив сил", scale: 'social' },
  
  // Самоконтроль (19-24)
  { id: 19, text: "Я всегда выполняю обещания, которые даю себе и другим", scale: 'control' },
  { id: 20, text: "Мне легко отказаться от сиюминутных удовольствий ради долгосрочных целей", scale: 'control' },
  { id: 21, text: "Я контролирую свои эмоциональные реакции в конфликтах", scale: 'control' },
  { id: 22, text: "Я придерживаюсь плана даже когда это сложно", scale: 'control' },
  { id: 23, text: "Я не откладываю важные дела на потом", scale: 'control' },
  { id: 24, text: "Мне легко удерживаться от вредных привычек и соблазнов", scale: 'control' },
];

export interface PersonalityType {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export const personalityTypes: Record<string, PersonalityType> = {
  calm_alpha: {
    id: 'calm_alpha',
    name: 'Спокойный альфа',
    emoji: '🐺',
    description: 'Ты — воплощение уверенности и стабильности. В хаосе ты находишь порядок, в кризисе — решение. Твоя сила не в агрессии, а в способности контролировать себя и ситуацию. Люди тянутся к тебе за опорой и мудростью. Ты не боишься одиночества, но знаешь ценность стаи.',
  },
  chaos_predator: {
    id: 'chaos_predator',
    name: 'Хищник хаоса',
    emoji: '⚡',
    description: 'Ты живёшь на пике эмоций и адреналина. Спонтанность — твоё оружие, непредсказуемость — твоя суперсила. Ты зажигаешь толпу, разрушаешь рамки и создаёшь новую реальность. Твоя энергия заразительна, но важно научиться направлять её в нужное русло, чтобы не сжечь себя и окружающих.',
  },
  anxious_observer: {
    id: 'anxious_observer',
    name: 'Тревожный наблюдатель',
    emoji: '👁️',
    description: 'Ты чувствуешь мир острее других. Твоя чувствительность — это дар и проклятие одновременно. Ты замечаешь детали, которые другие пропускают, но иногда тонешь в собственных переживаниях. Твоя задача — научиться превращать тревогу в осознанность, а не в паралич.',
  },
  lone_strategist: {
    id: 'lone_strategist',
    name: 'Стратег-одиночка',
    emoji: '🎯',
    description: 'Ты архитектор своей жизни. Тебе не нужны овации толпы, тебе нужна ясность цели. Ты выстраиваешь планы, анализируешь риски и действуешь методично. Твоя сила в дисциплине и фокусе. Одиночество для тебя не наказание, а рабочее пространство для великих достижений.',
  },
  balanced_wolf: {
    id: 'balanced_wolf',
    name: 'Сбалансированный волк',
    emoji: '⚖️',
    description: 'Ты умеешь находить равновесие между крайностями. В тебе гармонично сочетаются контроль и спонтанность, социальность и потребность в одиночестве. Ты адаптируешься к ситуации, не теряя себя. Твоя гибкость — твоё главное преимущество в непредсказуемом мире.',
  },
};

export const answerOptions = [
  { value: 1, label: 'Совсем не про меня' },
  { value: 2, label: 'Скорее нет' },
  { value: 3, label: 'Иногда' },
  { value: 4, label: 'Часто' },
  { value: 5, label: 'Почти всегда' },
];

export function calculateResults(answers: Record<number, number>) {
  const scales = {
    stress: 0,
    impulse: 0,
    social: 0,
    control: 0,
  };

  questions.forEach((question) => {
    const answer = answers[question.id];
    if (answer !== undefined) {
      scales[question.scale] += answer;
    }
  });

  // Нормализуем в проценты (6 вопросов * 5 максимум = 30 баллов на шкалу)
  const percentages = {
    stress: Math.round((scales.stress / 30) * 100),
    impulse: Math.round((scales.impulse / 30) * 100),
    social: Math.round((scales.social / 30) * 100),
    control: Math.round((scales.control / 30) * 100),
  };

  return percentages;
}

export function determinePersonalityType(percentages: Record<ScaleType, number>): PersonalityType {
  const { stress, impulse, social, control } = percentages;

  // Спокойный альфа: ��ысокая стрессоустойчивость + высокий самоконтроль
  if (stress >= 60 && control >= 60) {
    return personalityTypes.calm_alpha;
  }

  // Хищник хаоса: высокая импульсивность + высокая социальная энергия
  if (impulse >= 60 && social >= 60) {
    return personalityTypes.chaos_predator;
  }

  // Тревожный наблюдатель: низкая стрессоустойчивость + низкий самоконтроль
  if (stress < 50 && control < 50) {
    return personalityTypes.anxious_observer;
  }

  // Стратег-одиночка: высокий самоконтроль + низкая социальная энергия
  if (control >= 60 && social < 50) {
    return personalityTypes.lone_strategist;
  }

  // По умолчанию
  return personalityTypes.balanced_wolf;
}
