import assert from "assert"
import {Point} from "../src/shapes/point";
import {ViewPort} from "../src/viewport";

describe("Point", function() {
  describe(".intersect", function(){
    it("returns null when the point is inside the viewport", function() {
      var p = new Point(20, 20);
      var vp = new ViewPort(20, 20);
      assert.equal(p.intersect(vp), null);
    });
    it("returns itself when the point is outside of the viewport", function() {
      var p = new Point(5, 5);
      var vp = new ViewPort(20, 20);
      assert.equal(p.intersect(vp), p);
    });
  });
  describe(".equals", function() {
    it("returns true if the two points are identical", function() {
      var p1 = new Point(5, 5);
      var p2 = new Point(5, 5);
      assert.equal(p1.equals(p2), true);
    });
    it("returns false if the two points are not identical", function() {
      var p1 = new Point(5, 5);
      var p2 = new Point(5, 6);
      assert.equal(p1.equals(p2), false);
    });
    it("throws exception if object other than a Point is received", function() {
      var p1 = new Point(5, 5);
      assert.throws(function() {
        p1.equals({a:1})
      }, /Not a shape/);
      assert.throws(function() {
        p1.equals({type:'unknown'})
      }, /mismatch/);
    });
  })
  it(".toString", function() {
    var p = new Point(2, 3);
    assert.equal(p.toString(), "(2,3)")
  });
});
