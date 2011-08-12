var bot = require('bot.js'),
history = require('./history.js'),
regex = /\bs\/([^\/]+)\/([^\/]+)/;

function calcWord(a, b) {
    var count = 0,
    i;
    for (i = 0; i < a.length; i++) {
        if (b.indexOf(a[i]) >= 0) {
            count++;
        }
    }
    return count;
}

bot.addListener(__filename, 'message', function(from, to, msg) {
    var last, fixed, word;
    if (msg.match(/^s\//)) {
        fixed = history.from[from][1].msg.replace(msg.match(regex)[1], msg.match(regex)[2]);
        bot.client.say(to, from + ': ' + fixed);
    }
    if (msg.match(/^\w*\*$/)) {
        word = '';
        msg = msg.replace(/\*/, '');
        last = history.from[from][1].msg;
        last.split(' ').forEach(function(w) {
            if (calcWord(w, msg) > calcWord(w, word)) {
                word = w;
            }
        });
        bot.client.say(to, from + ': ' + last.replace(word, msg));
    }
});

