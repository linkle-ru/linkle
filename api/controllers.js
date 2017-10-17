let Alias = require('../mongo/models/alias'),
    _ = require('underscore');

let goto = (req, res, next) => {
    Alias.findById(req.params.alias)
        .then((alias) => {
            let href = alias.href;

            res.redirect(href);
            res.status(301);
        })
        .catch((error) => {
            next(error);
        });
};

let newAlias = (req, res, next) => {
    Alias.create(_.omit({
            '_id': req.body.name,
            'href': req.body.href
        }, (value) => _.isUndefined(value)))
        .then((alias) => {
            res.send(alias);
        })
        .catch((error) => {
            if (error.code === 11000) {
                let err = new Error('Alias exists');
                err.status = 400;

                next(err);
            } else if ('errors' in error) {
                let reasons = '';

                for (let e in error.errors) {
                    reasons += error.errors[e].message + '\n';
                }

                let err = new Error(reasons);
                err.status = 400;

                next(err);
            } else {
                next(error);
            }
        });
};

module.exports = {
    goto,
    newAlias
};
