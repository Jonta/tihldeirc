var http = require('http'),
path = require('path');

exports.get = function(option, callback) {
    var data = '';
    url = url.split('/');
    http.get(option, function(res) {
        res.on('data', function(c) {
            data += c;
        });
        res.on('end', function() {
            callback(data);
        });
    });
};

