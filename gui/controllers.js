var home = (req, res) => {
    res.render('index', {
        greeting: 'Здарова'
    });
};

module.exports = {home};
