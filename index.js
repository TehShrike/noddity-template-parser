var EventEmitter = require('events').EventEmitter
var Ractive = require('ractive')
var htmlify = require('./htmlify.js')
var turnNoddityTemplatesIntoHtmlElements = require('./noddity-template-tranformer.js')

module.exports = function (butler, linkifier) {
	return function (elementSelector, templateFileName) {
		var emitter = new EventEmitter()

		butler.getPost(templateFileName, function (err, post) {
			var html = htmlify(linkifier, post)

			html = turnNoddityTemplatesIntoHtmlElements(html)

			htmlToRactiveObjectsAtSomePointInTime(function () {
				emitter.emit('all descendants loaded')
			})

			var ractive = new Ractive({
				el: elementSelector,
				template: html
			})

			emitter.emit('THIS NEEDS A BETTER EVENT NAME GOES HERE', ractive)
		})

		return emitter
	}
}
