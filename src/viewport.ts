/// <reference path="./autocat.ts"/>
/// <reference path="./shapes/shapes.ts" />

// viewport always maps to the screen, i.e. the visible area of the Plane
module AutoCAT {
  export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
  };

  // screen dimensions are with prefix "s"
  // plane dimensions are with prefix "p"
  export class ViewPort {
    zoomFactor: number = 1;  // range from 0 to positive infinity: (0, +INF)
    sWidth: number;  // screen width, in pixels
    sHeight: number;  // screen height, in pixels
    pLeftTop: Shapes.Point;
    pWidth: number;  // plane coordinate
    pHeight: number;  // plane coordinate

    constructor(
      sWidth: number,
      sHeight: number,
      left: number,
      top: number,
      zoomFactor: number = 1
    ) {
      this.sWidth = sWidth;
      this.sHeight = sHeight;
      this.pLeftTop.x = left;
      this.pLeftTop.y = top;
      this.zoomFactor = zoomFactor;
      this.pWidth = this.sWidth * this.zoomFactor;
      this.pHeight = this.sHeight * this.zoomFactor;
    }

    zoom(newZoomFactor: number) {
      var centerx = this.pLeftTop.x + this.pWidth / 2;
      var centery = this.pLeftTop.y + this.pHeight / 2;
      this.zoomFactor = newZoomFactor;
      this.pWidth = this.sWidth * this.zoomFactor;
      this.pHeight = this.sHeight * this.zoomFactor;
      this.pLeftTop.x = centerx - this.pWidth / 2;
      this.pLeftTop.y = centery - this.pHeight / 2;
    }

    move(dir: Direction, delta: number) {
      var pWidthDelta = this.pWidth * delta, pHeightDelta = this.pHeight * delta;
      switch (dir) {
        case Direction.UP:
          this.pLeftTop = new Shapes.Point(this.pLeftTop.x, this.pLeftTop.y - pHeightDelta);
          break;
        case Direction.DOWN:
          this.pLeftTop = new Shapes.Point(this.pLeftTop.x, this.pLeftTop.y + pHeightDelta);
          break;
        case Direction.LEFT:
          this.pLeftTop = new Shapes.Point(this.pLeftTop.x - pWidthDelta, this.pLeftTop.y);
          break;
        case Direction.RIGHT:
          this.pLeftTop = new Shapes.Point(this.pLeftTop.x + pWidthDelta, this.pLeftTop.y);
          break;
        default:
          console.log("Unknown direction: " + dir);
      }
    }
  }

}
