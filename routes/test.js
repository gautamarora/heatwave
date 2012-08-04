routes = function(app) {
      return app.namespace('/test', function() {

        app.get('/client/:uid', function(req,res) {
          res.render('test/client', { title: 'Client Test Page', uid : req.params.uid});
        });

        app.get('/admin/:uid', function(req,res) {
          res.render('test/admin', { title: 'Admin Test Page', uid : req.params.uid});
        });
      })
    }

module.exports = routes;