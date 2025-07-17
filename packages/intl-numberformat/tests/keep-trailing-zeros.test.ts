import {it, describe, expect} from 'vitest'
import '@formatjs/intl-pluralrules/polyfill.js'
import '@formatjs/intl-pluralrules/locale-data/en'
import * as en from './locale-data/en.json'
import {NumberFormat} from '../src/core'
NumberFormat.__addLocaleData(en as any)
const trailingZeroResults: Array<
  [Intl.NumberFormatOptions | undefined, string, string]
> = [
  [undefined, '1', '1'],
  [undefined, '1.0', '1.0'],
  [undefined, '1.00000', '1.000'],
  [{maximumFractionDigits: 1}, '1', '1'],
  [{maximumFractionDigits: 1}, '1.0', '1.0'],
  [{maximumFractionDigits: 1}, '1.00000', '1.0'],
  [{maximumFractionDigits: 10}, '1.00000', '1.00000'],
  [{minimumFractionDigits: 1}, '1', '1.0'],
  [{minimumFractionDigits: 1}, '1.0', '1.0'],
  [{minimumFractionDigits: 1}, '1.00000', '1.000'],
  [{maximumSignificantDigits: 3}, '1', '1'],
  [{maximumSignificantDigits: 3}, '1.0', '1.0'],
  [{maximumSignificantDigits: 3}, '1.00000', '1.00'],
  [{minimumSignificantDigits: 3}, '1', '1.00'],
  [{minimumSignificantDigits: 3}, '1.0', '1.00'],
  [{minimumSignificantDigits: 3}, '1.00000', '1.00000'],
]

describe('keep-trailing-zeros', function () {
  for (const [opt, val, exp] of trailingZeroResults) {
    it(`format ${val} as ${exp}`, function () {
      const nf = new NumberFormat('en', opt)
      expect(nf.format(val)).toEqual(exp)
    })
  }
})
