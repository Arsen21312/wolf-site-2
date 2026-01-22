# Do Not Touch

Ниже перечислены зоны, которые нельзя менять без явного запроса.

- `.env.local` и любые секреты
- `context-embeddings-384.csv`
- `public/ambient/` и связанные файлы векторов
- `public/loopy/` и `public/trust-wolf/` (сторонние статические микросайты)
- `public/witch-hut/` если не запрошены правки
- `src/data/` и `src/content/` если правки не про тексты
- `src/data/tarot/ru.ts` и `src/data/tarot/ui.ts` без запроса на локализацию
- `src/content/home/featured.ts` содержит нестандартную кодировку, трогать только по запросу
- `nuxt.config.ts` раздел `nitro.routeRules` без запроса

TODO: уточнить, есть ли дополнительные области с данными, которые нельзя менять
