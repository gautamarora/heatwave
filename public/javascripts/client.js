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
    self.listenEvents();
  };

  self.listenEvents = function() {
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
    if(!(data.u in self.clients)) {
      var track = new Track(data.x, data.y, data.u, 'Tester', 'body', $);
      self.clients[data.u] = track;
    } else {
      if(data.c) {
        self.clients[data.u].click(data.x, data.y, $);
      } else {
        self.clients[data.u].moveTo(data.x, data.y);
      }
    }
  };

  function payload(event, click) {
    return {
      x : event.pageX,
      y : event.pageY,
      c : click,
      u : self.uid
    };
  }

  return self;
})(jQuery);