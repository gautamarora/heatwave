routes = function(app) {
      return app.namespace('/test', function() {

        app.get('/client', function(req,res) {
          res.render('test/client', { title: 'Client Test Page'});
        });

        app.get('/admin', function(req,res) {
          res.render('test/admin', { title: 'Admin Test Page'});
        });
      })
    }

module.exports = routes;