let mongoose = require('mongoose'),
    BPromise = require('bluebird').Promise;

/**
 * Схема данных для модели Alias
 */
let Schema = mongoose.Schema,
    aliasSchema = new Schema({
        // Идентификатор
        _id: {
            type: String,
            required: true,
            maxlength: 50,
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
 * Переопределение метода сериализации объекта
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
    // Для новых документов генерить хэш
    if (this.isNew) {
        if (!/^http/.test(this.href)) {
            this.href = 'http://' + this.href;
        }
    }

    done();
});

let Alias = mongoose.model('Alias', aliasSchema);

module.exports = Alias;
