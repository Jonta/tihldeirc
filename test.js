var bot = require('./bot.js'),
winston = require('winston'),
listeners = [],
          doTest = false,
client = (function() {
    return {
        addListener: function(type, c) {
            listeners.push(c);
            if (doTest) {
                test();
            }
        },
        removeListener: function(c) {
            listeners = listeners.splice(listeners.indexOf(c), 1);
        },
        say: function(to, msg) {
            if (to !== 'eirikb') {
                winston.info('[test] > ' + to.red + (' ' + msg).yellow);
            }
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

function test() {
    s('!e 1+1');
    s('google.com');
    s('s/google/microsoft');
    s('google.com');
    s('troll/google/microsoft');
    s('1 +  1');
    s('4 eur to nok');
    s('4 pound to nok');
    s('one hundred million years to seconds');
    s('gogle er best');
    s('google*');
    setTimeout(function() {
        s('!e typeof kaffe === "undefined" ? kaffe = 1 : ++kaffe;');
    },
    100);
}

setTimeout(function() {
    test();
},
500);

setTimeout(function() {
    doTest = true;
},
1000);

