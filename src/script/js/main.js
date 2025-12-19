/* eslint-disable no-tabs */
const smScript = (url) => `
	var init = function () {
		getJSON('${url}asset-manifest.json',
			function(err, data) {
			if (err !== null) {
				console.error('Unable to get manifest: ' + err);
			} else {
				var serverSRC = data.files['main.js'];
				var serverStyle = data.files['main.css'];
				var head = document.getElementsByTagName('head')[0];
				if(serverSRC) {
					var src = serverSRC.replace('./', '${url}');
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.defer = 'defer';
					script.src = src;
					head.appendChild(script);
			}
				if(serverStyle) {
					var styles = serverStyle.replace('./', '${url}');
					var style = document.createElement('link');
					style.rel = 'stylesheet';
					style.href = styles;
					head.appendChild(style);
				}
			}
		});
	};
	// window.onload can work without <body onload="">
	window.onload = init;

	var getJSON = function(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'json';
		xhr.onload = function() {
		var status = xhr.status;
		if (status === 200) {
			callback(null, xhr.response);
		} else {
			callback(status);
		}
		};
		xhr.send();
	};
`;

exports.smScript = smScript;
