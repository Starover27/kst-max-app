# Источники данных

Данные приложения хранятся в `src/data` и загружаются в UI через адаптеры из `src/shared/data`.

| Файл | Источник | Содержимое | Дата выгрузки |
| --- | --- | --- | --- |
| `doctors.json` | https://kst27.ru/index.php/nasha-komanda/vrachi | 72 врача из 6 отделений | 2026-08-15 |
| `clinics.json` | https://kst27.ru/index.php/kontakty | Филиалы, адреса, часы работы и категории услуг | 2026-08-15 |
| `services.json` | https://kst27.ru/index.php/uslugi | Каталог медицинских направлений и услуг | 2026-08-15 |
| `contacts.json` | https://kst27.ru/index.php/kontakty | Телефоны, электронная почта, часы работы и ссылки | 2026-08-15 |
| `prices.json` | https://kdoctoru.ru/client/16/price/ | 2 424 позиции официального прайса клиента 16 | 2026-08-16 |

## Обновление

Сохраните JSON-ответ прайса в `tmp_price_api.json`, затем сформируйте `src/data/prices.json`:

```powershell
$x = Get-Content tmp_price_api.json -Raw | ConvertFrom-Json
$out = [ordered]@{ _meta = [ordered]@{ source = 'https://kdoctoru.ru/client/16/price/'; fetched_date = (Get-Date -Format yyyy-MM-dd); status = 'complete' }; prices = $x }
$out | ConvertTo-Json -Depth 6 | Set-Content src/data/prices.json -Encoding utf8
```

Проверка структуры и ключевых объемов выполняется командой `node scripts/validate_data.cjs`.