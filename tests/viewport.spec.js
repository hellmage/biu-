import {Fraction} from "../src/math/fraction"
import {Direction, ViewPort} from "../src/viewport"
import {Point} from "../src/shapes/point"
import {assert} from "./utils/assert"

describe("ViewPort", function() {
  describe("constructor", function() {
    it("set origin of the plane at its center, zoomFactor defaults to 1", function() {
      var vp = new ViewPort(1405, 704);
      assert.true(vp.cWidth.eq(1405));
      assert.true(vp.cHeight.eq(704));
      assert.true(vp.pWidth.eq(1405));
      assert.true(vp.pHeight.eq(704));
      assert.true(vp.pLeftTop.equals(new Point(-702.5, 352)));
    });
    it("zoom on construction", function() {
      var vp = new ViewPort(1405, 704, 0.5);
      assert.true(vp.pWidth.eq(702.5));
      assert.true(vp.pHeight.eq(352));
      assert.true(vp.pLeftTop.equals(new Point(-351.25, 176)));
    });
  });
  describe(".zoom", function() {
    it("zoom in", function() {
      var vp = new ViewPort(1405, 704);
      vp.zoom(0.3);
      assert.true(vp.cWidth.eq(1405));
      assert.true(vp.cHeight.eq(704));
      assert.true(vp.pWidth.eq(421.5));
      assert.true(vp.pHeight.eq(211.2));
      assert.true(vp.pLeftTop.equals(new Point(-210.75, 105.6)));
    });
    it("zoom out", function() {
      var vp = new ViewPort(1405, 704);
      vp.zoom(5);
      assert.true(vp.cWidth.eq(1405));
      assert.true(vp.cHeight.eq(704));
      assert.true(vp.pWidth.eq(7025));
      assert.true(vp.pHeight.eq(3520));
      assert.true(vp.pLeftTop.equals(new Point(-3512.5, 1760)));
    });
  });
  describe(".move", function() {
    it("up, delta = 10%", function() {
      var vp = new ViewPort(1405, 704);
      vp.move(Direction.UP, 0.1);
      assert.true(vp.cWidth.eq(1405));
      assert.true(vp.cHeight.eq(704));
      assert.true(vp.pWidth.eq(1405));
      assert.true(vp.pHeight.eq(704));
      assert.true(vp.pLeftTop.equals(new Point(-702.5, 422.4)));
    });
    it("down", function() {
      var vp = new ViewPort(1405, 704);
      vp.move(Direction.DOWN, 0.2);
      assert.true(vp.pLeftTop.equals(new Point(-702.5, 211.2)));
    });
    it("left", function() {
      var vp = new ViewPort(1405, 704);
      vp.move(Direction.LEFT, 0.2);
      assert.true(vp.pLeftTop.equals(new Point(-983.5, 352)));
    });
    it("right", function() {
      var vp = new ViewPort(1405, 704);
      vp.move(Direction.RIGHT, 0.2);
      assert.true(vp.pLeftTop.equals(new Point(-421.5, 352)));
    });
  });
  it(".transx", function() {
    var vp = new ViewPort(1405, 704, 0.1);
    vp.move(Direction.UP, 0.2);
    vp.move(Direction.LEFT, 0.5);
    var x = vp.transx(new Fraction(14.22));
    assert.equal(x, 1547);
  });
  it(".transy", function() {
    var vp = new ViewPort(1405, 704, 0.1);
    vp.move(Direction.UP, 0.2);
    vp.move(Direction.LEFT, 0.5);
    var y = vp.transy(new Fraction(21.12));
    assert.equal(y, 282);
  });
});
