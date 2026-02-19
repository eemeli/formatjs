import {Decimal} from 'decimal.js'
import {ToPrimitive} from './262.js'

/**
 * https://tc39.es/ecma402/#sec-tointlmathematicalvalue
 * Converts input to a mathematical value, supporting BigInt
 */
export function ToIntlMathematicalValue(input: unknown): Decimal {
  // Handle BigInt directly before ToPrimitive, since ToPrimitive doesn't
  // handle bigint in its type signature (though the spec says it should return it as-is)
  if (typeof input === 'bigint') {
    return new Decimal(input.toString())
  }

  let primValue = ToPrimitive(input, 'number')

  // Handle other primitive types
  if (primValue === undefined) {
    return new Decimal(NaN)
  }
  if (primValue === true) {
    return new Decimal(1)
  }
  if (primValue === false) {
    return new Decimal(0)
  }
  if (primValue === null) {
    return new Decimal(0)
  }

  // Try to convert to Decimal (handles numbers and strings)
  try {
    const d = new Decimal(primValue as any)
    if (typeof primValue === 'string') {
      let m = 0
      let n = 0
      const numericLiteral = primValue.trim()
      const unsignedDecimalLiteral = numericLiteral.startsWith('-')
        ? numericLiteral.substring(1)
        : numericLiteral

      const decDotDec = unsignedDecimalLiteral.match(/^0*([0-9]+)\.([0-9]*)/)
      if (decDotDec) {
        m = decDotDec[1].length
        n = decDotDec[2].length
      } else {
        const dotDec = unsignedDecimalLiteral.match(/^0*\.([0-9]+)/)
        if (dotDec) {
          m = 1
          n = dotDec[1].length
        } else {
          const dec = unsignedDecimalLiteral.match(/^0*([0-9]+)/)
          if (dec) {
            m = dec[1].length
            n = 0
          }
        }
      }

      let f = 0
      const exp = unsignedDecimalLiteral.match(/[eE]([+-]?[0-9]+)$/)
      if (exp) {
        const e = Number(exp[1])
        if (m + e < 1) m = 1 - e
      }

      Object.assign(d, {__StringDigitCount: m + n + f})
    }
    return d
  } catch {
    return new Decimal(NaN)
  }
}
