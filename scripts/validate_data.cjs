const fs = require('node:fs');
const path = require('node:path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const files = fs.readdirSync(dataDir).filter((file) => file.endsWith('.json'));
const errors = [];

for (const file of files) {
  const fullPath = path.join(dataDir, file);
  try {
    const text = fs.readFileSync(fullPath, 'utf8').replace(/^\uFEFF/, '');
    const value = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      errors.push(`${file}: корневое значение должно быть объектом`);
    }
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }
}

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8').replace(/^\uFEFF/, ''));
const doctors = readJson('doctors.json');
if (!Array.isArray(doctors.doctors) || doctors.doctors.length !== 72) {
  errors.push(`doctors.json: ожидалось 72 врача, получено ${doctors.doctors?.length ?? 0}`);
}

const prices = readJson('prices.json');
if (!Array.isArray(prices.prices) || prices.prices.length === 0) {
  errors.push('prices.json: прайс не содержит позиций');
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`OK: ${files.length} JSON-файлов, ${doctors.doctors.length} врачей, ${prices.prices.length} позиций прайса`);
}