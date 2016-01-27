import * as log from "./html/logging"
import * as Cursor from "./html/cursor"
import {Point} from "./shapes/point"
import {Line} from "./shapes/line"

export class AutoCAT {
  constructor(viewport, canvas) {
    this.viewport = viewport;
    this.canvas = canvas;
    this.shapes = [new Line(new Point(-700, -300), new Point(-100, 300)), new Line(new Point(-700, -350), new Point(-100, 300)), new Line(new Point(-700, -800), new Point(-100, 350))];
    this.visibleShapes = [];
    this.drawingShape = null;
    this.cx = null;   // cursor x on canvas
    this.cy = null;   // cursor y on canvas
  }

  updateVisibleShapes() {
    this.visibleShapes = [];
    for (var i in this.shapes) {
      var shape = this.shapes[i].intersect(this.viewport);
      if (shape !== null)
        this.visibleShapes.push(shape);
    }
  }

  // @param dir: Direction
  move(dir) {
    this.viewport.move(dir);
    this.updateVisibleShapes();
  }

  zoomin() {
    this.viewport.zoom(-0.1);
    this.updateVisibleShapes();
  }

  zoomout() {
    this.viewport.zoom(0.1);
    this.updateVisibleShapes();
  }

  draw() {
    var ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i in this.visibleShapes) {
      var shape = this.visibleShapes[i];
      shape.draw(this.viewport, ctx);
    }
    Cursor.draw(ctx, this.cx, this.cy);
  }

  receive(evt) {
    var data = evt;
    if ('detail' in evt)
      data = evt.detail;
    log.info("[autocat]" + data);
  }
}
