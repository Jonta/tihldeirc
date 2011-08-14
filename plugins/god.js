var bot = require('bot.js'),
t = require('./translate.js'),
g = require('./get.js'),
$ = require('jquery'),
_ = require('underscore'),
fs = require('fs'),
winston = require('winston');

var first = true,
say = function(msg) {
    bot.client.say(currentTo, msg);
},
s = say,
currentTo,
ignoreKeys;

function loadKaffe(self) {
    ignoreKeys = Object.keys(self);
    try {
        data = fs.readFileSync('kaffe.json');
        if (data) {
            data = JSON.parse(data);
            Object.keys(data).forEach(function(key) {
                self[key] = data[key];
            });
        }
    } catch(e) {
        winston.error('[god] ' + e.toString());
    }
}

function storeKaffe(self) {
    var obj = {};
    try  {
        Object.keys(self).filter(function(key) {
            return ignoreKeys.indexOf(key) < 0;
        }).forEach(function(key) {
            obj[key] = self[key];
        });
        fs.writeFileSync('kaffe.json', JSON.stringify(obj));
    } catch(e) {
        winston.error('[god] ' + e.toString());
    }
}

bot.onTrigger(__filename, 'Godmode', ['e', 'meh', 'god'], function(from, to, msg) {
    if (first) {
        loadKaffe(this);
        first = false;
    }
    try {
        winston.info(from.yellow + ' is trying to run ' + msg.yellow);
        currentTo = to;
        var e = eval(msg);
        if (typeof e !== 'undefined') {
            storeKaffe(this);
            bot.client.say(to, e);
        }
    } catch(err) {
        winston.error('[god] ' + err.toString());
    }
});

