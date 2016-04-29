import * as log from '../html/logging'
import * as convexhull from '../algorithms/convexhull'
import { PartialShape } from './shape'
import { Circle } from './circle'

export class ConvexHull extends PartialShape {
  constructor (points) {
    super()
    this.points = points || []
    this.hull = []
    log.info('Please specify a point.')
  }
  feedPoint (message) {
    this.points.push(message.p)
    this.hull = this.buildHull(this.points)
    return this
  }
  buildHull (points) {
    return convexhull.build(points)
  }
  draw (viewport, context) {
    if (this.hull.length <= 0) {
      return
    }
    context.beginPath()
    var p0 = this.hull[0]
    var cx0 = viewport.p2cx(p0.x)
    var cy0 = viewport.p2cy(p0.y)
    context.moveTo(cx0, cy0)
    for (var i = 1; i < this.hull.length; i++) {
      var p = this.hull[i]
      var cx = viewport.p2cx(p.x)
      var cy = viewport.p2cy(p.y)
      context.lineTo(cx, cy)
    }
    context.lineTo(cx0, cy0)
    context.stroke()
    for (var j = 0; j < this.points.length; j++) {
      new Circle(this.points[j], 1).draw(viewport, context)
    }
  }
}
