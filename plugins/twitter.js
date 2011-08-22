var bot = require('../bot.js'),
twitter = require('twitter'),
winston = require('winston'),
fs = require('fs'),
twit = new twitter(JSON.parse(fs.readFileSync('assets/twitter-keys')));

twit.stream('user', function(stream) {
    stream.on('data', function(data) {
        winston.info('[twitter]' + JSON.stringify(data));
        if (data.source && data.target && data.target_object) {
            bot.client.say('#tihlde', '[twitter] [' + data.source.event + '] ' + data.source.screen_name + ': ' + data.target_object.text);
        }
    });
});

bot.onTrigger(__filename, 'Twitter', 'twitter', function(from, to, msg) {
    winston.info('[twitter] ' + from + ': ' + to + ' ' + msg);
    twit.updateStatus(from + ': ' + msg, function(data) {
        bot.client.say(to, from + ': Jaushø');
    });
});

