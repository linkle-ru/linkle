let mongoose = require('mongoose'),
    BPromise = require('bluebird').Promise;

/**
 * Схема данных для модели Alias
 */
let Schema = mongoose.Schema,
    aliasSchema = new Schema({
        // Короткая ссылка
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        // Полная ссылка
        href: {
            type: String,
            required: true,
            trim: true
        }
    });

/**
 * Поиск ссылки по имени
 *
 * @return {Promise}
 */
aliasSchema.statics.findByName = function(name) {
    return new BPromise(function(resolve, reject) {
        Alias.findOne({ 'name': name }, function(err, alias) {
            if (err) {
                reject({
                    status: 500,
                    reason: 'Database error'
                });
            }

            if (!alias) {
                reject({
                    status: 401,
                    reason: 'Alias not found'
                });
            } else {
                resolve(alias);
            }
        });
    });
};

let Alias = mongoose.model('Alias', aliasSchema);

module.exports = Alias;
