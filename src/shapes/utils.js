// @param degrees {Fraction}
// @return {number}
export function degrees2radians(degrees) {
  return degrees.mul(Math.PI).div(180);
}
