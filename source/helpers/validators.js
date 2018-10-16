'use strict'

module.exports.regexes = {
  alias: /^[a-zA-zа-яА-Я\d._-]+$/,
  noLoopHref: /^(https?:\/\/)?short\.taxnuke\.ru\/./,
  href: /\w+\.\w+\S/
}
