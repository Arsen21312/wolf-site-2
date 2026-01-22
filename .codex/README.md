# .codex

Краткая документация по проекту, чтобы быстрее ориентироваться в структуре и правилах.

## Описание проекта
- Название: wolf-portal (Nuxt 3)
- Назначение: набор игр, генераторов и утилит, плюс отдельные разделы вроде tarot и witch-hut
- Исходники: `src/`
- Публичные ассеты: `public/`

## Запуск
```bash
npm install
npm run dev
```

## Сборка и запуск
```bash
npm run build
npm run preview
# или
npm run start
```

## Переменные окружения
Загружаются в `nuxt.config.ts` из `.env` и `.env.local`.
Список переменных и назначение:
- `SUPABASE_URL` - URL Supabase, используется в `runtimeConfig` и серверных утилитах
- `SUPABASE_ANON_KEY` - публичный ключ Supabase для client access
- `SUPABASE_SERVICE_ROLE_KEY` - сервисный ключ Supabase для admin операций на сервере
- `NUXT_PUBLIC_SUPABASE_URL` - fallback URL для Supabase, используется при отсутствии `SUPABASE_URL`
- `NUXT_PUBLIC_SUPABASE_ANON_KEY` - fallback ключ, используется при отсутствии `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` - ключ OpenAI для server endpoints
- `ADMIN_TOKEN` - токен админских API (crocodile)
- `NODE_ENV` - влияет на отладочный лог в supabase client утилите

TODO: уточнить, какие из переменных нужны для локального запуска, а какие только для серверных эндпоинтов.
