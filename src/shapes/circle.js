import {Fraction} from "../math/fraction"
import {Shape, PartialShape} from "./shape"

export class Circle {
  constructor(center, radius) {
    super();
    this.center = center;  // point
    this.radius = new Fraction(radius);
  }

  // @return {boolean}
  equals(circle) {
    super(circle);
    return this.center.equals(circle.center) && this.radius.eq(circle.radius);
  }

  toString() {
    return `c:${this.center},r:${this.radius.valueOf()}`;
  }

  intersect(viewport) {
    super(viewport);
  }

  draw(viewport, context) {
    context.beginPath();
    context.stroke();
  }
}
