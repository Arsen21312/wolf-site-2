const state = {
  story: null,
  currentId: null,
  started: false,
  finished: false,
  soundEnabled: false
}

let elements = null
let initAttempts = 0

const getElements = () => ({
  title: document.getElementById('scene-title'),
  text: document.getElementById('scene-text'),
  choices: document.getElementById('choices'),
  endPanel: document.getElementById('end-panel'),
  menu: document.getElementById('menu'),
  menuToggle: document.getElementById('menu-toggle'),
  menuClose: document.getElementById('menu-close'),
  restart: document.getElementById('restart'),
  soundToggle: document.getElementById('sound-toggle'),
  soundToggleMenu: document.getElementById('sound-toggle-menu')
})

const audio = {
  bg: new Audio('/trust-wolf/audio/bg.mp3'),
  click: new Audio('/trust-wolf/audio/click.mp3')
}

audio.bg.loop = true
[audio.bg, audio.click].forEach((item) => {
  item.preload = 'auto'
  item.playsInline = true
})

const analytics = {
  track(event, data = {}) {
    if (window.trustWolfAnalytics && typeof window.trustWolfAnalytics.track === 'function') {
      window.trustWolfAnalytics.track(event, data)
      return
    }
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...data })
    }
  }
}

const getScene = (id) => state.story?.scenes.find((scene) => scene.id === id)

const updateSoundLabels = () => {
  if (!elements) return
  const label = state.soundEnabled ? 'Звук: вкл' : 'Включить звук'
  elements.soundToggle.textContent = label
  elements.soundToggleMenu.textContent = label
}

const toggleSound = async () => {
  if (state.soundEnabled) {
    audio.bg.pause()
    state.soundEnabled = false
    updateSoundLabels()
    return
  }

  try {
    await audio.bg.play()
    state.soundEnabled = true
    updateSoundLabels()
  } catch (error) {
    elements.soundToggle.textContent = 'Не удалось включить звук'
    elements.soundToggleMenu.textContent = 'Не удалось включить звук'
  }
}

const playClick = () => {
  if (!state.soundEnabled) return
  audio.click.currentTime = 0
  audio.click.play().catch(() => {})
}

const renderChoices = (choices = []) => {
  if (!elements) return
  elements.choices.innerHTML = ''

  choices.forEach((choice) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = choice.text
    button.addEventListener('click', () => {
      playClick()
      analytics.track('trustwolf_choice', { from: state.currentId, to: choice.next })
      renderScene(choice.next)
    })
    elements.choices.appendChild(button)
  })
}

const renderScene = (sceneId) => {
  if (!elements) return
  const scene = getScene(sceneId)
  if (!scene) return

  state.currentId = scene.id
  elements.title.textContent = state.story?.title || 'Волчья версия'
  elements.text.textContent = scene.text

  if (scene.end) {
    elements.endPanel.hidden = false
    renderChoices([])
    if (!state.finished) {
      state.finished = true
      analytics.track('trustwolf_complete', { scene: scene.id })
    }
    return
  }

  elements.endPanel.hidden = true
  renderChoices(scene.choices || [])
}

const restartGame = () => {
  if (!elements) return
  if (!state.story) return
  state.finished = false
  renderScene(state.story.start)
  analytics.track('trustwolf_restart')
}

const toggleMenu = (open) => {
  if (!elements) return
  elements.menu.hidden = !open
}

const bindSocialTracking = () => {
  document.querySelectorAll('[data-social]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      const network = link.getAttribute('data-social')
      analytics.track('trustwolf_social_click', { network })
    })
  })
}

const bindEvents = () => {
  if (!elements) return
  elements.soundToggle.addEventListener('click', toggleSound)
  elements.soundToggleMenu.addEventListener('click', toggleSound)
  elements.menuToggle.addEventListener('click', () => toggleMenu(true))
  elements.menuClose.addEventListener('click', () => toggleMenu(false))
  elements.restart.addEventListener('click', () => {
    toggleMenu(false)
    restartGame()
  })

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      audio.bg.pause()
      return
    }
    if (state.soundEnabled) {
      audio.bg.play().catch(() => {})
    }
  })

  window.addEventListener('pagehide', () => {
    audio.bg.pause()
  })
}

const init = async () => {
  elements = getElements()
  if (!elements.title || !elements.text || !elements.choices) {
    initAttempts += 1
    if (initAttempts < 6) {
      setTimeout(init, 100)
      return
    }
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div style=\"padding:16px;color:#fff\">Не найдены элементы сцены. Проверь index.html.</div>'
    )
    console.error('Trust-wolf init: missing DOM elements')
    return
  }

  document.documentElement.setAttribute('data-trustwolf-js', '1')
  elements.text.textContent = 'Загрузка истории...'
  try {
    const response = await fetch('/trust-wolf/data/story.json', { cache: 'no-store' })
    state.story = await response.json()
    if (!state.story || !Array.isArray(state.story.scenes)) {
      throw new Error('story.json is invalid')
    }
  } catch (error) {
    elements.text.textContent = 'Не удалось загрузить историю. Проверь файл story.json.'
    console.error('Trust-wolf init error:', error)
    return
  }

  renderScene(state.story.start)
  updateSoundLabels()
  bindEvents()
  bindSocialTracking()

  if (!state.started) {
    state.started = true
    analytics.track('trustwolf_start')
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
