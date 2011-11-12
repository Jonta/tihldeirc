var fs = require('fs'),
readline = require('readline');

var ignored, rl = readline.createInterface(process.stdin, process.stdout),
fname = 'evaled.json';

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

