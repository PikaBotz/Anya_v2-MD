'use strict'
const querystring = require('querystring');
const _ = require("lodash")
const isUrl = require("is-url")
const isNumber = require("num-or-not")
const isKeyword = require('is-keyword-js')
const userAgents = require("user-agents")
const got = require('got')

const languages = require('./languages')

const br = "\n"

function checkSame(v, maps) {
  for (const idx in maps) {
    if (maps[idx].v === v) {
      return idx
    }
  }
  return -1
}

function enMap(obj, except = [], path = '', map = []) {
  if (_.isObject(obj) == true) {
    _.forEach(obj, (v, k) => {
      const furKeyStr = _.isNumber(k) ? `[${k}]` : (path && '.') + k
      const curPath = path + furKeyStr
      if (_.isObject(v) == true) {
        enMap(v, except, curPath, map)
      } else {
        const exceptReg = except.length > 0 ? new RegExp(`(^|\\.)(${_.map(except, _.escapeRegExp).join('|')})(\\.|\\[|$)`, 'i') : false
        if (
          _.isString(v) &&
          !isNumber(v) &&
          !isUrl(v) &&
          !isKeyword(v) &&
          !/^(?!([a-z]+|\d+|[\?=\.\*\[\]~!@#\$%\^&\(\)_+`\/\-={}:";'<>,]+)$)[a-z\d\?=\.\*\[\]~!@#\$%\^&\(\)_+`\/\-={}:";'<>,]+$/i.test(v) &&
          (!exceptReg || !exceptReg.test(curPath))
        ) {
          const idx = checkSame(v, map)
          if (idx > -1) {
            map.splice(idx + 1, 0, {
              p: curPath,
              v: v,
              i: map[idx].i,
              l: map[idx].l,
              s: true
            })
          } else {
            const lastMap = _.last(map)
            map.push({
              p: curPath,
              v: v,
              i: lastMap ? lastMap.i + lastMap.l : 0,
              l: v.split(br).length,
              s: false
            })
          }
        }
      }
    })
  } else {
    map.push({
      p: '',
      v: obj,
      i: 0,
      l: obj.split(br).length
    })
  }
  return map
}

function deMap(src, maps, dest) {
  if (_.isObject(src) == true) {
    src = _.clone(src)
    dest = dest.split(br)
    for (const map of maps) {
      _.set(src, map.p, _.slice(dest, map.i, map.i + map.l).join(br))
    }
  } else {
    src = dest
  }
  return src
}

function extract(key, res) {
  const re = new RegExp(`"${key}":".*?"`)
  const result = re.exec(res.body)
  if (result !== null) {
    return result[0].replace(`"${key}":"`, '').slice(0, -1)
  }
  return ''
}

function translate(text, opts, gotopts) {
  opts = opts || {}
  gotopts = gotopts || {}

  let e
  [opts.from, opts.to].forEach(function (lang) {
    if (lang && !languages.isSupported(lang)) {
      e = new Error()
      e.code = 400
      e.message = 'The language \'' + lang + '\' is not supported'
    }
  })
  if (e) {
    return new Promise(function (resolve, reject) {
      reject(e)
    })
  }

  opts.from = opts.from || 'auto'
  opts.to = opts.to || 'en'
  opts.tld = opts.tld || 'com'
  opts.except = opts.except || []
  opts.detail = opts.detail || false

  opts.from = languages.getCode(opts.from);
  opts.to = languages.getCode(opts.to);
  const input = _.cloneDeep(text)

  var url = 'https://translate.google.' + opts.tld;
  return got(url, gotopts).then(function (res) {
    var data = {
      'rpcids': 'MkEWBc',
      'f.sid': extract('FdrFJe', res),
      'bl': extract('cfb2h', res),
      'hl': 'en-US',
      'soc-app': 1,
      'soc-platform': 1,
      'soc-device': 1,
      '_reqid': Math.floor(1000 + (Math.random() * 9000)),
      'rt': 'c'
    }

    return data
  }).then(function (data) {
    const strMap = enMap(text, opts.except)
    text = _.map(_.differenceBy(strMap, [{ s: true }], 's'), 'v').join(br)

    url = url + '/_/TranslateWebserverUi/data/batchexecute?' + querystring.stringify(data)
    gotopts.body = 'f.req=' + encodeURIComponent(JSON.stringify([[['MkEWBc', JSON.stringify([[text, opts.from, opts.to, true], [null]]), null, 'generic']]])) + '&'
    gotopts.headers = {
      'User-Agent': new userAgents({ deviceCategory: 'desktop' }).toString(),
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }

    return got.post(url, gotopts).then(function (res) {
      let json = res.body.slice(6)
      let length = ''

      const result = {
        text: '',
        pronunciation: '',
        from: {
          language: {
            didYouMean: false,
            iso: ''
          },
          text: {
            autoCorrected: false,
            value: '',
            didYouMean: false
          }
        },
        raw: ''
      }

      try {
        length = /^\d+/.exec(json)[0]
        json = JSON.parse(json.slice(length.length, parseInt(length, 10) + length.length))
        json = JSON.parse(json[0][2])
        result.raw = json
      } catch (e) {
        return result
      }

      if (json[1][0][0][5] === undefined || json[1][0][0][5] === null) {
        // translation not found, could be a hyperlink or gender-specific translation?
        result.text = json[1][0][0][0]
      } else {
        result.text = json[1][0][0][5]
          .map(function (obj) {
            return obj[0]
          })
          .filter(Boolean)
          // Google api seems to split text per sentences by <dot><space>
          // So we join text back with spaces.
          // See: https://github.com/vitalets/google-translate-api/issues/73
          .join('')
      }
      result.pronunciation = json[1][0][0][1]

      // From language
      if (json[0] && json[0][1] && json[0][1][1]) {
        result.from.language.didYouMean = true
        result.from.language.iso = json[0][1][1][0]
      } else if (json[1][3] === 'auto') {
        result.from.language.iso = json[2]
      } else {
        result.from.language.iso = json[1][3]
      }

      // Did you mean & autocorrect
      if (json[0] && json[0][1] && json[0][1][0]) {
        var str = json[0][1][0][0][1]

        str = str.replace(/<b>(<i>)?/g, '[')
        str = str.replace(/(<\/i>)?<\/b>/g, ']')

        result.from.text.value = str

        if (json[0][1][0][2] === 1) {
          result.from.text.autoCorrected = true
        } else {
          result.from.text.didYouMean = true
        }
      }

      result.text = deMap(input, strMap, result.text)
      if (opts.detail) {
        return result
      }

      return result.text
    }).catch(function (err) {
      err.message += `\nUrl: ${url}`
      if (err.statusCode !== undefined && err.statusCode !== 200) {
        err.code = 'BAD_REQUEST'
      } else {
        err.code = 'BAD_NETWORK'
      }
      throw err
    })
  })
}

module.exports = translate
module.exports.languages = languages