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
            }, {});
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
            return eval('temphack2000='+o);
            } catch (e) {}
        }
            return o;
    });
    return data;
}

var t = toJSON({test: function(){console.log('Real test!')},a:'a',b:1337,z:function(){console.log('LOL!')},
c: {d: {e: 14.5, f: [1,2, {g: { h: 9, i: function() { return 'lol'}}}]}}});
console.log(t);
var f = fromJSON(t);
console.log(require('util').inspect(f, true, null));
f.test();
console.log(f.c.d.f[2].g.i());
f.z();



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

/*
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
                    evaled = JSON.parse(data);
                    Object.keys(evaled).forEach(function(key) {
                        try {
                            eval(key + '=' + evaled[key]);
                            console.log('- - -', key, '=', evaled[key]);
                            console.log(typeof this[key]);
                            console.log(Array.isArray(this[key]));
                        } catch(e) {
                            console.log(e);
                            this[key] = evaled[key];
                        }
                    });
                } catch(e) {}
            }
            if (Array.isArray(this.listeners)) {
            this.listeners.forEach(function(listener) {
                console.log('ADD LISTENER', listener);
                //client.on('message', listener);
            });
            }
            persist();
        });
    } ())
},
1)
*/

function persist() {
            var evaled = Object.keys(this).filter(function(key) {
                return ignored.indexOf(key) < 0;
            }).reduce(function(o, key) {
                o[key] = hackify(this[key]);
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

