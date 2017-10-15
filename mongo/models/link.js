let mongoose = require('mongoose'),
    BPromise = require('bluebird').Promise;

/**
 * Схема данных для модели Link
 */
let Schema = mongoose.Schema,
    linkSchema = new Schema({
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
linkSchema.statics.findByName = function(name) {
    return new BPromise(function(resolve, reject) {
        Link.findOne({ 'name': name }, function(err, link) {
            if (err) {
                reject({
                    status: 500,
                    reason: 'Database error'
                });
            }

            if (!link) {
                reject({
                    status: 401,
                    reason: 'Link not found'
                });
            } else {
                resolve(link);
            }
        });
    });
};

let Link = mongoose.model('Link', linkSchema);

module.exports = Link;
