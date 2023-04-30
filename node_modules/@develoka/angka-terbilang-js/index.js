"use strict"

const units = ['', 'ribu', 'juta', 'milyar', 'triliun', 'quadriliun', 'quintiliun', 'sextiliun', 'septiliun', 'oktiliun', 'noniliun', 'desiliun', 'undesiliun', 'duodesiliun', 'tredesiliun', 'quattuordesiliun', 'quindesiliun', 'sexdesiliun', 'septendesiliun', 'oktodesiliun', 'novemdesiliun', 'vigintiliun']
const maxIndex = units.length - 1
function digitToUnit (digit) {
  const curIndex = digit / 3
  return curIndex <= maxIndex ? units[curIndex] : units[maxIndex]
}

const numbers = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']
function numberToText (index) {
  return numbers[index] || ''
}

const terbilang = (angka) => {
  const angkaLength   = angka.length
  const angkaMaxIndex = angkaLength - 1

  // Angka Nol
  if (angkaMaxIndex === 0 && Number(angka[0]) === 0) {
    return 'nol'
  }

  let space = ''
  let result = ''

  let i = 0
  while (i !== angkaLength) {

    const digitCount = angkaMaxIndex - i
    const modGroup = digitCount % 3 // [2,1,0]
    const curAngka = Number(angka[i])

    if (digitCount === 3 && curAngka === 1 && (i === 0 || 
      (Number(angka[i - 2]) === 0 && Number(angka[i - 1]) === 0))) {
      /* Angka Seribu */
      result += `${space}seribu`
    } else {
      if (curAngka !== 0) {
        if (modGroup === 0) {
          /* Angka Satuan Bukan Nol */
          result += `${space}${numberToText(curAngka)}${(i === angkaMaxIndex ? '' : ' ')}${digitToUnit(digitCount)}`
        } else if (modGroup === 2) {
          /* Angka Ratusan */
          if (curAngka === 1) {
            result += `${space}seratus`
          } else {
            result += `${space}${numberToText(curAngka)} ratus`
          }
        } else {
          /* Angka Sepuluh dan Belasan */
          if (curAngka === 1) {
            i++ // Skip Next Angka
            const nextAngka = Number(angka[i])
            if (nextAngka === 0) {
              result += `${space}sepuluh`
              /* Proses Next Angka Sekarang */
              if (digitCount !== 1 && (Number(angka[i - 2]) !== 0 || Number(angka[i - 1]) !== 0)) {
                result += ` ${digitToUnit(digitCount - 1)}`
              }
            } else {
              if (nextAngka === 1) {
                result += `${space}sebelas`
              } else {
                result += `${space}${numberToText(nextAngka)} belas`
              }
              /* Proses Next Angka Sekarang */
              if (digitCount !== 1) {
                result += ` ${digitToUnit(digitCount - 1)}`
              }
            }
          } else {
            /* Angka Puluhan */
            result += `${space}${numberToText(curAngka)} puluh`
          }
        }
      } else {
        /* Angka Satuan Nol */
        if (modGroup === 0 && (Number(angka[i - 2]) !== 0 || Number(angka[i - 1]) !== 0) && digitCount !== 0) {
          result += ` ${digitToUnit(digitCount)}`
        }
      }
    }

    if (i <= 1) {
      space = ' '
    }
    i++
  }

  return result
}

const terbilangSatuSatu = (angka) => {
  return angka
    .split('')
    .map(angka => angka == 0 ? 'nol' : numberToText(angka))
    .join(' ')
}

module.exports = function angkaTerbilang(target, settings={decimal: '.'}) {
  if (typeof target !== "string") target = String(target)
  if (target.indexOf(settings.decimal) > -1) {
    /* Dengan Desimal */
    target = target.split(settings.decimal)
    return `${terbilang(target[0])} koma ${terbilangSatuSatu(target[1])}`
  } else {
    /* Tanpa Desimal */
    return terbilang(target)
  }
}