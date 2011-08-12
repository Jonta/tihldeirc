var bot = require('bot.js'),
history = require('./history.js'),
regex = /\bs\/([^\/]+)\/([^\/]+)/;

bot.addListener(__filename, 'message', function(from, to, msg) {
    if (msg.match(/^s\//)) {
        var fixed = history.from[from][1].msg.replace(msg.match(regex)[1], msg.match(regex)[2]);
        bot.client.say(to, from + ': ' + fixed);
    }
});

