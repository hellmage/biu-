import { UserInputType } from '../html/wormhole'

// interface
export class Shape {

  constructor () {
    this.type = null
  }

  // determine if two shape of the same type is logically identical
  // subclasses MUST call super.equals(s) to ensure the type check
  // @return boolean
  equals (shape) {
    if (!('type' in shape)) { // if 'shape' is null, exception is thrown anyway
      throw 'Not a shape'
    } else if (shape.type !== this.type) {
      throw 'Shape type mismatch'
    }
  }

  toString () {
    throw 'NotImplemented'
  }

  // return the intersected part of this shape with the viewport
  // @abstract
  // @return
  //   - clipped object is it's (partly) inside the viewport
  //   - null if it's outside the viewport
  intersect (viewport) {
    throw 'NotImplemented'
  }

  // draw this shape on the canvas
  // @param viewport: ViewPort
  // @param context: the canvas 2d context
  draw (viewport, context) {
    throw 'NotImplemented'
  }
}

export class PartialShape {
  constructor () {
    this.type = ShapeType.Partial
  }
  feedPoint (message) {
    return this
  }
  feedCommand (message) {
    return this
  }
  feedText (message) {
    return this
  }
  feed (message) {
    var next = null
    switch (message.type) {
      case UserInputType.M:
        next = this.feedPoint(message.data)
        break
      case UserInputType.G:
        next = this.feedCommand(message.data)
        break
      case UserInputType.T:
        next = this.feedText(message.data)
        break
      default:
        throw `Unknown data: ${message.data}`
    }
    return next
  }
  draw (viewport, context) {
    throw 'NotImplemented'
  }
}

export const ShapeType = { // Enum
  Partial: 'partial',
  Point: 'point',
  Line: 'line',
  MultiLine: 'multiline',
  Rectangle: 'rectangle',
  Circle: 'circle'
}
