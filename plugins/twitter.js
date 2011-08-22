var bot = require('../bot.js'),
twitter = require('twitter'),
winston = require('winston'),
fs = require('fs'),
twit = new twitter(JSON.parse(fs.readFileSync('assets/twitter-keys')));

twit.stream('user', function(stream) {
    stream.on('data', function(data) {
        var s;
        if (data.target && data.user) {
            s = '[twitter] ' + data.user.screen_name + ': ' + data.text;
            bot.client.say('#tihlde', s);
            winston.info(s);
        } else {
            winston.info('[twitter]' + JSON.stringify(data));
        }
    });
});

bot.onTrigger(__filename, 'Twitter', 'twitter', function(from, to, msg) {
    winston.info('[twitter] ' + from + ': ' + to + ' ' + msg);
    twit.updateStatus(from + ': ' + msg, function(data) {
        bot.client.say(to, from + ': Jaushø');
    });
});

