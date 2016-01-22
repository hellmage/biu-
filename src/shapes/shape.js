// interface
export class Shape {

  constructor() {}

  // abstract
  // return:
  //   - clipped object is it's (partly) inside the viewport
  //   - null if it's outside the viewport
  intersect(viewport) {
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
