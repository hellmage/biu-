/// <reference path="../autocat.ts"/>

module Shapes {
  // Dimensions in shape classes are for the "plane" exclusively

  export enum ShapeType {
    Point,
    Line,
    MultiLine,
    Rectangle,
    Circle
  };

  export interface Shape {
    intersect(vp: AutoCAT.ViewPort)
  }
}
