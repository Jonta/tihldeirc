var bot = require('bot.js');

function onMessage(from, to, message) {
    if (message.match(/^meh /)) {
        try {
            message = message.replace(/^meh /, '');
            eval(message);
        } catch(err) {
            console.log(err);
        }
    }
}

bot.client.addListener('message', onMessage);

exports.destruct = function() {
    bot.client.removeListener('message', onMessage);
};

