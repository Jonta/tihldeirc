var bot = require('./bot.js'),
winston = require('winston'),
listeners = [],
client = (function() {
    return {
        addListener: function(type, c) {
            listeners.push(c);
        },
        removeListener: function() {},
        say: function(to, msg) {
            winston.info('[test] > ' + to.red + (' ' + msg).yellow);
        }
    };
} ());

bot.start(client);

function s(msg) {
    winston.info('[test] < ' + msg.cyan);
    listeners.forEach(function(l) {
        l('eirikb', '#test', msg);
    });
}

setTimeout(function() {
    s('!e 1+1');
    s('google.com');
    s('s/google/microsoft');
    s('1 +  1');
    s('4 eur to nok');
    s('gogle er best');
    s('google*');
    setTimeout(process.exit, 500);
},
500);

