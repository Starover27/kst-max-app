# Дизайн-система MAX Clinic App

Основана на эталоне `docs/design-reference.png` и текущих токенах проекта (`src/shared/styles/*`).

---

## 1. Цвета

### Брендовые
| Токен | Значение | Использование |
|---|---|---|
| `--red` | `#E3232A` | Основной акцент: CTA, активные элементы, ссылки, иконки навигации |
| `--red-dark` | `#A81B20` | Hover/active красных элементов |
| `--red-light` | `#FBEAEA` | Фоны с красным акцентом (badges, highlights) |
| `--orange` | `#F97316` | Активная дата в календаре, действие «Перенести», статус «В работе» |
| `--green` | `#16A34A` | Статус «Готово», успех |
| `--gray` | `#58595B` | Вторичный текст, иконки |
| `--gray-dark` | `#2F3033` | Конец градиентов, заголовки на тёмном |
| `--gray-light` | `#F5F5F5` | Фон чипов, кнопок-ghost |

### Поверхности
| Токен | Значение | Использование |
|---|---|---|
| `--color-bg` | `#F7F8FA` | Фон приложения |
| `--color-surface` | `#FFFFFF` | Карточки, модалы, навигация |
| `--color-border` | `#E8E8EC` | Разделители, бордеры карточек |
| `--chip` | `#ECECEE` | Неактивные чипы и кнопки |

### Текст
| Токен | Значение | Использование |
|---|---|---|
| `--color-text` | `#1C1C1E` | Основной текст |
| `--color-text-secondary` | `#6B7280` | Подзаголовки, описания |
| `--color-text-muted` | `#9CA3AF` | Placeholder, неактивные элементы |
| `--color-text-inverse` | `#FFFFFF` | Текст на градиентах/красном |

### Градиенты
| Токен | Значение | Использование |
|---|---|---|
| `--gradient-primary` | `linear-gradient(100deg, #E3232A 0%, #7A1220 55%, #4B5563 100%)` | Promo-баннер, шапка профиля |
| `--gradient-accent-orange` | `linear-gradient(100deg, #F97316 0%, #B3261E 60%, #57534E 100%)` | Hero «Мои записи» |
| `--gradient-hero` | `linear-gradient(180deg, #EAF2FB 0%, #DFE9F5 100%)` | Фон hero главного экрана |

---

## 2. Типографика

Шрифт: **Inter** (fallback: `'Segoe UI', system-ui, Arial, sans-serif`).

| Уровень | Размер | Вес | Line-height | Использование |
|---|---|---|---|---|
| H1 | 24px | 700 | 1.2 | Заголовок hero («Ваше здоровье — наш приоритет») |
| H2 | 20px | 700 | 1.3 | Имя профиля, заголовки секций |
| H3 | 18px | 700 | 1.3 | Заголовок страницы (topBar) |
| Section | 16px | 700 | 1.3 | Заголовки секций («Наши врачи») |
| Body | 15px | 500 | 1.4 | Текст карточек, кнопок, меню |
| Body-bold | 15px | 700 | 1.3 | ФИО врача, название анализа |
| Caption | 13px | 500 | 1.4 | Специальность, описание, цены |
| Small | 12px | 500 | 1.3 | Стаж, даты, статусы |
| Micro | 11px | 500 | 1.25 | Подписи нижней навигации |
| Logo | 12px | 800 | 1.15 | Текст логотипа (uppercase) |

---

## 3. Отступы и размеры

| Токен | Значение | Использование |
|---|---|---|
| `--space-xs` | 4px | Минимальные зазоры |
| `--space-sm` | 8px | Зазоры между чипами, иконками |
| `--space-md` | 12px | Внутренние отступы карточек (между элементами) |
| `--space-lg` | 16px | Padding страниц, отступы между карточками |
| `--space-xl` | 20px | Отступы hero-блоков |
| `--space-2xl` | 28px | Padding profile-hero |

Ширина контента: **max-width 480px**, margin auto.

---

## 4. Радиусы

| Токен | Значение | Использование |
|---|---|---|
| `--radius-sm` | 12px | Иконки-кнопки, фото врача, dateCell, timeCell |
| `--radius-md` | 14px | Кнопки (btnPrimary), quickBtn |
| `--radius-lg` | 16px | Карточки (doctorCard, analysisCard, card) |
| `--radius-xl` | 20px | Hero-блоки, profileHero, modalBox |
| `--radius-full` | 999px | Чипы, toast, toggle, аватары |

---

## 5. Тени

| Токен | Значение | Использование |
|---|---|---|
| `--shadow-card` | `0 2px 8px rgba(0,0,0,0.06)` | Карточки в списке |
| `--shadow-elevated` | `0 6px 16px rgba(0,0,0,0.08)` | quickBtn (перекрывают hero) |
| `--shadow-modal` | `0 12px 40px rgba(0,0,0,0.2)` | Модалы |
| `--shadow-nav` | `0 -1px 4px rgba(0,0,0,0.04)` | Нижняя навигация |

---

## 6. Z-index

| Токен | Значение | Элемент |
|---|---|---|
| `--z-content` | 1 | Контент |
| `--z-quick` | 2 | quickGrid (поверх hero) |
| `--z-nav` | 40 | bottomNav |
| `--z-modal` | 60 | modalOverlay |
| `--z-toast` | 70 | toast |

---

## 7. Компоненты

### Button
- **primary**: фон `--red`, текст белый, radius 14px, padding 15px 16px, font 15px/600. Active: `--red-dark`. Disabled: opacity 0.5.
- **ghost**: фон `--chip`, текст `--color-text`, radius 12px, padding 12px 16px, font 14px/500. Flex, space-between.
- **danger** (logout): фон `--chip`, текст `--red`, font 15px/700, radius 14px.

### Chip (фильтр)
- Неактивный: фон `--chip`, текст `--color-text`, font 13px/500, padding 9px 14px, radius full.
- Активный: фон `--red`, текст белый.
- Тёмный активный (альтернатива): фон `#4B5563`.

### Card (doctorCard)
- Фон белый, radius 16px, padding 14px, flex row, gap 12px.
- Фото: 84x96px, radius 12px, object-fit cover.
- Кнопка избранного: absolute top-right, иконка-сердце, неактивная `#B6BAC2`, активная `--red`.

### BottomNavigation
- Фиксирована снизу, фон белый, border-top 1px `--color-border`.
- 4 вкладки, flex column, иконка 24px + подпись 11px/500.
- Неактивная: `--color-text-muted`. Активная: `--red`.
- padding-bottom: `env(safe-area-inset-bottom)`.

### Header (topBar)
- Flex, space-between, padding 12px 4px.
- Логотип слева, иконка-колокольчик справа (iconBtn 40x40, radius 12).

### Modal
- Overlay: rgba(0,0,0,0.45), z-60.
- Box: белый, radius 18px, padding 18px, max-width 400px, max-height 80vh, overflow auto.

### Toggle
- 46x26px, radius full. Off: `#D1D5DB`. On: `--red`.
- Круг 20px, белый, тень, анимация left 0.2s.

### Toast
- Фиксирован bottom 90px, center. Фон `#1F2430`, текст белый, radius full, padding 10px 18px, font 13px.

---

## 8. Экраны и паттерны

### Главный экран
- Hero: gradient-hero фон, логотип, H1-приветствие, подзаголовок, фото клиники (height 190px, radius 20, overflow hidden).
- QuickGrid: 4x2 сетка, карточки перекрывают hero (margin-top -34px, z-index 2), тень elevated.
- PromoBanner: gradient-primary, flex, иконка + текст + стрелка-кнопка (rgba(255,255,255,0.18), круг 34px).

### Врачи
- ChipsRow: горизонтальный скролл, gap 8px, padding 4px 16px 12px. Скроллбар скрыт.
- DoctorCard: вертикальный список, margin 0 16px 12px.

### Запись
- DateRow: горизонтальный скролл, ячейки 56px, radius 14, flex column (день недели 12px, число 17px/700, месяц 10px). Активная: фон `--orange`, текст белый.
- TimeGrid: grid 3 колонки, gap 10px, ячейки radius 12, padding 13px, font 14px/500. Активная: `--red`/белый. Disabled: opacity 0.45, line-through.

### Мои записи
- ApptHero: gradient-accent-orange, radius 16, padding 18, flex. День 34px/800, месяц 14px. Разделитель border-left rgba(255,255,255,0.4).
- InfoRow: flex space-between, padding 9px 0, border-bottom 1px `--color-border`. Key: muted, Value: 600.
- ActionRow: flex, gap 12, padding 13px 4px, font 14/600. Danger: `--red`.

### Профиль
- ProfileHero: gradient-primary, radius 20, padding 28px 20px 44px, text-align center.
- Аватар: 96px, круг, фон `#E5E7EB`, инициалы 34px/700 `#6B7280`. Кнопка редактирования: 30px круг, белый фон, absolute bottom-right.
- Меню: белый, radius 20, margin-top -24px (перекрывает hero), padding 6px 16px.
- MenuRow: flex, gap 14, padding 15px 2px, font 14/500, border-bottom. Стрелка справа, muted.

### Анализы
- AnalysisCard: белый, radius 16, padding 16, margin-bottom 12.
- Статус «Готов»: muted. Статус «В работе»: `--orange`.

---

## 9. Иконки

Формат: inline SVG, stroke `currentColor`, strokeWidth 2, strokeLinecap round, viewBox 0 0 24 24.
Размеры: 24px (навигация, действия), 20px (карточки), 16px (кнопки-иконки).

---

## 10. Анимации

- Page fade-in: opacity 0 → 1, 200ms ease-out (классы `page-fade-enter` / `page-fade-enter-active`).
- Toggle: transition left 0.2s, background 0.2s.
- Button active: `transform: scale(0.97)` (quickBtn).
- Skeleton: shimmer 1.2s infinite (для загрузок).

---

## 11. Safe-area и адаптивность

- `viewport-fit=cover` в meta viewport.
- `padding-bottom: env(safe-area-inset-bottom)` для bottomNav.
- Min-width приложения: 320px.
- Max-width контента: 480px (мобильный формат MAX Mini App).
- На экранах > 480px контент центрируется.

---

## 12. Правила использования

1. Все цвета — только через CSS-переменные. Никаких hex в компонентах.
2. Отступы — через токены `--space-*`.
3. Радиусы — через `--radius-*`.
4. Не использовать inline-стили для повторяющихся паттернов.
5. Акцентный цвет один — `--red`. Оранжевый только для дат и «перенести». Зелёный только для статусов успеха.
6. Текст на градиентах — только белый.
7. Карточки всегда на белом фоне, страница — `--color-bg`.
8. Иконки — stroke, не fill (кроме активных состояний навигации).
