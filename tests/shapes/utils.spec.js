import { assert } from '../utils/assert'
import { degrees2radians } from '../../src/shapes/utils'
import { Fraction } from '../../src/math/fraction'

it('degrees2radians', function () {
  assert.true(degrees2radians(new Fraction(90)).eq(new Fraction(Math.PI).div(2)))
})
