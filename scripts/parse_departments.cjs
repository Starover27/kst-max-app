const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const departments = [
  { file: 'tmp_dept_therapy.html', name: 'Отделение Терапии', url: 'https://kst27.ru/index.php/nasha-komanda/vrachi/otdelenie-terapii' },
  { file: 'tmp_dept_pediatrii.html', name: 'Отделение Педиатрии', url: 'https://kst27.ru/index.php/nasha-komanda/vrachi/otdelenie-pediatrii' },
  { file: 'tmp_dept_ginekologii.html', name: 'Отделение Гинекологии', url: 'https://kst27.ru/index.php/nasha-komanda/vrachi/otdelenie-ginekologii' },
  { file: 'tmp_dept_onkologii.html', name: 'Отделение Онкологии', url: 'https://kst27.ru/index.php/nasha-komanda/vrachi/otdelenie-onkologii' },
  { file: 'tmp_dept_khirurgii.html', name: 'Отделение Хирургии', url: 'https://kst27.ru/index.php/nasha-komanda/vrachi/otdelenie-khirurgii' },
  { file: 'tmp_dept_lor.html', name: 'Отделение ОтоРиноЛарингологии', url: 'https://kst27.ru/index.php/nasha-komanda/vrachi/otdelenie-otorinolaringologii' }
  // Дополнительные отделения можно добавить после загрузки
];

function parseDepartment(filePath, departmentInfo) {
  try {
    const html = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const doctors = [];
    const doctorItems = document.querySelectorAll('.doctor-item');
    
    doctorItems.forEach(item => {
      const titleLink = item.querySelector('.pricing-classic-title a');
      const img = item.querySelector('.pricing-classic-figure');
      const detailLink = item.querySelector('a.button.btn');
      
      if (titleLink) {
        const fullName = titleLink.textContent.trim();
        const nameParts = fullName.split(' ');
        
        const doctor = {
          fullName: fullName,
          surname: nameParts[0] || '',
          firstName: nameParts[1] || '',
          middleName: nameParts[2] || '',
          department: departmentInfo.name,
          departmentUrl: departmentInfo.url,
          photoUrl: img ? 'https://kst27.ru' + img.getAttribute('src') : null,
          detailPageUrl: detailLink ? 'https://kst27.ru' + detailLink.getAttribute('href') : null,
          source: departmentInfo.url
        };
        
        doctors.push(doctor);
      }
    });
    
    return doctors;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return [];
  }
}

function main() {
  const allDoctors = [];
  
  departments.forEach(dept => {
    const filePath = path.join(__dirname, '..', dept.file);
    if (fs.existsSync(filePath)) {
      console.log(`Parsing ${dept.name}...`);
      const doctors = parseDepartment(filePath, dept);
      console.log(`Found ${doctors.length} doctors`);
      allDoctors.push(...doctors);
    } else {
      console.log(`File not found: ${filePath}`);
    }
  });
  
  const output = {
    _meta: {
      source: 'https://kst27.ru/index.php/nasha-komanda/vrachi',
      fetched_date: new Date().toISOString().split('T')[0],
      notes: 'Данные извлечены из страниц отделений врачей kst27.ru'
    },
    departments: departments.map(d => ({
      name: d.name,
      url: d.url,
      doctorCount: allDoctors.filter(doc => doc.department === d.name).length
    })),
    doctors: allDoctors
  };
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'data', 'doctors_departments.json'),
    JSON.stringify(output, null, 2),
    'utf-8'
  );
  
  console.log(`\nTotal doctors found: ${allDoctors.length}`);
  console.log('Output saved to src/data/doctors_departments.json');
}

main();
