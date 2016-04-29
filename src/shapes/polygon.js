import * as log from '../html/logging'
import { Fraction } from '../math/fraction'
import { Shape, PartialShape } from './shape'

function _draw (viewport, context, center, radius, start, nEdge) {
  if (radius <= 1) {
    context.beginPath()
    context.moveTo(viewport.p2cx(start.x), viewport.p2cy(start.y))
    context.lineTo(viewport.p2cx(start.x), viewport.p2cy(start.y))
    context.stroke()
  } else {
    var angle = new Fraction(Math.atan2(
      start.y.sub(center.y).valueOf(),
      start.x.sub(center.x).valueOf()
    ))
    var angleInterval = new Fraction(Math.PI).mul(2).div(nEdge)
    var angles = []
    for (var i = 1; i < nEdge; i++) {
      angles.push(angle.add(angleInterval.mul(i)).mod(Math.PI * 2))
    }
    context.beginPath()
    context.moveTo(viewport.p2cx(start.x), viewport.p2cy(start.y))
    for (var j = 0; j < angles.length; j++) {
      var dy = radius * Math.sin(angles[j].valueOf())
      var dx = radius * Math.cos(angles[j].valueOf())
      context.lineTo(
        viewport.p2cx(center.x.add(dx)),
        viewport.p2cy(center.y.add(dy))
      )
    }
    context.lineTo(viewport.p2cx(start.x), viewport.p2cy(start.y))
    context.stroke()
  }
}

class PartialPolygon extends PartialShape {
}

export class EmptyPolygon extends PartialPolygon {
  constructor () {
    super()
    log.info('Drawing polygon, please specify the number of edges.')
  }
  feedText (message) {
    try {
      var nEdge = new Fraction(message.s)
      console.assert(nEdge.gt(2) && nEdge.eq(parseInt(message.s))) // make sure it's integer
      return new EdgePolygon(nEdge)
    } catch (e) {
      log.error(`Invalid integer: ${message.s}`)
      return this
    }
  }
  draw (viewport, context) {}
}

export class EdgePolygon extends PartialPolygon {
  constructor (nEdge) {
    super()
    this.nEdge = nEdge
    log.info('Please specify the center of polygon.')
  }
  feedPoint (message) {
    return new CenterEdgePolygon(message.p, this.nEdge)
  }
  draw (viewport, context) {}
}

export class CenterEdgePolygon extends PartialPolygon {
  constructor (center, nEdge) {
    super()
    this.center = center
    this.nEdge = nEdge
    log.info('Please specify the polygon.')
  }
  _radius (p) {
    return Math.sqrt(this.center.x.sub(p.x).pow(2).add(this.center.y.sub(p.y).pow(2)).valueOf())
  }
  feedPoint (message) {
    return new Polygon(this.center, this._radius(message.p), message.p, this.nEdge)
  }
  draw (viewport, context) {
    var cursor = viewport.cursor()
    var radius = this._radius(cursor)
    _draw(viewport, context, this.center, radius, cursor, this.nEdge)
  }
}

export class Polygon extends Shape {
  // @param radius {Fraction}
  // @param start {Point}
  constructor (center, radius, start, nEdge) {
    super()
    this.center = center
    this.radius = new Fraction(radius)
    this.start = start
    this.nEdge = nEdge
  }
  equals (polygon) {
    super.equals(polygon)
    return this.center.equals(polygon.center) &&
      this.radius.eq(polygon.radius) &&
      this.start.equals(polygon.start)
  }
  toString () {
    return `c:${this.center},r:${this.radius.valueOf()},s:${this.start}`
  }
  intersect (viewport) {
    return this
  }
  draw (viewport, context) {
    _draw(viewport, context, this.center, this.radius.valueOf(), this.start, this.nEdge)
  }
}
