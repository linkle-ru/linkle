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
 * Переопределение метода сериализации объекта
 *
 * @return {string} JSON
 */
aliasSchema.methods.toJSON = function() {
    // Формирует объект из полей текущего юзера, исключая пустые
    return {
        name: this._id,
        href: this.href
    };
};

// /**
//  * Поиск ссылки по имени
//  *
//  * @return {Promise}
//  */
// aliasSchema.statics.findByName = (name) => {
//     return new BPromise((resolve, reject) => {
//         Alias.findOne({ 'name': name }, (err, alias) => {
//             if (err) {
//                 reject({
//                     status: 500,
//                     reason: 'Database error'
//                 });
//             }

//             if (!alias) {
//                 reject({
//                     status: 401,
//                     reason: 'Alias not found'
//                 });
//             } else {
//                 resolve(alias);
//             }
//         });
//     });
// };

let Alias = mongoose.model('Alias', aliasSchema);

module.exports = Alias;
