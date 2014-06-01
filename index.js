var Ractive = require('ractive')
var toolbox = require('./templateToolbox.js')
var Converter = require('pagedown').Converter
var numberOfOccurrances = require('./numberOfOccurrances.js')

var converter = new Converter()

function htmlify(post) {
	return (post.metadata.markdown !== false) ? converter.makeHtml(post.content) : post.content
}

function getTemplateDataObject(parentDataObject, pieces) {
	var dataz = Object.create(parentDataObject)
	var unnamedParameters = 0

	pieces.forEach(function(piece) {
		var keyAndValue = piece.split('=')
		var key, value

		if (keyAndValue.length > 1) {
			key = keyAndValue[0]
			value = keyAndValue[1]
		} else {
			unnamedParameters++
			key = unnamedParameters
			value = keyAndValue[0]
		}

		dataz[key] = value
	})
	return dataz
}

function parseTemplate(parentDataObject, html) {
	var templateParsingResults = {
		elements: [],
		replaceTemplateElementWithHtml: function(documentHtml, elementId, templateHtml) {
			var spanText = toolbox.generatePostDiv(elementId)
			return documentHtml.replace(spanText, templateHtml)
		}
	}

	templateParsingResults.html = html.replace(/::([^:]+)::/gm, function(match, templateText, offset, wholeString) {
		var numberOfPrecedingCodeOpeners = numberOfOccurrances('<code', wholeString.substr(0, offset))
		var numberOfPrecedingCodeClosers = numberOfOccurrances('</code', wholeString.substr(0, offset))

		if (numberOfPrecedingCodeOpeners !== numberOfPrecedingCodeClosers) {
			return match
		} else {
			var parsedTemplate = {}

			var pieces = templateText.split('|')
			parsedTemplate.postName = pieces.shift(0)
			parsedTemplate.elementId = toolbox.generateId(parsedTemplate.postName)
			parsedTemplate.data = getTemplateDataObject(parentDataObject, pieces)

			templateParsingResults.elements.push(parsedTemplate)

			return toolbox.generatePostDiv(parsedTemplate.elementId)
		}
	})

	return templateParsingResults
}

function render(templateHtml, data, cb) {
	try {
		var html = new Ractive({
			el: null,
			data: data,
			template: templateHtml,
			preserveWhitespace: true
		}).toHTML()
		cb(null, html)
	} catch (err) {
		cb(err)
	}
}

function makeHtmlFromPostName(getPost, linkify, postName, data, cb) {
	getPost(postName, function(err, post) {
		if (err) {
			cb(err)
		} else {
			makeHtmlFromPost(getPost, linkify, post, data, cb)
		}
	})
}

function makeHtmlFromPost(getPost, linkify, post, data, cb) {
	var html = linkify(htmlify(post))
	var templatesFromHtml = parseTemplate(data, html)
	var templateContentsResolved = 0

	html = templatesFromHtml.html
	templatesFromHtml.elements.forEach(function(templateData) {
		makeHtmlFromPostName(getPost, linkify, templateData.postName, templateData.data, function(err, childHtml) {
			templateContentsResolved += 1
			if (err) {
				console.log(err.message)
			} else {
				html = templatesFromHtml.replaceTemplateElementWithHtml(html, templateData.elementId, childHtml)
			}
			if (templateContentsResolved === templatesFromHtml.elements.length) {
				render(html, templateData.data, cb)
			}
		})
	})
	if (templatesFromHtml.elements.length === 0) {
		render(html, data || {}, cb)
	}
}


module.exports = {
	makeHtmlFromPost: makeHtmlFromPost,
	makeHtmlFromPostName: makeHtmlFromPostName
}
