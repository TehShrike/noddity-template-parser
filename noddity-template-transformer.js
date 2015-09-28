var getTemplateDataObject = require('./parse-template-arguments.js')
var execAll = require('regexp.execall')

function turnNoddityTemplatesIntoHtmlElements(html) {
	var regex = /((?:<code>[\s\S]*?<\/code>|[\s\S])*?)(?:::(.+?)::|$)/g
	return execAll(regex, html).reduce(function (memo, execResult) {
		if (execResult[1]) {
			memo.push({
				type: 'string',
				value: execResult[1]
			})
		}
		if (execResult[2]) {
			var pieces = execResult[2].split('|')
			var filename = pieces.shift()
			var args = getTemplateDataObject(pieces)
			memo.push({
				type: 'template',
				filename: filename,
				arguments: args
			})
		}
		return memo
	}, [])
}

module.exports = turnNoddityTemplatesIntoHtmlElements
