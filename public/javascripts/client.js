jQuery.noConflict();
window.jxy = (function($){
  var self = {};

  self.isAdmin = false;

  self.clients = {};

  self.init = function(options) {
    self.socket = io.connect(options.host + ':' + options.port);
    self.uid = options.uid;
    if(options.role == 'client') {
      self.initClient();
    } else if(options.role == 'admin') {
      self.initAdmin();
    }
  };

  self.initClient = function() {
    self.socket.emit('init', {'uid' : self.uid, 'role' : 'client'});
    self.listenEvents();    
  };

  self.initAdmin = function() {
    self.socket.emit('init', {'uid' : self.uid, 'role' : 'admin'});
    self.isAdmin = true;
    self.drawOverlay();
    self.listenEvents();
  };

  self.drawOverlay = function() {
    var overlay = $('<div></div>').addClass('jxy_overlay');
    var overlay_inner = $('<div></div>').addClass('jxy_overlay_inner');
    $(overlay).append(overlay_inner);
    $('body').append(overlay);
  };

  self.listenEvents = function() {
		console.log("i am now listening as admin:" + self.isAdmin);
    if(!self.isAdmin) {
      self.socket.on('start', self.handleStart);
      self.socket.on('end', self.handleEnd);
    } else {
      self.socket.on('moved', self.handleMove);
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
    var move = getPosition(data.data);
    var user = data.who;
    if(!(user.uid in self.clients)) {
      var track = new Track(move.x, move.y, user.uid, user.uname, 'body', $);
      self.clients[user.uid] = track;
    } else {
      if(move.c) {
        self.clients[user.uid].click(move.x, move.y, $);
      } else {
        self.clients[user.uid].moveTo(move.x, move.y);
      }
    }
  };

  function getPosition(data) {
    var x = data.x;
    var clientMax = data.maxw;
    var adminMax = $(window).width();
    var diff = Math.abs(adminMax - clientMax) / 2 * (adminMax > clientMax ? 1 : -1);
    data.x = x + diff;
    return data;
  }

  function payload(event, click) {
    return {
      x : event.pageX,
      y : event.pageY,
      c : click,
      u : self.uid,
      maxw : $(window).width()
    };
  }

  return self;
})(jQuery);