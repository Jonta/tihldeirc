var bot = require('./bot.js'),
irc = require('irc'),
http = require('http'),
fs = require('fs'),
client = new irc.Client('irc.homelien.no', 'hilde', {
    userName: 'tihihilde',
    realName: 'tihihilde',
    channels: ['#tihlde']
});

bot.start(client);

http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-type': 'text/plain'
    });
    res.end(fs.readFileSync('out.log'));
}).listen(8080);

