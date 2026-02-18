"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)("sample test", () => {
    (0, vitest_1.it)("verifies math works", () => {
        (0, vitest_1.expect)(1 + 1).toBe(2);
    });
});
