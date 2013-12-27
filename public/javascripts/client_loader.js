var hwloader = (function() {
	var self = {};

	self.load = function(server, port, callback) {
		createScript("https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js", function() {
			createScript(server + ':' + port + "/socket.io/socket.io.js", function() {
				createScript(server + ':' + port + "/javascripts/client.js", function() {
					callback();
				});
			});
		});

	};

	function createScript(url, callback) {
		var script = document.createElement('script');
		script.type = "text/javascript";
		script.src = url;
		script.onload = function() {
			callback();
		};
		document.getElementsByTagName('head')[0].appendChild(script);
	}

	return self;
})();