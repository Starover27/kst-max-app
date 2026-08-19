const fs = require('node:fs');
const path = require('node:path');

const dataDir = path.join(process.cwd(), 'src', 'data');
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8'));
const writeJson = (name, value) => {
  fs.writeFileSync(path.join(dataDir, name), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const departmentsData = readJson('doctors_departments.json');
const schedulePath = path.join(dataDir, 'doctors_schedule.json');
const scheduleData = fs.existsSync(schedulePath) && fs.statSync(schedulePath).size > 0
  ? readJson('doctors_schedule.json')
  : { doctors: [], _meta: { source: null, status: 'not_available' } };
const scheduleByName = new Map();

for (const doctor of scheduleData.doctors) {
  const key = `${doctor.surname}|${doctor.name || doctor.first_name}|${doctor.middle_name || ''}`;
  const records = scheduleByName.get(key) || [];
  const newRecords = doctor.availability?.length ? doctor.availability : [{
    branch: doctor.branch,
    branch_address: doctor.branch_address,
    schedule: doctor.schedule,
    price: doctor.price,
  }];
  records.push(...newRecords);
  scheduleByName.set(key, records);
}

const doctors = departmentsData.doctors.map((doctor, index) => {
  const key = `${doctor.surname}|${doctor.firstName}|${doctor.middleName}`;
  const availability = scheduleByName.get(key) || [];
  return {
    id: index + 1,
    full_name: doctor.fullName,
    surname: doctor.surname,
    first_name: doctor.firstName,
    middle_name: doctor.middleName,
    department: doctor.department,
    specialty: null,
    experience_years: null,
    description: null,
    photo_url: doctor.photoUrl,
    detail_page_url: doctor.detailPageUrl,
    availability,
    source: doctor.source,
    department_url: doctor.departmentUrl,
  };
});

writeJson('doctors.json', {
  _meta: {
  source: [departmentsData._meta.source, scheduleData._meta.source].filter(Boolean),
    fetched_date: departmentsData._meta.fetched_date,
    notes: scheduleData.doctors.length
      ? 'Единый список врачей отделений; расписания и филиалы присоединены из отдельной выгрузки расписаний.'
      : 'Единый список врачей отделений. Расписания не заполнены: отдельная выгрузка расписаний отсутствует.',
    doctor_count: doctors.length,
  },
  doctors,
});

writeJson('prices.json', {
  _meta: {
    source: null,
    fetched_date: null,
    status: 'pending_source',
    notes: 'Прайс-лист не был найден среди выгруженных материалов. Суммы намеренно не заполняются до получения актуального источника.',
  },
  prices: [],
});

console.log(`Finalized ${doctors.length} doctors; imported ${scheduleData.doctors.length} schedule records.`);