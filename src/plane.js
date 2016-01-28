import {Point} from "./shapes/point"
import {Line} from "./shapes/line"

export class Plane {
  constructor() {
    this.shapes = [
      new Line(new Point(-700, -300), new Point(-100, 300)),
      new Line(new Point(-700, -350), new Point(-100, 300)),
      new Line(new Point(-700, -800), new Point(-100, 350))
    ];
    this.visibleShapes = [];
    this.drawingShape = null;
  }

  add(shape) {
    this.shapes.push(shape);
  }

  updateVisibleShapes(viewport) {
    this.visibleShapes = [];
    for (var i in this.shapes) {
      var shape = this.shapes[i].intersect(viewport);
      if (shape !== null)
        this.visibleShapes.push(shape);
    }
  }
}