import proxyquire from "proxyquire"
import sinon from "sinon"
import {assert} from "../utils/assert"
import {Fraction} from "../../src/math/fraction"
import {Point} from "../../src/shapes/point"
import {props} from "../utils/harness"

var lineStub = {
  info: function(message) {
    // pass
  }
}
var arcProxy = proxyquire('../../src/shapes/arc', {
  '../html/logging': lineStub
})

describe("arcProxy._toArcAngle", function() {
  it("1st dimension", function() {
    var angle = arcProxy._toArcAngle(new Fraction(0), new Fraction(0), new Fraction(2), new Fraction(1));
    assert.equal(angle.valueOf().toPrecision(3), "5.82");
  });
  it("2st dimension", function() {
    var angle = arcProxy._toArcAngle(new Fraction(0), new Fraction(0), new Fraction(-2), new Fraction(1));
    assert.equal(angle.valueOf().toPrecision(3), "3.61");
  });
  it("3st dimension", function() {
    var angle = arcProxy._toArcAngle(new Fraction(0), new Fraction(0), new Fraction(-2), new Fraction(-1));
    assert.equal(angle.valueOf().toPrecision(3), "2.68");
  });
  it("4st dimension", function() {
    var angle = arcProxy._toArcAngle(new Fraction(0), new Fraction(0), new Fraction(2), new Fraction(-1));
    assert.equal(angle.valueOf().toPrecision(3), "0.464");
  });
  it("positive x axis", function() {
    var angle = arcProxy._toArcAngle(new Fraction(0), new Fraction(0), new Fraction(2), new Fraction(0));
    assert.true(angle.eq(0));
  });
  it("negative x axis", function() {
    var angle = arcProxy._toArcAngle(new Fraction(0), new Fraction(0), new Fraction(-2), new Fraction(0));
    assert.true(angle.eq(new Fraction(Math.PI)));
  });
  it("positive y axis", function() {
    var angle = arcProxy._toArcAngle(new Fraction(0), new Fraction(0), new Fraction(0), new Fraction(2));
    assert.true(angle.eq(new Fraction(Math.PI).mul(3).div(2)));
  });
  it("negative y axis", function() {
    var angle = arcProxy._toArcAngle(new Fraction(0), new Fraction(0), new Fraction(0), new Fraction(-2));
    assert.true(angle.eq(new Fraction(Math.PI).div(2)));
  });
  it("the origin", function() {
    var angle = arcProxy._toArcAngle(new Fraction(0), new Fraction(0), new Fraction(0), new Fraction(0));
    assert.true(angle.eq(0))
  });
});

describe("EmptyArc", function() {
  describe("constructor", function() {
    it("use 3-points-arc way by default", function() {
      var arc = new arcProxy.EmptyArc();
      assert.equal(arc.howto, arcProxy.HowToDrawAnArc.THREE_POINTS);
    })
  });
  describe(".feedPoint", function() {
    it("returns arcProxy.OnePointArc for 3-point-arc", function() {
      var arc = new arcProxy.EmptyArc();
      var next = arc.feedPoint({p: new Point(1, 1)});
      assert.true(next instanceof arcProxy.OnePointArc);
      assert.true(next.p.equals(new Point(1, 1)));
    });
    it("returns arcProxy.CenterArc for center-arc", function() {
      var arc = new arcProxy.EmptyArc();
      arc.feedText({s: 'c'});
      var next = arc.feedPoint({p: new Point(1, 1)});
      assert.true(next instanceof arcProxy.CenterArc);
      assert.true(next.center.equals(new Point(1, 1)));
    });
  });
  describe(".feedText", function() {
    it("switch to center-arc mode", function() {
      var arc = new arcProxy.EmptyArc();
      arc.feedText({s: 'c'});
      assert.equal(arc.howto, arcProxy.HowToDrawAnArc.CIRCLE);
    });
    it("switch to center-arc mode and switch back", function() {
      var arc = new arcProxy.EmptyArc();
      arc.feedText({s: 'c'});
      assert.equal(arc.howto, arcProxy.HowToDrawAnArc.CIRCLE);
      arc.feedText({s: '3p'});
      assert.equal(arc.howto, arcProxy.HowToDrawAnArc.THREE_POINTS);
    });
  });
});

describe("OnePointArc", function() {
  describe(".feedPoint", function() {
    it("returns a arcProxy.TwoPointArc", function() {
      var arc = new arcProxy.OnePointArc(new Point(1, 1));
      var next = arc.feedPoint({p: new Point(2, 2)});
      assert.true(next instanceof arcProxy.TwoPointArc);
      assert.true(next.p1.equals(new Point(1, 1)));
      assert.true(next.p2.equals(new Point(2, 2)));
    });
  });
});

describe("TwoPointArc", function() {
  describe("._findArc", function() {
    it("anticlockwise", function() {
      var arc = new arcProxy.TwoPointArc(new Point(5, 0), new Point(2.5, 2.5));
      var [crossX, crossY, radius, startAngle, endAngle, anticlockwise] = arc._findArc(new Point(-5, 0));
      assert.true(crossX.eq(0), crossX);
      assert.true(crossY.eq(-2.5), crossY);
      assert.equal(radius.valueOf().toPrecision(3), '5.59');
      assert.equal(startAngle.valueOf().toPrecision(3), '5.82');
      assert.equal(endAngle.valueOf().toPrecision(3), '3.61');
      assert.true(anticlockwise);
    });
    it("clockwise", function() {
      var arc = new arcProxy.TwoPointArc(new Point(2.5, 2.5), new Point(5, 0));
      var [crossX, crossY, radius, startAngle, endAngle, anticlockwise] = arc._findArc(new Point(-5, 0));
      assert.true(crossX.eq(0), crossX);
      assert.true(crossY.eq(-2.5), crossY);
      assert.equal(radius.valueOf().toPrecision(3), '5.59');
      assert.equal(startAngle.valueOf().toPrecision(3), '5.18');
      assert.equal(endAngle.valueOf().toPrecision(3), '3.61');
      assert.false(anticlockwise);
    });
    it("three points on the same line", function() {
      var arc = new arcProxy.TwoPointArc(new Point(-1, -1), new Point(1, 3))
      var params = arc._findArc(new Point(5, 11));
      assert.isNull(params)
    });
  });
});

describe("CenterArc", function() {
  describe(".feedPoint", function() {
    it("returns a arcProxy.CenterRadiusArc", function() {
      var centerArc = new arcProxy.CenterArc(new Point(0, 0));
      var next = centerArc.feedPoint({p: new Point(1, 1)});
      assert.true(next instanceof arcProxy.CenterRadiusArc);
    });
  });
});

describe("CenterRadiusArc", function() {
  it(".feedPoint", function() {
    var crArc = new arcProxy.CenterRadiusArc(new Point(0, 0), new Point(2, 3));
    var arc = crArc.feedPoint({p: new Point(-10, 4)});
    assert.true(arc.center.equals(new Point(0, 0)));
    assert.equal(arc.radius.valueOf().toPrecision(3), "3.61");
    assert.equal(arc.startAngle.valueOf().toPrecision(3), "5.30");
    assert.equal(arc.endAngle.valueOf().toPrecision(3), "3.52");
    assert.false(arc.anticlockwise);
  });
  describe(".feedText", function() {
    it("turn to anticlockwise", function() {
      var crArc = new arcProxy.CenterRadiusArc(new Point(0, 0), new Point(2, 3));

      crArc.anticlockwise = null;
      crArc = crArc.feedText({s: "acw"});
      assert.true(crArc.anticlockwise);

      crArc.anticlockwise = null;
      crArc = crArc.feedText({s: "anticlockwise"});
      assert.true(crArc.anticlockwise);
    });
    it("turn to clockwise", function() {
      var crArc = new arcProxy.CenterRadiusArc(new Point(0, 0), new Point(2, 3));

      crArc.anticlockwise = null;
      crArc = crArc.feedText({s: "cw"});
      assert.false(crArc.anticlockwise);

      crArc.anticlockwise = null;
      crArc = crArc.feedText({s: "clockwise"});
      assert.false(crArc.anticlockwise);
    });
  });
});

describe("Arc", function() {

});
