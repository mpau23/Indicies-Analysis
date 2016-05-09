var winston = require('winston');
var Base64Service = require('../services/Base64Service');
var path = require('path');
var fs = require('fs');

module.exports = function(app) {

    app.get('/api/get/user/by-login/:user', function(req, res) {

        winston.info("Requesting log in");

        var loginCredentials = Base64Service.decode(req.params.user);
        var success = false;

        try {
            var users = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/../data/Users.json')));
            for (var i = 0; i < users.length; i++) {
                if (loginCredentials == users[i].login) {
                    winston.info("Found user");
                    success = true;
                    res.status(200).send({ success: true });
                    break;
                }
            }

            if (!success) {
                winston.info("User not found");
                res.status(200).send();
            }

        } catch (err) {
            winston.info("Problem logging in");
            winston.info(err);
            res.send(err);
        }

    });
}
