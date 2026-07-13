// Downloads license-clear photos into public/images at build time. Images are never committed.
import { mkdir, writeFile } from 'node:fs/promises';

const UA = 'CiceroPestBot/1.0 (https://ciceropest.com; admin@ciceropest.com)';
const IMAGES = {
  'hero.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Portage_Park_Two_Flat.jpg',
  'cicero.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Cicero%2C_Illinois.jpg/1280px-Cicero%2C_Illinois.jpg',
  'ant-control.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Pavement_ants_in_battle.jpg/1280px-Pavement_ants_in_battle.jpg',
  'cockroach-control.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Periplaneta_americana_-_American_cockroach_%2825859665686%29.jpg/1280px-Periplaneta_americana_-_American_cockroach_%2825859665686%29.jpg',
  'rodent-control.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Rattus_norvegicus_%28Brown_Rat%29_%2848724520198%29.jpg/1280px-Rattus_norvegicus_%28Brown_Rat%29_%2848724520198%29.jpg',
  'bed-bug-control.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Cimex_lectularius_%28bed_bug%29_%285975362751%29.jpg/1280px-Cimex_lectularius_%28bed_bug%29_%285975362751%29.jpg',
  'spider-control.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Tigrosa_aspersa_-_wolf_spider_%2830610561848%29.jpg/1280px-Tigrosa_aspersa_-_wolf_spider_%2830610561848%29.jpg',
  'wasp-control.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Australian_paper_wasp._%2811619542284%29.jpg/1280px-Australian_paper_wasp._%2811619542284%29.jpg',
  'boxelder-control.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Eastern_boxelder_bug_%2841288%29.jpg/1280px-Eastern_boxelder_bug_%2841288%29.jpg',
  'mosquito-control.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/83/Aedes_aegypti_during_blood_meal.jpg',
  'commercial-pest-control.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Hawthorne_Works_tower_2012_1.JPG/1280px-Hawthorne_Works_tower_2012_1.JPG',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOne(name, url, tries = 6) {
  for (let i = 1; i <= tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'image/*,*/*' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 1000) throw new Error('too small');
      await writeFile('public/images/' + name, buf);
      console.log('[images] ok', name, (buf.length / 1024 | 0) + 'KB');
      return true;
    } catch (e) {
      console.warn('[images] retry', i, name, e.message);
      await sleep(1000 * i + Math.floor(Math.random() * 500));
    }
  }
  console.warn('[images] FAILED', name);
  return false;
}

// Limited concurrency to avoid rate limiting from the build host.
async function run() {
  await mkdir('public/images', { recursive: true });
  const entries = Object.entries(IMAGES);
  const limit = 3;
  let ok = 0;
  for (let i = 0; i < entries.length; i += limit) {
    const batch = entries.slice(i, i + limit);
    const res = await Promise.all(batch.map(([n, u]) => fetchOne(n, u)));
    ok += res.filter(Boolean).length;
    if (i + limit < entries.length) await sleep(600);
  }
  console.log('[images] done', ok + '/' + entries.length);
}
await run();
