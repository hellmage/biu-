import {Shape, ShapeType} from "./shape";

export class Point extends Shape {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.type = ShapeType.Point;
  }

  intersect(viewport) {
    if (this.x > viewport.pLeftTop.x && this.x < viewport.pLeftTop.x + viewport.pWidth &&
        this.y > viewport.pLeftTop.y && this.y < viewport.pLeftTop.y + viewport.pHeight)
      return this;
    else
      return null;
  }
}
