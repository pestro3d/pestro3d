export function getSafeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/")) {
    return "/";
  }

  const url = new URL(value, "https://pestro3d.local");
  if (url.origin !== "https://pestro3d.local") {
    return "/";
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
