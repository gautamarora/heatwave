
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
User 									= mongoose.model('User', require('./models/user'));
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

users = [];
sessions = [];
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
// io.set('log level', 1);                    // reduce logging
// io.set('transports', [                     // enable all transports (optional if you want flashsocket)
//     'websocket'
//   , 'flashsocket'
//   , 'htmlfile'
//   , 'xhr-polling'
//   , 'jsonp-polling'
// ]);


io.sockets.on('connection', function (socket) {
	
	var socketId = socket.id
    , sessionId = socket.handshake.sessionID;
  
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
    // delete connections[socket.userId];    
    socket.broadcast.emit('someone-disconnected', { message: 'someone disconnected' });
  });
  
	socket.on('init', function(data) {
		if(data.role === 'admin') {
			console.log("server:admin is in the house");
			adminSocketId = socket.id;
		} else {
			console.log("server:we have a new client");
			socket.emit('start', { message: 'you can start now' });
		}
	});
	
	socket.on('move', function(data) {
		if(adminSocketId) {
			io.sockets.socket(adminSocketId).emit('moved', data);
		}
	});
	
});