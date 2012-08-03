var jxyloader = (function() {
	var self = {};

	self.load = function(callback) {
		createStyle("http://192.168.110.172:3000/stylesheets/jxy.css", function() {
			createScript("https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js", function() {
				createScript("http://192.168.110.172:3000/socket.io/socket.io.js", function() {
					createScript("http://192.168.110.172:3000/javascripts/client.js", function() {
						createScript("http://192.168.110.172:3000/javascripts/Track.js", function() {
							callback();
						});
					});
				});
			});
		});
	}	

	function createStyle(url, callback) {
		var style = document.createElement('link');
		style.rel = "stylesheet";
		style.type = "text/css";
		style.href = url;
		document.getElementsByTagName('head')[0].appendChild(style);
		callback();
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