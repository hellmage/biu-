import {Point} from "./shapes/point"

class EnumDirection {
  constructor() {
    this.UP = "up";
    this.DOWN = "down";
    this.LEFT = "left";
    this.RIGHT = "right";
  }
}

export var Direction = new EnumDirection();

// screen dimensions are with prefix "s"
// plane dimensions are with prefix "p"
export class ViewPort {
  constructor(
    sWidth,  // screen width, in pixels
    sHeight, // screen height, in pixels
    zoomFactor=1  // range from 0 to positive infinity: (0, +INF)
  ) {
    this.sWidth = sWidth;
    this.sHeight = sHeight;
    this.zoomFactor = zoomFactor;
    this.pWidth = this.sWidth * this.zoomFactor;
    this.pHeight = this.sHeight * this.zoomFactor;
    this.pLeftTop = new Point(-this.pWidth / 2, -this.pHeight / 2);
  }

  zoom(newZoomFactor) {
    var centerx = this.pLeftTop.x + this.pWidth / 2;
    var centery = this.pLeftTop.y + this.pHeight / 2;
    this.zoomFactor = newZoomFactor;
    this.pWidth = this.sWidth * this.zoomFactor;
    this.pHeight = this.sHeight * this.zoomFactor;
    this.pLeftTop.x = centerx - this.pWidth / 2;
    this.pLeftTop.y = centery - this.pHeight / 2;
  }

  move(dir, delta) {
    var pWidthDelta = this.pWidth * delta, pHeightDelta = this.pHeight * delta;
    switch (dir) {
      case Direction.UP:
        this.pLeftTop = new Point(this.pLeftTop.x, this.pLeftTop.y - pHeightDelta);
        break;
      case Direction.DOWN:
        this.pLeftTop = new Point(this.pLeftTop.x, this.pLeftTop.y + pHeightDelta);
        break;
      case Direction.LEFT:
        this.pLeftTop = new Point(this.pLeftTop.x - pWidthDelta, this.pLeftTop.y);
        break;
      case Direction.RIGHT:
        this.pLeftTop = new Point(this.pLeftTop.x + pWidthDelta, this.pLeftTop.y);
        break;
      default:
        console.log("Unknown direction: " + dir);
    }
  }
}
