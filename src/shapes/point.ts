/// <reference path="./shapes.ts"/>

module Shapes {
  export class Point implements Shape {
    x: number
    y: number
    type: ShapeType
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.type = ShapeType.Point;
    }

    intersect(vp: AutoCAT.ViewPort) {
      if (this.x > vp.pLeftTop.x && this.x < vp.pLeftTop.x + vp.pWidth &&
          this.y > vp.pLeftTop.y && this.y < vp.pLeftTop.y + vp.pHeight)
        return this;
      else
        return null;
    }
  }
}
