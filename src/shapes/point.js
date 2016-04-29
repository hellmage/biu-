import { Fraction } from '../math/fraction'
import { Shape, ShapeType } from './shape'

export class Point extends Shape {
  constructor (x, y) {
    super()
    this.x = new Fraction(x)
    this.y = new Fraction(y)
    this.type = ShapeType.Point
  }

  equals (p) {
    super.equals(p)
    return p.x.eq(this.x) && p.y.eq(this.y)
  }

  toString () {
    return `(${this.x.valueOf()},${this.y.valueOf()})`
  }

  static fromString (str) {
    var re = new RegExp(/^\((.*), *(.*)\)$/)
    var ret = re.exec(str)
    if (!ret || ret.length !== 3) {
      return null
    }
    var x = Fraction.fromString(ret[1])
    var y = Fraction.fromString(ret[2])
    if (isNaN(x) || isNaN(y)) {
      return null
    }
    return new Point(x, y)
  }

  intersect (viewport) {
    if (this.x.gte(viewport.pLeftTop.x) &&
        this.x.lte(viewport.pLeftTop.x.add(viewport.pWidth)) &&
        this.y.lte(viewport.pLeftTop.y) &&
        this.y.gte(viewport.pLeftTop.y.sub(viewport.pHeight))) {
      return this
    } else {
      return null
    }
  }

  draw (viewport, context) {
    var x = viewport.p2cx(this.x)
    var y = viewport.p2cx(this.y)
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x, y)
    context.stroke()
  }
}
