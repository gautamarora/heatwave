jQuery.noConflict();
window.hwclient = (function(){
  var self = {};
  
  var uid = '';

  self.init = function(options) {
    console.log('client.js: self.init()');
    socket = io.connect(options.host + ':' + options.port, {"reconnect" : false});
    uid = options.uid;
    initClient();
    listenEvents();
  };

  var initClient = function() {
    console.log('client.js: self.initClient()');    
    socket.emit('init', {'uid' : uid, 'role' : 'client'});
  };

  var listenEvents = function() {
    console.log('client.js: self.listenEvents()');
    socket.on('start', handleStart);
    socket.on('end', handleEnd);
    socket.on('disconnect', handleEnd);
    socket.on('reconnect', initClient);
  };

  var handleStart = function(data) {
    var moveLock = false,
				moveX = 0,
				moveY = 0;
    $(document).observe('click', function(event) {
      socket.emit('move', payload(event, true));
    });
		
    $(document).observe('mousemove', function(event) {
      if(!moveLock) {
        moveLock = true;
				// console.log(moveX, event.pageX);
				// console.log(moveY, event.pageY);
				if(moveX != event.pageX && moveY != event.pageY) {
					moveX = event.pageX;
					moveY = event.pageY;
	        socket.emit('move', payload(event, false));
				}
        setTimeout(function(){
          moveLock = false;
        }, 100);
      }
    });
  };

  var handleEnd = function(data) {
    $(document).stopObserving('click');
    $(document).stopObserving('mousemove');
  };

  function payload(event, click) {
    return {
      x : event.pageX,
      y : event.pageY,
      c : click,
      u : uid,
      maxw : document.viewport.getDimensions().width
    };
  }
	// console.log('heatwave client loaded...');
  return self;
})();