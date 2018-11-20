const mongoose = require('mongoose')
const shortId = require('shortid')
const constants = require('../i18n/error-codes')
const validators = require('../lib/validators')

const aliasSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortId.generate,
    required: [true, constants.ALIAS_NAME_EMPTY],
    maxlength: [50, constants.ALIAS_NAME_TOO_LONG],
    validate: {
      validator: v => {
        return validators.regexes.alias.test(v)
      },
      message: constants.ALIAS_NAME_BAD
    },
    trim: true
  },
  // Полная ссылка
  href: {
    type: String,
    maxlength: [2000, constants.LINK_TOO_LONG],
    required: [true, constants.LINK_EMPTY],
    validate: [{
      validator: href => {
        return !(validators.regexes.noLoopHref.test(href))
      },
      message: constants.LINK_LOOP
    }, {
      validator: href => {
        return validators.regexes.href.test(href)
      },
      message: constants.HREF_BAD
    }],
    trim: true
  },
  analytics: {
    type: {},
    default: {
      followed: 0
    }
  }
}, {
  // Конфиг схемы
  versionKey: false,
  timestamps: true
})

/**
 * Переопределение метода сериализации объекта в JSON
 *
 * @return {obj} JSON
 */
aliasSchema.methods.toJSON = function () {
  return {
    name: this._id,
    href: this.href,
    analytics: {
      followed: this.analytics.followed
    }
  }
}

// Хук, который срабатывает перед валидацией нового документа
aliasSchema.pre('validate', function (done) {
  if (this.href && !/^http/.test(this.href)) {
    this.href = 'http://' + this.href
  }

  done()
})

module.exports = mongoose.model('Alias', aliasSchema)
