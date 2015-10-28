var getTemplateDataObject = require('./parse-template-arguments.js')
var execAll = require('regexp.execall')

var charactersToEscape = /[\{\}]/g
var codeBlocks = /<code>[\s\S]*?<\/code>/g

module.exports = function turnNoddityTemplatesIntoHtmlElements(html) {
	var regex = /((?:<code>[\s\S]*?<\/code>|[\s\S])*?)(?:::(.+?)::|$)/g
	return execAll(regex, html).reduce(function(memo, execResult) {
		var regularTemplateBit = execResult[1]
		var embeddedTemplateReference = execResult[2]

		if (regularTemplateBit) {
			memo.push({
				type: 'string',
				value: escapeCharactersInCodeBlocks(regularTemplateBit, charactersToEscape)
			})
		}
		if (embeddedTemplateReference) {
			var pieces = embeddedTemplateReference.split('|')
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



function escapeCharactersInCodeBlocks(str, regex) {
	return str.replace(codeBlocks, function(match) {
		return match.replace(regex, function(match) {
			return '&#' + match.charCodeAt() + ';'
		})
	})
}
