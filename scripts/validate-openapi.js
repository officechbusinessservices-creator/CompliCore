#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const specPath = path.join(__dirname, "..", "specs", "openapi.yaml");

function fail(message) {
  console.error(`OpenAPI validation failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(specPath)) {
  fail(`spec not found at ${specPath}`);
}

let spec;
try {
  spec = yaml.load(fs.readFileSync(specPath, "utf8"));
} catch (error) {
  fail(`unable to parse YAML (${error.message})`);
}

if (!spec || typeof spec !== "object") {
  fail("spec root is empty");
}

if (!spec.openapi) {
  fail("missing `openapi` field");
}

if (!spec.paths || typeof spec.paths !== "object" || Object.keys(spec.paths).length === 0) {
  fail("missing or empty `paths`");
}

const methods = new Set(["get", "post", "put", "patch", "delete", "options", "head"]);
let operationCount = 0;

for (const [routePath, route] of Object.entries(spec.paths)) {
  if (!routePath.startsWith("/")) {
    fail(`path must start with '/': ${routePath}`);
  }

  if (!route || typeof route !== "object") {
    fail(`invalid operation map at path: ${routePath}`);
  }

  for (const method of Object.keys(route)) {
    if (!methods.has(method)) {
      fail(`unsupported method '${method}' at path '${routePath}'`);
    }
    operationCount += 1;
  }
}

const servers = Array.isArray(spec.servers) ? spec.servers : [];
if (!servers.some((server) => server && server.url === "http://localhost:4000/v1")) {
  fail("missing local development server `http://localhost:4000/v1`");
}

const registerRequest = spec.components?.schemas?.RegisterRequest?.properties || {};
const loginRequest = spec.components?.schemas?.LoginRequest?.properties || {};

if (Object.prototype.hasOwnProperty.call(registerRequest, "role")) {
  fail("RegisterRequest must not expose `role`");
}

if (Object.prototype.hasOwnProperty.call(loginRequest, "role")) {
  fail("LoginRequest must not expose `role`");
}

console.log(`OpenAPI validation passed (${operationCount} operations).`);
