var fs = require('fs'),
irc = require('irc');

var replyto, client, config, ignored, fname = 'evaled.json';

var readline = require('readline'),
rl = readline.createInterface(process.stdin, process.stdout);

function traverse(o, cb) {
    if (Array.isArray(o)) {
        return o.map(function(e, i) {
            return traverse(e, cb);
        });
    } else if (typeof o === 'object') {
        return Object.keys(o).reduce(function(o2, key) {
            o2[key] = traverse(o[key], cb);
            return o2;
        },
        {});
    } else {
        return cb(o);
    }
}

function toJSON(o) {
    o = traverse(o, function(o) {
        if (typeof o === 'function') {
            return '' + o;
        }
        return o;
    });
    return JSON.stringify(o);
}

function fromJSON(json) {
    var data = traverse(JSON.parse(json), function(o) {
        if (typeof o === 'string') {
            try {
                return eval('temphack2000=' + o);
            } catch(e) {}
        }
        return o;
    });
    delete evaled.temphack2000;
    return data;
}

function keys() {
    return Object.keys(this).filter(function(key) {
        return ignored.indexOf(key) < 0;
    });
}

rl.on('line', function(line) {
    boss(line, function(e, r) {
        if (e) {
            console.log(e);
        } else {
            console.log(r)
        }
    });
});

try {
    config = require('./config.json');
    /*
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
    */
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

        this.m = function(listener) {
            this.listeners.push(listener);
            //client.on('message', listener);
            persist();
        };

        ignored = Object.keys(this);

        if (typeof this.listeners === 'undefined') {
            this.listeners = [];
        }

        fs.readFile(fname, function(err, data) {
            var evaled;
            if (!err) {
                try {
                    evaled = fromJSON(data);
                    Object.keys(evaled).forEach(function(key) {
                        this[key] = evaled[key];
                    });
                } catch(e) {}
            }
            /*
            if (Array.isArray(this.listeners)) {
                this.listeners.forEach(function(listener) {
                    console.log('ADD LISTENER', listener);
                    //client.on('message', listener);
                });
            }
            */
        });
    } ())
},
1)

function persist() {
    var evaled = keys().reduce(function(o, key) {
        o[key] = this[key];
        return o;
    },
    {});
    fs.writeFile(fname, toJSON(evaled));
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

