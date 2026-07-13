import site from '../data/site.js';
import { services } from '../data/services.js';
import { areas } from '../data/areas.js';
import { guides } from '../data/learn.js';
export function GET() {
  const paths = [
    '/', '/pest-control-services/',
    ...services.map((s) => s.path),
    '/service-areas/', ...areas.map((a) => a.path),
    '/learn/', ...guides.map((g) => g.path),
    '/about-us/', '/contact/', '/privacy-policy/', '/terms-of-use/', '/image-credits/',
  ];
  const today = '2026-07-13';
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${site.url}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
