var EventEmitter = require('events').EventEmitter

var linkifier = new EventEmitter()
linkifier.linkify = function (a) { return a }

module.exports = linkifier
