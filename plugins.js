var fs = require('fs'),
path = require('path'),
bot = require('bot.js'),
pluginFullPath = path.join('/', path.join(path.dirname(__filename), 'plugins/')),
plugins = {},
req = function(file) {
    console.log('Require plugin %s', file);
    try {
        return require(file);
    } catch(e) {
        console.log('Error while loading plugin %s:', file, e);
    }
    return null;
};

exports.watch = function() {
    console.log('Watching %s for plugins', pluginFullPath);
    fs.readdir(pluginFullPath, function(err, files) {
        files.forEach(function(file) {

            file = pluginFullPath + file;
            plugins[file] = req(file);

            fs.watchFile(file, function(current, previous) {
                if ( + current.mtime !== + previous.mtime) {
                    if (plugins[file]) {
                        bot.removeListeners(plugins[file]);
                        if (plugins[file].destruct) {
                            plugins[file].destruct();
                        }
                    }
                    delete require.cache[require.resolve(file)];
                    plugins[file] = req(file);
                }
            });
        });
    });
};

