import { computed, onMounted } from 'vue'

type CookieConsent = {
  analytics: boolean
  decidedAt: number
  expiresAt: number
  version: number
}

const STORAGE_KEY = 'nw_cookie_consent'
const CONSENT_VERSION = 1
const CONSENT_DAYS = 270
const CONSENT_MS = CONSENT_DAYS * 24 * 60 * 60 * 1000
const METRICA_ID = 103991776
const METRICA_SCRIPT_ID = 'ya-metrica-script'

let analyticsLoaded = false

const loadYandexMetrica = () => {
  if (!process.client || analyticsLoaded) return

  const existing = document.getElementById(METRICA_SCRIPT_ID)
  if (existing) {
    analyticsLoaded = true
    return
  }

  const w = window as typeof window & {
    ym?: ((...args: unknown[]) => void) & { a?: unknown[]; l?: number }
  }

  if (!w.ym) {
    w.ym = (...args: unknown[]) => {
      w.ym?.a?.push(args)
    }
    w.ym.a = []
    w.ym.l = Date.now()
  }

  const script = document.createElement('script')
  script.id = METRICA_SCRIPT_ID
  script.async = true
  script.src = 'https://mc.yandex.ru/metrika/tag.js'
  document.head.appendChild(script)

  w.ym?.(METRICA_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true
  })

  analyticsLoaded = true
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
}

const removeAnalyticsCookies = () => {
  if (!process.client) return

  const known = new Set([
    '_ym_uid',
    '_ym_d',
    '_ym_isad',
    '_ym_visorc',
    'yandexuid',
    'ymex',
    'yuidss'
  ])

  document.cookie.split(';').forEach((cookie) => {
    const [rawName] = cookie.split('=')
    const name = rawName.trim()
    if (!name) return
    if (known.has(name) || name.startsWith('_ym')) {
      deleteCookie(name)
    }
  })
}

const readConsent = (): CookieConsent | null => {
  if (!process.client) return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as CookieConsent
    if (parsed?.version !== CONSENT_VERSION) return null
    if (!parsed.expiresAt || Date.now() > parsed.expiresAt) return null
    return parsed
  } catch {
    return null
  }
}

const saveConsent = (analytics: boolean) => {
  const now = Date.now()
  const payload: CookieConsent = {
    analytics,
    decidedAt: now,
    expiresAt: now + CONSENT_MS,
    version: CONSENT_VERSION
  }

  if (process.client) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }

  return payload
}

export const useCookieConsent = () => {
  const consent = useState<CookieConsent | null>('cookie-consent', () => null)
  const loaded = useState<boolean>('cookie-consent-loaded', () => false)

  const analyticsEnabled = computed(() => consent.value?.analytics ?? false)
  const shouldShowBanner = computed(() => loaded.value && !consent.value)

  const hydrate = () => {
    if (!process.client || loaded.value) return
    loaded.value = true

    const stored = readConsent()
    if (!stored) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    consent.value = stored
    if (stored.analytics) {
      loadYandexMetrica()
    }
  }

  const acceptAll = () => {
    consent.value = saveConsent(true)
    loaded.value = true
    loadYandexMetrica()
  }

  const rejectAll = () => {
    consent.value = saveConsent(false)
    loaded.value = true
    removeAnalyticsCookies()
  }

  const saveSettings = (analytics: boolean) => {
    consent.value = saveConsent(analytics)
    loaded.value = true
    if (analytics) {
      loadYandexMetrica()
    } else {
      removeAnalyticsCookies()
    }
  }

  onMounted(hydrate)

  return {
    consent,
    analyticsEnabled,
    shouldShowBanner,
    acceptAll,
    rejectAll,
    saveSettings
  }
}
