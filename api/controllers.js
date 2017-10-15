let Link = require('../mongo/models/link');

function goto(req, res, next) {
    Link.findByName(req.params.link)
        .then((link) => {
            res.redirect(link.href);
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
