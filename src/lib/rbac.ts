export const APP_ROLES = [
  "host",
  "guest",
  "cleaner",
  "maintenance",
  "corporate",
  "admin",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

/**
 * Maps each role to its primary portal destination after login.
 */
export const ROLE_PORTAL_MAP: Record<AppRole, string> = {
  host: "/portal/host",
  guest: "/portal/guest",
  cleaner: "/portal/cleaner",
  maintenance: "/portal/maintenance",
  corporate: "/portal/corporate",
  admin: "/dashboard",
};

/**
 * Human-readable labels for each role.
 */
export const ROLE_LABELS: Record<AppRole, string> = {
  host: "Host",
  guest: "Guest",
  cleaner: "Cleaner",
  maintenance: "Maintenance Staff",
  corporate: "Corporate Traveler",
  admin: "Administrator",
};

/**
 * Returns the portal path for a given role, defaulting to /dashboard for unknowns.
 */
export function rolePortalPath(role: AppRole | string | undefined): string {
  if (!role) return "/login";
  return ROLE_PORTAL_MAP[role as AppRole] ?? "/dashboard";
}

/**
 * Type guard that checks whether a string is a valid AppRole.
 */
export function isValidRole(role: unknown): role is AppRole {
  return typeof role === "string" && (APP_ROLES as readonly string[]).includes(role);
}

/**
 * Portal route prefixes that require an authenticated session.
 * Used by middleware to protect routes.
 */
export const PROTECTED_PORTAL_PREFIXES: string[] = [
  "/portal/host",
  "/portal/guest",
  "/portal/cleaner",
  "/portal/maintenance",
  "/portal/corporate",
  "/dashboard",
];

/**
 * For each portal prefix, which role(s) are allowed to access it.
 */
export const PORTAL_ROLE_MAP: Record<string, AppRole[]> = {
  "/portal/host": ["host", "admin"],
  "/portal/guest": ["guest", "admin"],
  "/portal/cleaner": ["cleaner", "admin"],
  "/portal/maintenance": ["maintenance", "admin"],
  "/portal/corporate": ["corporate", "admin"],
  "/dashboard": ["host", "admin"],
};
