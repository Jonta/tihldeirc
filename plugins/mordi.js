var bot = require('bot.js'),
    fs = require('fs'),
    http = require('http'),
    mordi = JSON.parse(fs.readFileSync('mordi.txt'));

function onMessage(from, to, message) {
    if (message.match(/mordi/)) {
        var joke = mordi[Math.floor(Math.random() * mordi.length)];

        var options = {
            host: 'translate.google.com',
            port: 80,
            path: '/translate_a/t?client=a&text=' + escape(joke) + '&sl=en&tl=no'
        };
        http.get(options, function(res) {
            res.on('data', function(data) {
                data = JSON.parse(data);
                bot.client.say(bot.channel, from + ': hehe ja, men ' + data.sentences[0].trans);
            });
        });
    }
}

bot.client.addListener('message', onMessage);

exports.destruct = function() {
    bot.client.removeListener('message', onMessage);
};

