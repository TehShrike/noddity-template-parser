var EventEmitter = require('events').EventEmitter

var linkifier = new EventEmitter()
linkifier.linkify = function (a) { return a.replace(/.../g, '!!!') }

module.exports = linkifier
