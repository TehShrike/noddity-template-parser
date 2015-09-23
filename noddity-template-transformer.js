var stringTemplate = require('string-template/compile')
var getTemplateDataObject = require('./parse-template-arguments.js')
var uuid = require('random-uuid-v4')

var generatePostSpan = stringTemplate('<span class=\'noddity-template\' data-noddity-post-file-name=\'{0}\' data-noddity-template-arguments=\'{1}\' data-noddity-partial-name=\'{2}\'>{3}</span>')

function turnNoddityTemplatesIntoHtmlElements(html) {
	return html.replace(/<code[\s\S]+?<\/code|::(.+?)::/gm, function(match, templateText) {
		if (match.slice(0, 5) === '<code') {
			return match
		} else {
			var partialName = uuid()
			var pieces = templateText.split('|')
			var postName = pieces.shift()
			var templateObject = getTemplateDataObject(pieces)
			var templateArguments = JSON.stringify(templateObject)
			return generatePostSpan(postName, templateArguments, partialName, '{{>' + partialName + '}}')
		}
	})
}

module.exports = turnNoddityTemplatesIntoHtmlElements
