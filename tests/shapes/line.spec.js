import {assert} from "../utils/assert";
import {Fraction} from "../../src/math/fraction";
import {ShapeType} from "../../src/shapes/shape";
import {Point} from "../../src/shapes/point";
import {Line} from "../../src/shapes/line";
import {ViewPort} from "../../src/viewport";

describe("Line", function() {
  describe("constructor", function() {
    it("set type to Line", function() {
      var p1 = new Point(-12, 5);
      var p2 = new Point(20, -5);
      var l = new Line(p1, p2);
      assert.equal(l.type, ShapeType.Line);
    });
  });
  it(".toString", function() {
    var p1 = new Point(-12, 5);
    var p2 = new Point(20, -5);
    var l = new Line(p1, p2);
    assert.equal(l.toString(), '(-12,5)->(20,-5)');
  });
  describe(".intersect", function() {
    describe("returns null for line outside of viewport", function() {
      it("parallel, to the left", function() {
        var p1 = new Point(-20, -5);
        var p2 = new Point(-20, 5);
        var l = new Line(p1, p2);
        var vp = new ViewPort(20, 20);
        assert.equal(l.intersect(vp), null);
      });
      it("just to the left", function() {
        var p1 = new Point(-100, -30);
        var p2 = new Point(-85, 50);
        var l = new Line(p1, p2);
        var vp = new ViewPort(20, 20);
        assert.equal(l.intersect(vp), null);
      });
      it("just to the right", function() {
        var p1 = new Point(100, -30);
        var p2 = new Point(85, 50);
        var l = new Line(p1, p2);
        var vp = new ViewPort(20, 20);
        assert.equal(l.intersect(vp), null);
      });
      it("from left top to right top", function() {
        var p1 = new Point(-100, 30);
        var p2 = new Point(85, 50);
        var l = new Line(p1, p2);
        var vp = new ViewPort(20, 20);
        assert.equal(l.intersect(vp), null);
      });
      it("from right bottom to left bottom", function() {
        var p1 = new Point(100, -30);
        var p2 = new Point(-5, -15);
        var l = new Line(p1, p2);
        var vp = new ViewPort(20, 20);
        assert.equal(l.intersect(vp), null);
      });
    });
    it("returns itself for the line inside of viewport", function() {
      var p1 = new Point(5, 5);
      var p2 = new Point(0, 0);
      var l = new Line(p1, p2);
      var vp = new ViewPort(20, 20);
      assert.equal(l.intersect(vp), l);
    });
    describe("return the intersected part for the line passing through the viewport", function() {
      it("insde -> outside, parallel", function() {
        var p1 = new Point(15, 0);
        var p2 = new Point(1, 0);
        var l = new Line(p1, p2);
        var vp = new ViewPort(20, 20);
        var nl = l.intersect(vp);
        assert.true(nl.p1.equals(new Point(10, 0)));
        assert.true(nl.p2.equals(new Point(1, 0)));
      });
      it("vertical, outside -> inside -> outside", function() {
        var p1 = new Point(-10, -15);
        var p2 = new Point(0, 15);
        var l = new Line(p1, p2);
        var vp = new ViewPort(20, 20);
        var nl = l.intersect(vp);
        var expectedP1 = new Point(new Fraction(-25, 3), -10);
        var expectedP2 = new Point(new Fraction(-5, 3), 10);
        assert.true(nl.p1.equals(expectedP1));
        assert.true(nl.p2.equals(expectedP2));
      });
      it("horizontal, outside -> inside -> outside", function() {
        var p1 = new Point(-12, 5);
        var p2 = new Point(20, -5);
        var l = new Line(p1, p2);
        var vp = new ViewPort(20, 20);
        var nl = l.intersect(vp);
        var expectedP1 = new Point(-10, new Fraction(35, 8));
        var expectedP2 = new Point(10, new Fraction(-15, 8));
        assert.true(nl.p1.equals(expectedP1));
        assert.true(nl.p2.equals(expectedP2));
      });
    });
  });
  describe(".equals", function () {
    it("returns true if the two lines are identical", function() {
      var p1 = new Point(-12, 5);
      var p2 = new Point(20, -5);
      var l1 = new Line(p1, p2);
      var l2 = new Line(p1, p2);
      assert.true(l1.equals(l2));
    });
    it("returns false if the two lines are not identical", function() {
      var p1 = new Point(-12, 5);
      var p2 = new Point(20, -5);
      var p3 = new Point(0, 0)
      var l1 = new Line(p1, p2);
      var l2 = new Line(p2, p3);
      assert.false(l1.equals(l2));
    });
    it("throws exception if object other than a Line is received", function() {
      var p1 = new Point(-12, 5);
      var p2 = new Point(20, -5);
      var l1 = new Line(p1, p2);
      assert.throws(function() {
        l1.equals({a:1})
      }, /Not a shape/);
      assert.throws(function() {
        l1.equals({type:'unknown'})
      }, /mismatch/);
    });
  });
});
