const ABSOLUTE_URL_PATTERN = /^[a-z][a-z\d+\-.]*:\/\//i;

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function trimTrailingSlash(url: string) {
  let result = url;
  while (result.endsWith("/")) {
    result = result.slice(0, -1);
  }
  return result;
}

const normalizedBaseUrl = rawBaseUrl ? trimTrailingSlash(rawBaseUrl) : "";

function ensureLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function getApiBaseUrl() {
  return normalizedBaseUrl;
}

export function apiUrl(path: string) {
  if (ABSOLUTE_URL_PATTERN.test(path)) {
    return path;
  }

  const normalizedPath = ensureLeadingSlash(path);

  if (normalizedBaseUrl) {
    return `${normalizedBaseUrl}${normalizedPath}`;
  }

  return normalizedPath;
}
