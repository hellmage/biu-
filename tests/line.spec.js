import assert from "assert"
import {Point} from "../src/shapes/point";
import {Line} from "../src/shapes/line";
import {ViewPort} from "../src/viewport";

describe("for a Line", function() {
  it("parallel and outside of the viewport, intersect returns null", function() {
    var p1 = new Point(-20, -5);
    var p2 = new Point(-20, 5);
    var l = new Line(p1, p2);
    var vp = new ViewPort(20, 20);
    assert.equal(l.intersect(vp), null);
  });
  // it("when inside the viewport, intersect returns itself", function() {
  //   var p = new Point(5, 5);
  //   var vp = new ViewPort(20, 20);
  //   assert.equal(p.intersect(vp), p);
  // });
});
