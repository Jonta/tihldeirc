var bot = require('bot.js'),
t = require('./translate.js'),
g = require('./get.js'),
$ = require('jquery'),
_ = require('underscore');

var currentTo, say = function(msg) {
    bot.client.say(currentTo, msg);
},
s = say;

bot.onTrigger(__filename, 'Godmode', ['e', 'meh', 'god'], function(from, to, msg) {
    try {
        console.log('%s is trying to run %s...', from, msg);
        currentTo = to;
        var e = eval(msg);
        if (typeof e !== 'undefined') {
            bot.client.say(to, e);
        }
    } catch(err) {
        console.log(err);
    }
});

