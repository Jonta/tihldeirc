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

bot.onTrigger(__filename, 'Seen', 'seen', function(from, to, msg) {
    if (from[msg]) {
        bot.client.say(to, 'Æ såg %s sist den %s me meldinga %s', msg, from[msg][0].date, from[msg][0].msg);
    }
});

