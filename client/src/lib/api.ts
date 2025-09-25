import { Capacitor } from "@capacitor/core";

const ABSOLUTE_URL_PATTERN = /^[a-z][a-z\d+\-.]*:\/\//i;

function trimTrailingSlash(url: string) {
  let result = url;
  while (result.endsWith("/")) {
    result = result.slice(0, -1);
  }
  return result;
}

function ensureLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function readCapacitorApiBaseUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const platform = Capacitor.getPlatform();
    if (platform === "web") {
      return "";
    }

    const raw =
      ((Capacitor as unknown as {
        config?: { extra?: { apiBaseUrl?: string | undefined } | undefined };
      }).config?.extra?.apiBaseUrl
        ?.toString()
        .trim?.() ?? "");

    if (!raw && !warnedAboutMissingNativeBaseUrl) {
      warnedAboutMissingNativeBaseUrl = true;
      console.warn(
        "SwingAI: No API base URL configured for the native build. Set VITE_API_BASE_URL during the client build or configure NATIVE_API_BASE_URL before syncing Capacitor.",
      );
    }

    return raw;
  } catch (error) {
    if (!warnedAboutMissingNativeBaseUrl) {
      warnedAboutMissingNativeBaseUrl = true;
      console.warn("SwingAI: Unable to read Capacitor configuration", error);
    }
    return "";
  }
}

let warnedAboutMissingNativeBaseUrl = false;

const normalizedBaseUrl = (() => {
  const envValue = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envValue) {
    return trimTrailingSlash(envValue);
  }

  const capacitorValue = readCapacitorApiBaseUrl();
  return capacitorValue ? trimTrailingSlash(capacitorValue) : "";
})();

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
