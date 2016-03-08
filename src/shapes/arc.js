import * as log from "../html/logging"
import {Fraction} from "../math/fraction"
import {Shape, PartialShape} from "./shape"
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

// given the center of the circle, return the angle of arbitary points on the
// circle
function toCircularAngle(cx, cy, x, y) {
  if (y.eq(cy)) {
    if (x.gte(cx)) {
      return new Fraction(0);
    } else {
      return new Fraction(Math.PI);
    }
  }
  if (x.eq(cx)) {
    if (y.gte(cy)) {
      return new Fraction(Math.PI).div(2);
    } else {
      return new Fraction(Math.PI).mul(3).div(2);
    }
  }
  var angle = Math.atan2(y.sub(cy).valueOf(), x.sub(cx).valueOf());
  if (y.lt(cy)) {
    angle += Math.PI;
  }
  return new Fraction(angle);
}

class PartialArc extends PartialShape {}

export class EmptyArc extends PartialArc {
  constructor() {
    super();
    this.howto = HowToDrawAnArc.THREE_POINTS;
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
    var howto = ArcCmdMap[message.s];
    if (howto)
      this.howto = howto;
    else
      log.error(`Unrecognized subcommand: ${message.s}`);
    return this;
  }
  draw(viewport, context) {}
}

export class OnePointArc extends PartialArc {
  constructor(p) {
    super();
    this.p = p;
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
    var startAngle = toCircularAngle(centerX, centerY, x1, y1),
        midAngle = toCircularAngle(centerX, centerY, x2, y2),
        endAngle = toCircularAngle(centerX, centerY, x3, y3);
    var anticlockwise = false;
    if (midAngle >= startAngle) {
      if (endAngle >= midAngle || endAngle <= startAngle) {
        anticlockwise = true;
      }
      else {
        anticlockwise = false;
      }
    } else {
      if (endAngle >= startAngle || endAngle <= midAngle) {
        anticlockwise = false;
      } else {
        anticlockwise = true
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
        centerX.valueOf(),
        centerY.valueOf(),
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
    this.p = p;
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

export class CenterRadiusArc extends PartialArc {
  // @param center {Point} center of the circle
  // @param p {Point} one point on the circle
  constructor(center, p) {
    super();
    this.center = center;
    this.p = p;
    this.radius = new Fraction(Math.sqrt(p.x.sub(center.x).pow(2).add(p.y.sub(center.y).pow(2))));
  }
  _findArc(p) {
    var p1 = this.p, p2 = p;
    var startAngle = Math.atan(p1.y.sub(this.center.y).div(p1.x.sub(this.center.x)).valueOf()),
        endAngle = Math.atan(p2.y.sub(this.center.y).div(p2.x.sub(this.center.x)).valueOf());
    var anticlockwise = startAngle > endAngle ? true : false;
    return [startAngle, endAngle, anticlockwise];
  }
  feedPoint(message) {
    var [startAngle, endAngle, anticlockwise] = this._findArc(message.p);
    return new Arc(this.center, this.radius, startAngle, endAngle, anticlockwise);
  }
  draw(viewport, context) {
    var centerx = viewport.p2cx(this.center.x), centery = viewport.p2cy(this.center.y);
    var [startAngle, endAngle, anticlockwise] = this._findArc(viewport.cursor());
    context.beginPath();
    context.arc(
      centerx,
      centery,
      this.radius.valueOf(),
      startAngle.valueOf(),
      endAngle.valueOf(),
      anticlockwise
    )
    context.moveTo(centerx, centery);
    context.lineTo(viewport.p2cx(this.p.x), viewport.p2cy(this.p.y));
    context.lineTo(viewport.cursorX, viewport.cursorY);
    context.stroke();
  }
}

export class Arc extends Shape {
  // @param center {Point}
  constructor(center, radius, startAngle, endAngle, anticlockwise=false) {
    super();
    this.center = center;  // point
    this.radius = new Fraction(radius);
    this.startAngle = new Fraction(startAngle);
    this.endAngle = new Fraction(endAngle);
    this.anticlockwise = anticlockwise;
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
      this.center.x.valueOf(),
      this.center.y.valueOf(),
      this.radius.valueOf(),
      this.startAngle.valueOf(),
      this.endAngle.valueOf(),
      this.anticlockwise
    )
    context.stroke();
  }
}
