// interface
export class Shape {

  constructor() {
    this.type = null;
  }

  // determine if two shape of the same type is logically identical
  // subclasses MUST call super.equals(s) to ensure the type check
  // @return boolean
  equals(shape) {
    if (!('type' in shape))  // if 'shape' is null, exception is thrown anyway
      throw "Not a shape";
    else if (shape.type != this.type)
      throw "Shape type mismatch";
  }

  toString() {
    throw "NotImplemented";
  }

  // return the intersected part of this shape with the viewport
  // @abstract
  // @return
  //   - clipped object is it's (partly) inside the viewport
  //   - null if it's outside the viewport
  intersect(viewport) {
    throw "NotImplemented";
  }

  // draw this shape on the canvas
  // @param viewport: ViewPort
  // @param context: the canvas 2d context
  draw(viewport, context) {
    throw "NotImplemented";
  }
}

// enum
class EnumShapeType {
  constructor() {
    this.Point = "point";
    this.Line = "line";
    this.MultiLine = "multiline";
    this.Rectangle = "rectangle";
    this.Circle = "circle";
  }
}

export var ShapeType = new EnumShapeType();
