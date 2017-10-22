let Alias = require('../mongo/models/alias'),
    _ = require('underscore');

let getAlias = (req, res, next) => {
    Alias.findById(req.params.alias)
        .then((alias) => {
            if (!alias) {
                let err = new Error('d0');
                err.status = 400;

                next(err);
            } else {
                res.locals.payload = alias;

                next();
            }
        })
        .catch((error) => {
            next(error);
        });
};

/**
 * Редирект по короткой ссылке
 */
let follow = (req, res, next) => {
    Alias.findById(req.params.alias)
        .then((alias) => {
            if (!alias) {
                let err = new Error('d0');
                err.status = 400;

                next(err);
            } else {
                alias.analytics.followed++;
                alias.markModified('analytics');
                alias.save();

                res.redirect(alias.href);
                res.status(301);

                return null;
            }
        })
        .catch((error) => {
            next(error);
        });
};

/**
 * Создание новой короткой ссылки
 */
let newAlias = (req, res, next) => {
    Alias.create(
            // На лету формируем объект и отметаем пустые свойства
            _.omit({
                '_id': req.body.name,
                'href': req.body.href
            }, (value) => _.isUndefined(value))
        )
        .then((alias) => {
            res.locals.payload = {
                name: alias._id,
                href: alias.href
            };

            next();
        })
        .catch((error) => {
            if (error.code === 11000) {
                let err = new Error('v1');
                err.status = 400;

                next(err);
            } else if ('errors' in error) {
                let reason = error.errors[Object.keys(error.errors)[0]].message;

                let err = new Error(reason);
                err.code = reason;
                err.status = 400;

                next(err);
            } else {
                next(error);
            }
        });
};

module.exports = {
    follow,
    newAlias,
    getAlias
};
