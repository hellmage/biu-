import { assert } from '../utils/assert'
import * as convexhull from  '../../src/algorithms/convexhull'
import { Point } from '../../src/shapes/point'

describe('Convex Hull', function () {
  it('Happy path', function () {
    var hull = convexhull.build([
      new Point(-228, -74), new Point(-91, -19), new Point(-9, 79),
      new Point(173, -50), new Point(88, -168), new Point(-22, 109)
    ]);
    var expected = [
      new Point(-228, -74), new Point(-22, 109),
      new Point(173, -50), new Point(88, -168)
    ];
    assert.equal(expected.length, hull.length)
    for (var i = 0; i < expected.length; i++) {
      assert.true(hull[i].equals(expected[i]))
    }
  })
})
