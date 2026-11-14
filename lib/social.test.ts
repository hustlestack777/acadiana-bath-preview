import assert from "node:assert/strict";
import test from "node:test";
import { SITE_SAME_AS } from "./site";
import { facebookProfile } from "./social";

test("the only social profile is the Facebook URL already in schema", () => {
  assert.deepEqual([...SITE_SAME_AS], ["https://www.facebook.com/profile.php?id=61596069587015"]);
  assert.equal(facebookProfile(), "https://www.facebook.com/profile.php?id=61596069587015");
});
