import { writeFileSync } from 'fs';

export const ACCEPT_HEADER = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';

// Destination ports from the current shipping data
const DEST_PORTS = [
  'Adelaide', 'Amsterdam', 'Antwerp', 'Aruba', 'Auckland', 'Baltimore',
  'Basseterre', 'Bremerhaven', 'Bridgetown', 'Brisbane', 'Bristol', 'Castries',
  'Chittagong', 'Dar', 'Dar Es Salaam', 'Derince', 'Drammen', 'Dublin',
  'Durban', 'Famagusta', 'Freeport (Texas)', 'Fremantle', 'George Town(Guy)',
  'Hambantota', 'Hanko', 'Iquique', 'Jacksonville', 'Karachi', 'Kingston',
  'Kingstown', 'Lae', 'Laem Chabang', 'Larnaca', 'Le Havre', 'Limassol',
  'Los angeles', 'Lyttelton', 'Maput', 'Maputo', 'Matadi', 'Melbourne',
  'Mombasa', 'Mongla', 'Nacala', 'Nassau', 'Nelson', 'New Westminster',
  'Newcastle', 'Novorossiysk', 'Paramaribo', 'Port Kembla', 'Port Louis',
  'Port Moresby', 'Port of Spain', 'Poti', 'Roseau', 'Rotterdam',
  'Southampton', 'Tacoma', 'Ulaanbaatar', 'Valletta', 'Vancouver',
  'Vladivostok', 'Walvis Bay', 'Wellington', 'Zeebrugge',
];

export function extractShippingEntries(html) {
  const entries = [];
  const listIdx = html.indexOf('<section class="shipping-list">');
  if (listIdx === -1) return entries;

  // Find matching </section> for shipping-list
  let depth = 1;
  let pos = listIdx + '<section class="shipping-list">'.length;
  while (depth > 0 && pos < html.length) {
    if (html.startsWith('<section ', pos)) depth++;
    else if (html.startsWith('</section>', pos)) depth--;
    pos++;
  }
  const listHtml = html.substring(listIdx, pos);
  if (depth !== 0) return entries;

  const entryRegex = /<section class="shipping">(.*?)<\/section>/gs;
  let entryMatch;
  while ((entryMatch = entryRegex.exec(listHtml)) !== null) {
    const entryHtml = entryMatch[1];

    // Extract company
    const companyM = entryHtml.match(/shipping_info shipstatus">\s*<div>([^<]+)<\/div>/);
    if (!companyM) continue;

    // Extract vessel and type
    const vesselM = entryHtml.match(/shipping_info shipstatus">\s*<div>[^<]+<\/div>\s*<div>([^<]+)<\/div>/);
    const typeM = entryHtml.match(/shipping_ro-ro">([^<]+)<\//);
    const type = typeM && typeM[1].trim() === 'RO-RO' ? 'ro-ro' : 'container';

    // Extract all shipping_port divs
    const portRegex = /shipping_port[^>]*>\s*<div>([^<]+)<\/div>\s*<div>([^<]+)<\/div>\s*<\/div>/g;
    const allPorts = [];
    let portMatch;
    while ((portMatch = portRegex.exec(entryHtml)) !== null) {
      allPorts.push({ date: portMatch[1].trim(), port: portMatch[2].trim(), isCut: false });
    }

    if (allPorts.length === 0) continue;

    // Separate into leave/arrive based on position relative to "Arrive" header
    const arriveIdx = entryHtml.indexOf(">Arrive<");
    const leavePorts = [];
    const arrivePorts = [];

    for (const p of allPorts) {
      const dateTag = `<div>${p.date}</div>`;
      const pos = entryHtml.indexOf(dateTag);
      if (pos < arriveIdx || arriveIdx === -1) {
        leavePorts.push({ date: p.date, port: p.port, isCut: false });
      } else {
        arrivePorts.push({ date: p.date, port: p.port, isCut: false });
      }
    }

    const destPort = arrivePorts.length > 0 ? arrivePorts[0].port : 'Unknown';

    entries.push({
      company: companyM[1].trim(),
      vessel: vesselM ? vesselM[1].trim() : '',
      type,
      category: mapCategory(destPort, type),
      leavePorts,
      arrivePorts,
    });
  }

  return entries;
}

function mapCategory(destPort, type) {
  const africaRoro = ['Dar', 'Dar Es Salaam', 'Durban', 'Mombasa', 'Maput', 'Maputo', 'Beira', 'Berbera', 'Matadi', 'Nacala', 'Walvis Bay', 'Port Louis', 'Hambantota', 'Karachi'];
  const europeRoro = ['Southampton', 'Bremerhaven', 'Zeebrugge', 'Rotterdam', 'Antwerp', 'Le Havre', 'Hanko', 'Drammen', 'Dublin', 'Bristol', 'Larnaca', 'Limassol', 'Valletta', 'Derince', 'Amsterdam', 'Newcastle'];
  const africaContainer = ['Dar Es Salaam', 'Mombasa', 'Durban', 'Maputo', 'Matadi', 'Walvis Bay', 'Port Louis', 'Nacala', 'Berbera', 'Beira'];
  const europeContainer = ['Southampton', 'Bremerhaven', 'Rotterdam', 'Antwerp', 'Le Havre'];

  if (europeRoro.includes(destPort) && type === 'ro-ro') return 'europe-roro';
  if (europeContainer.includes(destPort)) return 'europe-container';
  if (africaRoro.includes(destPort) && type === 'ro-ro') return 'africa-roro';
  if (africaContainer.includes(destPort)) return 'africa-container';
  return 'other';
}

export async function fetchForPort(destPort) {
  const url = `https://autocj.co.jp/spn/japan_shipping?arrival_port=${encodeURIComponent(destPort)}&shipsearch=Search`;
  try {
    const res = await fetch(url, {
      headers: { Accept: ACCEPT_HEADER },
    });
    if (!res.ok) {
      console.error(`HTTP ${res.status} for ${destPort}`);
      return [];
    }
    const html = await res.text();
    return extractShippingEntries(html);
  } catch (e) {
    console.error(`Failed to fetch ${destPort}:`, e.message);
    return [];
  }
}

async function main() {
  console.log(`Fetching shipping data for ${DEST_PORTS.length} ports...`);
  const allEntries = [];

  for (let i = 0; i < DEST_PORTS.length; i++) {
    const port = DEST_PORTS[i];
    process.stdout.write(`[${i + 1}/${DEST_PORTS.length}] ${port}... `);
    const entries = await fetchForPort(port);
    allEntries.push(...entries);
    console.log(`${entries.length} entries`);
    await new Promise(r => setTimeout(r, 300));
  }

  const output = `const shippingData = ${JSON.stringify(allEntries, null, 2)};\n\nexport default shippingData;\n`;
  writeFileSync('components/shipping/shippingData.js', output);
  console.log(`\nDone! Wrote ${allEntries.length} entries to components/shipping/shippingData.js`);
}

if (process.argv[1]?.endsWith('fetch-shipping.mjs')) {
  main().catch(console.error);
}

