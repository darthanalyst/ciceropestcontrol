// Service slugs are canonical. No legacy redirects.
export const aliases = [];
export function getAlias(slug) {
  return aliases.find((a) => a.slug === slug);
}
export default aliases;
