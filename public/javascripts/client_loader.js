var hwloader = (function() {
	var self = {};

	self.load = function(server, port, callback) {
			createScript(server + ':' + port + "/socket.io/socket.io.js", function() {
				createScript(server + ':' + port + "/javascripts/client2.js", function() {
					callback();
				});
			});

	}	

	function createScript(url, callback) {
		var script = document.createElement('script');
		script.type = "text/javascript";
		script.src = url;
		script.onload = function() {
			callback();
		};
		jQuery.noConflict();
		document.getElementsByTagName('head')[0].appendChild(script);
	}

	return self;
})();