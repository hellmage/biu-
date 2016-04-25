import * as log from "../html/logging"
import {Fraction} from "../math/fraction"
import {PartialShape, ShapeType} from "./shape"
import {Circle} from "./circle"

export class ConvexHull extends PartialShape {
  constructor(points) {
    super();
    this.points = points || [];
    this.hull = [];
    log.info('Please specify a point.')
  }
  feedPoint(message) {
    this.points.push(message.p);
    this.hull = this.buildHull(this.points);
    return this;
  }
  buildHull(points) {
    if (points.length <= 3) {
      return points;
    }
    // upper hull
    points.sort(function(p1, p2) {
      var dx = p1.x.sub(p2.x);
      if (dx.eq(0)) {
        return p2.y.sub(p1.y).valueOf();
      } else {
        return dx.valueOf();
      }
    });
    var upperHull = [points[0]], i = 1;
    while (i < points.length) {
      var p = points[i], last = upperHull[upperHull.length - 1];
      if (p.x.eq(last.x)) {
        i++;
        continue;
      }
      if (upperHull.length === 1) {
        upperHull.push(p);
        i++;
        continue;
      }
      var prev = upperHull[upperHull.length - 2];
      if (last.y.sub(prev.y).div(last.x.sub(prev.x)).gt(p.y.sub(last.y).div(p.x.sub(last.x)))) {
        upperHull.push(p);
        i++;
      } else {
        upperHull.pop();
      }
    }
    // lower hull
    points.reverse();
    var lowerHull = [points[0]], i = 1;
    while (i < points.length) {
      var p = points[i], last = lowerHull[lowerHull.length - 1];
      if (p.x.eq(last.x)) {
        i++;
        continue;
      }
      if (lowerHull.length === 1) {
        lowerHull.push(p);
        i++;
        continue;
      }
      var prev = lowerHull[lowerHull.length - 2];
      if (prev.y.sub(last.y).div(prev.x.sub(last.x)).gt(last.y.sub(p.y).div(last.x.sub(p.x)))) {
        lowerHull.push(p);
        i++;
      } else {
        lowerHull.pop();
      }
    }
    if (upperHull[upperHull.length - 1].equals(lowerHull[0]))
      upperHull.pop()
    if (upperHull[0].equals(lowerHull[lowerHull.length - 1]))
      lowerHull.pop()
    return upperHull.concat(lowerHull);
  }
  draw(viewport, context) {
    if (this.hull.length <= 0)
      return;
    context.beginPath();
    var p0 = this.hull[0];
    var cx0 = viewport.p2cx(p0.x), cy0 = viewport.p2cy(p0.y);
    context.moveTo(cx0, cy0);
    for (var i = 1; i < this.hull.length; i++) {
      var p = this.hull[i];
      var cx = viewport.p2cx(p.x), cy = viewport.p2cy(p.y);
      context.lineTo(cx, cy);
    }
    context.lineTo(cx0, cy0);
    context.stroke();
    for (var i = 0; i < this.points.length; i++) {
      new Circle(this.points[i], 1).draw(viewport, context);
    }
  }
}
