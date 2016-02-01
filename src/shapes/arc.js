import * as log from "../html/logging"
import {Fraction} from "../math/fraction"
import {Shape, PartialShape} from "./shape"
import {Point} from "./point"

const HowToDrawAnArc = {
  '3p': 'three-points-arc',
  'c': 'circle-arc'
}

class PartialArc extends PartialShape {}

export class EmptyArc extends PartialArc {
  constructor() {
    this.howto = HowToDrawAnArc['3p'];
  }
  feedPoint(message) {
    switch (this.howto) {
      case HowToDrawAnArc['3p']:
        return OnePointArc(message.p);
      case HowToDrawAnArc['c']:
        return CenterArc(message.p);
    }
    return this;
  }
  feedText(message) {
    var howto = HowToDrawAnArc[message.s]
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
    this.p = p;
  }
  feedPoint(message) {
    return TwoPointArc(this.p, message.p);
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
    this.p1 = p1;
    this.p2 = p2;
  }
  _findArc(p) {

    // given the line described by two points p1 & p2\
    // find the perpendicular line described by the 'k' and 'b' (kx + b = y)
    function kb(p1, p2) {
      return [
        p1.x.sub(p2.x).div(p2.y.sub(p1.y))
        p2.y.pow(2).sub(p1.y.pow(2)).add(p2.x.pow(2)).sub(p2.x.pow(2)).div(p2.y.sub(p1.y).mul(2))
      ];
    }

    var [k1, b1] = kb(this.p1, this.p2),
        [k2, b2] = kb(this.p2, p);
    var crossX = b1.sub(b2).div(k2.sub(k1)),
        crossY = k2.mul(b1).sub(k1.mul(b2)).div(k2.sub(k1));  // center
    var radius = Math.sqrt(crossX.sub(this.p1.x).pow(2).add(crossY.sub(this.p1.y).pow(2)).valueOf());
    var angle1 = Math.arctan(this.p1.y.sub(crossY).div(this.p1.x.sub(crossX)).valueOf()),
        angle2 = Math.arctan(this.p2.y.sub(crossY).div(this.p2.x.sub(crossX)).valueOf()),
        angle3 = Math.arctan(p.y.sub(crossY).div(p.x.sub(crossX)).valueOf());
    var startAngle = Math.min(angle1, Math.min(angle2, angle3)),
        endAngle = Math.max(angle1, Math.max(angle2, angle3));
    return [crossX, crossY, radius, startAngle, endAngle];
  }
  feedPoint(message) {
    var [crossX, crossY, radius, startAngle, endAngle] = this._findArc(message.p);
    return new Arc(new Point(crossX, crossY), radius, startAngle, endAngle);
  }
  draw(viewport, context) {
    var [crossX, crossY, radius, startAngle, endAngle] = this._findArc(viewport.cursor());
    context.beginPath();
    context.arc(
      crossX.valueOf(),
      crossY.valueOf(),
      radius.valueOf(),
      startAngle.valueOf(),
      endAngle.valueOf()
    )
    context.moveTo(viewport.p2cx(this.p1.x), viewport.p2cy(this.p1.y));
    context.lineTo(viewport.p2cx(this.p2.x), viewport.p2cy(this.p2.y));
    context.lineTo(viewport.cursorX, viewport.cursorY);
    context.stroke();
  }
}

export class CenterArc extends PartialArc {
  constructor(p) {
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
    this.center = center;
    this.p = p;
    this.radius = new Fraction(Math.sqrt(p.x.sub(center.x).pow(2).add(p.y.sub(center.y).pow(2))));
  }
  _findArc(p) {
    var p1 = this.p, p2 = p;
    var startAngle = Math.arctan(p1.y.sub(this.center.y).div(p1.x.sub(this.center.x)).valueOf()),
        endAngle = Math.arctan(p2.y.sub(this.center.y).div(p2.x.sub(this.center.x)).valueOf());
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

export class Arc {
  // @param center {Point}
  constructor(center, radius, startAngle, endAngle, anticlockwise=false) {
    super();
    this.center = center;  // point
    this.radius = new Fraction(radius);
    this.startAngle = new Fraction(startAngle);
    this.endAngle = new Fraction(endAngle);
    this.anticlockwise = anticlockwise
  }

  // @return {boolean}
  equals(arc) {
    super(arc);
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
