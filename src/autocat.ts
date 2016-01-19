/// <reference path="./viewport.ts" />
/// <reference path="./shapes/shapes.ts" />

module AutoCAT {
  export class Cat {
    viewport: ViewPort
    visibleShapes: Shapes.Shape[]
    shapes: Shapes.Shape[]

    constructor(vp: ViewPort) {
      this.viewport = vp;
      this.visibleShapes = [];
      this.shapes = [];
    }

    private updateVisibleShapes() {
      this.visibleShapes = []
      for (var i in this.shapes) {
        var shape = this.shapes[i].intersect(this.viewport);
        if (shape !== null)
          this.visibleShapes.push(shape);
      }
    }

    move(dir: Direction) {
      this.viewport.move(dir, 0.2);
      this.updateVisibleShapes();
    }
    // iterate over all visible shapes and draw
  }
}
