var getTemplateDataObject = require('./parse-template-arguments.js')
var execAll = require('regexp.execall')

function turnNoddityTemplatesIntoHtmlElements(html) {
	var regex = /((?:<code>[\s\S]*?<\/code>|[\s\S])*?)(?:::(.+?)::|$)/g
	var results = execAll(regex, html).map(function (execResult) {
		var result = []
		if (execResult[1]) {
			result.push({
				type: 'string',
				value: execResult[1]
			})
		}
		if (execResult[2]) {
			var pieces = execResult[2].split('|')
			var filename = pieces.shift()
			var args = getTemplateDataObject(pieces)
			result.push({
				type: 'template',
				filename: filename,
				arguments: args
			})
		}
		return result
	})
	var flattenedResults = [].concat.apply([], results)
	return flattenedResults
}

module.exports = turnNoddityTemplatesIntoHtmlElements
