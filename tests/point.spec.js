import assert from "assert"
import {Point} from "../src/shapes/point";
import {ViewPort} from "../src/viewport";

describe("for a Point", function() {
  it("when outside the viewport, intersect returns null", function() {
    var p = new Point(20, 20);
    var vp = new ViewPort(20, 20);
    assert.equal(p.intersect(vp), null);
  });
  it("when inside the viewport, intersect returns itself", function() {
    var p = new Point(5, 5);
    var vp = new ViewPort(20, 20);
    assert.equal(p.intersect(vp), p);
  });
});
