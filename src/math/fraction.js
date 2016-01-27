import * as _Fraction from "fraction.js"

// instance methods
Object.assign(_Fraction.default.prototype, {
  'eq': function(f) {
    return this.compare(new Fraction(f)) === 0;
  },
  'ne': function(f) {
    return this.compare(new Fraction(f)) !== 0;
  },
  'lt': function(f) {
    return this.compare(new Fraction(f)) < 0;
  },
  'lte': function(f) {
    return this.compare(new Fraction(f)) <= 0;
  },
  'gt': function(f) {
    return this.compare(new Fraction(f)) > 0;
  },
  'gte': function(f) {
    return this.compare(new Fraction(f)) >= 0;
  },
  'max': function(f) {
    f = new Fraction(f);
    return this.compare(f) > 0 ? this : f;
  },
  'min': function(f) {
    f = new Fraction(f);
    return this.compare(f) < 0 ? this : f;
  }
});

// static methods
Object.assign(_Fraction.default, {
  'fromString': function(str) {
    var f = NaN;
    try {
      f = new Fraction(str);
    } catch(e) {
      // pass
    }
    return f;
  }
})

export var Fraction = _Fraction.default;
