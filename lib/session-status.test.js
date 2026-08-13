import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldClearSession } from "./session-status.js";

test("401 real logout limpia sesión", () => {
  assert.equal(shouldClearSession(401), true);
});

test("500 (blip de DB) no limpia sesión", () => {
  assert.equal(shouldClearSession(500), false);
});

test("503/timeout no limpia sesión", () => {
  assert.equal(shouldClearSession(503), false);
});

test("200 no limpia sesión (caso no usado pero no debe romper)", () => {
  assert.equal(shouldClearSession(200), false);
});
