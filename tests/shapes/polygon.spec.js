import proxyquire from "proxyquire"
import sinon from "sinon"
import {assert} from "../utils/assert"
import {Fraction} from "../../src/math/fraction"
import {ShapeType} from "../../src/shapes/shape"
import {Point} from "../../src/shapes/point"

var errorspy = sinon.spy();
var lineStub = {
  info: function(message) {},
  error: errorspy
}
var polyProxy = proxyquire('../../src/shapes/polygon', {
  '../html/logging': lineStub
})

describe("EmptyPolygon", function() {
  describe(".feedText", function() {
    it("accept number of edges", function() {
      var poly = new polyProxy.EmptyPolygon();
      var next = poly.feedText({s: "7"});
      assert.true(next instanceof polyProxy.EdgePolygon);
      assert.true(next.nEdge.eq(7));
    });
    it("reject float number", function() {
      var poly = new polyProxy.EmptyPolygon();
      var next = poly.feedText({s: "7.1"});
      assert.true(next instanceof polyProxy.EmptyPolygon);
      assert.true(errorspy.calledWith("Invalid integer: 7.1"));
    });
    it("reject invalid input", function() {
      var poly = new polyProxy.EmptyPolygon();
      var next = poly.feedText({s: "7s"});
      assert.true(next instanceof polyProxy.EmptyPolygon);
      assert.true(errorspy.calledWith("Invalid integer: 7s"));
    });
  });
});

describe("EdgePolygon", function() {
  it(".constructor", function() {
    var poly = new polyProxy.EdgePolygon(new Fraction(5));
    assert.true(poly.nEdge.eq(5));
  });
  it(".feedPoint", function() {
    var poly = new polyProxy.EdgePolygon(new Fraction(5));
    var next = poly.feedPoint({p: new Point(1, 1)});
    assert.true(next instanceof polyProxy.CenterEdgePolygon);
    assert.true(next.center.equals(new Point(1, 1)));
    assert.true(next.nEdge.eq(5));
  });
});

describe("CenterEdgePolygon", function() {
  it(".feedPoint", function() {
    var poly = new polyProxy.CenterEdgePolygon(new Point(1, 1), new Fraction(5));
    var next = poly.feedPoint({p: new Point(2, 2)});
    assert.true(next instanceof polyProxy.Polygon);
    assert.true(next.center.equals(new Point(1, 1)));
    assert.equal(next.radius.valueOf().toPrecision(3), "1.41");
    assert.true(next.start.equals(new Point(2, 2)));
    assert.true(next.nEdge.eq(5));
  })
})
