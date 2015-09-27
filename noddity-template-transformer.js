var getTemplateDataObject = require('./parse-template-arguments.js')
var execAll = require('regexp.execall')

function turnNoddityTemplatesIntoHtmlElements(html) {
	var result = []
	var finished = false
	var startSearchIndex = 0

	execAll(/<code>.+?<\/code>|::.+?::/, html).forEach(function (matches))
		var searchString = html.slice(startSearchIndex)
		var found = searchString.search()
		if (found === -1) {
			finished = true
		} else if (searchString[found] === ':') {
			if (found > startSearchIndex) {
				result.push({
					type: 'string',
					value: searchString.slice(0, found - 1) // not sure about the "- 1" bit
				})
			}
			var templateText = searchString.exec(/::([^:]+?)::/)
			var pieces = templateText.split('|')
			var filename = pieces.shift()
			var args = getTemplateDataObject(pieces)
			result.push({
				type:'template',
				filename: filaname,
				arguments: args
			})
		} else {
			searchString
		}
	}
	return html.replace(/<code[\s\S]+?<\/code|::(.+?)::/gm, function(match, templateText) {
		if (match.slice(0, 5) === '<code') {
			return match
		} else {
		}
	})
}

module.exports = turnNoddityTemplatesIntoHtmlElements
