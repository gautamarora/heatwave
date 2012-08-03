
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


server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//global socket.io
io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
	console.log("server:got connection from " + socket.id);
	socket.emit('connected', { message: 'you connected' });
	
	socket.on('disconnect', function () {
		console.log("server:got disconnect from ");
    delete connections[socket.userId];    
    socket.broadcast.emit('someone-disconnected', { message: 'someone disconnected' });
  });
  
	socket.on('init', function(data) {
		socket.emit('start', { message: 'you connected' }); //to client if role != admin, else say nothing
	});
	
	socket.on('move', function(data) {
		socket.emit('moved', { message: 'someone moved' }); //to admin only
	});
	
});