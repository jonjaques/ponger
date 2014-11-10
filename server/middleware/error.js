module.exports.devError = function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
};

module.exports.error = function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
}

module.exports.notFound = function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}
