let mongoose = require('mongoose'),
    shortid = require('shortid');

/**
 * Схема данных для модели Alias
 */
let Schema = mongoose.Schema,
    aliasSchema = new Schema({
        // Короткая ссылка
        _id: {
            type: String,
            default: shortid.generate,
            minlength: [1, 'v5'],
            maxlength: [50, 'v0'],
            validate: {
                validator: (v) => {
                    return /^[a-zA-zа-яА-Я\d\._-]+$/.test(v);
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
                    return !(/short\.taxnuke\.ru/.test(v));
                },
                message: 'v8'
            }, {
                validator: (v) => {
                    return /\w+\.\w+/.test(v);
                },
                message: 'v7'
            }],
            trim: true
        },
        // Аналитика
        analytics: {
            type: {},
            default: {
                followed: 0
            }
        }
    }, {
        // Конфиг схемы
        versionKey: false
    });

/**
 * Переопределение метода сериализации объекта в JSON
 *
 * @return {obj} JSON
 */
aliasSchema.methods.toJSON = function() {
    return {
        name: this._id,
        href: this.href,
        analytics: {
            followed: this.analytics.followed
        }
    };
};

/**
 * Хук, который срабатывает перед сохранением документа в базу
 */
aliasSchema.pre('save', function(done) {
    if (this.isNew) {
        if (!/^http/.test(this.href)) {
            this.href = 'http://' + this.href;
        }
    }

    done();
});

let Alias = mongoose.model('Alias', aliasSchema);

module.exports = Alias;
