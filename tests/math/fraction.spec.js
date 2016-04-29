import { assert } from '../utils/assert'
import { Fraction } from '../../src/math/fraction'

describe('Fraction', function () {
  describe('.fromString', function () {
    it('recognize integer', function () {
      assert.true(Fraction.fromString('1').eq(1))
    })
    it('recognize float', function () {
      assert.true(Fraction.fromString('1.1').eq(1.1))
    })
    it('recognize decimal', function () {
      assert.true(Fraction.fromString('2/3').eq(new Fraction(2, 3)))
    })
    it('behave well in some corner cases', function () {
      assert.true(Fraction.fromString('.1').eq(0.1))
      assert.true(Fraction.fromString('1.').eq(1))
      assert.true(isNaN(Fraction.fromString('1.1/2')))
      assert.true(isNaN(Fraction.fromString('1.1.1')))
      assert.true(isNaN(Fraction.fromString('/1')))
      assert.true(isNaN(Fraction.fromString('1/1/1')))
      assert.true(isNaN(Fraction.fromString('a')))
      assert.true(isNaN(Fraction.fromString('a/2')))
      assert.true(isNaN(Fraction.fromString('0.2x')))
    })
  })
})
