HILDE <3
-

To start developing you need  [node.js](http://nodejs.org) and [npm](http://npmjs.org).

Then all you need to do is:

    git clone git@github.com:tihlde/tihldeirc
    npm install

Eval is evil
--

This bot can only do one thing, and that is evil eval.  
It will store all variables (as much as it can), and reload them on startup.

Where be plugins?
--

There are no plugins, the point of this bot is to program it from IRC directly!

Usage
--
Some functions built into the bot.  
Note that these are called from IRC (channel, or pm to bot).  
Current trigger key: *e*

on
---

    on = function(trigger, callback, replaceTrigger);

trigger is RegExp and will match on every incoming message.  
callback will be called if trigger match.  
If replaceTrigger is set to true it will replace trigger with '' in message.  
Example:

    e on(/^world /, function(f,t,m) { say(f, 'said', m) }, true)
    e on(/^hello/, function(f,t,m) { say(m, ', world!') })

All triggers are stored in _this.listeners_. If removed they will not reappear on reload. Example:

    e listeners = listeners.filter(function(l) { return l !== /^hello/ })

or

    e listeners.map(function(l) { return l.trigger })
    e listeners.splice(2)

s
---

    say = function() { client.say(replyto, arguments) }

This function will post everything it was given to the last place it was called from. NOTE that replyto changes all the time so this might not behave as expected.  
Example:

    e say('Hello', ', world!', new Date(), 1337)

to
---

    to = function(to) { client.say(to, arguments) }

Same as _say_, but can define who to send message to.  
Example:

    e to('eirikb', 'Dude, this is',  'madness!'.toUpperCase())

req
---

    req = function(key, name)

This is a workaround for autoloading modules on start.  
It will try to require a module with name _name_ and assign it to _this[key]_.  
Example:

    e req('$', 'jquery')

It will also require it when called

Interesting arrays
--

_this.listeners_ = Triggers that will be injected on load, appended by _on_-function.  
_this.reqs_ = All modules that will be required on load, appended by _r_-function.  
_this.onload_ = All normal functions that should be run on load, annotated with string-name of function, appended to manually.  

Note
--

Lots of hacks have been made, not that functions are located in the json by the fact that they are strings, and start with "function" (this can be made even more obscure, but it will not remove the fact of the hack). channels-option is not used, and channels are rather specified outside the normal config (meta), this because onload need to be ran after all channels are joined, and to know about this channels must be joined manually (it seems)...
