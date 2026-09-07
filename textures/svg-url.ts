export function svgUrl(source: string) {
  return `data:image/svg+xml,${encodeURIComponent(source)}`;
}
