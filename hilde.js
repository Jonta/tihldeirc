// Disclmer: This whole thing is one big hack, and I love it
var fs = require('fs'),
irc = require('irc'),
http = require('http'),
url = require('url');

var replyto, client, config, ignored, fname = 'evaled.json',
actuallisteners = [];

http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    var q = url.parse(req.url, true).query;
    if (q.q) {
        boss(q.q, function(e, result) {
            res.end('' + (e ? e: result));
        });
    } else {
        res.end('meh');
    }
}).listen(3000);

function traverse(o, cb) {
    if (Array.isArray(o)) {
        return o.map(function(e, i) {
            return traverse(e, cb);
        });
    } else if (typeof o === 'object') {
        if (('' + o).match(/^\/.*\/$/)) {
            return '' + o;
        }

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
            if (o.match(/^function/)) {
                try {
                    return eval('temphack2000=' + o);
                } catch(e) {}
            } else if (o.match(/^\/.*\/$/)) {
                return eval(o);
            }
        }
        return o;
    });
    delete temphack2000;
    return data;
}

function keys() {
    return Object.keys(this).filter(function(key) {
        return ignored.indexOf(key) < 0;
    });
}

function addListener(listener) {
    var f = function(f, t, m) {
        if (!listener.trigger) {
            listener.listener(f, t, m);
        } else if (m.match(listener.trigger)) {
            if (listener.replace) {
                m = m.replace(listener.trigger, '');
            }
            try {
                listener.listener(f, t, m);
            } catch(e) {
                console.error(e);
            }
        }
    };
    actuallisteners.push(f);
    client.on('message', f);
}

try {
    config = require('./config.json');
    client = new irc.Client(config.server, config.nick, config.extra);
    client.connect(function() {
        var i = 0;
        config.meta.channels.forEach(function(c) {
            client.join(c, function() {
                if (++i === config.meta.channels.length) {
                    if (Array.isArray(onload)) {
                        onload.forEach(function(l) {
                            boss(l);
                        });
                    }
                }
            });
        });
    });

    client.addListener('message', function(from, to, message) {
        replyto = to !== client.nick ? to: from;

        console.log(from + ' => ' + to + ': ' + message);
        if ((message.match(/^\./) && ! message.match(/^\.\./)) || to === client.nick) {
            boss(message.replace(/^\./, ''), function(e, result) {
                if (!e) {
                    if (typeof result !== 'undefined') {
                        var r = ('' + result).split(/\n/).join(' ').slice(0, 300);
                        if (r.length < 150) {
                            client.say(replyto, r);
                        } else {
                            client.say(from, r);
                        }
                    }
                } else {
                    client.say(from, e);
                }
            });
        }
    });

    // Catch all errors like a boss
    client.on('error', function(e) {
        console.error(e);
    });
} catch(e) {
    console.error('Unable to start client', e);
}

setTimeout(function() {
    // Refer this to global object
    (function() {
        // Of all the hacks this is probably the worst
        this.say = function() {
            var msg = [].slice.apply(arguments).join(' ');
            client && client.say(replyto, msg);
        };

        this.to = function(to) {
            var msg = [].slice.apply(arguments).filter(function(e, i) {
                return i > 0;
            }).join(' ');
            client && client.say(to, msg);
        };

        this.on = function(trigger, listener, replace) {
            if (arguments.length === 1) {
                listener = trigger;
            }
            listener = {
                trigger: trigger,
                listener: listener,
                replace: replace
            };
            listeners.push(listener);
            addListener(listener);
            persist();
            say('Added listener');
        };

        this.off = function(regexOrIndex) {
            var count = listeners.length,
            toremove = [];

            if (arguments.length === 0) {
                regexOrIndex = listeners.length - 1;
            }
            if (typeof regexOrIndex === 'number') {
                listeners.splice(regexOrIndex, 1);
                toremove.push(regexOrIndex)
            } else {
                listeners = listeners.filter(function(l, i) {
                    console.log(l.trigger, regexOrIndex);
                    if ('' + l.trigger === '' + regexOrIndex) {
                        toremove.push(i);
                        return false;
                    }
                    return true;
                });

            }
            actuallisteners = actuallisteners.filter(function(al, i) {
                if (toremove.indexOf(i) >= 0) {
                    console.log(i, l.trigger, al)
                    client.removeListener('message', al);
                    return false;
                }
                return true;
            });
            if (listeners.length < count) {
                say('Removed', count - listeners.length, 'listeners');
            }
        };

        ignored = Object.keys(this);

        if (typeof this.listeners === 'undefined') {
            this.listeners = [];
        }
        if (typeof this.onload === 'undefined') {
            this.onload = [];
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
            if (Array.isArray(this.listeners)) {
                this.listeners.forEach(function(listener) {
                    addListener(listener);
                });
            }
        });
    } ());
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
    var e;
    try {
        e = eval(line);
        if (typeof e !== 'undefined') {
            persist();
        }
        cb && cb(null, e);
    } catch(err) {
        cb && cb(err);
    }
}

