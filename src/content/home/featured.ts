export type HomeFeaturedItem = {
  title: string
  description: string
  href: string
  icon: 'claw' | 'spark' | 'loop' | 'context' | 'quote' | 'coin'
}

export const homeFeaturedItems: HomeFeaturedItem[] = [
  {
    title: 'Волчья эволюция доверия',
    description: 'Игра про выборы, команды и внутреннего волка.',
    href: '/games/trust-wolf',
    icon: 'claw'
  },
  {
    title: 'Правда или действие',
    description: 'Мемный костер вопросов для любой тусовки.',
    href: '/games/truth-or-dare',
    icon: 'spark'
  },
  {
    title: 'Truth or Dare: подборки',
    description: 'Кластеры под интент: для друзей, пары, компании, подростков и 18+.',
    href: '/games/truth-or-dare/for-friends',
    icon: 'spark'
  },
  {
    title: 'Петли',
    description: 'Визуальный генератор узоров и настроения.',
    href: '/generators/loopy',
    icon: 'loop'
  },
  {
    title: 'Волчий контекст',
    description: 'Шепот подсказок, когда нужно увидеть шире.',
    href: '/games/wolf-context',
    icon: 'context'
  },
  {
    title: 'Генератор цитат',
    description: 'Ауф-цитаты, чтобы поставить точку в чате.',
    href: '/generators/wolf-quotes',
    icon: 'quote'
  },
  {
    title: 'Подброс монетки',
    description: 'Решение на раз-два без лишних мыслей.',
    href: '/decisions/coin-flip',
    icon: 'coin'
  }
]

export const homeRandomRoutes = [
  '/games/trust-wolf',
  '/games/wolf-runner',
  '/games/truth-or-dare/for-friends',
  '/games/truth-or-dare/for-couple',
  '/games/truth-or-dare/for-company',
  '/games/truth-or-dare/for-teens',
  '/games/truth-or-dare/18-plus',
  '/games/sudoku',
  '/games/minesweeper',
  '/decisions/coin-flip',
  '/decisions/randomizer',
  '/decisions/love-calculator',
  '/decisions/wheel-of-fortune',
  '/generators/wolf-quotes',
  '/generators/loops',
  '/generators/morse',
  '/generators/password-generator'
]

