var bot = require('bot.js'),
    twitter = require('twitter'),
    fs = require('fs'),
    twit;

function onMessage(from, to, message) {
    if (message.match(/^!twitter /)) {
        twit.updateStatus(from + ': ' + message.replace(/^!twitter /, ''), function(data) {});
    }
}

bot.client.addListener('message', onMessage);

fs.readFile('twitter-keys', function(error, data) {
    if (!error) {

        twit = new twitter(JSON.parse(data));

        twit.stream('statuses/filter', {
            track: 'tihlde'
        },
        function(stream) {
            stream.on('data', function(data) {
                bot.client.say(bot.channel, '[twitter] ' + data.user.screen_name + ': ' + data.text);
            });
        });
    }
});

exports.destruct = function() {
    bot.client.removeListener('message', onMessage);
};

