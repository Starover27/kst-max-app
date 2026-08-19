# Аудит проекта MAX Clinic App

Дата аудита: 15.08.2026
Статус сборки: **сборка падает** (22 ошибки TypeScript), lint: 43 ошибки + 1 предупреждение.

---

## 1. Текущий стек

| Категория | Технология | Версия |
|---|---|---|
| UI-фреймворк | React (SPA, client-side rendering) | 19.2.8 |
| Язык | TypeScript (strict) | ~6.0.2 |
| Сборка | Vite (+ @vitejs/plugin-react) | 8.2.0 |
| Роутинг | react-router-dom (createBrowserRouter) | 7.18.2 |
| Серверное состояние | @tanstack/react-query | 5.101.4 |
| Клиентское состояние | zustand + кастомный store на useSyncExternalStore | 5.0.14 |
| Формы/валидация | react-hook-form + @hookform/resolvers + zod | 7.84 / 5.8 / 4.4 |
| Стили | CSS Variables + CSS Modules + глобальные классы (app.css) | — |
| Линтер | ESLint 10 + typescript-eslint + react-hooks + react-refresh | — |

Архитектура: Feature-Sliced Design (слои app / pages / widgets / features / entities / shared), зафиксирована в `docs/architecture.md`.

MAX Mini App: собственной SDK-библиотеки нет; интеграция написана вручную (`src/shared/platform/max-bridge.ts` — ожидает `window.max.bridge`) + noop-адаптеры (`src/shared/platform/max/adapters.ts`).

## 2. Структура проекта

```
index.html                  — точка входа (lang="en", title "max-clinic-app", нет MAX SDK)
src/main.tsx                — createRoot -> app/App
src/app/                    — App.tsx, providers.tsx (QueryClient + Router), router.tsx
src/widgets/layout/         — AppShell (нижняя навигация, inline-SVG)
src/widgets/admin-layout/   — AdminShell (админ-панель)
src/pages/                  — home, doctors, booking, appointments, analysis, profile,
                              LoginPage, patients, records, settings, admin/*
src/features/home/          — HomeFeature + компоненты (Header, Greeting, HeroImage,
                              QuickActions, PromoCard) — НЕ используется роутером
src/features/booking/steps/ — 7 шагов мастера записи — НЕ подключены, ломают сборку
src/entities/               — модели (Doctor, Appointment, Analysis, User, ...) + model.ts
src/stores/                 — appStore.ts (zustand), bookingStore.ts (useSyncExternalStore)
src/api/                    — doctors, appointments, analysis, auth, booking, notifications,
                              profile, admin/* (service/mapper/mock/types)
src/shared/
  api/client.ts             — fetch-обёртка (apiGet/apiPost/apiPut/apiDelete)
  config/                   — api.ts (BASE_URL), routes.ts
  data/                     — doctors.ts (8 врачей с фото), clinicData.ts
  platform/                 — max-bridge.ts, max/ (types, adapters)
  styles/                   — theme, colors, variables, typography, radius, shadows, spacing, animations
  ui/                       — Button, Card, Chip, Input, Modal, Avatar, Badge, SearchInput,
                              DoctorCard, BottomNavigation, Page, Container, Section, ...
  utils/, lib/, types/
src/assets/                 — logo.png, hero.png, clinic.jpg, clinic-rudneva.jpg, фото врачей (12)
src/app.css                 — глобальные классы дизайна (topBar, doctorCard, timeGrid, ...) — НЕ импортируется
src/index.css               — импорт theme.css + animations.css
```

Вне src: `kst27_home.html`, `kst27_doctors.html`, `kst27_price.html`, `tmp_home.html` — статические HTML-прототипы экранов; `max-clinic-app/src/pages/` — пустой дубликат-артефакт; `docs/architecture.md`, `docs/design-reference.png`.

## 3. Routing

`src/app/router.tsx` (createBrowserRouter), все страницы под `AppShell`:

| Путь | Страница | Статус |
|---|---|---|
| `/` | HomePage | работает |
| `/doctors` | DoctorsPage | работает |
| `/booking`, `/booking/:doctorId` | BookingPage | работает |
| `/appointment` | AppointmentsPage («Моя запись») | работает |
| `/analysis` | AnalysisPage | **ошибка сборки** (нет импорта Page) |
| `/profile` | ProfilePage | **ошибка сборки** (named vs default export в router) |

Несоответствия: router импортирует `{ AnalysisPage }` и `{ ProfilePage }` как именованные экспорты, а страницы экспортируются `default`. Страницы `patients`, `records`, `settings`, `LoginPage`, `admin/*` в роутере не зарегистрированы (админ-маршруты описаны только в `shared/config/routes.ts`).

## 4. Состояние приложения

- `stores/appStore.ts` (zustand): user, tokens, theme, isLoading, error, isAdmin + login/logout/admin-методы. Персистентности нет (токены не переживают перезагрузку).
- `stores/bookingStore.ts`: текущая запись (одна) + избранное врачей, персистентно в localStorage, собственный useSyncExternalStore.
- `features/booking/steps/*` ожидают **другой** zustand-`useBookingStore` (doctor/service/date/time/patient, selectDate, goBack...) — такого store нет. Это второй, несовместимый контур записи (мастер из 7 шагов), не подключён к роутеру и ломает сборку. Отсутствует и `steps.module.css`.

Итог: два параллельных контура записи (простой в `pages/booking` и незавершённый мастер в `features/booking`), два store-подхода, дублирование.

## 5. API

- Клиент: `shared/api/client.ts` — fetch + JSON, без авторизационных заголовков (токены из appStore не подставляются!), без ретраев и интерцепторов.
- `shared/config/api.ts`: `BASE_URL = 'http://localhost:8080/api'` — захардкожен, не читает `import.meta.env.VITE_API_BASE_URL` (в `.env.example` указан `http://localhost:3000/api` — рассинхронизация).
- Сервисы (`doctors`, `appointments`, `analysis`, `auth`, `booking`, `notifications`, `profile`, `admin/*`) переписаны на реальные HTTP-вызовы, моки закомментированы, но **бэкенда нет** — все запросы упадут в runtime. Типизация ответов — `any`.
- Страницы при этом используют локальные данные: `shared/data/doctors.ts` (8 врачей, реальные фото и ссылки на kst27.ru) и хардкод в AnalysisPage/AppointmentsPage. То есть API-слой фактически мёртвый код.
- React Query подключён в providers и используется только в `features/booking/steps/ConfirmStep` (мёртвый код).

## 6. MAX Mini App — текущая реализация

- `max-bridge.ts`: интерфейсы MaxBridge/MaxUser/MaxTheme, функции init/getUser/getTheme/close/openLink/shareLink/showAlert c фолбэками на браузер.
- `max/adapters.ts` + `types.ts`: платформенный адаптер (backButton, mainButton, storage, haptics) с noop-реализациями и `setAdapter()`.
- **Интеграция отсутствует**: `initMaxBridge()` нигде не вызывается, в `index.html` нет подключения MAX SDK/скрипта, тема MAX не применяется, пользователь MAX не читается, адаптер не подменяется. Приложение работает как обычный мобильный веб-SPA.

## 7. Стилі и UI-кит

- Токены: `shared/styles/*.css` (colors: --red #E3232A, --gray, фоны; typography: Inter, base 17px; radius: 16/12/50%; shadows; spacing).
- **Критично**: `src/app.css` содержит всю визуальную систему текущих экранов (`.appShell`, `.bottomNav`, `.topBar`, `.doctorCard`, `.quickGrid`, `.promoBanner`, `.timeGrid`, `.apptHero`, `.chip`, `.toggle`, `.toast`...), но **нигде не импортируется** — стили не применяются. Работают только инлайновые стили и CSS Modules.
- Двойная система стилей: глобальные классы (HomePage, DoctorsPage, BookingPage, AppointmentsPage, AppShell) vs CSS Modules (Analysis/Profile, shared/ui/*.module.css). Компоненты `shared/ui` (Button, Chip, DoctorCard, SearchInput...) страницами почти не используются.
- `--orange` используется в DoctorsPage/AppointmentsPage, но определён только в app.css (который не подключён).

## 8. Ошибки сборки (tsc, 22 шт.)

1. `src/app/router.tsx:7-8` — именованный импорт страниц с default-экспортом (AnalysisPage, ProfilePage).
2. `src/pages/analysis/AnalysisPage.tsx` — не импортирован `Page`; неиспользуемый `useState`.
3. `src/features/booking/steps/*` (7 файлов) — `useBookingStore` не экспортируется из `stores/bookingStore`; как следствие — implicit any в селекторах.
4. `src/api/booking/mock.ts:98` — неиспользуемый параметр `payload`.

## 9. Ошибки lint (43 errors, 1 warning)

- `@typescript-eslint/no-explicit-any` (~30) — весь API-слой, LoginPage, админ-страницы, client.ts, platform/max.
- `@typescript-eslint/no-unused-vars` — auth/mock.ts, booking/mock.ts, AnalysisPage, adapters.ts.
- `react-hooks/exhaustive-deps` (warning) — admin/users/UsersPage.

## 10. Анализ эталонного дизайна (docs/design-reference.png)

6 экранов, мобильная сетка ~390px, светлая тема, красный акцент, нижняя навигация из 4 вкладок на всех экранах.

| Элемент | Эталон | Текущая реализация | Статус |
|---|---|---|---|
| Главный экран | экран 1 | HomePage | частично (нет фото клиники, SVG-заглушка) |
| Шапка | логотип слева + колокольчик справа | есть (SVG-логотип) | требуется фирменный логотип (assets/logo.png) |
| Логотип | «Клиника современных технологий» | SVG-сердце + текст | заменить на реальный логотип |
| Приветствие | «Здравствуйте, Денис!» + подзаголовок | хардкод имени | нужно имя пользователя (MAX/профиль) |
| Большая фотография клиники | реальное фото здания с вывеской | SVG-рисунок | есть assets (clinic.jpg / clinic-rudneva.jpg / hero.png) — подключить |
| Быстрые действия | 8 плиток 4x2 (запись, мои записи, анализы, оплата, врачи, направления, отзывы, как добраться) | реализованы 8 плиток | совпадает, доработать иконки/стиль |
| Карточка преимущества | градиент красный->тёмный, иконка-сердце с пульсом, текст, стрелка | promoBanner | совпадает по смыслу |
| Список врачей | вертикальные карточки | DoctorsPage | реализовано |
| Фильтры врачей | chips специальностей, активный — красный | chips | реализовано |
| Поиск | иконка лупы в шапке, раскрывающийся поиск | есть | реализовано |
| Карточка врача | фото, ФИО, специальность, стаж, рейтинг-звезда, «от N ₽», сердце-избранное | есть | реализовано |
| Запись к врачу | карточка врача + выбор даты/времени + CTA | BookingPage | реализовано (без услуги/пациента/подтверждения) |
| Выбор даты | горизонтальный скролл, активная — оранжевая | dateRow | реализовано |
| Выбор времени | сетка 3 колонки, активный — красный, занятые скрыты/disabled | timeGrid | реализовано |
| Подтверждение записи | отдельный шаг/экран сводки | только фикс. кнопка CTA | отсутствует (есть заготовка ConfirmStep) |
| Мои записи | градиент-hero с датой и пульсом, «О приёме», перенос/отмена, тумблер напоминания | AppointmentsPage | реализовано близко к эталону |
| Анализы и результаты | chips-фильтр (Все/Готовые/В работе), карточки со статусом, «Смотреть результат», загрузка | AnalysisPage | частично (нет фильтров, нет кнопки загрузки, сломана) |
| Профиль | градиентная шапка, аватар с кнопкой редактирования, телефон, меню 7 пунктов, тумблер уведомлений, «Выйти» | ProfilePage | частично (нет половины пунктов, аватар — фото клиники, нет тумблеров/настроек) |
| Нижняя навигация | 4 вкладки, активная — красная с заливкой иконки | AppShell | реализовано |

Дополнительно в эталоне: статус-бар 9:41 (системный), экраны без скролл-артефактов, pill-чипы, радиусы 16, тень карточек, оранжевый для активной даты и действий «перенести», красный для CTA и активных элементов.

## 11. Что уже реализовано

- Каркас SPA: Vite + React 19 + TS, роутер, провайдеры, AppShell с нижней навигацией.
- 4 из 6 экранов эталона в рабочем состоянии (Главная, Врачи, Запись, Моя запись) с близкой к эталону вёрсткой.
- Избранное врачей и текущая запись с персистентностью в localStorage.
- UI-кит в shared/ui (12 компонентов) и дизайн-токены в shared/styles.
- Заготовки API-слоя (7 доменов + admin) с mapper/mock-структурой.
- Заготовки MAX-интеграции (bridge + адаптеры).
- Ассеты: реальные фото 8 врачей (используются) + 4 webp (не используются), фото клиники, логотип.

## 12. Что отсутствует / сломано

1. Сборка: 22 ошибки TS (см. п. 8). Lint: 43 ошибки.
2. `src/app.css` не подключён — весь глобальный CSS дизайна мёртв.
3. Экран «Анализы»: фильтры, статусы «В работе», просмотр/скачивание результата.
4. Экран «Профиль»: половина меню, редактирование, уведомления-тумблер, корректный аватар.
5. Подтверждение записи как отдельный шаг; выбор услуги; данные пациента; история записей (хранится только одна запись).
6. Реальная MAX-интеграция: инициализация bridge, пользователь/тема из MAX, SDK в index.html.
7. Работающий API-контур: токены в заголовках, env-конфигурация BASE_URL, переключатель mock/real.
8. Авторизация пациента (LoginPage не в роутере; профиль использует заглушку).
9. Единый подход к стилям (глобальные классы vs CSS Modules vs инлайны).
10. Тесты, CI, production-конфигурация (HTTPS-домен, backend, деплой в MAX).
11. Мусор: kst27_*.html, tmp_home.html, пустой `max-clinic-app/`, дублирующий `features/home`, мёртвый `features/booking/steps`, страницы patients/records/settings вне роутера.

## 13. Файлы, которые будем изменять (карта изменений)

| Файл | Действие |
|---|---|
| `src/main.tsx` | импорт app.css (или миграция классов), initMaxBridge |
| `index.html` | lang=ru, title, viewport, MAX SDK |
| `src/app/router.tsx` | фикс импортов, новые маршруты (подтверждение, история) |
| `src/app.css` | подключить либо разнести по модулям |
| `src/pages/analysis/AnalysisPage.tsx` | фикс + фильтры/результаты по эталону |
| `src/pages/profile/ProfilePage.tsx` | доработка по эталону |
| `src/pages/booking/BookingPage.tsx` | шаг подтверждения, услуга, пациент |
| `src/pages/appointments/AppointmentsPage.tsx` | история записей |
| `src/pages/home/HomePage.tsx` | реальное фото клиники, логотип, имя пользователя |
| `src/stores/bookingStore.ts` | расширение (история, пациент) или замена на zustand |
| `src/shared/config/api.ts` | чтение import.meta.env |
| `src/shared/api/client.ts` | Authorization-заголовок, типизация |
| `src/shared/platform/*` | реальная инициализация в app |
| `src/features/booking/steps/*` | удалить либо достроить (решение на этапе 0) |
| `src/features/home/*` | удалить либо подключить (решение на этапе 0) |
| `src/widgets/layout/AppShell.tsx` | стили навигации из дизайн-системы |
| `src/shared/styles/*` | расширение токенов (orange, gradient, z-index, safe-area) |

## 14. Потенциальные проблемы и риски

- Два несовместимых контура записи и два store — при развитии легко усилить дублирование.
- API-слой без бэкенда: любые «реальные» вызовы падают; моки отключены.
- Токены не подставляются в запросы; нет refresh-логики; персистентность только в localStorage (недоступен в некоторых WebView).
- MAX SDK не подключён: getUser/getTheme не работают; noop-адаптер скрывает это молча.
- Инлайн-стили и хардкод (имя «Денис», кабинет, цены) — препятствие для локализации/динамических данных.
- `any` в API-слое — потеря типобезопасности мапперов.
- Фото клиники в трёх вариантах (clinic.jpg, clinic-rudneva.jpg, hero.png) — нужно выбрать эталонное.
- Пустой дубликат `max-clinic-app/` и HTML-прототипы в корне могут путать сборку/поиск.
- Vite 8 / TS 6 / React 19 — очень свежие мажорные версии: возможны несовместимости плагинов и типов.

## 15. Что нужно для production

1. Починить сборку и lint (этап 0 плана).
2. Определиться с источником данных: реальный backend (адрес, CORS, HTTPS, авторизация) или mock-режим по умолчанию.
3. Env-конфигурация (`VITE_API_BASE_URL`), убрать хардкод localhost:8080.
4. Реальная интеграция MAX Mini App: SDK-скрипт, подпись/валидация сессии на backend, тема, пользователь.
5. Хранение токенов с учётом WebView (httpOnly-куки либо безопасное хранилище), refresh.
6. Полные сценарии по эталону (анализы с результатами/PDF, профиль, история записей, подтверждение).
7. Единая дизайн-система (docs/DESIGN_SYSTEM.md) и единый подход к стилям.
8. Тесты (unit на мапперы/store, e2e на сценарий записи), CI (build+lint+test).
9. Оптимизация бандла (фото врачей — webp/сжатие), PWA-метрики, safe-area для iOS.
10. Публикация: домен с HTTPS, настройка Mini App в кабинете MAX (URL, обложка, права), мониторинг ошибок.
