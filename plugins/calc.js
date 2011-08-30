var bot = require('../bot.js'),
get = require('./get.js'),
winston = require('winston');

bot.addListener(__filename, 'message', function(from, to, msg) {
    get.get({
        host: 'www.google.com',
        path: '/ig/calculator?q=' + encodeURIComponent(msg)
    },
    function(data) {
        try {
            data = eval('(' + data + ')');
            if (!data.error || data.error.length === 0) {
                data.rhs = data.rhs.
                replace(/&#215;/, '*').
		replace(/&nbsp;/g, ' ').
                replace(/<sup>/, '^').
                replace(/<\/sup>/, '');
                bot.client.say(to, from + ': ' + data.lhs + ' = ' + data.rhs);
            }
        } catch(e) {
            winston.error('[calc] error: ' + e.toString());
        }
    });
});

