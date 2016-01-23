import {Fraction} from "../math/fraction";
import {Shape, ShapeType} from "./shape";

export class Point extends Shape {
  constructor(x, y) {
    super();
    this.x = new Fraction(x);
    this.y = new Fraction(y);
    this.type = ShapeType.Point;
  }

  equals(p) {
    super.equals(p);
    return p.x.equals(this.x) && p.y.equals(this.y);
  }

  toString() {
    return `(${this.x.valueOf()},${this.y.valueOf()})`;
  }

  intersect(viewport) {
    if (this.x.gte(viewport.pLeftTop.x)
        && this.x.lte(viewport.pLeftTop.x.add(viewport.pWidth))
        && this.y.gte(viewport.pLeftTop.y)
        && this.y.lte(viewport.pLeftTop.y.add(viewport.pHeight)))
      return this;
    else
      return null;
  }
}
