# Architecture

## Карта папок
- `src/pages/` - file based роутинг Nuxt, каждая страница это маршрут
- `src/layouts/` - базовые layout оболочки
- `src/components/` - UI и доменные компоненты, сгруппированы по фичам
- `src/composables/` - composables уровня приложения
- `src/utils/` - утилиты и алгоритмы для игр, генераторов и текстовых инструментов
- `src/data/` - статические данные и тексты (включая tarot)
- `src/content/` - контент для главной
- `src/assets/` - стили и статические ресурсы, импортируемые в сборку
- `src/server/api/` - server API эндпоинты (Nitro)
- `src/server/routes/` - server routes типа `sitemap.xml`
- `src/server/utils/` - серверные утилиты, Supabase, OpenAI, контекстные данные
- `src/workers/` - web worker для контекстной игры
- `public/` - публичные ассеты и отдельные статические микросайты
- `scripts/` - скрипты для генерации контекстных эмбеддингов
- `tools/` - внешние инструменты и заготовки для данных

## Точки входа и ключевые файлы
- `nuxt.config.ts` - конфиг Nuxt, env, css, routeRules, public assets
- `src/pages/index.vue` - главная страница
- `src/layouts/default.vue` и `src/layouts/MainLayout.vue` - основные layout
- `src/error.vue` - глобальная страница ошибки
- `src/server/api/*` - серверные эндпоинты
- `public/` - favicon, manifest, статические страницы и медиа

## Роутинг
- Клиентский роутинг: `src/pages/` и вложенные каталоги (`decisions`, `generators`, `games`, `admin`)
- Динамические роуты: `src/pages/games/[slug].vue`
- Серверные роуты: `src/server/api/**` и `src/server/routes/sitemap.xml.ts`
- Redirect правила: `nuxt.config.ts` -> `nitro.routeRules`

## Witch hut и статика
- `src/pages/witch-hut.vue` это Nuxt страница для маршрута `/witch-hut`
- `public/witch-hut/` это отдельный статический проект, доступен как статические файлы (например `/witch-hut/index.html`)
- Nuxt страница использует аудио из `public/witch-hut/audio/*`, но не импортирует исходники из `public/witch-hut/src`
- `public/loopy/` и `public/trust-wolf/` это статические микросайты, обслуживаются как есть, без сборки Nuxt

## Данные и внешние сервисы
- Supabase: `src/server/utils/supabaseClient.ts` и `src/server/utils/supabaseAdmin.ts`
- OpenAI: `src/server/utils/openai.ts` и `src/server/api/test-openai.get.ts`
- Контекстные данные: `context-embeddings-384.csv`, `public/ambient/*`, `src/server/utils/context*`

## i18n
Подключен `@nuxtjs/i18n`, но в `src/` нет реального использования переводов.
TODO: либо настроить `@nuxtjs/i18n` с реальными локалями, либо убрать модуль.
