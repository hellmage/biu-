import assert from "assert"
import {Point} from "../src/shapes/point";
import {Line} from "../src/shapes/line";
import {ViewPort} from "../src/viewport";

describe("Line", function() {
  describe(".intersect", function() {
    it("returns null for line outside of viewport", function() {
      var p1 = new Point(-20, -5);
      var p2 = new Point(-20, 5);
      var l = new Line(p1, p2);
      var vp = new ViewPort(20, 20);
      assert.equal(l.intersect(vp), null);
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
        assert.equal(nl.p1.equals(new Point(10, 0)), true);
        assert.equal(nl.p2.equals(new Point(1, 0)), true);
      });
      it("outside -> inside -> outside", function() {
        var p1 = new Point(-10, -15);
        var p2 = new Point(0, 15);
        var l = new Line(p1, p2);
        var vp = new ViewPort(20, 20);
        var nl = l.intersect(vp);
        assert.equal(nl.p1.equals(new Point(-7.5, -10)), true);
        assert.equal(nl.p1.equals(new Point(-2.5, 10)), true);
      });
    });
  });
});
