var path = require('path'),
    dir = path.join('/', path.join(__dirname, '/'));
console.log('dirname', dir);
require.paths.unshift(dir);

var fs = require('fs'),
irc = require("irc"),
plugins = require('plugins.js');

plugins.watch(dir + 'plugins/');

exports.channel = '#nodester';

exports.client = new irc.Client('irc.freenode.org', 'hilde', {
    userName: 'tihihilde',
    realName: 'tihihilde',
    channels: [this.channel]
});

exports.say = function(message) {
    this.client.say(this.channel, message);
};

