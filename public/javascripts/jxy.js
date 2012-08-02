jQuery.noConflict();
jQuery(document).ready(function() {
	window.jxy = (function($){
		var self = {};

		self.isAdmin = false;

		self.init = function(options) {
			self.socket = io.connect('http://artemvm:3000');
			if(options.role == 'client') {
				self.initClient();
			} else if(options.role == 'admin') {
				self.initTracker();
			}
		};

		self.initClient = function() {
			self.socket.emit('init', {'uid' : 493, 'role' : 'client'});
			self.listenEvents();		
		};

		self.initTracker = function() {
			self.socket.emit('init', {'uid' : 493, 'role' : 'tracker'});
			self.isAdmin = true;
			self.listenEvents();
		};

		self.listenEvents = function() {
			if(!self.isAdmin) {
				self.socket.on('start', self.handleStart);
				self.socket.on('end', self.handleEnd);
				self.socket.on('moved', self.handleMove);
			} else {
			}
		};

		self.handleStart = function(data) {
			$(document).on('click', function(event) {
				self.socket.emit('move', payload(event, true));
			});
			$(document).on('mousemove', function(event) {
				self.socket.emit('move', payload(event, false));
			});
		};

		self.handleEnd = function(data) {
			$(document).off('click');
			$(document).off('mousemove');
		};

		self.handleMove = function(data) {
			console.log(data);
		};

		function payload(event, click) {
			return {
				x : event.offsetX,
				y : event.offsetY,
				c : click
			};
		}

		return self;
	})(jQuery);
});