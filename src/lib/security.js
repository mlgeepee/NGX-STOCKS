const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function isStrongPassword(value) {
  return PASSWORD_POLICY.test(String(value || ""));
}

export function buildAuthRedirect(path) {
  if (typeof window === "undefined") return undefined;

  const { origin, protocol, hostname } = window.location;
  const isTrustedOrigin =
    protocol === "https:" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1";

  if (!isTrustedOrigin) {
    return undefined;
  }

  const safePath = String(path || "/").startsWith("/")
    ? String(path || "/")
    : `/${String(path || "/")}`;

  return `${origin}${safePath}`;
}
