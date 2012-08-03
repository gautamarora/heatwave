jQuery.noConflict();
window.jxy = (function($){
  var self = {};

  var isAdmin = false;

  var clients = {};
  var socket = {};
  var uid = '';
  var heatmap = {};

  self.init = function(options) {
    socket = io.connect(options.host + ':' + options.port);
    uid = options.uid;
    if(options.role == 'client') {
      initClient();
    } else if(options.role == 'admin') {
      initAdmin();
    }
    listenEvents();
  };

  var initClient = function() {
    socket.emit('init', {'uid' : uid, 'role' : 'client'});
  };

  var initAdmin = function() {
    socket.emit('init', {'uid' : uid, 'role' : 'admin'});
    isAdmin = true;
    drawOverlay();
  };

  var drawOverlay = function() {
    if($('.jxy_overlay').length == 0) {
        var overlay = $('<div></div>').addClass('jxy_overlay');
        var overlay_inner = $('<div></div>').addClass('jxy_overlay_inner');
        var overlay_heatmap = $('<div></div>').addClass('jxy_heatmap');
        $(overlay).append(overlay_heatmap);
        $(overlay).append(overlay_inner);
        $('body').append(overlay);
        initHeatmap();
    }   
  };

  var initHeatmap = function() {
    heatmap = h337.create({'element' : $('.jxy_heatmap')[0], 'radius' : 25, 'visible' : true});
  }

  var listenEvents = function() {
    if(!isAdmin) {
      socket.on('start', handleStart);
      socket.on('end', handleEnd);
      socket.on('disconnect', handleEnd);
      socket.on('reconnect', initClient);
    } else {
      socket.on('moved', handleMove);
      socket.on('reconnect', initAdmin);
    }
  };

  var handleStart = function(data) {
    $(document).on('click', function(event) {
      socket.emit('move', payload(event, true));
    });
    $(document).on('mousemove', function(event) {
      socket.emit('move', payload(event, false));
    });
  };

  var handleEnd = function(data) {
    $(document).off('click');
    $(document).off('mousemove');
  };

  var handleMove = function(data) {
    var move = getPosition(data.data);
    var user = data.who;
    if(!(user.uid in clients)) {
      var track = new Track(move.x, move.y, user.uid, user.uname, 'body', $);
      clients[user.uid] = track;
    } else {
      if(move.c) {
        clients[user.uid].click(move.x, move.y, $);
      } else {
        clients[user.uid].moveTo(move.x, move.y);
      }
    }
    heatmap.store.addDataPoint(move.x, move.y);
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
      u : uid,
      maxw : $(window).width()
    };
  }

  return self;
})(jQuery);