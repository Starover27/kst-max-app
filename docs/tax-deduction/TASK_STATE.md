# Налоговый вычет — TASK_STATE.md

> Этот файл — главный контекст для дальнейшей работы.  
> **Перед началом работы обязательно прочитать этот файл.**  
> Не сканировать весь проект заново — использовать только перечисленные здесь файлы.  
> После каждого этапа обновлять секции «Текущий этап» и «Что уже сделано».

---

## 1. Цель задачи

Реализовать функционал «Налоговый вычет» в мобильном приложении клиники. Пользователь должен:

1. **Увидеть информацию** о налоговом вычете в личном кабинете (пункт меню).
2. **Открыть экран** «Налоговый вычет» с:
   - пояснением, что такое социальный налоговый вычет за медицинские услуги;
   - суммой, доступной для вычета (на основе истории посещений/платежей);
   - списком документов, необходимых для получения вычета;
   - кнопкой «Сформировать заявление» или ссылкой на инструкцию.
3. (Опционально, если потребуется) **Скачать/отправить** заявление на вычет.

---

## 2. Архитектура проекта (относящаяся к задаче)

### Технологический стек

| Технология | Версия | Назначение |
|---|---|---|
| React | 19.2.8 | UI-фреймворк |
| TypeScript | 6.0.2 | Типизация |
| React Router | 7.18.2 | Роутинг |
| Zustand | 5.0.14 | Состояние (store) |
| React Query | 5.101.4 | Загрузка данных (API) |
| Zod | 4.4.3 | Валидация |
| Vite | 8.2.0 | Сборка |

### Паттерны проекта

- **API-слой** (`src/api/{feature}/`): файлы `service.ts`, `types.ts`, `mapper.ts`, `mock.ts`
- **Страницы** (`src/pages/{feature}/`): `Page.tsx` + `Page.module.css`
- **UI-компоненты** (`src/shared/ui/`): переиспользуемые компоненты (Button, Card, Modal и т.д.)
- **Store** (`src/stores/`): Zustand-хранилища
- **Типы/сущности** (`src/entities/`): интерфейсы данных
- **Конфиг** (`src/shared/config/`): маршруты, API URL

### Стилизация

- Глобальные CSS-переменные: `src/shared/styles/colors.css`, `typography.css`, `spacing.css`, `radius.css`, `shadows.css`
- Общие стили: `src/app.css` (содержит стили для `.page`, `.card`, `.menuRow`, `.profileHero` и т.д.)
- CSS-модули: `*.module.css` рядом с компонентами

### Навигация

- Роутинг: `src/app/router.tsx` — `createBrowserRouter` с `<AppShell />` как layout
- Нижняя навигация: `src/widgets/layout/AppShell.tsx` — 4 вкладки: Главная, Запись, Анализы, Профиль
- Константы маршрутов: `src/shared/config/routes.ts`

---

## 3. Файлы, которые будем использовать

| Файл | Назначение |
|---|---|
| `src/app/router.tsx` | Добавить маршрут `/profile/tax-deduction` |
| `src/shared/config/routes.ts` | Добавить константу маршрута `taxDeduction` |
| `src/pages/profile/ProfilePage.tsx` | Добавить пункт меню «Налоговый вычет» |
| `src/app.css` | Стили для нового экрана (или CSS-модуль) |
| `src/stores/appStore.ts` | Доступ к данным пользователя (`user`) |
| `src/entities/User.ts` | Тип `User` (id, fullName, phone, email) |
| `src/shared/api/client.ts` | API-клиент (`apiGet`, `apiPost`) |
| `src/shared/config/api.ts` | `API_CONFIG.BASE_URL` |
| `src/shared/ui/Button.tsx` | Кнопки на экране вычета |
| `src/shared/ui/Card.tsx` | Карточки с информацией |
| `src/shared/ui/Modal.tsx` | Модальное окно (если нужно) |
| `src/shared/ui/Section.tsx` | Секции на странице |
| `src/widgets/layout/AppShell.tsx` | Layout (не меняем, но понимаем структуру) |

---

## 4. Файлы, которые нужно изменить

| Файл | Что меняем |
|---|---|
| `src/shared/config/routes.ts` | Добавить `taxDeduction: '/profile/tax-deduction'` |
| `src/app/router.tsx` | Добавить маршрут для страницы налогового вычета |
| `src/pages/profile/ProfilePage.tsx` | Добавить пункт меню «Налоговый вычет» с иконкой и навигацией |
| `src/app.css` | Добавить стили для экрана вычета (информационные блоки, карточки документов) |

---

## 5. Файлы, которые нужно создать

| Файл | Назначение |
|---|---|
| `src/pages/tax-deduction/TaxDeductionPage.tsx` | Основной экран «Налоговый вычет» |
| `src/pages/tax-deduction/TaxDeductionPage.module.css` | Стили экрана (если используются CSS-модули) |
| `src/api/tax-deduction/types.ts` | Типы данных для вычета (при необходимости) |
| `src/api/tax-deduction/service.ts` | Сервис для получения данных о вычете (при необходимости) |
| `src/api/tax-deduction/mock.ts` | Мок-данные для разработки (при необходимости) |
| `src/api/tax-deduction/mapper.ts` | Маппер данных (при необходимости) |
| `src/entities/TaxDeduction.ts` | Тип/интерфейс сущности «Налоговый вычет» |

---

## 6. Текущий этап

**Этап 1: MVP реализован — страница «Налоговый вычет» + пункт меню в профиле**  
→ Выполнен. TypeScript + build проходят без ошибок.

---

## 7. Что уже сделано

### Этап 0: Анализ
- [x] Проанализирована структура проекта
- [x] Найден экран личного кабинета (`src/pages/profile/ProfilePage.tsx`)
- [x] Изучен роутинг, UI-компоненты, store, типы, API-слой, стили
- [x] Создан `docs/tax-deduction/TASK_STATE.md`

### Этап 1: MVP «Налоговый вычет»
- [x] Добавлена константа маршрута `taxDeduction` в `src/shared/config/routes.ts`
- [x] Создана страница `src/pages/tax-deduction/TaxDeductionPage.tsx` (заголовок, hero-описание, карточка сумм, инфо-блок, список документов, кнопки CTA)
- [x] Добавлены стили `.tax*` в `src/app.css`
- [x] Добавлен импорт `TaxDeductionPage` и маршрут `profile/tax-deduction` в `src/app/router.tsx`
- [x] Добавлена иконка `tax` и пункт меню «Налоговый вычет» с `navigate('/profile/tax-deduction')` в `src/pages/profile/ProfilePage.tsx`
- [x] TypeScript `tsc -b` проходит без ошибок
- [x] `vite build` проходит без ошибок

---

## 8. Что делать следующим этапом

### Этап 2: Добавление API-слоя и реальных данных

1. Создать `src/entities/TaxDeduction.ts` — интерфейс `TaxDeduction` (id, year, totalSpent, deductionAmount, status, documents)
2. Создать `src/api/tax-deduction/types.ts` — типы для API
3. Создать `src/api/tax-deduction/mock.ts` — мок-данные с реалистичными суммами
4. Создать `src/api/tax-deduction/service.ts` — `fetchTaxDeduction()` через `apiGet`
5. Создать `src/api/tax-deduction/mapper.ts` — маппер в сущность
6. В `TaxDeductionPage.tsx` — загружать данные через React Query или напрямую из service, показывать реальные суммы вместо «— ₽»

### Этап 3: Улучшения UX

1. Состояние загрузки (скелетон / спиннер)
2. Обработка ошибок (если API недоступен)
3. Кнопка «Оформить вычет» — открытие модалки или переход на внешнюю ссылку ФНС
4. Адаптивность — проверить на очень узких экранах (< 360px)

### Этап 4: Интеграция с реальным бэкендом

1. Заменить моки на реальные API-вызовы
2. Добавить авторизацию (токен) в запросы вычета
3. Тестирование end-to-end

---

## 9. Контекст для следующего агента

**Читай только этот файл + конкретные файлы из таблиц выше.**

- Проект: React 19 + TypeScript 6 + Vite 8 + Zustand + React Router 7 + React Query
- Стилизация: глобальные CSS в `src/app.css` (основной подход) + CSS-модули (`*.module.css`)
- Паттерн API: `src/api/{feature}/service.ts` → `apiGet<T>(url)` → `mapper.ts` → сущность
- UI-компоненты: `src/shared/ui/` — Button, Card, Modal, Section, Badge, Input
- Store: Zustand `src/stores/appStore.ts` — хранит `user: User | null`
- Роутинг: `createBrowserRouter` в `src/app/router.tsx`, `<AppShell>` обёртка с навигацией снизу
- Страница профиля: `src/pages/profile/ProfilePage.tsx` — массив `menu` с объектами `{ icon, label }`, рендерится через `.map()`
- Новые маршруты добавляются в массив `children` роутера и в `src/shared/config/routes.ts`
- Ключевые CSS-классы для профиля: `.page`, `.profileHero`, `.profileMenu`, `.menuRow`, `.arrow`
- Иконки: inline SVG в компонентах (не отдельные файлы)
