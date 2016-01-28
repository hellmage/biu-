import * as log from "./html/logging"
import * as Cursor from "./html/cursor"
import {Point} from "./shapes/point"
import {Line} from "./shapes/line"

export class AutoCAT {
  constructor(plane, viewport, canvas) {
    this.plane = plane;
    this.viewport = viewport;
    this.canvas = canvas;
  }

  // @param dir: Direction
  move(dir) {
    this.viewport.move(dir);
    this.plane.updateVisibleShapes(this.viewport);
  }

  zoomin() {
    this.viewport.zoom(-0.1);
    this.plane.updateVisibleShapes(this.viewport);
  }

  zoomout() {
    this.viewport.zoom(0.1);
    this.plane.updateVisibleShapes(this.viewport);
  }

  updateVisibleShapes() {
    this.plane.updateVisibleShapes(this.viewport);
  }

  draw() {
    var ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i in this.plane.visibleShapes) {
      var shape = this.plane.visibleShapes[i];
      shape.draw(this.viewport, ctx);
    }
    Cursor.draw(ctx, this.viewport);
  }

  receive(evt) {
    var data = evt;
    if ('detail' in evt)
      data = evt.detail;
    log.info("[autocat]" + data);
  }
}
