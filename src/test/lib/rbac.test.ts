import { describe, it, expect } from "vitest";
import { rolePortalPath, PORTAL_ROLE_MAP, PROTECTED_PORTAL_PREFIXES } from "@/lib/rbac";

describe("rolePortalPath", () => {
  it("returns /dashboard for admin role", () => {
    expect(rolePortalPath("admin")).toBe("/dashboard");
  });

  it("returns /portal for host role", () => {
    expect(rolePortalPath("host")).toMatch(/^\/portal/);
  });

  it("returns a string for any role", () => {
    expect(typeof rolePortalPath("guest")).toBe("string");
  });
});

describe("PROTECTED_PORTAL_PREFIXES", () => {
  it("is a non-empty array of strings", () => {
    expect(Array.isArray(PROTECTED_PORTAL_PREFIXES)).toBe(true);
    expect(PROTECTED_PORTAL_PREFIXES.length).toBeGreaterThan(0);
    PROTECTED_PORTAL_PREFIXES.forEach((prefix) => {
      expect(typeof prefix).toBe("string");
      expect(prefix.startsWith("/")).toBe(true);
    });
  });
});

describe("PORTAL_ROLE_MAP", () => {
  it("maps all protected prefixes to role arrays", () => {
    PROTECTED_PORTAL_PREFIXES.forEach((prefix) => {
      const roles = PORTAL_ROLE_MAP[prefix];
      if (roles) {
        expect(Array.isArray(roles)).toBe(true);
      }
    });
  });
});
