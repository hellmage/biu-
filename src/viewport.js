import { Fraction } from './math/fraction'
import { Point } from './shapes/point'

export const Direction = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
}

// canvas dimensions are with prefix 'c'
// plane dimensions are with prefix 'p'
// zoomFactor = (plane viewport width) / (canvas pixel)
// so, zoom out == zoomFactor > 1
//     zoom in  == zoomFactor < 1
export class ViewPort {
  constructor (
    cWidth, // canvas width, in pixels
    cHeight, // canvas height, in pixels
    zoomFactor = new Fraction(1) // range from 0 to positive infinity: (0, +INF)
  ) {
    this.cWidth = new Fraction(cWidth)
    this.cHeight = new Fraction(cHeight)
    this.zoomFactor = new Fraction(zoomFactor)
    this.pWidth = this.cWidth.mul(this.zoomFactor)
    this.pHeight = this.cHeight.mul(this.zoomFactor)
    this.pLeftTop = new Point(this.pWidth.neg().div(2), this.pHeight.div(2))
    this.cursorX = null // canvas x
    this.cursorY = null // canvas y
  }

  setCursor (x, y) {
    this.cursorX = x
    this.cursorY = y
  }

  cursor () {
    return new Point(this.c2px(this.cursorX), this.c2py(this.cursorY))
  }

  zoom (delta) {
    var centerx = this.pLeftTop.x.add(this.pWidth.div(2))
    var centery = this.pLeftTop.y.sub(this.pHeight.div(2))
    this.zoomFactor = this.zoomFactor.add(delta)
    this.pWidth = this.cWidth.mul(this.zoomFactor)
    this.pHeight = this.cHeight.mul(this.zoomFactor)
    this.pLeftTop.x = centerx.sub(this.pWidth.div(2))
    this.pLeftTop.y = centery.add(this.pHeight.div(2))
  }

  move (dir, delta = 0.1) {
    var pWidthDelta = this.pWidth.mul(delta), pHeightDelta = this.pHeight.mul(delta)
    switch (dir) {
      case Direction.UP:
        this.pLeftTop = new Point(this.pLeftTop.x, this.pLeftTop.y.add(pHeightDelta))
        break
      case Direction.DOWN:
        this.pLeftTop = new Point(this.pLeftTop.x, this.pLeftTop.y.sub(pHeightDelta))
        break
      case Direction.LEFT:
        this.pLeftTop = new Point(this.pLeftTop.x.sub(pWidthDelta), this.pLeftTop.y)
        break
      case Direction.RIGHT:
        this.pLeftTop = new Point(this.pLeftTop.x.add(pWidthDelta), this.pLeftTop.y)
        break
      default:
        console.log('Unknown direction: ' + dir)
    }
  }

  // @return {number} x coordinate: plane to canvas
  p2cx (px) {
    return px.sub(this.pLeftTop.x).div(this.zoomFactor).valueOf()
  }

  // @return {number} y coordinate: plane to canvas
  p2cy (py) {
    return this.pLeftTop.y.sub(py).div(this.zoomFactor).valueOf()
  }

  // @return {Fraction} x coordinate: canvas to plane
  c2px (cx) {
    return this.zoomFactor.mul(cx).add(this.pLeftTop.x)
  }

  // @return {Fraction} y coordinate: canvas to plane
  c2py (cy) {
    return this.pLeftTop.y.sub(this.zoomFactor.mul(cy))
  }
}
