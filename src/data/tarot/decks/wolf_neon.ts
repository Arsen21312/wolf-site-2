import majorArcana from './wolf_neon_major.json'
import pentacles from './wolf_neon_pentacles.json'
import swords from './wolf_neon_swords.json'
import wands from './wolf_neon_wands.json'
import cups from './wolf_neon_cups.json'

const wolfNeonDeck = {
  title: 'Нейронное Таро Волка',
  tagline: 'Тёмный лес, неон, стая знает ответы',
  majorArcana,
  suits: {
    pentacles,
    swords,
    wands,
    cups
  }
}

export default wolfNeonDeck
