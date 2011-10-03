var bot = require('../bot.js'),
from = exports.from = {},
msg = exports.msg = [];

bot.addListener(__filename, 'message', function(f, t, m) {
    var bundle = {
        date: new Date(),
        from: f,
        to: t,
        msg: m
    };
    if (!from[f]) {
        from[f] = [];
    }
    from[f].unshift(bundle);
    msg.unshift(bundle);
});

bot.onTrigger(__filename, 'Seen', 'seen', function(f, to, msg) {
    if (from[msg]) {
        bot.client.say(to, 'Æ såg %s sist den %s me meldinga %s', msg, from[msg][0].date, from[msg][0].msg);
    }
});

bot.onTrigger(__filename, 'History regex master 2000', 'h', function(from, to, m) {
    var i;

    for (i = msg.length - 1; i >= 0; i--) {
        if (msg[i].msg.match(m)) {
            bot.client.say(to, msg[i].from + ': ' + msg[i].msg);
            break;
        }
    }
});

