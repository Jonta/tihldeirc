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

There are no plugins, the point of this bot is to program it from IRC directly, like a boss!

Usage
--
The bot will eval every pm message, and every channel message that starts with a <code>.</code>

on
---

    on = function(trigger, callback, replaceTrigger);

trigger is RegExp and will match on every incoming message.  
callback will be called if trigger match.  
If no trigger is specified it listens to all messages.  
If replaceTrigger is set to true it will replace trigger with '' in message.  
Example:

    .on(/^world /, function(f,t,m) { say(f, 'said', m) }, true)
    .on(/^hello/, function(f,t,m) { say(m, ', world!') })
    .on(function(f,t,m){if (f.match(/eirikb/)){say('eirikb: ssshh') }})

All triggers are stored in _this.listeners_. To view all triggers to this:

    .listeners.map(function(l){return l.trigger})

off
---

Remove listeners, takes either regex, index of no argument.  
Regex will search for all similar regex triggers in listeners and remove them.  
Index will remove a given index.  
No argument will remove the last listener.  
Example:  

    .off(/^calc /)
    .off(4)
    .off()

say
---

    say = function() { client.say(replyto, arguments) }

This function will post everything it was given to the last place it was called from. NOTE that replyto changes all the time so this might not behave as expected.  
Example:

    .say('Hello', ', world!', new Date(), 1337)

to
---

    to = function(to) { client.say(to, arguments) }

Same as _say_, but can define who to send message to.  
Example:

    .to('eirikb', 'Dude, this is',  'madness!'.toUpperCase())

onload
---

Used to push strings that will be run on startup, like this:

    .onload.push('util = require("util")')
    .onload.push('runMe()')

Interesting arrays
--

_this.listeners_ = Triggers that will be injected on load, appended by _on_-function.  
_this.onload_ = Array of strings that will be evil evaled on startup
All normal functions that should be run on load, annotated with string-name of function, appended to manually.  

Note
--

Lots of hacks have been made, note that functions are located in the json by the fact that they are strings, and start with "function" (this can be made even more obscure, but it will not remove the fact of the hack). channels-option is not used, and channels are rather specified outside the normal config (meta), this because onload need to be ran after all channels are joined, and to know about this channels must be joined manually (it seems)...
