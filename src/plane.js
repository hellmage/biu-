import {Point} from "./shapes/point"
import {Line, EmptyLine, OnePointLine, FixLengthLine} from "./shapes/line"
import {EmptyArc} from "./shapes/arc"
import {EmptyCircle} from "./shapes/circle"
import {EmptyPolygon} from "./shapes/polygon"

export class Plane {
  constructor() {
    this.shapes = [
      new Line(new Point(-700, -300), new Point(-100, 300)),
      new Line(new Point(-700, -350), new Point(-100, 300)),
      new Line(new Point(-700, -800), new Point(-100, 350))
    ];
    this.visibleShapes = [];
    // this.drawingShape = new FixLengthLine(new Point(1, 1.5), 500);
    // this.drawingShape = new OnePointLine(new Point(1, 1.5));
    this.drawingShape = new EmptyArc();
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
