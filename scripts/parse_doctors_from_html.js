const fs = require('fs');
const path = require('path');

// Маппинг файлов отделений к названиям
const DEPT_FILES = [
  { file: 'tmp_dept_therapy.html', name: 'Отделение Терапии' },
  { file: 'tmp_dept_pediatrii.html', name: 'Отделение Педиатрии' },
  { file: 'tmp_dept_ginekologii.html', name: 'Отделение Гинекологии' },
  { file: 'tmp_dept_nevrologii.html', name: 'Отделение Неврологии' },
  { file: 'tmp_dept_onkologii.html', name: 'Отделение Онкологии' },
  { file: 'tmp_dept_khirurgii.html', name: 'Отделение Хирургии' },
  { file: 'tmp_dept_lor.html', name: 'Отделение ОтоРиноЛарингологии' },
  { file: 'tmp_dept_oftalmologii.html', name: 'Отделение Офтальмологии' },
  { file: 'tmp_dept_diagnosticheskoe.html', name: 'Диагностическое Отделение' },
  { file: 'tmp_dept_luchevoj.html', name: 'Отделение Лучевой Диагностики' },
  { file: 'tmp_dept_laboratoriya.html', name: 'Клинико-Диагностическая Лаборатория' },
  { file: 'tmp_dept_anesteziologii.html', name: 'Отделение Анестезиологии и РАО' },
  { file: 'tmp_dept_vosstanovitelnoj.html', name: 'Отделение Восстановительной Терапии' },
  { file: 'tmp_dept_smp.html', name: 'Станция СМП' },
];

const BASE_URL = 'https://kst27.ru';
const dataDir = path.join(__dirname, '..', 'src', 'data');

function parseDepartment(html, deptName) {
  const doctors = [];
  
  // Паттерн для карточки врача в слайдере
  // <div class="sotrud-td swiper-slide ...">
  //   <a href="..." class="doctors-slider-info">
  //     <img ... data-src="..." alt="ФИО" />
  //   </a>
  //   <p class="fio">ФИО</p>
  //   <p class="opis_vrach">Специальность</p>
  // </div>
  
  const cardRegex = /<div\s+class="sotrud-td\s+swiper-slide[^"]*">([\s\S]*?)<\/div>\s*(?=<div\s+class="sotrud-td|<\/div>\s*<\/div>\s*<\/div>)/gi;
  
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const cardHtml = match[1];
    
    // Извлекаем ссылку на профиль
    const linkMatch = cardHtml.match(/<a\s+href="([^"]+)"\s+class="doctors-slider-info"/i);
    const profileUrl = linkMatch ? linkMatch[1] : null;
    
    // Извлекаем фото (data-src или src)
    const photoMatch = cardHtml.match(/data-src="([^"]+)"/i) || cardHtml.match(/src="([^"]+)"[^>]*alt=/i);
    const photoUrl = photoMatch ? (photoMatch[1].startsWith('http') ? photoMatch[1] : BASE_URL + photoMatch[1]) : null;
    
    // Извлекаем ФИО
    const fioMatch = cardHtml.match(/<p\s+class="fio">([^<]+)<\/p>/i);
    const fullName = fioMatch ? fioMatch[1].trim() : null;
    
    // Извлекаем специальность
    const specMatch = cardHtml.match(/<p\s+class="opis_vrach">([^<]+)<\/p>/i);
    const specialty = specMatch ? specMatch[1].trim() : null;
    
    if (fullName && profileUrl) {
      doctors.push({
        full_name: fullName,
        specialty: specialty,
        photo_url: photoUrl,
        detail_page_url: profileUrl.startsWith('http') ? profileUrl : BASE_URL + profileUrl,
        department: deptName,
        source: BASE_URL + '/index.php/nasha-komanda/vrachi',
      });
    }
  }
  
  return doctors;
}

// Собираем всех врачей
const allDoctors = [];
const seenUrls = new Set();

for (const dept of DEPT_FILES) {
  const filePath = path.join(__dirname, '..', dept.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`Файл не найден: ${dept.file}`);
    continue;
  }
  
  const html = fs.readFileSync(filePath, 'utf8');
  const doctors = parseDepartment(html, dept.name);
  
  for (const doc of doctors) {
    if (!seenUrls.has(doc.detail_page_url)) {
      seenUrls.add(doc.detail_page_url);
      allDoctors.push(doc);
    }
  }
  
  console.log(`${dept.name}: найдено ${doctors.length} врачей`);
}

// Сортируем по ФИО
allDoctors.sort((a, b) => a.full_name.localeCompare(b.full_name, 'ru'));

// Формируем итоговый JSON
const output = {
  _meta: {
    source: 'https://kst27.ru/index.php/nasha-komanda/vrachi',
    fetched_date: new Date().toISOString().split('T')[0],
    notes: 'Данные извлечены из HTML-страниц отделений сайта kst27.ru',
    doctor_count: allDoctors.length,
    department_count: new Set(allDoctors.map(d => d.department)).size,
  },
  doctors: allDoctors.map((doc, idx) => ({
    id: idx + 1,
    full_name: doc.full_name,
    surname: doc.full_name.split(' ')[0] || null,
    first_name: doc.full_name.split(' ')[1] || null,
    middle_name: doc.full_name.split(' ')[2] || null,
    department: doc.department,
    specialty: doc.specialty,
    experience_years: null,
    description: null,
    photo_url: doc.photo_url,
    detail_page_url: doc.detail_page_url,
    availability: [],
    source: doc.source,
    department_url: BASE_URL + '/index.php/nasha-komanda/vrachi',
  })),
};

// Записываем
const outputPath = path.join(dataDir, 'doctors.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n', 'utf8');

console.log(`\nИтого: ${allDoctors.length} уникальных врачей из ${output._meta.department_count} отделений`);
console.log(`Записано в: ${outputPath}`);
