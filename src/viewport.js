import {Fraction} from "./math/fraction"
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

// canvas dimensions are with prefix "c"
// plane dimensions are with prefix "p"
// zoomFactor = (canvas pixel) / (viewport width on the plane)
// so, zoom in  == zoomFactor > 1
//     zoom out == zoomFactor < 1
export class ViewPort {
  constructor(
    cWidth,  // canvas width, in pixels
    cHeight, // canvas height, in pixels
    zoomFactor=new Fraction(1)  // range from 0 to positive infinity: (0, +INF)
  ) {
    this.cWidth = new Fraction(cWidth);
    this.cHeight = new Fraction(cHeight);
    this.zoomFactor = new Fraction(zoomFactor);
    this.pWidth = this.cWidth.mul(this.zoomFactor);
    this.pHeight = this.cHeight.mul(this.zoomFactor);
    this.pLeftTop = new Point(this.pWidth.neg().div(2), this.pHeight.neg().div(2));
  }

  zoom(newZoomFactor) {
    var centerx = this.pLeftTop.x.add(this.pWidth.div(2));
    var centery = this.pLeftTop.y.add(this.pHeight.div(2));
    this.zoomFactor = newZoomFactor;
    this.pWidth = this.cWidth.mul(this.zoomFactor);
    this.pHeight = this.cHeight.mul(this.zoomFactor);
    this.pLeftTop.x = centerx.sub(this.pWidth.div(2));
    this.pLeftTop.y = centery.sub(this.pHeight.div(2));
  }

  move(dir, delta=0.2) {
    var pWidthDelta = this.pWidth.mul(delta), pHeightDelta = this.pHeight.mul(delta);
    switch (dir) {
      case Direction.UP:
        this.pLeftTop = new Point(this.pLeftTop.x, this.pLeftTop.y.sub(pHeightDelta));
        break;
      case Direction.DOWN:
        this.pLeftTop = new Point(this.pLeftTop.x, this.pLeftTop.y.add(pHeightDelta));
        break;
      case Direction.LEFT:
        this.pLeftTop = new Point(this.pLeftTop.x.sub(pWidthDelta), this.pLeftTop.y);
        break;
      case Direction.RIGHT:
        this.pLeftTop = new Point(this.pLeftTop.x.sub(pWidthDelta), this.pLeftTop.y);
        break;
      default:
        console.log("Unknown direction: " + dir);
    }
  }

  transx(x) {
    return x.sub(this.pLeftTop.x).mul(this.zoomFactor);
  }

  transy(y) {
    return y.sub(this.pLeftTop.y).mul(this.zoomFactor);
  }

  // @param pPoint: Point, on the plane
  // @return Point, on the canvas
  transpoint(pPoint) {
    return new Point(transx(pPoint.x), transy(pPoint.y));
  }
}
