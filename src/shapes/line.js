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

  // @param vp: ViewPort
  _bCohenSutherland(vp) {
    // @param p: Point
    // @return number
    function region(p) {
      if (p.x <= vp.pLeftTop.x && p.y <= vp.pLeftTop.y)
        return 9 // 1001
      else if (p.x <= vp.pLeftTop.x && p.y > vp.pLeftTop.y && p.y <= vp.pLeftTop.y + vp.pHeight)
        return 1 // 0001
      else if (p.x <= vp.pLeftTop.x && p.y > vp.pLeftTop.y + vp.pHeight)
        return 5 // 0101
      else if (p.x > vp.pLeftTop.x && p.x <= vp.pLeftTop.x + vp.pWidth && p.y >= vp.pLeftTop.y + vp.pHeight)
        return 4 // 0100
      else if (p.x > vp.pLeftTop.x + vp.pWidth && p.y >= vp.pLeftTop.y + vp.pHeight)
        return 6 // 0110
      else if (p.x >= vp.pLeftTop.x + vp.pWidth && p.y > vp.pLeftTop.y && p.y <= vp.pLeftTop.y + vp.pHeight)
        return 2 // 0010
      else if (p.x >= vp.pLeftTop.x + vp.pWidth && p.y <= vp.pLeftTop.y)
        return 10 // 1010
      else if (p.x > vp.pLeftTop.x && p.x <= vp.pLeftTop.x + vp.pWidth && p.y <= vp.pLeftTop.y)
        return 8 // 1000
      else
        return 0 // 0000
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
    var dx = this.p2.x - this.p1.x, dy = this.p2.y - this.p1.y;
    var xWinMin = vp.pLeftTop.x, xWinMax = vp.pLeftTop.x + vp.pWidth;
    var yWinMin = vp.pLeftTop.y, yWinMax = vp.pLeftTop.y + vp.pHeight;
    var p1 = -dx, q1 = this.p1.x - xWinMin,
        p2 = dx, q2 = xWinMax - this.p1.x,
        p3 = -dy, q3 = this.p1.y - yWinMin,
        p4 = dy, q4 = yWinMax - this.p1.y;
    if ((dx === 0 && (q1 <= 0 || q2 <= 0)) ||
        (dy === 0 && (q3 <= 0 || q4 <= 0)))
      return null;  // parallel and outside of window
    var t1 = 0, t2 = 1;
    if (dx > 0) {
      t1 = Math.max(0, q1 / p1);
      // t2 = Math.min(1, q2 / p2);
    } else if (dx < 0) {
      t1 = Math.max(0, q2 / p2);
      // t2 = Math.min(1, q1 / p1);
    }
    if (dy > 0) {
      // t1 = Math.max(0, q4 / p4);
      t2 = Math.min(1, q4 / p4);
    } else if (dy < 0) {
      // t1 = Math.max(0, q3 / p3);
      t2 = Math.min(1, q3 / p3);
    }
    var newP1 = this.p1, newP2 = this.p2;
    if (t1 !== 0)
      newP1 = new Point(this.p1.x + t1 * dx, this.p1.y + t1 * dy);
    if (t2 !== 1)
      newP2 = new Point(this.p2.x + t2 * dx, this.p2.y + t2 * dy);
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
}
