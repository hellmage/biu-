import Fraction from "fraction.js"
import assert from "assert"
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
    zoomFactor=new Fraction(1)  // range from 0 to positive infinity: (0, +INF)
  ) {
    this.sWidth = new Fraction(sWidth);
    this.sHeight = new Fraction(sHeight);
    this.zoomFactor = new Fraction(zoomFactor);
    this.pWidth = this.sWidth.mul(this.zoomFactor);
    this.pHeight = this.sHeight.mul(this.zoomFactor);
    this.pLeftTop = new Point(this.pWidth.neg().div(2), this.pHeight.neg().div(2));
  }

  zoom(newZoomFactor) {
    var centerx = this.pLeftTop.x.add(this.pWidth.div(2));
    var centery = this.pLeftTop.y.add(this.pHeight.div(2));
    this.zoomFactor = newZoomFactor;
    this.pWidth = this.sWidth.mul(this.zoomFactor);
    this.pHeight = this.sHeight.mul(this.zoomFactor);
    this.pLeftTop.x = centerx.sub(this.pWidth.div(2));
    this.pLeftTop.y = centery.sub(this.pHeight.div(2));
  }

  move(dir, delta) {
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
}
