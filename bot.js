require.paths.unshift('.');

var fs = require('fs'),
    irc = require("irc"),
    plugins = require('plugins.js');

plugins.watch('./plugins/');

exports.channel = '#tihlde';

exports.client = new irc.Client('irc.efnet.nl', 'hilde', {
    userName: 'tihihilde',
    realName: 'tihihilde',
    channels: [this.channel]
});

exports.say = function(message) {
    this.client.say(this.channel, message);
};

