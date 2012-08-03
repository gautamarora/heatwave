var User = require('../models/user')
  , routes = function(app) {
      return app.namespace('/users', function() {

        app.get('/', function(req,res) {
          res.send('fetching...');
          User.find(function(err,users) {
            if (!err) {
              return console.log(users);
            } else {
              return console.log(err);
            }          
          });
        });

        // curl -v -H "Content-Type: application/json" -X POST -d '{"user":{"id":"211126260","name":"gautam", "firstname":"Gautam", "lastname":"Arora"}}' http://192.168.110.137:3000/users
        app.post('/', function(req,res) {
          res.send('creating...');
          var user = new User();
          user.id = req.body.user.id;
          user.name = req.body.user.name;
          user.firstname = req.body.user.firstname;
          user.lastname = req.body.user.lastname;

          user.save(function(err) {
            if (!err) {
              return console.log("created!");
            } else {
              return console.log(err);
            }
          });  
        });

        
        app.get('/:username', function(req,res) {
          res.send('fetching...');
          User.findOne({username:req.params.username},function(err,user) {
            if (!err) {
              return console.log(user);
            } else {
              return console.log(err);
            }
          });
        });

      })
    }

module.exports = routes;