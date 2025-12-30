export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak'

export interface PomodoroSettings {
  workMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  longBreakEvery: number
  autoStartNext: boolean
  soundEnabled: boolean
  notificationsEnabled: boolean
  keepAwake: boolean
}

export interface PomodoroState {
  phase: PomodoroPhase
  isRunning: boolean
  endAt: number | null
  remainingMs: number
  activeDurationMs: number
  completedPomodoros: number
}

export interface PomodoroSession {
  id: number
  phase: PomodoroPhase
  minutes: number
  endedAt: number
}

const SETTINGS_KEY = 'pomodoro-settings-v1'
const STATE_KEY = 'pomodoro-state-v1'
const HISTORY_KEY = 'pomodoro-history-v1'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const toNumber = (value: unknown, fallback: number) => {
  const asNumber = Number(value)
  return Number.isFinite(asNumber) ? asNumber : fallback
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakEvery: 4,
  autoStartNext: false,
  soundEnabled: true,
  notificationsEnabled: false,
  keepAwake: false
}

export const getPhaseDurationMs = (phase: PomodoroPhase, settings: PomodoroSettings) => {
  if (phase === 'shortBreak') return settings.shortBreakMinutes * 60 * 1000
  if (phase === 'longBreak') return settings.longBreakMinutes * 60 * 1000
  return settings.workMinutes * 60 * 1000
}

export const getDefaultState = (settings: PomodoroSettings = DEFAULT_SETTINGS): PomodoroState => {
  const durationMs = getPhaseDurationMs('work', settings)
  return {
    phase: 'work',
    isRunning: false,
    endAt: null,
    remainingMs: durationMs,
    activeDurationMs: durationMs,
    completedPomodoros: 0
  }
}

const normalizeSettings = (raw: Partial<PomodoroSettings> | null): PomodoroSettings => {
  if (!raw) return { ...DEFAULT_SETTINGS }
  return {
    workMinutes: clamp(toNumber(raw.workMinutes, DEFAULT_SETTINGS.workMinutes), 10, 60),
    shortBreakMinutes: clamp(toNumber(raw.shortBreakMinutes, DEFAULT_SETTINGS.shortBreakMinutes), 3, 20),
    longBreakMinutes: clamp(toNumber(raw.longBreakMinutes, DEFAULT_SETTINGS.longBreakMinutes), 10, 40),
    longBreakEvery: clamp(toNumber(raw.longBreakEvery, DEFAULT_SETTINGS.longBreakEvery), 2, 8),
    autoStartNext: Boolean(raw.autoStartNext),
    soundEnabled: raw.soundEnabled !== undefined ? Boolean(raw.soundEnabled) : DEFAULT_SETTINGS.soundEnabled,
    notificationsEnabled:
      raw.notificationsEnabled !== undefined
        ? Boolean(raw.notificationsEnabled)
        : DEFAULT_SETTINGS.notificationsEnabled,
    keepAwake: raw.keepAwake !== undefined ? Boolean(raw.keepAwake) : DEFAULT_SETTINGS.keepAwake
  }
}

const normalizeState = (raw: Partial<PomodoroState> | null, settings: PomodoroSettings): PomodoroState => {
  if (!raw) return getDefaultState(settings)
  const phase: PomodoroPhase =
    raw.phase === 'shortBreak' || raw.phase === 'longBreak' || raw.phase === 'work' ? raw.phase : 'work'
  const durationMs = getPhaseDurationMs(phase, settings)
  const activeDurationMs = Math.max(1000, toNumber(raw.activeDurationMs, durationMs))
  const remainingMs = Math.max(0, toNumber(raw.remainingMs, activeDurationMs))
  const endAt = raw.endAt && Number.isFinite(raw.endAt) ? Number(raw.endAt) : null
  return {
    phase,
    isRunning: Boolean(raw.isRunning),
    endAt,
    remainingMs,
    activeDurationMs,
    completedPomodoros: Math.max(0, toNumber(raw.completedPomodoros, 0))
  }
}

const safeRead = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch (error) {
    return null
  }
}

export const loadSettings = (): PomodoroSettings => {
  const stored = safeRead<Partial<PomodoroSettings>>(SETTINGS_KEY)
  return normalizeSettings(stored)
}

export const saveSettings = (settings: PomodoroSettings) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export const loadState = (settings: PomodoroSettings): PomodoroState => {
  const stored = safeRead<Partial<PomodoroState>>(STATE_KEY)
  return normalizeState(stored, settings)
}

export const saveState = (state: PomodoroState) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STATE_KEY, JSON.stringify(state))
}

export const loadHistory = (): PomodoroSession[] => {
  const stored = safeRead<PomodoroSession[]>(HISTORY_KEY)
  if (!stored || !Array.isArray(stored)) return []
  return stored.filter((item) => item && typeof item.id === 'number').slice(0, 10)
}

export const saveHistory = (history: PomodoroSession[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)))
}
