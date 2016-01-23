import * as _assert from "assert"

export var assert = Object.assign(_assert, {
  'true': function(predicate, message="") {
    return _assert.equal(predicate, true, message);
  },
  'false': function(predicate, message="") {
    return _assert.equal(predicate, false, message);
  }
});
