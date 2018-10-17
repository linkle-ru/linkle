'use strict'

const mongoose = require('mongoose')
const shortId = require('shortid')
const constants = require('../../helpers/constants')
const validators = require('../../helpers/validators')

// todo: добавить поле с таймштампом

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
      validator: v => {
        return !(validators.regexes.noLoopHref.test(v))
      },
      message: constants.LINK_LOOP
    }, {
      validator: v => {
        return validators.regexes.href.test(v)
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
  versionKey: false
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

// Хук, который срабатывает перед сохранением документа в базу
aliasSchema.pre('save', function (done) {
  if (this.isNew) {
    if (!/^http/.test(this.href)) {
      this.href = 'http://' + this.href
    }
  }

  done()
})

module.exports = mongoose.model('Alias', aliasSchema)
