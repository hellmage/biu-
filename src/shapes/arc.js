import * as log from "../html/logging"
import {Fraction} from "../math/fraction"
import {Shape, PartialShape, ShapeType} from "./shape"
import {Point} from "./point"

export const HowToDrawAnArc = {
  // define an arc by three points on the arc
  THREE_POINTS: 'three-points-arc',
  // define an arc by the center of the circle,
  // and the starting and ending points on the circle
  CIRCLE: 'circle-arc'
};

const ArcCmdMap = {
  '3p': HowToDrawAnArc.THREE_POINTS,
  'c': HowToDrawAnArc.CIRCLE
};

// Given the center of the circle, return the angle of arbitary points on the circle.
// NOTE: The angle is measured clockwise from the positive x axis and expressed in radians.
// This is totally the fault of Math.arc. Why in hell does it accept angles in such a weired way?
// NOTE: This function should be private. It's exposed for the sake of testing.
export function _toArcAngle(cx, cy, x, y) {
  if (y.eq(cy)) {
    if (x.gte(cx)) {
      return new Fraction(0);
    } else {
      return new Fraction(Math.PI);
    }
  }
  if (x.eq(cx)) {
    if (y.gte(cy)) {
      return new Fraction(Math.PI).mul(3).div(2);
    } else {
      return new Fraction(Math.PI).div(2);
    }
  }
  var angle = -Math.atan2(y.sub(cy).valueOf(), x.sub(cx).valueOf());
  if (y.gt(cy)) {
    angle += Math.PI * 2;
  }
  return new Fraction(angle);
}

class PartialArc extends PartialShape {}

export class EmptyArc extends PartialArc {
  constructor() {
    super();
    this._switchToThreePointsMode()
  }
  _switchToThreePointsMode() {
    this.howto = HowToDrawAnArc.THREE_POINTS;
    log.info("Drawing arc by three points, please specify the first point.")
    log.info('Input "c" to draw the arc by circle.')
  }
  _switchToCircleMode() {
    this.howto = HowToDrawAnArc.CIRCLE;
    log.info("Drawing arc by circle, please specify the center.")
    log.info('Input "3p" to draw the arc by three points.')
  }
  feedPoint(message) {
    switch (this.howto) {
      case HowToDrawAnArc.THREE_POINTS:
        return new OnePointArc(message.p);
      case HowToDrawAnArc.CIRCLE:
        return new CenterArc(message.p);
      default:
        throw `Invalid way to draw an arc: ${this.howto}`;
    }
    return this;
  }
  feedText(message) {
    switch(ArcCmdMap[message.s]) {
      case HowToDrawAnArc.THREE_POINTS:
        this._switchToThreePointsMode();
        break;
      case HowToDrawAnArc.CIRCLE:
        this._switchToCircleMode();
        break;
      default:
        log.error(`Unrecognized subcommand: ${message.s}`);
        break;
    }
    return this;
  }
  draw(viewport, context) {}
}

export class OnePointArc extends PartialArc {
  constructor(p) {
    super();
    this.p = p;
    log.info("Please specify the second point.")
  }
  feedPoint(message) {
    return new TwoPointArc(this.p, message.p);
  }
  draw(viewport, context) {
    context.beginPath();
    context.moveTo(viewport.p2cx(this.p.x), viewport.p2cy(this.p.y));
    context.lineTo(viewport.cursorX, viewport.cursorY);
    context.stroke();
  }
}

export class TwoPointArc extends PartialArc {
  constructor(p1, p2) {
    super();
    this.p1 = p1;
    this.p2 = p2;
    log.info("Please specify the third point.")
  }
  _findArc(p) {
    var p1 = this.p1, p2 = this.p2, p3 = p;
    var x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, x3 = p3.x, y3 = p3.y;
    var dx21 = x2.sub(x1), dy21 = y2.sub(y1), dx32 = x3.sub(x2), dy32 = y3.sub(y2);
    if (dx21.mul(dy32).eq(dx32.mul(dy21)))
      return null;  // the three points are on the same line
    // (x-a)^2+(y-b)^2=0
    var z1 = x1.pow(2).add(y1.pow(2)), z2 = x2.pow(2).add(y2.pow(2)), z3 = x3.pow(2).add(y3.pow(2));
    var centerX = y1.sub(y2).mul(z3.sub(z2)).sub(y2.sub(y3).mul(z2.sub(z1)))
                  .div(y1.sub(y2).mul(x2.sub(x3)).sub(y2.sub(y3).mul(x1.sub(x2))))
                  .div(-2),   // a
        centerY = z2.sub(z1).mul(x2.sub(x3)).sub(z3.sub(z2).mul(x1.sub(x2)))
                  .div(y1.sub(y2).mul(x2.sub(x3)).sub(y2.sub(y3).mul(x1.sub(x2))))
                  .div(-2);   // b
    var radius = new Fraction(Math.sqrt(x1.sub(centerX).pow(2).add(y1.sub(centerY).pow(2)).valueOf()));
    var startAngle = _toArcAngle(centerX, centerY, x1, y1),
        midAngle = _toArcAngle(centerX, centerY, x2, y2),
        endAngle = _toArcAngle(centerX, centerY, x3, y3);
    var anticlockwise = false;
    if (midAngle >= startAngle) {
      if (endAngle >= midAngle || endAngle <= startAngle) {
        anticlockwise = false;
      }
      else {
        anticlockwise = true;
      }
    } else {
      if (endAngle >= startAngle || endAngle <= midAngle) {
        anticlockwise = true;
      } else {
        anticlockwise = false;
      }
    }
    return [centerX, centerY, radius, startAngle, endAngle, anticlockwise];
  }
  feedPoint(message) {
    var params = this._findArc(message.p);
    if (params === null)
      return this;
    var [centerX, centerY, radius, startAngle, endAngle, anticlockwise] = params;
    return new Arc(new Point(centerX, centerY), radius, startAngle, endAngle, anticlockwise);
  }
  draw(viewport, context) {
    var params = this._findArc(viewport.cursor());
    context.beginPath();
    if (params !== null) {  // arc
      var [centerX, centerY, radius, startAngle, endAngle, anticlockwise] = params;
      context.arc(
        viewport.p2cx(centerX),
        viewport.p2cy(centerY),
        radius.valueOf(),
        startAngle.valueOf(),
        endAngle.valueOf(),
        anticlockwise
      )
    }
    context.moveTo(viewport.p2cx(this.p1.x), viewport.p2cy(this.p1.y));
    context.lineTo(viewport.p2cx(this.p2.x), viewport.p2cy(this.p2.y));
    context.lineTo(viewport.cursorX, viewport.cursorY);
    context.stroke();
  }
}

export class CenterArc extends PartialArc {
  constructor(p) {
    super();
    this.center = p;
    log.info("Please specify the radius.")
  }
  feedPoint(message) {
    return new CenterRadiusArc(this.center, message.p);
  }
  draw(viewport, context) {
    context.beginPath();
    context.moveTo(viewport.p2cx(this.center.x), viewport.p2cy(this.center.y));
    context.lineTo(viewport.cursorX, viewport.cursorY);
    context.stroke();
  }
}

export class CenterRadiusArc extends PartialArc {
  // @param center {Point} center of the circle
  // @param p {Point} one point on the circle
  constructor(center, p) {
    super();
    this.center = center;
    this.p = p;
    this.radius = new Fraction(Math.sqrt(p.x.sub(center.x).pow(2).add(p.y.sub(center.y).pow(2))));
    this.anticlockwise = false;
    log.info("The arc goes clockwise by default.")
    log.info('Type "anticlockwise" or "acw" to draw it anticlockwise.');
    log.info('Type "clockwise" or "cw" to switch it back.');
  }
  _findArc(p) {
    var p1 = this.p, p2 = p;
    var startAngle = _toArcAngle(this.center.x, this.center.y, p1.x, p1.y),
        endAngle = _toArcAngle(this.center.x, this.center.y, p2.x, p2.y);
    return [startAngle, endAngle];
  }
  feedPoint(message) {
    var [startAngle, endAngle] = this._findArc(message.p);
    return new Arc(this.center, this.radius, startAngle, endAngle, this.anticlockwise);
  }
  feedText(message) {
    if (message.s === 'anticlockwise' || message.s === 'acw')
      this.anticlockwise = true;
    else if (message.s === 'clockwise' || message.s === 'cw')
      this.anticlockwise = false;
    else
      log.error(`Unrecognized subcommand: ${message.s}`);
    return this;
  }
  draw(viewport, context) {
    var centerx = viewport.p2cx(this.center.x), centery = viewport.p2cy(this.center.y);
    var [startAngle, endAngle] = this._findArc(viewport.cursor());
    context.beginPath();
    context.arc(
      centerx,
      centery,
      this.radius.valueOf(),
      startAngle.valueOf(),
      endAngle.valueOf(),
      this.anticlockwise
    )
    context.moveTo(centerx, centery);
    context.lineTo(viewport.p2cx(this.p.x), viewport.p2cy(this.p.y));
    context.stroke();
  }
}

export class Arc extends Shape {
  // @param center {Point}
  // @param radius {Fraction}
  // @param startAngle {Fraction}
  // @param endAngle {Fraction}
  // @param anticlockwise {Boolean}
  constructor(center, radius, startAngle, endAngle, anticlockwise=false) {
    super();
    this.center = center;  // point
    this.radius = new Fraction(radius);
    this.startAngle = new Fraction(startAngle);
    this.endAngle = new Fraction(endAngle);
    this.anticlockwise = anticlockwise;
    this.type = ShapeType.Arc;
  }

  // @return {boolean}
  equals(arc) {
    super.equals(arc);
    return this.center.equals(arc.center)
      && this.radius.eq(arc.radius)
      && this.startAngle.eq(arc.startAngle)
      && this.endAngle.eq(arc.endAngle)
      && this.anticlockwise === arc.anticlockwise;
  }

  toString() {
    return "arc";
  }

  intersect(viewport) {
    return this;
  }

  draw(viewport, context) {
    context.beginPath();
    context.arc(
      viewport.p2cx(this.center.x),
      viewport.p2cy(this.center.y),
      this.radius.valueOf(),
      this.startAngle.valueOf(),
      this.endAngle.valueOf(),
      this.anticlockwise
    )
    context.stroke();
  }
}
