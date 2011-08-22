var bot = require('./bot.js'),
irc = require('irc'),
client = new irc.Client('irc.efnet.org', 'hildemor', {
    userName: 'tihihilde',
    realName: 'tihihilde',
    channels: ['#testfrest']
});

bot.start(client);

