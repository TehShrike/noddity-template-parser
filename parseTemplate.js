var toolbox = require('./toolbox')
var numberOfOccurrances = require('./numberOfOccurrances')

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

module.exports = parseTemplate
