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
            maxlength: [50, 'Alias name is too long'],
            validate: {
                validator: function(v) {
                    return /^[a-zA-zа-яА-Я\d_-]+$/.test(v);
                },
                message: 'Alias contains weird characters'
            },
            trim: true
        },
        // Полная ссылка
        href: {
            type: String,
            maxlength: 2000,
            required: true,
            trim: true
        }
    });

/**
 * Переопределение метода сериализации объекта в JSON
 *
 * @return {obj} JSON
 */
aliasSchema.methods.toJSON = function() {
    return {
        name: this._id,
        href: this.href
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
