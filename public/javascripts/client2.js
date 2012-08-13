jQuery.noConflict();
window.hwclient = (function($){
  var self = {};
  
  var uid = '';

  self.init = function(options) {
    socket = io.connect(options.host + ':' + options.port);
    uid = options.uid;
    initClient();
    listenEvents();
  };

  var initClient = function() {
    socket.emit('init', {'uid' : uid, 'role' : 'client'});
  };

  var listenEvents = function() {
    socket.on('start', handleStart);
    socket.on('end', handleEnd);
    socket.on('disconnect', handleEnd);
    socket.on('reconnect', initClient);
  };

  var handleStart = function(data) {
    var moveLock = false;
    $(document).on('click', function(event) {
      socket.emit('move', payload(event, true));
    });
    $(document).on('mousemove', function(event) {
      if(!moveLock) {
        moveLock = true;
        socket.emit('move', payload(event, false));
        setTimeout(function(){
          moveLock = false;
        }, 100);
      }
    });
  };

  var handleEnd = function(data) {
    $(document).off('click');
    $(document).off('mousemove');
  };

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