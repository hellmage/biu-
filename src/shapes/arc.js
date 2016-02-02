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
    // given the line described by two points p1 & p2,
    // find the perpendicular line described by the 'k' and 'b' (kx + b = y)
    function kb(p1, p2) {
      return [
        p1.x.sub(p2.x).div(p2.y.sub(p1.y)),
        p2.y.pow(2).sub(p1.y.pow(2)).add(p2.x.pow(2)).sub(p1.x.pow(2)).div(p2.y.sub(p1.y).mul(2))
      ];
    }

    // given an angle, convert it to range [0, Math.PI * 2]
    function normalize(ap, angle, centerx, centery) {
      if (Math.abs(angle - 1) < 0.00001)
        angle = 0;
      var normalized = angle;
      if (angle > 0) {
        if (ap.x.lt(centerx)) {
          normalized = angle + Math.PI;
        }
      } else {
        normalized = angle + Math.PI;
        if (ap.x.gt(centerx)) {
          normalized = angle + Math.PI;
        }
      }
      return normalized;
    }

    var startAngle = null, endAngle = null, side = new Fraction(1), radius = 5, crossX = new Fraction(0), crossY = new Fraction(-2.5);

    var [k1, b1] = kb(this.p1, this.p2),
        [k2, b2] = kb(this.p2, p);
    if (k1.eq(k2)) {  // the three points are on one line
      return [null, null, null, null, null, null];
    }
    var crossX = b1.sub(b2).div(k2.sub(k1)),
        crossY = k2.mul(b1).sub(k1.mul(b2)).div(k2.sub(k1));  // center
    console.log(`x=${crossX}, y=${crossY}`);
    var radius = Math.sqrt(crossX.sub(this.p1.x).pow(2).add(crossY.sub(this.p1.y).pow(2)).valueOf());
    console.log(`r=${radius}`)
    var startAngle = Math.PI / 2;
    if (this.p1.x.ne(crossX))
      startAngle = normalize(this.p1, Math.atan(this.p1.y.sub(crossY).div(this.p1.x.sub(crossX)).valueOf()), crossX, crossY);
    var endAngle = Math.PI / 2;
    if (p.x.ne(crossX))
      endAngle = normalize(p, Math.atan(p.y.sub(crossY).div(p.x.sub(crossX)).valueOf()), crossX, crossY);
    console.log(`s=${startAngle}, e=${endAngle}`)
    var anticlockwise = true;
    if (this.p1.x.eq(this.p2.x)) {
      if (this.p.x.lt(this.p1.x))
        anticlockwise = false;
    }
    else {
      var k = this.p2.y.sub(this.p1.y).div(this.p2.x.sub(this.p1.x)),
          b = this.p2.y.mul(this.p1.x).sub(this.p1.y.mul(this.p2.x)).div(this.p2.x.sub(this.p1.x));
      var side = p.x.mul(k).add(b);
      // the 3rd point is on the upper side of the line described by this.p1 and this.p2
      if (side.lt(0))
        // the 3rd point is on the lower side of the line described by this.p1 and this.p2
        anticlockwise = false;
    }


    return [crossX, crossY, radius, startAngle, endAngle, anticlockwise];
  }
  feedPoint(message) {
    var [crossX, crossY, radius, startAngle, endAngle, anticlockwise] = this._findArc(message.p);
    if (crossX === null)
      return this;
    return new Arc(new Point(crossX, crossY), radius, startAngle, endAngle, anticlockwise);
  }
  draw(viewport, context) {
    var [crossX, crossY, radius, startAngle, endAngle, anticlockwise] = this._findArc(viewport.cursor());
    context.beginPath();
    if (crossX === null) {
      context.arc(
        crossX.valueOf(),
        crossY.valueOf(),
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
