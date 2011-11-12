var fs = require('fs'),
readline = require('readline');

var ignored, rl = readline.createInterface(process.stdin, process.stdout),
fname = 'evaled.json';

setTimeout(function() { (function() {
        ignored = Object.keys(this);
    })();
    load(function () {
        onLine('a')
        onLine('a="test"');
    });
},
1000);

function load(cb) {
    fs.readFile(fname, function(err, data) {
        var evaled;

        if (err) console.error(err)
        else {
            console.log('data', data.toString());
            try {
                evaled = JSON.parse(data);
                Object.keys(evaled).forEach(function(key) {
                    try {
                        eval(key + '=' + evaled[key]);
                    } catch (e) {
                        this[key] = evaled[key];
                    }
                });
            } catch(e) {
                console.error(e);
            }
        }
    cb && cb();
    });
}

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

function onLine(line) {
    try {
        var e = eval(line);
        if (typeof e !== 'undefined') {
            console.log(e);
            persist();
        }
    } catch(e) {
        console.log('error', e);
    }
}

rl.on('line', function(line) {
    onLine(line);
});

