import { strict as assert } from "node:assert";
import { test } from "node:test";
import { HealthController } from "./health.controller";

test("health controller returns the expected status", () => {
  const result = new HealthController().status();
  assert.deepEqual(result, { status: "ok", service: "panokit-api" });
});
