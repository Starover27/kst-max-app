# Анализ приложения Клиники Современных Технологий (КСТ)

> База для следующих доработок. Составлен 18.08.2026 на основе исходников `src/`, данных `src/data/` и выгрузок `tmp_*.html` / `kst27.ru`.

---

## 1. Текущая структура экранов

### 1.1 Маршрутизация (`src/app/router.tsx`)

Все экраны вложены в `AppShell` (нижнее меню):

```tsx
/                 -> HomePage
/doctors          -> DoctorsPage (список)
/doctors/:doctorId -> DoctorProfilePage (профиль врача)
/booking          -> BookingPage (выбор врача)
/booking/:doctorId -> BookingPage (выбор даты/времени)
/appointment      -> AppointmentPage (Мои записи / конкретная запись)
/analysis         -> AnalysisPage
/profile          -> ProfilePage
```

`DoctorsPage`, `HomePage`, `BookingPage`, `AnalysisPage`, `AppointmentPage` имеют `pageWide` / `paddingBottom: 96` для нижнего меню.

### 1.2 Главная — `src/pages/home/HomePage.tsx`

Реализация мобильного экрана, свёрстанного по скриншотам:

*   **Шапка `topBar`**: лого `logo.png` + подпись "Клиника современных технологий / для взрослых и детей" + `iconBtn` колокольчик (уведомления).
*   **Hero-блок `homeHero`**: приветствие `"Здравствуйте, Денис!"`, подзаголовок `"Мы заботимся..."`, фото `clinic.jpg`.
*   **Сетка 8 кнопок `quickGrid` (`quickBtn`)**:

| # | Иконка | Текст | Действие сейчас |
|---|--------|-------|-----------------|
| 1 | calendar | Записаться к врачу | `nav('/doctors')` |
| 2 | clipboard | Мои записи | `nav('/appointment')` |
| 3 | flask | Анализы и результаты | `nav('/analysis')` |
| 4 | card | Оплата услуг | `Modal` заглушка |
| 5 | user | Врачи | `nav('/doctors')` |
| 6 | doc | Направления | `Modal` заглушка |
| 7 | star | Отзывы | `Modal` с 2 фейк-отзывами |
| 8 | pin | Как добраться | `Modal` с адресом |

*   **Промо-баннер `promoBanner`**: SVG сердце + пульс, текст "Ваше здоровье — наша главная цель", стрелка -> открывает модалку маршрута.
*   **Модалки `info: InfoKey`**: `payment`, `referral`, `reviews`, `route`, `notify` — реализованы через `shared/ui/Modal`.

Отличия от `tmp_home.html` (сайт kst27.ru): на сайте есть слайдер, блок записи kdoctor, преимущества, список врачей. В приложении главная упрощена до 8 плиток — сознательное решение для мобилки.

### 1.3 Врачи — `src/pages/doctors/DoctorsPage.tsx` + `DoctorProfilePage.tsx`

*   **DoctorsPage**:
    *   Топ-бар с `pageTitle: "Врачи"` и кнопкой поиска (лупа) `searchOpen`.
    *   Поле `<input>` поиска по `ФИО / специальности / отделению / описанию` (case-insensitive `toLocaleLowerCase('ru')`).
    *   Чипы `chipsRow`: `Все специалисты` + уникальные `specialties` из `doctors.flatMap(d => d.specialties)`, отсортированные `localeCompare('ru')`.
    *   Состояния: `loading` спиннер, `loadError` + кнопка "Повторить", `empty` "Врачи не найдены" + "Сбросить фильтры".
    *   Карточка `doctorCard`: фото (`DoctorPhoto` с `fallback` инициалами), `doctorName`, `doctorSpec` (`title`), `doctorExp` ("Стаж N лет"), `primaryPrice` ("Первичный приём · X ₽" из `doctor-prices.json` где `status === 'verified'`), кнопка избранного `favBtn` (`useFavorites / toggleFavorite`).
    *   Клик -> `nav('/doctors/:id')`.
*   **DoctorProfilePage** (по роутеру, видно по аналогии):
    *   Фото крупно, ФИО, должность, отделение, стаж, рейтинг, описание, избранное, кнопка "Записаться" -> `/booking/:id`.

### 1.4 Профиль — `src/pages/profile/ProfilePage.tsx`

*   `profileHero` с аватаром (инициалы `initials(name)` или `avatarUrl`), кнопка редактирования (карандаш), шестерёнка настроек в углу.
*   Имя `fullName` из `appStore.user` (fallback "Денис Петров"), телефон/email `phone`.
*   Меню `profileMenu` (`menuRow`):
    1. Личные данные (`user`)
    2. История посещений (`clock`)
    3. Документы (`doc`)
    4. Семейный доступ (`users`)
    5. Уведомления (`bell`) — переключатель `toggle on/off` `remind` state
    6. О клинике (`info`)
    7. Помощь и поддержка (`help`)
*   Кнопка `logoutBtn` -> `api/auth/service logout()` с `isLoading`.

Все пункты кроме "Выйти" пока без навигации — заглушки.

### 1.5 Запись — `src/pages/booking/BookingPage.tsx`

Два режима:
*   **Без `doctorId`**: список всех врачей `doctorCard` -> клик `nav('/booking/:id')`, заголовок "Выберите специалиста".
*   **С `doctorId`**: `docSummary` карточка врача + рейтинг, блок `dateRow` (10 дней `getNextDays(10)` с `weekday/day/monthShort`, активный `dateISO`), сетка `timeGrid` `TIMES = [09:00 ... 16:00]` 13 слотов. `busyTimes(doctorId, dateISO)` — детерминированная псевдо-занятость на основе хеша строки. Выбранное `time` -> кнопка фиксированная `position: fixed bottom:70` "Записаться на HH:MM" -> `setAppointment({doctorId, dateISO, time, cabinet: 'Кабинет 203, 2 этаж'})` -> `nav('/appointment')`.

### 1.6 Мои записи — `src/pages/appointments/AppointmentsPage.tsx`

*   Пусто `!appointment` -> `empty` "У вас пока нет активных записей" + `btnPrimary "Записаться к врачу"` -> `/doctors`.
*   Есть `appointment` (из `bookingStore`):
    *   `apptHero` красный градиент: слева день/месяц `formatDateParts`, справа `Сегодня в HH:MM`, сокращённое ФИО, `title`, `cabinet`, декоративная кардиограмма SVG.
    *   Карточка "О приёме": причина "Консультация", длительность 30 мин, стоимость `(doctor.price ?? 2000)`, статус "Подтверждена".
    *   Карточка действий: `actionRow "Перенести запись"` -> `/booking/:doctorId`, `actionRow danger "Отменить запись"` -> `Modal` подтверждение -> `setAppointment(null)` + `toast "Запись отменена"`.
    *   Карточка "Напомнить о приёме" с `toggle`.

### 1.7 Анализы — `src/pages/analysis/AnalysisPage.tsx`

*   Топ-бар с кнопкой назад, заголовок "Анализы и результаты".
*   Чипы фильтра: `Все / Готовые / В работе` (`Filter = 'all' | 'ready' | 'work'`), активный `activeDark`.
*   Мок-данные `ITEMS = 3` (Общий анализ крови 12.08.2024, Биохимия 10.08.2024, Анализ мочи 05.08.2024) статус "Готов".
*   Карточка `analysisCard`:	title/date + бейдж `statusReady/statusWork`, кнопка `btnGhost "Смотреть результат"` + иконка скачивания. Пустой стейт "Нет результатов".

---

## 2. Существующий функционал

| Функция | Где | Статус | Комментарий |
|---------|-----|--------|-------------|
| **Запись к врачу** | `Home quickBtn[0]` -> `DoctorsPage` -> `BookingPage` | Работает (мок) | Выбор врача, даты, времени, сохранение в `bookingStore` (`localStorage`). Нет интеграции с `kdoctoru.ru/client/16/frame/`. На сайте — виджет iframe `bookingwidget-cont` с `baseURL https://kdoctoru.ru/client/16/frame/`, выбором клиники (23,24,25) и услуги. |
| **Мои записи** | `quickBtn[1]` -> `AppointmentPage` | Работает (локально) | Хранит одну запись `appointment` в памяти/LS. Есть перенос/отмена/напоминание. На сайте — отдельные формы `fos1`, `fos1-skor`. |
| **Анализы и результаты** | `quickBtn[2]` -> `AnalysisPage` | Заглушка | 3 мок-записи, фильтры. На сайте — раздел лабораторной диагностики, но API результатов нет. |
| **Оплата услуг** | `quickBtn[3]` modal | Заглушка текста | На сайте `https://kst27.ru/index.php/oplata-uslug` — реальная онлайн-оплата. В данных `prices.json` 2424 позиции прайса. |
| **Врачи** | `quickBtn[4]` -> `DoctorsPage` | Работает с реальными данными | `src/shared/data/doctors` из `src/data/doctors.json` (72 врача, 6 отделений). Фото с `kst27.ru`, цены `doctor-prices.json` verified, избранное `useFavorites`. |
| **Направления** | `quickBtn[5]` modal | Заглушка | Текст "выдаёт терапевт на приёме" + кнопка записи. На сайте нет отдельного сервиса — часть приёма. |
| **Отзывы** | `quickBtn[6]` modal | Заглушка | 2 фейк-карточки. На сайте `https://kst27.ru/index.php/kliniki/otzyvy` и VK. |
| **Как добраться** | `quickBtn[7]` modal + `route` | Заглушка | Адрес "Тихоокеанская 73" (неверный — см. п.4 актуальные 5 филиалов). Телефон "+7 (4212) 00-00-00" — плейсхолдер, реальный `+7 (4212) 48-88-88`. |
| **Уведомления** | `bell` в Home | Заглушка | Модалка "Напоминание за 1 день". Тоггл есть в Profile и Appointment. |
| **Промо баннер** | Home | Статика | "Современное оборудование..." -> ведёт на route модалку. |

**Дополнительно реализовано, но не отражено в скриншотах:**
*   Избранные врачи (`favBtn` + `bookingStore`).
*   Профиль: toggles, логаут, `appStore.user`.
*   Поиск врачей с chips + input.

**В разработке / заглушки, требуемые по ТЗ:**
*   Документы, История посещений, Семейный доступ, О клинике, Помощь — только пункты меню.
*   Оплата, направления, отзывы, анализы — без бэкенда.

---

## 3. Навигация

### 3.1 Нижнее меню — `src/widgets/layout/AppShell.tsx`

`AppShell` — `display:flex` колонка, `main { flex:1 }` + `nav.bottomNav` fixed.

| Иконка | Лейбл | `to` | Активность `isActive` |
|--------|-------|------|-----------------------|
| `IconHome` (домик) | Главная | `/` | `pathname === '/'`, заливка `fill=currentColor` если активно |
| `IconCalendar` (календарь) | Запись | `/booking` | `pathname.startsWith('/booking')` |
| `IconFlask` (колба + полоска) | Анализы | `/analysis` | `startsWith('/analysis')` |
| `IconUser` (человек) | Профиль | `/profile` | `startsWith('/profile')`, заливка если активно |

Класс `active` подсвечивает. `maxWidth:480` центрирование, `bottomNav` высота ~70px, поэтому страницы имеют `paddingBottom:96/110`.

### 3.2 Вторичная навигация

*   `topBar` с `iconBtn` назад (стрелка) на вложенных экранах (`Booking`, `Appointment`, `Analysis`).
*   `HomePage` quickGrid дублирует нижнее меню + даёт быстрый доступ к 4 доп. разделам (оплата, направления, отзывы, маршрут).
*   `DoctorsPage` -> `DoctorProfile` -> `Booking` цепочка.
*   `Appointment` "Перенести" -> обратно в `Booking`.

### 3.3 Несоответствие ТЗ и скриншотов

ТЗ просит `Главная, Запись, Анализы, Профиль` — так и сделано. На скриншотах альтернатива видна как `Главная, Врачи, Профиль` — сейчас "Врачи" доступны только через Home плитку и `/doctors` без пункта в bottomNav. Рекомендация: при желании вернуть "Врачи" в нижнее меню — заменить `/booking` на `/doctors` или сделать 5 пунктов (нарушит `maxWidth`).

---

## 4. Данные из kst27.ru для интеграции

### 4.1 Общий обзор `docs/DATA_SOURCES.md`

Данные лежат в `src/data/*.json`, загружаются через `src/shared/data/*` адаптеры.

| Файл | Источник | Что внутри | Дата |
|------|----------|------------|------|
| `doctors.json` | `https://kst27.ru/index.php/nasha-komanda/vrachi` | 72 врача из 6 отделений | 2026-08-15 |
| `clinics.json` | `https://kst27.ru/index.php/kontakty` | 5 филиалов + стационар, адреса, часы, услуги | 2026-08-15 |
| `services.json` | `https://kst27.ru/index.php/uslugi` | Каталог направлений/услуг | 2026-08-15 |
| `contacts.json` | `https://kst27.ru/index.php/kontakty` | Телефоны, email, часы, соцсети | 2026-08-15 |
| `prices.json` | `https://kdoctoru.ru/client/16/price/` | 2424 позиции прайса клиента 16 | 2026-08-16 |
| `doctor-prices.json` | `tmp_price_live.json` + `scripts/build_doctor_prices.cjs` | `records: {doctorId, visitType, price, currency, status}` | 2026-08-16 |

Выгрузки `tmp_*.html` — сырые HTML страниц сайта для парсинга.

### 4.2 Сайт `kst27.ru` — структура (`tmp_kst_sitemap.xml` 7042 URL)

Основные разделы:

*   `/` — Главная с `bookingwidget-cont` (kdoctor), слайдером, преимуществами.
*   `/nasha-komanda/vrachi/...` — 15 отделений: Терапии, Педиатрии, Гинекологии, Неврологии, Офтальмологии, Онкологии, Хирургии, ЛОР, Диагностическое, Лучевой диагностики, КДЛ, Анестезиологии и РАО, Восстановительной терапии, СМП и т.д. Каждый врач `/.../id-fio` с фото, должностью, стажем.
*   `/uslugi/...` — услуги по филиалам: `sheronova6` (взрослое, 28 услуг), `sheronova-8-k-3-1-etazh` (детское, 9 услуг), `sheronova-8-k-3-2-etazh` (центр здорового ребёнка 20+ патронажные), `rudneva-17` (многопрофильная 15), `sheronova-10` (лаб+СМП), `hospital` (гинеко/хирург стационар), `chek-ap`.
*   `/price` — прайс (дубль `kdoctoru.ru/client/16/price/` JSON).
*   `/oplata-uslug` — онлайн-оплата.
*   `/kontakty` — контакты, 5 адресов, телефоны.
*   `/kliniki/otzyvy`, `/foto-i-video`, `/news` — контент.

### 4.3 Филиалы (`src/data/clinics.json`)

5 адресов, все `Пн-Пт 08:00-21:00, Сб-Вс 08:00-19:00`:

*   `sheronova-6` Взрослое отделение — Шеронова 6, ЖК "Дендрарий" [48.4682,135.087] — 28 категорий (аллерго, гастро, гемат, гинеко, дермато, кардио, космето, лаб, генетик, невро, нефро, хирург, онко, офтальмо, пульмо, ревмато, сосудист., терапевт, травмато, УЗИ, уролог, эндокрин., ФГДС, функц.диагн., колоноскопия).
*   `sheronova-8-children` Детское 1 этаж — Шеронова 8 к.3 [48.4683,135.086] — инфекционист, лаб, СМП, ЛОР, педиатр, психотерапевт, пульмо + процедурн/больничные.
*   `sheronova-8-center` Центр здорового ребёнка 2 этаж — Шеронова 8 к.3 — аллерго, вакцинопроф., гемат, дет.кардио, невро, нефро, онко, ортопед, педиатр, уролог, физиотер., дет.хирург, дет.эндокрин., УЗИ, функц., лучевая, патронаж 0-3г. + п/отд восстановительной (физио, массаж).
*   `sheronova-10` Лаборатория СМП — Шеронова 10 [48.4689,135.085] — СМП, лаб.
*   `rudneva-17` Многопрофильная — Руднева 17 [48.5580,135.035] — 15 категорий (аналог Шеронова 6 без космето/травмато).
*   `hospital` Стационар — гинекология/хирургия.

Все координаты и `services_categories` — готовый контент для экрана "Как добраться" / выбора филиала при записи.

### 4.4 Врачи (`src/data/doctors.json` + `tmp_kst_doctors.html`)

72 врача (на 15.08.26, сейчас по sitemap >150). Поля: `id (slug fio)`, `name`, `title`, `department`, `specialties[]`, `photo (https://kst27.ru/images/...)`, `experience`, `rating`, `description`, `category`. Отделения совпадают с филиалами. Используются для `DoctorsPage` чипов и поиска.

### 4.5 Прайс (`src/data/prices.json` / `tmp_price_api.json`)

JSON `https://kdoctoru.ru/client/16/price/` — массив `{id, name, price, category}` 2424 записи. `_meta {source, fetched_date, status}`. Связь с `doctor-prices.json`: `records` мапит `doctorId -> visitType -> price` со статусами `verified/needs_review/not_found`. Для интеграции оплаты — искать по `name`/`category` и фильтровать по отделению.

### 4.6 Виджет записи (`tmp_home.html` `bookingwidget-cont`)

```
baseURL: https://kdoctoru.ru/client/16/frame/
departments: [{id:23 name:"Взрослая поликлиника" address:"Шеронова 6"},
             {id:24 name:"Детская поликлиника" address:"Шеронова 8 корп 3"},
             {id:25 name:"Многопрофильный центр" address:"Руднева 17"}]
services: [417 Терапия, 1 Гинекология, 537 Педиатрия, 217 Кардиология, 310 Неврология, 95 Гастро, 335 ЛОР, 464 Хирургия, 592 Рентген, 328 Онкология]
servicesSharonova6AndRudneva: + дермато 9, космето 21, офтальмо 47, УЗИ 71, аллерго 3, урология 72, гемат 62, эндокрин 80, травмато 70
flow: renderDepartments -> click department -> renderServices -> click service -> renderBookingWidget(url?service_id&departments)
iframe: booking-iframe frameborder 0 lazy loading
```

Для мобилки можно встроить iframe или дергать тот же endpoint напрямую: `GET https://kdoctoru.ru/client/16/frame/?service_id={id}&departments={id}`.

### 4.7 Контакты (`tmp_contacts.html` + `src/data/contacts.json`)

*   Единый телефон `+7 (4212) 48-88-88` + доп `48-22-22`, `48-33-33`, `33-20-20`.
*   Онлайн-консультация `MilaWidget` (`https://widget.mila.online/static/css/main.css` + `showMilaWidget()`), "Вызвать скорую" `fos1-skor`, "Версия для слабовидящих" `bvi-open`.
*   Режим `Ежедневно 8:00-21:00`.
*   Соц-боты: `https://t.me/kst_tg_bot`, `https://max.ru/id2721191316_bot` (MAX).
*   Адреса см. п.4.3. В модалке Home сейчас неверный адрес/телефон — заменить на данные из `contacts.json`.

### 4.8 Что готово к интеграции без парсинга

*   Все `src/data/*.json` валидны, `scripts/validate_data.cjs` проходит.
*   Обновление прайса: `tmp_price_api.json -> src/data/prices.json` скриптом из `DATA_SOURCES.md`.
*   Парсеры `scripts/parse_*` уже извлекают врачей/отделения/цены из `tmp_*.html`.

---

## 5. База для следующих доработок (бэклог)

### 5.1 Приоритеты

1.  **Интеграция записи**: заменить `busyTimes` мок на iframe `kdoctoru.ru` или API, передавать `departmentId/serviceId/doctorId`.
2.  **Оплата**: экран с поиском по `prices.json` + переход на `kdoctoru.ru/client/16/price` / `oplata-uslug`.
3.  **Анализы**: API получения результатов (пока заглушка).
4.  **Навигация**: решить судьба "Врачи" в `bottomNav` (сейчас только Home плитка).
5.  **Контент**: заполнить Профиль разделы, подключить `contacts.json/clinics.json` в модалки маршрута, отзывы ленту с `kliniki/otzyvy`.
6.  **Данные**: ре-парсинг `doctors.json` (72 -> 150+ врачей), обновление `doctor-prices` `verified`.
7.  **Уведомления**: push/WebPush `shared/api/notifications`.

### 5.2 Технические заметки

*   Стек: React 18 + TS + react-router 6 + zustand (`appStore`, `bookingStore`) + Vite + Cloudflare Workers (`wrangler.toml`).
*   Хранилища: `src/shared/data/doctors.ts` адаптер, `src/stores/bookingStore.ts` LS.
*   Стили: `src/app.css` + `index.css` CSS-переменные `--red`, `--orange`, `--bg`, `--border`, `--gray`, `--text`; классы `page`, `card`, `chip`, `bottomNav`, `doctorCard`, `toggle`.
*   Активы: `src/assets/logo.png`, `clinic.jpg`, `doctors/*`.

---

*Документ сгенерирован автоматически после анализа скриншотов (HomePage, DoctorsPage, ProfilePage, BookingPage, AnalysisPage, AppointmentPage) и выгрузок `kst27.ru`. Для актуализации данных запустить `npm run validate` и перегенерировать `src/data` из `tmp_*`.*
