#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pricesPath = path.join(root, 'src', 'data', 'prices.json');
const outputPath = path.join(root, 'tmp_primary_prices_extract.json');
const payload = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
const prices = payload.prices;
const byId = new Map(prices.map((item) => [item.id, item]));

function getAncestors(item) {
  const result = [];
  const visited = new Set();
  let parentId = item.parent;
  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    const parent = byId.get(parentId);
    if (!parent) break;
    result.unshift({ id: parent.id, name: parent.name, kind: parent.kind });
    parentId = parent.parent;
  }
  return result;
}

function isPrimaryVisit(item) {
  const name = item.name.toUpperCase().replace(/Ё/g, 'Е');
  if (item.price <= 0 || !name.includes('ПЕРВИЧН')) return false;
  if (!name.includes('ПРИЕМ') && !name.includes('КОНСУЛЬТАЦ')) return false;
  return !name.includes('ХИРУРГИЧЕСКАЯ ОБРАБОТКА');
}

const services = prices
  .filter(isPrimaryVisit)
  .map((item) => ({
    serviceId: String(item.id),
    serviceName: item.name,
    price: item.price,
    currency: 'RUB',
    kind: item.kind,
    parentId: item.parent ? String(item.parent) : null,
    ancestors: getAncestors(item),
  }))
  .sort((a, b) => a.serviceName.localeCompare(b.serviceName, 'ru'));

const output = {
  _meta: {
    sourceUrl: payload._meta.source,
    sourceFetchedDate: payload._meta.fetched_date,
    extractedAt: new Date().toISOString(),
    count: services.length,
  },
  services,
};

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Extracted ${services.length} priced primary-visit services.`);
console.log(`Written: ${path.relative(root, outputPath)}`);
