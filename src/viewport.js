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
// zoomFactor = (plane viewport width) / (canvas pixel)
// so, zoom out == zoomFactor > 1
//     zoom in  == zoomFactor < 1
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
    this.pLeftTop = new Point(this.pWidth.neg().div(2), this.pHeight.div(2));
  }

  zoom(newZoomFactor) {
    var centerx = this.pLeftTop.x.add(this.pWidth.div(2));
    var centery = this.pLeftTop.y.sub(this.pHeight.div(2));
    this.zoomFactor = newZoomFactor;
    this.pWidth = this.cWidth.mul(this.zoomFactor);
    this.pHeight = this.cHeight.mul(this.zoomFactor);
    this.pLeftTop.x = centerx.sub(this.pWidth.div(2));
    this.pLeftTop.y = centery.add(this.pHeight.div(2));
  }

  move(dir, delta=0.1) {
    var pWidthDelta = this.pWidth.mul(delta), pHeightDelta = this.pHeight.mul(delta);
    switch (dir) {
      case Direction.UP:
        this.pLeftTop = new Point(this.pLeftTop.x, this.pLeftTop.y.add(pHeightDelta));
        break;
      case Direction.DOWN:
        this.pLeftTop = new Point(this.pLeftTop.x, this.pLeftTop.y.sub(pHeightDelta));
        break;
      case Direction.LEFT:
        this.pLeftTop = new Point(this.pLeftTop.x.sub(pWidthDelta), this.pLeftTop.y);
        break;
      case Direction.RIGHT:
        this.pLeftTop = new Point(this.pLeftTop.x.add(pWidthDelta), this.pLeftTop.y);
        break;
      default:
        console.log("Unknown direction: " + dir);
    }
  }

  // x coordinate: plane to canvas
  p2cx(px) {
    return px.sub(this.pLeftTop.x).div(this.zoomFactor).valueOf();
  }

  // y coordinate: plane to canvas
  p2cy(py) {
    return this.pLeftTop.y.sub(py).div(this.zoomFactor).valueOf();
  }

  // x coordinate: canvas to plane
  c2px(cx) {
    return this.zoomFactor.mul(cx).add(this.pLeftTop.x).valueOf();
  }

  // y coordinate: canvas to plane
  c2py(cy) {
    return this.pLeftTop.y.sub(this.zoomFactor.mul(cy)).valueOf();
  }
}
