# 🏥 MAX Clinic App — приложение пациента клиники «Клиника Современных Технологий»

![Интерфейс MAX Clinic App: запись к врачу, медицинская карта и услуги клиники КСТ](screen.png)

Одностраничное приложение (SPA) для пациентов клиники КСТ (kst27.ru), разработанное как **мини-приложение для мессенджера MAX**: запись к врачу, история посещений, медицинские документы, расчёт налогового вычета и личный профиль. Фронтенд на **React 19 + TypeScript** с архитектурой **Feature-Sliced Design**, деплой на **Cloudflare Pages**.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/State-Zustand-F97316)
![FSD](https://img.shields.io/badge/Architecture-Feature--Sliced-0F172A)
![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare_Pages-F38020?style=flat&logo=cloudflare&logoColor=white)

## ✨ Возможности

- 📅 **Запись к врачу** — выбор специальности, специалиста, даты и времени (`booking`);
- 👩‍⚕️ **Каталог врачей и специальностей** — данные отделений и врачей собираются пайплайном скриптов из открытых источников клиники;
- 📋 **История посещений и медицинские записи** (`appointments`, `records`);
- 📄 **Документы** — выписки, справки и заключения (`documents`);
- 💰 **Налоговый вычет** — раздел с материалами по вычету за лечение (`tax-deduction`);
- 🧑‍💼 **Кабинет сотрудника клиники** — режимы администратора и персонала (`admin`, `staff`, `patients`);
- 🧪 **Анализы** — просмотр результатов исследований (`analysis`);
- 👤 **Профиль и настройки** — личные данные и переключатель уведомлений (`profile`, `settings`);
- ℹ️ **О клинике и помощь** (`about`) + экран входа (`login`).

## 🧱 Архитектура

Feature-Sliced Design — доменная логика отделена от общих абстракций:

| Слой | Назначение |
|---|---|
| `app` | Точки входа, провайдеры, маршрутизация |
| `pages` | Композиции экранов и маршрутов |
| `widgets` | Крупные блоки интерфейса (shell, навигация) |
| `entities` | Модели предметной области и типы данных |
| `shared` | Общие утилиты, API-клиент, UI-библиотека |

Подробности — в [`docs/architecture.md`](docs/architecture.md).

## 📂 Структура проекта

```
max-clinic-app/
├── src/
│   ├── app/            Провайдеры, роутинг, точки входа
│   ├── pages/          Экраны: login, home, doctors, booking, appointments,
│   │                   records, documents, profile, tax-deduction,
│   │                   analysis, admin, patients, staff, settings, about
│   ├── widgets/        Shell и навигация
│   ├── entities/       Доменные модели
│   ├── shared/         Утилиты, API-клиент, UI-компоненты
│   ├── api/            Интеграционный слой
│   ├── stores/         Zustand-сторы
│   ├── data/           Данные (services.json и др.)
│   └── assets/         Статические ресурсы
├── scripts/            Пайплайн данных: парсинг → сборка → валидация
├── docs/               Архитектура, дизайн-система, аудиты данных
├── public/             favicon.svg, icons.svg, _redirects (SPA-роутинг на Cloudflare)
├── screen.png          Скриншот интерфейса — обложка этого README
└── wrangler.toml       Конфигурация Cloudflare Pages (pages_build_output_dir: dist)
```

## 🔧 Пайплайн данных

Данные о врачах, отделениях и ценах — не хардкод, а результат обработки исходников клиники:

1. **Извлечение** — `scripts/parse_departments.cjs`, `scripts/parse_doctors_v2.cjs`, `scripts/parse_doctors_from_html.js`, `scripts/extract_primary_prices.cjs`;
2. **Сборка** — `scripts/build_doctor_prices.cjs`, `scripts/finalize_data.cjs` — формируют итоговые JSON-данные в `src/data`;
3. **Валидация** — сквозная проверка данных перед коммитом:

```bash
npm run validate:data   # scripts/validate_data.cjs
```

## 🚀 Быстрый старт

```bash
npm install

# настройки окружения (см. .env.example):
#   VITE_API_BASE_URL   — адрес backend API
#   VITE_MAX_BOT_TOKEN  — токен бота MAX (интеграция с мессенджером)
copy .env.example .env

npm run dev        # дев-сервер Vite → http://localhost:5173
npm run build      # tsc -b && vite build → dist/
npm run lint       # ESLint
```

### Деплой на Cloudflare Pages

```bash
npx wrangler pages deploy dist
```

Конфигурация — `wrangler.toml`; `public/_redirects` обеспечивает корректный SPA-роутинг.

## 🧰 Технологии

| Слой | Решение |
|---|---|
| UI | React 19 + TypeScript, строгий ESLint-конфиг (typescript-eslint) |
| Сборка | Vite 8 |
| Роутинг | React Router 7 |
| Состояние | Zustand (глобальное) + TanStack Query (серверное) |
| Формы | React Hook Form + Zod-схемы |
| Деплой | Cloudflare Pages (Wrangler) |

## 📚 Документация

В [`docs/`](docs/) лежат внутренние документы проекта:

- [`architecture.md`](docs/architecture.md) — принципы и слои FSD;
- [`DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — дизайн-система (+ `design-reference.png`);
- [`DATA_SOURCES.md`](docs/DATA_SOURCES.md) — источники данных;
- `DOCTORS_DATA_AUDIT.md`, `DOCTOR_PRICES_AUDIT.md` — аудиты данных по врачам и ценам;
- `IMPLEMENTATION_PLAN.md`, `PROJECT_AUDIT.md` — план работ и аудит проекта;
- `tax-deduction/` — материалы раздела «Налоговый вычет».

## 🩺 Связанный проект

- **[kst-price-list](https://github.com/Starover27/kst-price-list)** — интерактивный прайс-лист той же клиники (13 категорий, 540 услуг, синхронизация цен с API kst27.ru).

---

*Учебный проект. Данные — реальные сведения клиники kst27.ru, полученные из её открытых источников.*
