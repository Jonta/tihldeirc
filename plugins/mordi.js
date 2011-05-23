var bot = require('bot.js'),
    translate = require('translate.js'),
    fs = require('fs'),
    mordi = JSON.parse(fs.readFileSync('assets/mordi.txt'));

function onMessage(from, to, message) {
    if (message.match(/mordi/)) {
        var joke = mordi[Math.floor(Math.random() * mordi.length)];
        translate.translate('en', 'no', joke, function(text) {
            bot.client.say(bot.channel, from + ': hehe ja, men ' + text);
        });
    }
}

bot.client.addListener('message', onMessage);

exports.destruct = function() {
    bot.client.removeListener('message', onMessage);
};

