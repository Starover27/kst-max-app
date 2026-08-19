const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://kst27.ru';
const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

const MAIN_HTML_FILE = 'tmp_kst_doctors.html';

const DEPARTMENTS = {
  'otdelenie-terapii': 'Отделение Терапии',
  'otdelenie-pediatrii': 'Отделение Педиатрии',
  'otdelenie-ginekologii': 'Отделение Гинекологии',
  'otdelenie-nevrologii': 'Отделение Неврологии',
  'otdelenie-oftalmologii': 'Отделение Офтальмологии',
  'otdelenie-onkologii': 'Отделение Онкологии',
  'otdelenie-khirurgii': 'Отделение Хирургии',
  'otdelenie-otorinolaringologii': 'Отделение ОтоРиноЛарингологии',
  'diagnosticheskoe-otdelenie': 'Диагностическое Отделение',
  'otdelenie-luchevoj-diagnostiki': 'Отделение Лучевой Диагностики',
  'kliniko-diagnosticheskaya-laboratoriya': 'Клинико-Диагностическая Лаборатория',
  'otdelenie-anesteziologii-i-rao': 'Отделение Анестезиологии и РАО',
  'otdelenie-vosstanovitelnoj-terapii': 'Отделение Восстановительной Терапии',
  'stantsiya-smp': 'Станция СМП',
};

const DEPT_URLS = {};
for (const [slug, name] of Object.entries(DEPARTMENTS)) {
  DEPT_URLS[name] = BASE_URL + '/index.php/nasha-komanda/vrachi/' + slug;
}

const CLINICS = [
  { id: 1, name: 'Взрослое отделение', address: 'г. Хабаровск, ул. Шеронова, 6', source: 'https://kst27.ru/index.php/kontakty' },
  { id: 2, name: 'Детское отделение', address: 'г. Хабаровск, ул. Шеронова, 8 к.3 - 1 этаж', source: 'https://kst27.ru/index.php/kontakty' },
  { id: 3, name: 'Центр здорового ребенка', address: 'г. Хабаровск, ул. Шеронова, 8 к.3 - 2 этаж', source: 'https://kst27.ru/index.php/kontakty' },
  { id: 4, name: 'Лаборатория СМП', address: 'г. Хабаровск, ул. Шеронова, 10', source: 'https://kst27.ru/index.php/kontakty' },
  { id: 5, name: 'Мультипрофильная клиника', address: 'г. Хабаровск, ул. Руднева, 17', source: 'https://kst27.ru/index.php/kontakty' },
];

// Загружаем предыдущие данные как fallback для определения отделов
function loadPreviousDoctors() {
  const prevPath = path.join(DATA_DIR, 'doctors.json');
  if (!fs.existsSync(prevPath)) return new Map();
  try {
    const prev = JSON.parse(fs.readFileSync(prevPath, 'utf8'));
    const map = new Map();
    for (const doc of (prev.doctors || [])) {
      if (doc.detail_page_url && doc.department) {
        map.set(doc.detail_page_url, doc.department);
      }
    }
    return map;
  } catch { return new Map(); }
}

function parseDoctorsFromHtml(html) {
  const doctors = [];
  // Ищем НЕ-закомментированные карточки
  // Сначала удалим все HTML-комментарии
  const cleanHtml = html.replace(/<!--[\s\S]*?-->/g, '');
  
  const cardRegex = /<div\s+class="sotrud-td\s+swiper-slide[^"]*">([\s\S]*?)<\/div>\s*(?=<div\s+class="sotrud-td|<script|if\s*\(doctor)/gi;
  
  let match;
  while ((match = cardRegex.exec(cleanHtml)) !== null) {
    const cardHtml = match[0];
    
    const linkMatch = cardHtml.match(/<a\s+href="([^"]+)"\s+class="doctors-slider-info"/i);
    const profilePath = linkMatch ? linkMatch[1] : null;
    
    const photoMatch = cardHtml.match(/data-src="([^"]+)"/i) 
      || cardHtml.match(/src="([^"]+)"[^>]*(?:class="lazy"|alt=)/i);
    let photoUrl = null;
    if (photoMatch) {
      const src = photoMatch[1];
      if (src && !src.includes('example.png')) {
        photoUrl = src.startsWith('http') ? src : BASE_URL + (src.startsWith('/') ? '' : '/') + src;
      }
    }
    
    const fioMatch = cardHtml.match(/<p\s+class="fio">([^<]+)<\/p>/i);
    const fullName = fioMatch ? fioMatch[1].trim() : null;
    
    const specMatch = cardHtml.match(/<p\s+class="opis_vrach">([^<]+)<\/p>/i);
    const specialty = specMatch ? specMatch[1].trim() : null;
    
    if (fullName && profilePath) {
      const detailUrl = profilePath.startsWith('http') 
        ? profilePath 
        : BASE_URL + (profilePath.startsWith('/') ? '' : '/') + profilePath;
      
      doctors.push({
        full_name: fullName,
        specialty_text: specialty,
        photo_url: photoUrl,
        detail_page_url: detailUrl,
      });
    }
  }
  
  return doctors;
}

function inferDepartmentFromUrl(url) {
  for (const [slug, name] of Object.entries(DEPARTMENTS)) {
    if (url.toLowerCase().includes(slug)) {
      return name;
    }
  }
  return null;
}

function parseSpecialty(specStr) {
  if (!specStr) return { specialties: null, has_km: false, category: null };
  
  let str = specStr.trim();
  let hasKm = false;
  let category = null;
  
  if (/\bКМН\b/i.test(str) || /к\.м\.н\./i.test(str)) {
    hasKm = true;
    str = str.replace(/,?\s*КМН/gi, '').replace(/,?\s*к\.м\.н\./gi, '').trim();
  }
  
  str = str.replace(/^Врач\s+/i, '');
  
  const parts = str.split(',').map(s => s.trim()).filter(Boolean);
  
  const categoryPatterns = /высш|перв|втор/i;
  for (let i = parts.length - 1; i >= 0; i--) {
    if (categoryPatterns.test(parts[i])) {
      category = parts[i];
      parts.splice(i, 1);
    }
  }
  
  return {
    specialties: parts.length > 0 ? parts : null,
    has_km: hasKm,
    category: category,
  };
}

function parseName(fullName) {
  const parts = fullName.split(/\s+/);
  return {
    surname: parts[0] || null,
    first_name: parts[1] || null,
    middle_name: parts[2] || null,
  };
}

function main() {
  console.log('=== Парсинг данных врачей КСТ v2 ===\n');
  
  const mainHtmlPath = path.join(ROOT_DIR, MAIN_HTML_FILE);
  if (!fs.existsSync(mainHtmlPath)) {
    console.error('ОШИБКА: файл ' + MAIN_HTML_FILE + ' не найден!');
    process.exit(1);
  }
  const mainHtml = fs.readFileSync(mainHtmlPath, 'utf8');
  
  const rawDoctors = parseDoctorsFromHtml(mainHtml);
  console.log('Найдено карточек врачей в HTML: ' + rawDoctors.length);
  
  // Загружаем предыдущие данные для fallback
  const prevDeptMap = loadPreviousDoctors();
  console.log('Предыдущих записей с отделами: ' + prevDeptMap.size);
  
  // Собираем уникальных врачей
  const seenUrls = new Set();
  const allDoctors = [];
  
  for (const doc of rawDoctors) {
    if (seenUrls.has(doc.detail_page_url)) continue;
    seenUrls.add(doc.detail_page_url);
    
    // Определяем отдел по URL профиля
    let department = inferDepartmentFromUrl(doc.detail_page_url);
    
    // Fallback: берём из предыдущего JSON
    if (!department) {
      department = prevDeptMap.get(doc.detail_page_url) || null;
    }
    
    const parsed = parseSpecialty(doc.specialty_text);
    const nameParts = parseName(doc.full_name);
    
    allDoctors.push({
      full_name: doc.full_name,
      ...nameParts,
      department: department,
      specialties: parsed.specialties,
      specialty_text: doc.specialty_text || null,
      has_km: parsed.has_km,
      category: parsed.category,
      experience_years: null,
      description: null,
      photo_url: doc.photo_url,
      detail_page_url: doc.detail_page_url,
      source: DEPT_URLS[department] || 'https://kst27.ru/index.php/nasha-komanda/vrachi',
      department_url: DEPT_URLS[department] || null,
    });
  }
  
  // Сортируем по отделу, затем по ФИО
  allDoctors.sort((a, b) => {
    const deptA = a.department || 'Яяя';
    const deptB = b.department || 'Яяя';
    if (deptA !== deptB) return deptA.localeCompare(deptB, 'ru');
    return a.full_name.localeCompare(b.full_name, 'ru');
  });
  
  const output = {
    _meta: {
      source: [
        'https://kst27.ru/index.php/nasha-komanda/vrachi',
        ...Object.values(DEPT_URLS),
      ],
      fetched_date: new Date().toISOString().split('T')[0],
      notes: 'Данные извлечены из HTML сайта kst27.ru. Специальности из поля opis_vrach. Отделы определены по URL профиля или из предыдущей версии данных. Стаж, описание, направления, услуги отсутствуют на страницах списков.',
      doctor_count: allDoctors.length,
      department_count: new Set(allDoctors.map(d => d.department).filter(Boolean)).size,
      clinic_count: CLINICS.length,
    },
    clinics: CLINICS,
    doctors: allDoctors.map((doc, idx) => ({
      id: idx + 1,
      ...doc,
      availability: [],
    })),
  };
  
  const outputPath = path.join(DATA_DIR, 'doctors.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log('\nЗаписано: ' + outputPath);
  
  // Статистика
  const deptCounts = {};
  const specSet = new Set();
  let nullDept = 0;
  let nullSpec = 0;
  let nullPhoto = 0;
  let defaultPhoto = 0;
  let kmCount = 0;
  
  for (const doc of output.doctors) {
    if (!doc.department) nullDept++;
    else deptCounts[doc.department] = (deptCounts[doc.department] || 0) + 1;
    
    if (!doc.specialties) nullSpec++;
    else doc.specialties.forEach(s => specSet.add(s));
    
    if (!doc.photo_url) nullPhoto++;
    else if (doc.photo_url.includes('default.jpg')) defaultPhoto++;
    if (doc.has_km) kmCount++;
  }
  
  console.log('\n=== Статистика ===');
  console.log('Всего врачей: ' + output.doctors.length);
  console.log('Отделений: ' + Object.keys(deptCounts).length);
  console.log('Уникальных специальностей: ' + specSet.size);
  console.log('Врачей с КМН: ' + kmCount);
  console.log('Без отдела: ' + nullDept);
  console.log('Без специальности: ' + nullSpec);
  console.log('Без фото: ' + nullPhoto);
  console.log('Фото default.jpg: ' + defaultPhoto);
  
  console.log('\nПо отделениям:');
  for (const [dept, count] of Object.entries(deptCounts).sort((a, b) => b[1] - a[1])) {
    console.log('  ' + dept + ': ' + count);
  }
  
  console.log('\nСпециальности (' + specSet.size + '):');
  for (const spec of [...specSet].sort()) {
    console.log('  - ' + spec);
  }
  
  // Врачи без отдела
  if (nullDept > 0) {
    console.log('\nВрачи без определённого отдела:');
    for (const doc of output.doctors) {
      if (!doc.department) {
        console.log('  ' + doc.full_name + ' -> ' + doc.detail_page_url);
      }
    }
  }
  
  generateAuditReport(output, deptCounts, specSet, nullDept, nullSpec, nullPhoto, defaultPhoto, kmCount);
}

function generateAuditReport(output, deptCounts, specSet, nullDept, nullSpec, nullPhoto, defaultPhoto, kmCount) {
  const noDeptDoctors = output.doctors.filter(d => !d.department);
  const defaultPhotoDoctors = output.doctors.filter(d => d.photo_url && d.photo_url.includes('default.jpg'));
  
  const report = `# DOCTORS_DATA_AUDIT

## Дата аудита
${new Date().toISOString().split('T')[0]}

## Источник данных
- Основная страница врачей: https://kst27.ru/index.php/nasha-komanda/vrachi
- Страницы отделений (14 подразделений):
${Object.entries(DEPARTMENTS).map(([slug, name]) => `  - ${name}: https://kst27.ru/index.php/nasha-komanda/vrachi/${slug}`).join('\n')}

## Общая статистика
- **Всего врачей:** ${output.doctors.length}
- **Отделений с врачами:** ${Object.keys(deptCounts).length}
- **Клиник/филиалов:** ${CLINICS.length}
- **Уникальных специальностей:** ${specSet.size}
- **Врачей с учёной степенью КМН:** ${kmCount}

## Полнота данных

| Поле | Заполнено | Отсутствует | % заполнения |
|------|-----------|-------------|--------------|
| ФИО | ${output.doctors.length} | 0 | 100% |
| Фото | ${output.doctors.length - nullPhoto - defaultPhoto} | ${nullPhoto + defaultPhoto} | ${Math.round((output.doctors.length - nullPhoto - defaultPhoto) / output.doctors.length * 100)}% |
| Специальность | ${output.doctors.length - nullSpec} | ${nullSpec} | ${Math.round((output.doctors.length - nullSpec) / output.doctors.length * 100)}% |
| Отдел | ${output.doctors.length - nullDept} | ${nullDept} | ${Math.round((output.doctors.length - nullDept) / output.doctors.length * 100)}% |
| Ссылка на профиль | ${output.doctors.length} | 0 | 100% |
| Стаж | 0 | ${output.doctors.length} | 0% |
| Категория | 0 | ${output.doctors.length} | 0% |
| Описание | 0 | ${output.doctors.length} | 0% |
| Направления работы | 0 | ${output.doctors.length} | 0% |
| Услуги | 0 | ${output.doctors.length} | 0% |
| Привязка к филиалу | 0 | ${output.doctors.length} | 0% |

## Распределение по отделениям
${Object.entries(deptCounts).sort((a, b) => b[1] - a[1]).map(([dept, count]) => `- **${dept}:** ${count} врачей`).join('\n')}

## Список специальностей (${specSet.size})
${[...specSet].sort().map(s => `- ${s}`).join('\n')}

## Клиники/филиалы
${CLINICS.map(c => `- **${c.name}** — ${c.address}`).join('\n')}

## Врачи без определённого отдела (${nullDept})
${noDeptDoctors.length > 0 ? noDeptDoctors.map(d => `- ${d.full_name} (${d.specialty_text || 'нет специальности'}) — ${d.detail_page_url}`).join('\n') : '_Нет таких врачей_'}

## Врачи с фото по умолчанию (${defaultPhoto})
${defaultPhotoDoctors.length > 0 ? defaultPhotoDoctors.map(d => `- ${d.full_name}`).join('\n') : '_Нет таких врачей_'}

## Отсутствующие данные (недоступны на сайте kst27.ru)
1. **Стаж (experience_years)** — не указан в карточках врачей на страницах списков
2. **Категория (category)** — не указана в карточках
3. **Описание (description)** — доступно только на отдельных страницах профилей (требует парсинга ~85 страниц)
4. **Направления работы** — не структурированы на сайте
5. **Услуги** — привязка врач-услуга отсутствует на сайте
6. **Привязка к конкретному филиалу** — врачи привязаны к отделению, но не к конкретному адресу клиники

## Невозможно подтвердить
- Точный стаж каждого врача (на сайте не публикуется)
- Индивидуальные рейтинги (отсутствуют на сайте)
- Индивидуальные цены приёма (отсутствуют на сайте)
- Точную привязку врача к конкретному филиалу (один врач может принимать в нескольких)

## Методология
1. Данные извлечены из HTML-страницы \`/index.php/nasha-komanda/vrachi\` с помощью парсинга карточек \`<div class="sotrud-td">\`
2. Отдел определён по URL профиля (если содержит \`/vrachi/otdelenie-xxx/\`) или из предыдущей версии данных
3. Специальности получены из поля \`<p class="opis_vrach">\`
4. Все данные получены исключительно из HTML сайта kst27.ru
5. Никакие данные не выдуманы и не сгенерированы искусственно
6. Поля со значением \`null\` означают отсутствие данных на сайте
`;

  const reportPath = path.join(DOCS_DIR, 'DOCTORS_DATA_AUDIT.md');
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log('\nОтчёт записан: ' + reportPath);
}

main();
