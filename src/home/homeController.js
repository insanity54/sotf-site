var home = function home(app) {
    app.get('/', function(req, res) {
        res.sendFile(app.get('appDir') + '/app/index.html');
    });
}

module.exports = home;