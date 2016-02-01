import {assert} from "../utils/assert"
import {Fraction} from "../../src/math/fraction"
import {Point} from "../../src/shapes/point"
import {EmptyArc, OnePointArc, TwoPointArc, CenterArc, CenterRadiusArc, Arc, HowToDrawAnArc} from "../../src/shapes/arc"
import {props} from "../utils/harness"

describe("EmptyArc", function() {
  describe("constructor", function() {
    it("use 3-points-arc way by default", function() {
      var arc = new EmptyArc();
      assert.equal(arc.howto, HowToDrawAnArc.THREE_POINTS);
    })
  });
  describe(".feedPoint", function() {
    it("returns OnePointArc for 3-point-arc", function() {
      var arc = new EmptyArc();
      var next = arc.feedPoint({p: new Point(1, 1)});
      assert.true(next instanceof OnePointArc);
      assert.true(next.p.equals(new Point(1, 1)));
    });
    it("returns CenterArc for center-arc", function() {
      var arc = new EmptyArc();
      arc.feedText({s: 'c'});
      var next = arc.feedPoint({p: new Point(1, 1)});
      assert.true(next instanceof CenterArc);
      assert.true(next.p.equals(new Point(1, 1)));
    });
  });
  describe(".feedText", function() {
    it("switch to center-arc mode", function() {
      var arc = new EmptyArc();
      arc.feedText({s: 'c'});
      assert.equal(arc.howto, HowToDrawAnArc.CIRCLE);
    });
    it("switch to center-arc mode and switch back", function() {
      var arc = new EmptyArc();
      arc.feedText({s: 'c'});
      assert.equal(arc.howto, HowToDrawAnArc.CIRCLE);
      arc.feedText({s: '3p'});
      assert.equal(arc.howto, HowToDrawAnArc.THREE_POINTS);
    });
  });
});

describe("OnePointArc", function() {
  describe(".feedPoint", function() {
    it("returns a TwoPointArc", function() {
      var arc = new OnePointArc(new Point(1, 1));
      var next = arc.feedPoint({p: new Point(2, 2)});
      assert.true(next instanceof TwoPointArc);
      assert.true(next.p1.equals(new Point(1, 1)));
      assert.true(next.p2.equals(new Point(2, 2)));
    });
  });
});

describe("TwoPointArc", function() {
  describe("._findArc", function() {
    // var arc = new TwoPointArc(new Point(5, 0), new Point(2.5, 2.5));
    // var [crossX, crossY, radius, startAngle, endAngle] = arc._findArc(new Point(0, 5));
    // assert.true(crossX.eq(0), crossX);
    // assert.true(crossY.eq(0), crossY);
  });
});

describe("CenterArc", function() {

});

describe("CenterRadiusArc", function() {

});

describe("Arc", function() {

});
