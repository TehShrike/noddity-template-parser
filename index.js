var EventEmitter = require('events').EventEmitter
var Ractive = require('ractive')
var htmlify = require('./htmlify.js')
var turnEmbeddedTemplatesIntoHtmlElements = require('./noddity-template-tranformer.js')

module.exports = function (post, linkifier) {
	var html = htmlify(post)
	html = linkifier.linkify(html)
	html = turnEmbeddedTemplatesIntoHtmlElements(html)
	return html
}
