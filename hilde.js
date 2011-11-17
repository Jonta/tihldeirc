var fs = require('fs'),
irc = require('irc');

var replyto, client, config, ignored, fname = 'evaled.json';

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
    client.on('message', function(f, t, m) {
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
    });
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
                            this[l]();
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
            boss(message.replace(/^\. /, ''), function(e, result) {
                if (!e) {
                    var r = ('' + result).split(/\n/).join(' ').slice(0, 300);
                    if (r.length < 150) {
                        client.say(replyto, r);
                    } else {
                        client.say(from, r);
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
        // Of all the hacks, this is the worst, but.. meh
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
            listener = {
                trigger: trigger,
                listener: listener,
                replace: replace
            };
            listeners.push(listener);
            addListener(listener);
            persist();
        };

        this.req = function(key, name) {
            reqs.push({
                key: key,
                name: name
            });
            return require(name);
        };

        ignored = Object.keys(this);

        if (typeof this.reqs === 'undefined') {
            this.reqs = [];
        }
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
            if (Array.isArray(this.reqs)) {
                this.reqs.forEach(function(r) {
                    this[r.key]  = require(r.name);
                });
            }
            if (Array.isArray(this.listeners)) {
                this.listeners.forEach(function(listener) {
                    addListener(listener);
                });
            }
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

