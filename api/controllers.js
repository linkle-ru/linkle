let Alias = require('../mongo/models/alias');

let goto = (req, res, next) => {
    Alias.findByName(req.params.alias)
        .then((alias) => {
            let href = alias.href;

            if (!/^http/.test(href)) {
                href = 'http://' + href;
            }

            res.redirect(href);
            res.status(301);
        })
        .catch((error) => {
            let err = new Error(error.reason);
            err.status = error.status;

            next(err);
        });
};

let newAlias = (req, res, next) => {
    const name = req.body.name,
        href = req.body.href;

    Alias.create({ 'name': name, 'href': href })
        .then((alias) => {
            res.json(alias);
            res.status(200);
        })
        .catch((error) => {
            let err = new Error(error.reason);
            err.status = error.status;

            next(err);
        });
};

module.exports = {
    goto,
    newAlias
};
