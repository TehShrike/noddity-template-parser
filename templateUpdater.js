var Ractive = require('ractive')
var EventEmitter = require('events').EventEmitter
var toolbox = require('./templateToolbox.js')
var Converter = require('pagedown').Converter
var numberOfOccurrances = require('./numberOfOccurrances.js')

var converter = new Converter()

function htmlify(post) {
	return (post.metadata.markdown !== false) ? converter.makeHtml(post.content) : post.content
}

function templatify(butler, linkify, returnHtmlString, html, parentDataObject) {
	var children = []
	var numberOfChildren = 0
	var numberOfResponses = 0
	var emitter = new EventEmitter()

	html = html.replace(/::([^:]+)::/gm, function(match, templateText, offset, wholeString) {
		var numberOfPrecedingCodeOpeners = numberOfOccurrances('<code', wholeString.substr(0, offset))
		var numberOfPrecedingCodeClosers = numberOfOccurrances('</code', wholeString.substr(0, offset))

		if (numberOfPrecedingCodeOpeners !== numberOfPrecedingCodeClosers) {
			return match
		} else {
			numberOfChildren = numberOfChildren + 1
			var pieces = templateText.split('|')
			var postName = pieces.shift(0)
			var elementId = toolbox.generateId(postName)
			var spanElement = toolbox.generatePostDiv(elementId)
			var data = toolbox.getTemplateDataObject(pieces, parentDataObject)

			var element = null
			var cb = null
			if (returnHtmlString) {
				cb = function(err, html) {
					numberOfResponses = numberOfResponses + 1
					if (err) {
						console.log("Error getting back post", postName, err)
					} else {
						emitter.emit('post comes back', spanElement, html, numberOfResponses === numberOfChildren)
					}
				}
			} else {
				element = ('#' + elementId)
			}
			children.push(templateUpdater(butler, linkify, data, postName, cb, element))

			return spanElement
		}
	})

	emitter.once('teardown', function() {
		children.forEach(function() {
			emitter.emit('teardown')
		})
	})

	emitter.anyTemplatesWereReplaced = numberOfChildren > 0
	emitter.html = html

	return emitter
}

function templateUpdater(butler, linkify, data, filename, cb, element) {
	var emitter = new EventEmitter()

	butler.getPost(filename, function(err, post) {
		if (err) {
			if (typeof cb === 'function') {
				cb(err)
			} else {
				console.log(err)
			}
		} else {
			// get the html version
			var html = linkify(htmlify(post))
			var returnHtmlString = !element

			// replace templates with <span> elements
			var templateReplacementResults = templatify(butler, linkify, returnHtmlString, html, data)
			html = templateReplacementResults.html

			if (element) {
				var ractive = new Ractive({
					el: element,
					data: data,
					template: html
				})

				emitter.once('teardown', function() {
					ractive.teardown()
					templateReplacementResults.emit('teardown')
				})

				if (typeof cb === 'function') {
					cb(null, ractive)
				}
			} else {
				emitter.once('teardown', function() {
					templateReplacementResults.emit('teardown')
				})

				if (templateReplacementResults.anyTemplatesWereReplaced) {
					templateReplacementResults.on('post comes back', function updateHtml(spanHtml, templateContents, wasTheLastOne) {
						html = html.replace(spanHtml, templateContents)
						if (wasTheLastOne) {
							cb(null, html)
						}
					})
				} else {
					cb(null, html)
				}
			}
		}
	})

	return emitter
}

module.exports = templateUpdater
