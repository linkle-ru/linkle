let Alias = require('../mongo/models/alias');

function goto(req, res, next) {
    Alias.findByName(req.params.alias)
        .then((alias) => {
            res.redirect(alias.href);
            res.status(301);
        })
        .catch((error) => {
            let err = new Error(error.reason);
            err.status = error.status;

            next(err);
        });
}

module.exports = {
    goto
};
