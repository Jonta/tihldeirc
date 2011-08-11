var bot = require('bot.js'),
twitter = require('twitter'),
fs = require('fs'),
twit = new twitter(JSON.parse(fs.readFileSync('assets/twitter-keys')));

twit.stream('statuses/filter', {
    track: 'tihlde'
},
function(stream) {
    stream.on('data', function(data) {
        bot.client.say('#tihlde', '[twitter] ' + data.user.screen_name + ': ' + data.text);
    });
});

bot.onTrigger(__filename, 'Twitter', 'twitter', function(from, to, msg) {
    twit.updateStatus(from + ': ' + msg, function(data) {});
});

