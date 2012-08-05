
/**
 * Module dependencies.
 */

var express = require('express')
  , conf = require('./conf')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , moment            = require('moment')
  , _                 = require('underscore')._;

//required modules
require('express-namespace');

// configuration
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var env = process.env.NODE_ENV;
kProduction = env === 'production';

//global mongoose
mongoose              = require('mongoose');
Schema                = mongoose.Schema;
ObjectId              = mongoose.SchemaTypes.ObjectId;
User                                    = mongoose.model('User', require('./models/user'));
Move                                    = mongoose.model('Move', require('./models/move'));
Metric 								= mongoose.model('Metric', require('./models/metric'));
var db = mongoose.connect(conf.mongo.url[env]+conf.mongo.dbname[env], function(err) { if (err) { throw err; } });

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
require('./routes/users')(app);
require('./routes/test')(app);


server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//global socket.io
io = require('socket.io').listen(server);

// users = [];
// sessions = [];
adminSocketId = '';
// var parseCookie = require('connect').utils.parseCookie;
// io.set('authorization', function (data, accept) {
//     if (data.headers.cookie) {
//         data.cookie = parseCookie(data.headers.cookie);
//         
//         data.sessionID = data.cookie['connect.sid'];
//     } else {
//        return accept('No cookie transmitted.', false);
//     }
//     accept(null, true);
// });
// io.enable('browser client minification');  // send minified client
// io.enable('browser client etag');          // apply etag caching logic based on version number
// io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging
// io.set('transports', [                     // enable all transports (optional if you want flashsocket)
//     'websocket'
//   , 'flashsocket'
//   , 'htmlfile'
//   , 'xhr-polling'
//   , 'jsonp-polling'
// ]);


io.sockets.on('connection', function (socket) {
    
    var socketId = socket.id
    // , sessionId = socket.handshake.sessionID;
  
    console.log("server:got connection from " + socket.id);
  // if(!(_.contains(sessions, sessionId))) {
  //   sessions.push(sessionId);
  //   socket.emit('connected', { socketId: socketId, sessionId: socket.handshake.sessionID });
  //   socket.broadcast.emit('someone-connected', { socketId: socketId, sessionId: socket.handshake.sessionID });
  // } else {
  //   socket.emit('connected', { socketId: socketId, sessionId: socket.handshake.sessionID });
  // }
    
    socket.on('disconnect', function () {
        console.log("server:got disconnect from ");
        if(adminSocketId) {
            io.sockets.socket(adminSocketId).emit('disconnected', {who: {uid: socket.uid, uname: socket.uname, uimg: socket.uimg}});
        }
  });
  
    socket.on('init', function(data) {
        console.log("server:got init" + data.role);
        socket.uid = data.uid;
        socket.role = data.role;

        if(socket.role == 'admin') {
            console.log("server:admin is in the house");
            adminSocketId = socket.id;
            socket.name = 'admin';
            socket.uname = 'admin';
            socket.fname = 'admin';
            socket.lname = 'admin';
            socket.uimg = '';
        } else {
            //TODO KAM hit API and get the name, image
            var optionsgetUserName = {
                host : 'api.corporateperks.com', // here only the domain name
                port : 80,
                path : '/user/getbyid/id/'+socket.uid+'/?auth=kjrfr6bQcFBJa1BTWOVZJmLwxBbOauxzJWXICklr1MI%3D', 
                method : 'GET' // do GET
            };

            var optionsgetUserImage = {
                host : 'api.corporateperks.com', // here only the domain name
                port : 80,
                path : '/profile/getbyid/id/'+socket.uid+'/?auth=kjrfr6bQcFBJa1BTWOVZJmLwxBbOauxzJWXICklr1MI%3D', 
                method : 'GET' // do GET
            };
            User.findOne({"id": socket.uid}, function foundUser(err, user) {
                if(!user) {
                    console.log("server:we have a client with no user info")
                    // get user name
                    var reqGetUserName = http.request(optionsgetUserName, function(res) {
                        console.log("statusCode: ", res.statusCode);
                        res.on('data', function(d) {
                            obj = JSON.parse(d);
                            console.log("firstname: ", obj.results.user.firstName);
                            socket.fname = obj.results.user.firstName;
                            socket.lname = obj.results.user.lastName;
                            
                            //now get user image
                            console.log(optionsgetUserImage.path);
                            var reqGetUserImage = http.request(optionsgetUserImage, function(res) {
                                console.log("statusCode: ", res.statusCode);
                                res.on('data', function(d) {
                                    obj = JSON.parse(d);
                                    console.log("userimage: ", obj.results.profile.profileimage);
                                    socket.uname = obj.results.profile.nickname;
                                    socket.uimg = 'https://imgb.nxjimg.com/emp_image/upload/userprofileimage/'+obj.results.profile.profileimage;
                                    
                                    //save user info to db
                                    var user = new User();
                                    user.id = socket.uid;
                                    user.name = socket.uname;
                                    user.firstname = socket.fname;
                                    user.lastname = socket.lname;
                                    user.image = socket.uimg;
                                    
                                    user.save(function(err) {
                                        if (!err) {
                                          console.log("user saved");
                                          console.log("server:we have a new client");
                                          socket.emit('start', { message: 'you can start now' });
                                        } else {
                                          return console.log(err);
                                        }
                                    });
                                });
                            });
                            reqGetUserImage.end();
                            reqGetUserImage.on('error', function(e) {
                                console.error(e);
                            });
                        }); 
                    });
                    reqGetUserName.end();
                    reqGetUserName.on('error', function(e) {
                        console.error(e);
                    });
                } else {
                    socket.uname = user.name;
                    socket.fname = user.firstname;
                    socket.lname = user.lastname;
                    socket.uimg = user.image;

                    console.log("server:we have a client and his user info is right here " + user);
                    console.log("server:we have a new client");
                    socket.emit('start', { message: 'you can start now' });
                }
            });
        }     
    });
    
    socket.on('move', function(data) {
        console.log("someone is on the move...");
        if(socket.uname == undefined) {
            console.log("ERROR:socket.uname is undefined --> uid",socket.uid)
        } else {
            console.log("server: moved " + socket.uname);
        }
        
        if(adminSocketId) {
            io.sockets.socket(adminSocketId).emit('moved', {data: data, who: {uid: socket.uid, uname: socket.uname, uimg: socket.uimg}});
        }

        var move = new Move();
        move.x = data.x;
        move.y = data.y;
        move.click = data.c;
        move.sid = socket.id;
        
        User.findOne({"id": socket.uid}, function foundUser(err, user) {
            move._user = user._id;
            move.uid = user.id;
            // console.log("move" + move);
						move.save(function(err) {
						  if (!err) {
						    console.log("move saved");
								//update metric
								var metric = new Metric();
								metric.x = (Math.round(data.x/10) * 10) + 5;
								metric.y = (Math.round(data.y/10) * 10) + 5;
								var count =  data.c ? 100 : 1;
								Metric.update({page: 'home', x: metric.x, y: metric.y}, {$inc: { 'count': count }}, {upsert: true}, function(err, metric_updated){
									if(err) { throw err; }
						    	return console.log("move metric saved");
								});
						  } else {
						    return console.log(err);
						  }
						});  
       });
    });

    socket.on('getinsights', function(data) {
    	var metrics = Metric
			.find({page: 'home'})
			.sort('count', -1)
			.exec(function(err, insights) {
				// console.log("insights",insights[0].count);
				// console.log(insights);
				if(insights != undefined && insights[0] != undefined) {
				    socket.emit('sendinsights', {max: insights[0].count, data: insights}); 
                }
    	}); 
    });
});
