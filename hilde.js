var fs = require('fs'),
readline = require('readline'),
irc = require('irc');

var client, config, ignored, fname = 'evaled.json',
rl = readline.createInterface(process.stdin, process.stdout);

try {
    config = require('./config.json');
    console.log(config);
    client = new irc.Client(config.server, config.nick, config.extra);
    client.addListener('message', function(from, to, message) {
        console.log(from + ' => ' + to + ': ' + message);
        if (message.match(/^e /) || client.nick === to) {
            boss(message.replace(/^e /, ''), function(e, result) {
                if (!e) {
                    client.say(to !== client.nick ? to: from, result);
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

rl.on('line', function(line) {
    boss(line, function(err, result) {
        console.log(err, result);
    });
});

