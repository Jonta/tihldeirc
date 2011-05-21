require.paths.unshift('.');

var fs = require('fs'),
pluginsDir = "./plugins/",
irc = require("irc"),
plugins = {};

function watchFiles() {
	fs.readdir(pluginsDir, function(err, files) {
		files.forEach(function(file) {
			file = pluginsDir + file;
			plugins[file] = require(file);
			fs.watchFile(file, function(current, previous) {
				if ( + current.mtime !== + previous.mtime) {
					plugins[file].destruct && plugins[file].destruct();
					delete require.cache[require.resolve(file)];
					plugins[file] = require(file);
				}
			});
		});
	});
};

fs.watchFile(pluginsDir, watchFiles);
watchFiles();

exports.channel = '#testfrest';

exports.client = new irc.Client('irc.homelien.no', 'nodebot', {
	channels: [this.channel]
});

