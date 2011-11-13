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

API
--
Some functions built into the bot

on
---

    on = function(trigger, callback, replaceTrigger);

trigger is RegExp and will match on every incoming message.  
callback will be called if trigger match.  
If replaceTrigger is set to true it will replace trigger with '' in message.  
Example:

    on(/^world /, function(f,t,m) { s(f, 'said', m) }, true)
    on(/^hello/, function(f,t,m) { s(m, ', world!') })

All triggers are stored in _this.listeners_. If removed they will not reappear on reload. Example:

    listeners = listeners.filter(function(l) { return l !== /^hello/ })

or

    listeners.map(function(l) { return l.trigger })
    listeners.splice(2)

s
---

    s = function() { client.say(replyto, arguments) }

This function will post everything it was given to the last place it was called from. NOTE that replyto changes all the time so this might not behave as expected.  
Example:

    s('Hello', ', world!', new Date(), 1337)

to
---

    to = function(to) { client.say(to, arguments) }

Same as _s_, but can define who to send message to
