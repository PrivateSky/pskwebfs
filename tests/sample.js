require("../../../engine/core").enableTesting();
const assert = $$.requireModule("double-check").assert;
// const assert = require("double-check").assert;
const arr1 = [1, 2, 3];
const arr2 = [1, 2];
assert.equal('1', 1, "Values don't match");
assert.true(arr1.length === arr2.length, "Arrays sizes don't match");