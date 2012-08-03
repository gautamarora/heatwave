(function() {
  var socketsInitialized = false;
  
  $(document).ready(function() {

		var hostname = '192.168.110.137'
		, port = ":3000"
		, uri = 'http://' + hostname + port;

    socket = io.connect(uri, {"max reconnection attempts":10});

    socket.on('connected', function(data) {
			console.log("client: got connected");
    });

  });
})();