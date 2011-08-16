var fs = require('fs'),
plugins = require('./plugins.js'),
winston = require('winston'),
listeners = {},
triggers = [],
self = this,
client;

require('colors');
winston.remove(winston.transports.Console);
winston.add(winston.transports.File, {
    filename: 'out.log'
});
winston.add(winston.transports.Console, {
    colorize: true
});

exports.triggers = triggers;

exports.start = function(c) {
    client = exports.client = c;
    plugins.watch();
    winston.add(function() {
        this.name = "eirikbLogger";
        this.log = function(level, msg, meta, callback) {
            client.say('eirikb', msg);
            callback(null, true);
        };
    });
};

exports.addListener = function(module, type, fn) {
    client.addListener(type, fn);
    if (!listeners[module]) {
        listeners[module] = [];
    }
    listeners[module].push({
        type: type,
        fn: fn
    });
    winston.info('[bot] Add listener from ' + module.replace(/^.*\//, '').green + ' (' + listeners[module].length + ')');
};

exports.removeListeners = function(module) {
    winston.info('[bot] removeListeners from ' + module.replace(/^.*\//, '').green + ' (' + listeners[module].length + ')');
    listeners[module].forEach(function(l) {
        winston.info('[bot] Remove listener ' + l);
        client.removeListener(l.type, l.fn);
    });
    delete listeners[module];
};

exports.onTrigger = function(module, name, triggerKeys, callback) { //
    triggerKeys = [].concat(triggerKeys).filter(function(tk) { 
        return tk !== undefined;
    });
    winston.info('[bot] Add Trigger ' + name + ' [' + triggerKeys + ']');
    triggers.push({
        name: name,
        triggerKeys: triggerKeys
    });
    triggerKeys.forEach(function(triggerKey) {
        self.addListener(module, 'message', function(from, to, msg) {
            var regexp = new RegExp('^\!(' + triggerKey + ' |' + triggerKey + '$)');
            if (msg.match(regexp)) {
                try {
                    callback(from, to, msg.replace(regexp, ''));
                } catch(e) {
                    winston.error('[bot] Trigger error for %s:', triggerKey, e);
                }
            }
        });
    });
};

