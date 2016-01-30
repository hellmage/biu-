import * as log from "../html/logging";
import {Fraction} from "../math/fraction";
import {PartialShape, Shape, ShapeType} from "./shape";
import {Point} from "./point";

function extractCmdArg(input) {
  var str = input.split(' ').filter(s => s != '');
  var cmd = str.shift(), arg = str.join(' ');
  try {
    arg = new Fraction(arg);
    return [cmd, arg];
  } catch(e) {
    log.error(`Invalid argument: ${input}`);
    return [cmd, null]
  }
}

// @param angle {Fraction}
// @return {number}
function convertAngle(angle) {
  return new Fraction(angle).mod(360).div(360).mul(2).mul(Math.PI).valueOf()
}

class PartialLine extends PartialShape {
  _drawTo(viewport) {
    throw "NotImplemented";
  }
  draw(viewport, context) {
    var [destX, destY] = this._drawTo(viewport);
    context.beginPath();
    context.moveTo(viewport.p2cx(this.p.x), viewport.p2cy(this.p.y));
    context.lineTo(destX, destY);
    context.stroke();
  }
}

export class EmptyLine extends PartialLine {
  feedPoint(message) {
    return new OnePointLine(message.p);
  }
}

export class OnePointLine extends PartialLine {
  constructor(p) {
    super();
    this.p = p;
  }

  _drawTo(viewport) {
    return [viewport.cursorX, viewport.cursorY];
  }

  feedPoint(message) {
    return new Line(this.p, message.p);
  }

  feedText(message) {
    var [cmd, arg] = extractCmdArg(message.s)
    if (arg === null) {
      return this;
    }
    var next = this;
    if (cmd === 'l') // here length refers to distance on the plane
      next = new FixLengthLine(this.p, arg);
    else
      log.error(`Unrecognized subcommand: ${cmd}`);
    return next;
  }
}

export class FixLengthLine extends PartialLine {
  // @param p {Point}
  // @param length {Fraction}
  constructor(p, length) {
    super();
    this.p = p;
    this.length = length;
  }

  // given a point on the plane(usually a click), return the ending point of fix-length line
  _dest(px, py) {
    var dx = px.sub(this.p.x), dy = py.sub(this.p.y);
    if (dx.eq(0)) {
      var length = dy.gt(0) ? this.length : -this.length;
      return [this.p.x, this.p.y.add(length)];
    }
    else {
      var dist = Math.sqrt(dx.pow(2).add(dy.pow(2)).valueOf());
      var destX = this.p.x.add(dx.div(dist).mul(this.length)),
          destY = this.p.y.add(dy.div(dist).mul(this.length));
      return [destX, destY];
    }
  }

  _drawTo(viewport) {
    var cursorX = viewport.c2px(viewport.cursorX),
        cursorY = viewport.c2py(viewport.cursorY);
    var [destX, destY] = this._dest(cursorX, cursorY);
    return [viewport.p2cx(destX), viewport.p2cy(destY)];
  }

  feedPoint(message) {
    var [destX, destY] = this._dest(message.p.x, message.p.y);
    return new Line(this.p, new Point(destX, destY));
  }

  feedText(message) {
    var [cmd, arg] = extractCmdArg(message.s)
    if (arg === null) {
      return this;
    }
    var next = this;
    if (cmd === 'a') {
      var angle = convertAngle(arg);
      var destX = this.p.x.add(this.length.mul(Math.cos(angle))),
          destY = this.p.y.add(this.length.mul(Math.sin(angle)));
      next = new Line(this.p, new Point(destX, destY));
    } else {
      log.error(`Unrecognized subcommand: ${cmd}`);
    }
    return next;
  }
}

export class Line extends Shape {
  // @param p1: Point
  // @param p2: Point
  constructor(p1, p2) {
    super();
    this.p1 = p1;
    this.p2 = p2;
    this.type = ShapeType.Line;
  }

  toString() {
    return `${this.p1}->${this.p2}`;
  }

  equals(l) {
    super.equals(l);
    return this.p1.equals(l.p1) && this.p2.equals(l.p2);
  }

  // @param vp: ViewPort
  _bCohenSutherland(vp) {
    // region definition: https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
    // 1001 | 1000 | 1010
    // -----+------+-----
    // 0001 | 0000 | 0010
    // -----+------+-----
    // 0101 | 0100 | 0110
    // @param p: Point
    // @return number
    function region(p) {
      if (p.x.lte(vp.pLeftTop.x) && p.y.gte(vp.pLeftTop.y))
        return 9; // 1001
      else if (p.x.lte(vp.pLeftTop.x)
               && p.y.lt(vp.pLeftTop.y) && p.y.gte(vp.pLeftTop.y.sub(vp.pHeight)))
        return 1; // 0001
      else if (p.x.lte(vp.pLeftTop.x) && p.y.lt(vp.pLeftTop.y.sub(vp.pHeight)))
        return 5; // 0101
      else if (p.x.gt(vp.pLeftTop.x) && p.x.lte(vp.pLeftTop.x.add(vp.pWidth))
               && p.y.lte(vp.pLeftTop.y.sub(vp.pHeight)))
        return 4; // 0100
      else if (p.x.gt(vp.pLeftTop.x.add(vp.pWidth)) && p.y.lte(vp.pLeftTop.y.sub(vp.pHeight)))
        return 6; // 0110
      else if (p.x.gte(vp.pLeftTop.x.add(vp.pWidth))
               && p.y.lt(vp.pLeftTop.y) && p.y.gte(vp.pLeftTop.y.sub(vp.pHeight)))
        return 2; // 0010
      else if (p.x.gte(vp.pLeftTop.x.add(vp.pWidth)) && p.y.gte(vp.pLeftTop.y))
        return 10; // 1010
      else if (p.x.gt(vp.pLeftTop.x) && p.x.lte(vp.pLeftTop.x.add(vp.pWidth))
               && p.y.gte(vp.pLeftTop.y))
        return 8; // 1000
      else
        return 0; // 0000
    }

    var r1 = region(this.p1), r2 = region(this.p2);
    if ((r1 | r2) === 0) // Both endpoints are in the viewport region, accept
      return true;
    else if ((r1 & r2) !== 0) // reject
      return false;
    return null;
  }

  // https://www.youtube.com/watch?v=fneoVtZx9iA
  // @param vp: ViewPort
  // @return Line?
  _clipLiangBarsky(vp) {
    var dx = this.p2.x.sub(this.p1.x), dy = this.p2.y.sub(this.p1.y);
    var xWinMin = vp.pLeftTop.x, xWinMax = vp.pLeftTop.x.add(vp.pWidth);
    var yWinMin = vp.pLeftTop.y.sub(vp.pHeight), yWinMax = vp.pLeftTop.y;
    var p1 = dx.neg(), q1 = this.p1.x.sub(xWinMin),
        p2 = dx, q2 = xWinMax.sub(this.p1.x),
        p3 = dy.neg(), q3 = this.p1.y.sub(yWinMin),
        p4 = dy, q4 = yWinMax.sub(this.p1.y);
    if ((dx.equals(0) && (q1.lte(0)|| q2.lte(0))) ||
        (dy.equals(0) && (q3.lte(0)|| q4.lte(0))))
      return null;  // parallel and outside of window
    var t1 = new Fraction(0), t2 = new Fraction(1);
    if (dx.gt(0)) {
      t1 = q1.div(p1).max(0);
      t2 = q2.div(p2).min(1);
    } else if (dx.lt(0)) {
      t1 = q2.div(p2).max(0);
      t2 = q1.div(p1).min(1);
    }
    if (dy.gt(0)) {
      t1 = q3.div(p3).max(t1);
      t2 = q4.div(p4).min(t2);
    } else if (dy.lt(0)) {
      t1 = q4.div(p4).max(t1);
      t2 = q3.div(p3).min(t2);
    }
    var newP1 = this.p1, newP2 = this.p2;
    if (t1.ne(0))
      newP1 = new Point(this.p1.x.add(t1.mul(dx)), this.p1.y.add(t1.mul(dy)));
    if (t2.ne(1))
      newP2 = new Point(this.p1.x.add(t2.mul(dx)), this.p1.y.add(t2.mul(dy)));
    return new Line(newP1, newP2);
  }

  /* Line clipping: https://en.wikipedia.org/wiki/Line_clipping
     Here the Cohen–Sutherland algorithm is used to give a trivial accept or reject.
     If further processing is needed, Liang–Barsky algorithm is used.
     @param vp: ViewPort
     @return
      - if the line intersect with viewport, return the intersected part
      - else, return null
   */
  intersect(vp) {
    if (this._bCohenSutherland(vp) === true)
      return this;
    else if (this._bCohenSutherland(vp) === false)
      return null;
    else
      return this._clipLiangBarsky(vp);
  }

  draw(viewport, context) {
    context.beginPath();
    context.moveTo(viewport.p2cx(this.p1.x), viewport.p2cy(this.p1.y));
    context.lineTo(viewport.p2cx(this.p2.x), viewport.p2cy(this.p2.y));
    context.stroke();
  }
}
