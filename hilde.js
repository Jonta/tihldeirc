var fs = require('fs'),
irc = require('irc');

var replyto, client, config, ignored, fname = 'evaled.json';

try {
    config = require('./config.json');
    client = new irc.Client(config.server, config.nick, config.extra);

    client.addListener('message', function(from, to, message) {
        replyto = to !== client.nick ? to: from;

        console.log(from + ' => ' + to + ': ' + message);
        if (message.match(/^e /) || to === client.nick) {
            boss(message.replace(/^e /, ''), function(e, result) {
                if (!e) {
                    client.say(replyto, result);
                } else {
                    client.say(from, e);
                }
            });
        }
    });
} catch(e) {
    console.err('Unable to start client', e);
}

setTimeout(function() {
    // Refer this to global object
    (function() {

        // Of all the hacks, this is the worst, but.. meh
        this.s = function(msg) {
            client && client.say(replyto, msg);
        };

        ignored = Object.keys(this);
        fs.readFile(fname, function(err, data) {
            var evaled;
            if (!err) {
                try {
                    evaled = JSON.parse(data);
                    Object.keys(evaled).forEach(function(key) {
                        try {
                            eval(key + '=' + evaled[key]);
                        } catch(e) {
                            this[key] = evaled[key];
                        }
                    });
                } catch(e) {}
            }
        });
    } ())
},
1)

function persist() {
    var evaled = Object.keys(this).filter(function(key) {
        return ignored.indexOf(key) < 0;
    }).reduce(function(o, key) {
        o[key] = '' + this[key];
        return o;
    },
    {});
    fs.writeFile(fname, JSON.stringify(evaled));
}

function boss(line, cb) {
    try {
        var e = eval(line);
        if (typeof e !== 'undefined') {
            persist();
            cb && cb(null, e);
        }
    } catch(e) {
        cb && cb(e);
    }
}

