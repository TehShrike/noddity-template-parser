var stringTemplate = require('string-template/compile')

var generatePostSpan = stringTemplate('<span class="noddity-template" data-noddity-post-file-name="{0}" data-noddity-template-arguments="{1}"></span>')

function getTemplateDataObject(pieces) {
	var unnamedParameters = 0

	return pieces.reduce(function(memo, piece) {
		var keyAndValue = piece.split('=').slice(0, 2)
		var value = keyAndValue.pop()
		var key = keyAndValue.pop() || ++unnamedParameters

		memo[key] = value
		return memo
	})
}

function turnNoddityTemplatesIntoHtmlElements(html) {
	return html.replace(/::(.+?)::/gm, function(match, templateText, offset, wholeString) {
		var numberOfPrecedingCodeOpeners = numberOfOccurrences('<code', wholeString.substr(0, offset))
		var numberOfPrecedingCodeClosers = numberOfOccurrences('</code', wholeString.substr(0, offset))

		if (numberOfPrecedingCodeOpeners !== numberOfPrecedingCodeClosers) {
			return match
		} else {
			var pieces = templateText.split('|')
			var postName = pieces.shift()
			var templateArguments = getTemplateDataObject(pieces)

			return generatePostSpan(postName, templateArguments)
		}
	})
}

module.exports = turnNoddityTemplatesIntoHtmlElements
