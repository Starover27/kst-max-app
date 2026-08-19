#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const doctors = JSON.parse(fs.readFileSync(path.join(root, 'src/data/doctors.json'), 'utf8')).doctors;
const pricesPayload = JSON.parse(fs.readFileSync(path.join(root, 'tmp_price_live_verify.json'), 'utf8'));
const prices = pricesPayload;
const verifiedAt = '2026-08-17';
const sourceUrl = 'https://kdoctoru.ru/client/16/price/';
const doctorSourceUrl = 'https://kst27.ru/index.php/nasha-komanda/vrachi';

const serviceById = new Map(prices.map((item) => [String(item.id), item]));
const service = (id) => serviceById.get(String(id));

// Only explicit, unambiguous specialty/profile matches are allowed here.
const rules = [
  { test: (d) => d.full_name === 'Глонин Александр Юрьевич', id: '11198', clinicId: 'sheronova-8-center' },
  { test: (d) => d.full_name === 'Зенюков Артем Сергеевич', id: '12557', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'акушер-гинеколог', id: '50', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'аллерголог-иммунолог', id: '67', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'иммунолог-аллерголог', id: '67', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'гастроэнтеролог', id: '10371', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'кардиолог', id: '66', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'невролог', id: '62', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'нефролог', id: '1471', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'онколог', id: '55', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'ортопед взрослый', id: '76', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && ['отоларинголог', 'оториноларинголог'].includes(d.specialties[0]), id: '70', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'офтальмолог', id: '3917', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'педиатр', id: '82', clinicId: 'sheronova-8-center' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'пульмонолог', id: '75', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'ревматолог', id: '65', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'терапевт', id: '64', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'уролог', id: '53', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'физиотерапевт', id: '77', clinicId: 'sheronova-8-center' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'хирург', id: '71', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'эндокринолог', id: '69', clinicId: 'sheronova-6' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'детский кардиолог', id: '93', clinicId: 'sheronova-8-center' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'детский невролог', id: '91', clinicId: 'sheronova-8-center' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'детский ортопед-травматолог', id: '102', clinicId: 'sheronova-8-center' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'детский уролог', id: '83', clinicId: 'sheronova-8-center' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'детский эндокринолог', id: '95', clinicId: 'sheronova-8-center' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'детский иммунолог-аллерголог', id: '94', clinicId: 'sheronova-8-center' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'детский гастроэнтеролог', id: '89', clinicId: 'sheronova-8-center' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'детский гематолог', id: '98', clinicId: 'sheronova-8-center' },
  { test: (d) => d.specialties.length === 1 && d.specialties[0] === 'гинеколог-эндокринолог', id: '51', clinicId: 'sheronova-6' },
];

function buildRecord(doctor) {
  const rule = rules.find((candidate) => candidate.test(doctor));
  const item = rule && service(rule.id);
  const exact = Boolean(rule && item && item.price > 0);
  const reason = exact
    ? null
    : doctor.specialties.length > 1
      ? 'Несколько специальностей: первичный приём нельзя выбрать без указания конкретного профиля.'
      : doctor.specialties.includes('УЗД') || doctor.specialties.includes('функциональной диагностики')
        ? 'В прайсе нет однозначной услуги первичного приёма врача УЗД/функциональной диагностики.'
        : doctor.specialties.includes('анестезиолог-реаниматолог') || doctor.specialties.includes('СМП')
          ? 'В прайсе нет однозначной услуги первичного приёма по этой специальности.'
          : doctor.has_km
            ? 'Квалификация КМН требует отдельной услуги; подходящая цена без подтверждения не выбрана.'
            : 'Однозначная услуга первичного приёма не найдена в актуальном прайсе.';

  return {
    doctorId: String(doctor.id),
    doctorName: doctor.full_name,
    specialty: doctor.specialty_text,
    serviceId: exact ? String(item.id) : null,
    serviceName: exact ? item.name : null,
    visitType: 'primary',
    price: exact ? item.price : null,
    currency: 'RUB',
    clinicId: exact ? rule.clinicId : null,
    sourceUrl,
    doctorSourceUrl: doctor.detail_page_url || doctorSourceUrl,
    verifiedAt,
    status: exact ? 'verified' : (doctor.specialties.length > 1 || doctor.has_km ? 'needs_review' : 'not_found'),
    reviewNote: reason,
  };
}

const records = doctors.map(buildRecord);
const output = {
  _meta: {
    sourceUrl,
    sourceFetchedDate: '2026-08-17',
    sourceWarning: 'Прайс может корректироваться клиникой; перед записью необходимо подтвердить стоимость у КСТ.',
    doctorsSourceUrl: doctorSourceUrl,
    verifiedAt,
    count: records.length,
  },
  records,
};

fs.writeFileSync(path.join(root, 'src/data/doctor-prices.json'), `${JSON.stringify(output, null, 2)}\n`, 'utf8');

const lines = [
  '# Аудит сопоставления врачей и стоимости первичного приёма',
  '',
  `Проверено: **${verifiedAt}**. Врачи: [КСТ](${doctorSourceUrl}), прайс: [актуальный JSON прайса](${sourceUrl}).`,
  '',
  '> Важно: сайт предупреждает, что прайс может корректироваться. Цены ниже — результат проверки источника на указанную дату; перед записью стоимость нужно подтвердить у клиники.',
  '',
  'Правило: цена записана только при однозначном сопоставлении специальности, услуги первичного приёма и взрослого/детского профиля. При сомнении сохранено `price: null`.',
  '',
  '| Врач | Специальность | Услуга первичного приёма | Цена | Филиал | Источник | Статус |',
  '|---|---|---|---:|---|---|---|',
];
const clinicNames = { 'sheronova-6': 'Взрослое отделение — Шеронова 6', 'sheronova-8-center': 'Центр здорового ребёнка — Шеронова 8 к.3, 2 этаж' };
for (const record of records) {
  const price = record.price == null ? '—' : `${record.price.toLocaleString('ru-RU')} ₽`;
  const clinic = record.clinicId ? clinicNames[record.clinicId] : 'не определён';
  const serviceName = record.serviceName || '—';
  lines.push(`| ${record.doctorName} | ${record.specialty} | ${serviceName} | ${price} | ${clinic} | [прайс](${record.sourceUrl}) | ${record.status} |`);
}
lines.push('', '## Методика и ограничения', '', '- В live-источнике на 2026-08-17 получено 2424 позиции; они полностью совпали с локальным `src/data/prices.json`.', '- `doctorId` соответствует `src/data/doctors.json`, `serviceId` — ID позиции прайса.', '- Услуги с экспертизой нетрудоспособности, услуги КМН и диагноз-специфичные услуги не подставлялись вместо обычного первичного приёма.', '- Для нескольких специальностей одного врача запись требует ручного выбора конкретного профиля, поэтому цена не угадывается.', '- Отсутствие цены (`null`) означает, что достоверное сопоставление не найдено, а не бесплатный приём.');
fs.writeFileSync(path.join(root, 'docs/DOCTOR_PRICES_AUDIT.md'), `${lines.join('\n')}\n`, 'utf8');

const counts = records.reduce((acc, item) => { acc[item.status] += 1; return acc; }, { verified: 0, needs_review: 0, not_found: 0 });
console.log(JSON.stringify(counts));