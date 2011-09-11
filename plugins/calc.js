var bot = require('../bot.js'),
get = require('./get.js'),
winston = require('winston');

bot.onTrigger(__filename, 'Google calc', ['c', 'calc'], function(from, to, msg) {
    get.get({
        host: 'www.google.com',
        path: '/ig/calculator?q=' + encodeURIComponent(msg)
    },
    function(data) {
        winston.info('[calc] data: ' + data);
        try {
            data = eval('(' + data + ')');
            if (!data.error || data.error.length === 0) {
                data.rhs = data.rhs.
                replace(/&#215;/g, '*').
                replace(/�/g, ' ').
                replace(/<sup>/g, '^').
                replace(/<\/sup>/g, '');
                bot.client.say(to, from + ': ' + data.lhs + ' = ' + data.rhs);
            }
        } catch(e) {
            winston.error('[calc] error: ' + e.toString());
        }
    });
});

