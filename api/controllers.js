let Alias = require('../mongo/models/alias');

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
    Alias.create({
            '_id': req.body.name,
            'href': req.body.href
        })
        .then((alias) => {
            res.send(alias);
        })
        .catch((error) => {
            if (error.code === 11000) {
                let err = new Error('Alias exists');
                err.status = 400;

                next(err);
            } else {
                next(err);
            }
        });
};

module.exports = {
    goto,
    newAlias
};
