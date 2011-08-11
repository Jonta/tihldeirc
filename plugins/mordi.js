var bot = require('bot.js'),
translate = require('./translate.js'),
fs = require('fs'),
mordi = JSON.parse(fs.readFileSync('assets/mordi.txt'));

bot.addListener(__filename, 'message', function(from, to, msg) {
    if (msg.match(/moRdI/)) {
        var joke = mordi[Math.floor(Math.random() * mordi.length)];
        joke = joke.replace(/Yo mama/, 'mordi');
        translate.translate('en', 'no', joke, function(text) {
            bot.client.say(to, from + ': hehe ja, men ' + text);
        });
    }
});

