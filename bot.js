var jerk = require('jerk'),
options = {
	server: 'irc.homelien.no',
	nick: 'hilde',
	channels: ['#tihlde']
};

jerk(function(j) {
	j.watch_for('lett', function(message) {
		message.say('Like a boss');
	});
}).connect(options);
