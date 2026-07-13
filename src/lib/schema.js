import site from '../data/site.js';
const ORG = `${site.url}/#org`;
const WEBSITE = `${site.url}/#website`;
const cities = ['Cicero', 'Berwyn', 'Oak Park', 'Stickney', 'Forest View', 'Lyons', 'Riverside', 'Little Village'];

export function orgNode() {
  return {
    '@type': 'LocalBusiness', '@id': ORG,
    additionalType: 'https://en.wikipedia.org/wiki/Pest_control',
    name: site.name, url: `${site.url}/`, telephone: site.phone,
    description: 'Pest control help in Cicero, Illinois. Ants, cockroaches, rats and mice, bed bugs, spiders, wasps, boxelder bugs, mosquitoes and commercial pest control, handled by an experienced local exterminator.',
    logo: `${site.url}/favicon.svg`,
    image: `${site.url}/favicon.svg`,
    areaServed: [
      ...cities.map((c) => ({ '@type': 'City', name: c, addressRegion: 'IL', addressCountry: 'US' })),
      { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: site.lat, longitude: site.lng }, geoRadius: site.radiusMeters },
    ],
    geo: { '@type': 'GeoCoordinates', latitude: site.lat, longitude: site.lng },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '07:00', closes: '21:00' }],
  };
}
export function websiteNode() {
  return { '@type': 'WebSite', '@id': WEBSITE, url: `${site.url}/`, name: site.name, publisher: { '@id': ORG }, inLanguage: 'en-US' };
}
export function serviceNode({ name, serviceType, description, url, areaName }) {
  return {
    '@type': 'Service', name, serviceType, description, url, provider: { '@id': ORG },
    areaServed: areaName ? { '@type': 'City', name: areaName, addressRegion: 'IL', addressCountry: 'US' }
      : cities.map((c) => ({ '@type': 'City', name: c, addressRegion: 'IL', addressCountry: 'US' })),
  };
}
export function breadcrumbNode(trail) {
  return { '@type': 'BreadcrumbList', itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: `${site.url}${t.path}` })) };
}
export function itemListNode(items) {
  return { '@type': 'ItemList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: `${site.url}${it.path}` })) };
}
export function faqNode(faqs) {
  return { '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
}
export function articleNode({ headline, description, url, image, datePublished }) {
  return { '@type': 'Article', headline, description, url, image: `${site.url}${image}`, datePublished, dateModified: datePublished, author: { '@id': ORG }, publisher: { '@id': ORG }, mainEntityOfPage: url };
}
export function graph(nodes) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) });
}
