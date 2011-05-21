require.paths.unshift('.');

var fs = require('fs'),
irc = require("irc"),
plugins = require('plugins.js');

plugins.watch('./plugins/');

exports.channel = '#testfrest';

exports.client = new irc.Client('irc.homelien.no', 'hilde', {
	channels: [this.channel]
});

