var bot = require('./bot.js'),
irc = require('irc'),
client = new irc.Client('irc.efnet.org', 'hilde', {
    userName: 'tihihilde',
    realName: 'tihihilde',
    channels: ['#tihlde']
});

bot.start(client);

