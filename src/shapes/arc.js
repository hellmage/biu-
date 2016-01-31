import {Fraction} from "../math/fraction"
import {Shape, PartialShape} from "./shape"
import {degrees2radians} from "./utils"

class Arc {
  constructor(center, radius, startAngle, endAngle, anticlockwise=false) {
    super();
    this.center = center;  // point
    this.radius = new Fraction(radius);
    this.startAngle = degrees2radians(new Fraction(startAngle));
    this.endAngle = degrees2radians(new Fraction(endAngle));
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
    super(viewport);
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
