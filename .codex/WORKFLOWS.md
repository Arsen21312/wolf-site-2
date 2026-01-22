# Workflows

## Добавить страницу
1) Создай файл в `src/pages/` или подпапках (`games`, `generators`, `decisions`)
2) Используй компоненты из `src/components/`
3) Если нужен новый layout, добавь в `src/layouts/` и подключи на странице
4) Проверь путь и редиректы в `nuxt.config.ts` если нужен старый URL

## Добавить новый инструмент
1) Выбери раздел: `src/pages/decisions` или `src/pages/generators`
2) Вынеси логику в `src/utils/<domain>/` если она переиспользуется
3) Ассеты положи в `public/images/<tool>` или `src/assets/images/`
4) Если инструмент должен быть на главной, обнови `src/content/home/featured.ts`

## Новый генератор
1) Создай страницу в `src/pages/generators/<name>.vue`
2) Вынеси алгоритмы в `src/utils/<domain>/`, переиспользуй существующие утилиты
3) Подключи компоненты из `src/components/` или добавь фичевые в `src/components/<feature>/`
4) Добавь ассеты в `public/images/<name>` если они нужны на странице
5) Добавь ссылку в `src/pages/generators/index.vue` если есть список

## Новая игра
1) Создай страницу в `src/pages/games/<name>.vue` или добавь динамику в `src/pages/games/[slug].vue`
2) Игровую логику вынеси в `src/utils/games/<name>/`
3) UI компоненты положи в `src/components/games/<Name>/`
4) Если есть серверная часть, добавь endpoints в `src/server/api/<domain>/`
5) Добавь ассеты в `public/images/<game>` и обнови `src/content/home/featured.ts` при необходимости

## Добавить перевод
- `@nuxtjs/i18n` подключен, но локали не найдены
- Для tarot тексты лежат в `src/data/tarot/ru.ts` и `src/data/tarot/ui.ts`
TODO: определить, где живут остальные переводы и как устроены ключи
Варианты:
1) Настроить `@nuxtjs/i18n` и вынести тексты в локали
2) Убрать модуль `@nuxtjs/i18n`, если он не нужен

## Подключить таблицу или эндпоинт
1) Добавь серверный обработчик в `src/server/api/<path>.<method>.ts`
2) Используй `src/server/utils/supabaseClient.ts` или `src/server/utils/supabaseAdmin.ts`
3) На клиенте дергай API через `useFetch` или `fetch` по `/api/...`
4) Если нужен OpenAI, смотри `src/server/utils/openai.ts`

## Новый API endpoint
1) Добавь файл в `src/server/api/<group>/<name>.<method>.ts`
2) Подключи `useRuntimeConfig()` если нужны ключи или URL
3) Для Supabase используй `src/server/utils/supabaseClient.ts` или `src/server/utils/supabaseAdmin.ts`
4) Если endpoint доступен только админам, сверяй `ADMIN_TOKEN` как в `src/server/api/admin/crocodile/*`
5) На клиенте вызови через `$fetch('/api/<group>/<name>')`

## Деплой
- Билд: `npm run build` создает `.output/`
- Предпросмотр: `npm run preview`
TODO: уточнить хостинг и правила деплоя для этого проекта
