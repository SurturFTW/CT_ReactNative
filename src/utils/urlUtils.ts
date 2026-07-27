export function parseQueryParams(url: string): Record<string, string> {
  const queryStart = url.indexOf('?');
  if (queryStart === -1) {
    return {};
  }

  const params: Record<string, string> = {};
  const queryString = url.slice(queryStart + 1);

  queryString.split('&').forEach(pair => {
    if (!pair) {
      return;
    }
    const [rawKey, rawValue = ''] = pair.split('=');
    const key = decodeURIComponent(rawKey);
    params[key] = decodeURIComponent(rawValue);
  });

  return params;
}
