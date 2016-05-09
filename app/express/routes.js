var path = require('path');
var express = require('express');
var compression = require('compression');
var serveStatic = require('serve-static');

module.exports = function(app) {

    require('./routes/MarketDataRoutes')(app);
    require('./routes/LoginRoutes')(app);

    app.use(compression());

    app.use(serveStatic(path.resolve(__dirname + '/../public'), {
        maxAge: '30m',
        setHeaders: setCustomCacheControl
    }));

    app.get('*', function(req, res) {
        res.sendFile(path.resolve(__dirname + '/../public/index.html'));
    });

    function setCustomCacheControl(res, path) {
        if (serveStatic.mime.lookup(path) === 'text/html') {
            // Custom Cache-Control for HTML files 
            res.setHeader('Cache-Control', 'public, max-age=0')
        }
    }

};
