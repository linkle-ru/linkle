const mongoose = require('mongoose')
const shortId = require('shortid')

const aliasSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortId.generate,
    minlength: [1, 'v5'],
    maxlength: [50, 'v0'],
    validate: {
      validator: (v) => {
        return /^[a-zA-zа-яА-Я\d._-]+$/.test(v)
      },
      message: 'v2'
    },
    trim: true
  },
  // Полная ссылка
  href: {
    type: String,
    maxlength: [2000, 'v3'],
    required: [true, 'v4'],
    validate: [{
      validator: (v) => {
        return !(/^(https?:\/\/)?short\.taxnuke\.ru\/./.test(v))
      },
      // todo: сделать понятные константы для кодов ошибок
      message: 'v8'
    }, {
      validator: (v) => {
        return /\w+\.\w+/.test(v)
      },
      message: 'v7'
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
