# Conventions

## Именование
- Компоненты: PascalCase, `src/components/**/ComponentName.vue`
- Страницы: kebab-case, `src/pages/section/page-name.vue`
- Composables: `useXxx.ts` в `src/composables/`
- Server API: `src/server/api/<path>.<method>.ts` (пример: `random.get.ts`)
- Утилиты: логика по доменам в `src/utils/<domain>/`

## Компоненты
- По умолчанию SFC в `src/components/`
- UI общие компоненты в `src/components/ui/`
- Фичевые компоненты в папках `tarot`, `games`, `navigation` и т.д.

## Стили
- По умолчанию использовать `<style scoped>` в компонентах
- Глобальные стили подключаются через `nuxt.config.ts`:
  - `src/assets/styles/base.css`
  - `src/assets/styles/tailwind.css`
  - `src/assets/css/tarot-theme.css`
- Tailwind не добавлять и не расширять без явного запроса

## i18n и тексты
- В проекте нет использования `useI18n`, `$t` или `locale` для переводов
- `@nuxtjs/i18n` подключен в `nuxt.config.ts`, но в `src/` не видно реальных вызовов
- Тексты и данные лежат в `src/data/` и `src/content/`
- Tarot тексты: `src/data/tarot/ru.ts` и `src/data/tarot/ui.ts`
- Witch hut тексты: inline в `src/pages/witch-hut.vue` (`RU_COPY`, `EN_COPY`)
- TODO: определить, где живут остальные переводы и как устроены ключи

## Типизация
- Проект на TypeScript, утилиты и серверные обработчики в `.ts`
- TODO: нет явных правил линтинга или форматирования в репозитории
