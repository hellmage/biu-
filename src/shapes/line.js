import {Fraction} from "../math/fraction"
import {Shape, ShapeType} from "./shape"
import {Point} from "./point"

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
    context.moveTo(viewport.transx(this.p1.x).valueOf(), viewport.transy(this.p1.y).valueOf());
    context.lineTo(viewport.transx(this.p2.x).valueOf(), viewport.transy(this.p2.y).valueOf());
    context.stroke();
  }
}
