import proxyquire from "proxyquire"
import sinon from "sinon"
import {assert} from "../utils/assert"
import {ShapeType} from "../../src/shapes/shape"
import {Point} from "../../src/shapes/point"

var lineStub = {
  info: function(message) {},
  error: function(message) {}
}
var circleProxy = proxyquire('../../src/shapes/circle', {
  '../html/logging': lineStub
})

describe("EmptyCircle", function() {
  it(".feedPoint", function() {
    var circle = new circleProxy.EmptyCircle();
    var next = circle.feedPoint({p: new Point(1, 1)});
    assert.true(next instanceof circleProxy.CenterCircle);
  });
});

describe("CenterCircle", function() {
  it(".feedPoint", function() {
    var circle = new circleProxy.CenterCircle(new Point(1, 1));
    var next = circle.feedPoint({p: new Point(3, 5)});
    assert.true(next instanceof circleProxy.Circle);
    assert.true(next.center.equals(new Point(1, 1)));
    assert.equal(next.radius.valueOf().toPrecision(3), "4.47");
  });
  describe(".feedText", function() {
    it("valid number", function() {
      var circle = new circleProxy.CenterCircle(new Point(1, 1));
      var next = circle.feedText({s: "10.5"});
      assert.true(next instanceof circleProxy.Circle);
      assert.true(next.center.equals(new Point(1, 1)));
      assert.equal(next.radius.valueOf().toPrecision(3), "10.5");
    });
    it("invalid number", function() {
      var circle = new circleProxy.CenterCircle(new Point(1, 1));
      var next = circle.feedText({s: "10.5x"});
      assert.true(next instanceof circleProxy.CenterCircle);
      assert.true(next.center.equals(new Point(1, 1)));
    });
  });
});

describe("Circle", function() {
  describe(".constructor", function() {
    it("set type to Circle", function() {
      var circle = new circleProxy.Circle(new Point(1, 1), 5);
      assert.equal(circle.type, ShapeType.Circle);
    });
  });
  it(".equals", function() {
    var circle = new circleProxy.Circle(new Point(1, 1), 5);
    assert.true(circle.equals(new circleProxy.Circle(new Point(1, 1), 5)));
  });
});
