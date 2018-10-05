'use strict'

const validators = require('../../helpers/validators')

function validateAlias($alias) {
  const alias = $alias.val().trim()

  if (!(validators.regexes.alias.test(alias))) {
    return 'Запрещенные символы, справа есть подсказка!'
  }
}

function validateHref($href) {
  const href = $href.val().trim()

  if (!(validators.regexes.href.test(href))) {
    return 'Это не похоже на ссылку!'
  } else if (validators.regexes.noLoopHref.test(href)) {
    return 'Это может привести к зацикливанию!'
  }
}

module.exports = {
  href: validateHref,
  alias: validateAlias
}
