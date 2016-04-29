import * as log from '../html/logging'
import { Fraction } from '../math/fraction'
import { Shape, PartialShape, ShapeType } from './shape'

class PartialCircle extends PartialShape {
}

export class EmptyCircle extends PartialCircle {
  constructor () {
    super()
    log.info('Drawing circle, please specify the center.')
  }
  feedPoint (message) {
    return new CenterCircle(message.p)
  }
  draw (viewport, context) {}
}

export class CenterCircle extends PartialCircle {
  constructor (center) {
    super()
    this.center = center
    log.info('Please specify the radius.')
  }
  _radius (p) {
    return Math.sqrt(this.center.x.sub(p.x).pow(2).add(this.center.y.sub(p.y).pow(2)).valueOf())
  }
  feedPoint (message) {
    return new Circle(this.center, this._radius(message.p))
  }
  feedText (message) {
    try {
      var radius = new Fraction(message.s)
      return new Circle(this.center, radius)
    } catch (e) {
      log.error(`Invalid number: ${message.s}`)
      return this
    }
  }
  draw (viewport, context) {
    var radius = this._radius(viewport.cursor())
    context.beginPath()
    context.arc(
      viewport.p2cx(this.center.x),
      viewport.p2cy(this.center.y),
      radius,
      0,
      Math.PI * 2
    )
    context.stroke()
  }
}

export class Circle extends Shape {
  constructor (center, radius) {
    super()
    this.center = center // point
    this.radius = new Fraction(radius)
    this.type = ShapeType.Circle
  }

  // @return {boolean}
  equals (circle) {
    super.equals(circle)
    return this.center.equals(circle.center) && this.radius.eq(circle.radius)
  }

  toString () {
    return `c:${this.center.toString()},r:${this.radius.valueOf()}`
  }

  intersect (viewport) {
    return this
  }

  draw (viewport, context) {
    context.beginPath()
    context.arc(
      viewport.p2cx(this.center.x),
      viewport.p2cy(this.center.y),
      this.radius.valueOf(),
      0,
      Math.PI * 2
    )
    context.stroke()
  }
}
