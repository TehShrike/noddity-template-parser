var toolbox = require('./templateToolbox')
var numberOfOccurrances = require('./numberOfOccurrances')
var EventEmitter = require('events').EventEmitter
var extend = require('xtend')

function makeNewMixinObject() {
	return Object.create(new EventEmitter())
}

function getTemplateDataObject(parentDataObject, pieces) {
	var dataz = extend({}, parentDataObject)
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

function parseTemplate(mixin) {
	var parentDataObject = extend(mixin.rootData, mixin.data, mixin.ractive ? mixin.ractive.get() : {})

	mixin.templateElements = []

	mixin.html = mixin.html.replace(/::(.+?)::/gm, function(match, templateText, offset, wholeString) {
		var numberOfPrecedingCodeOpeners = numberOfOccurrances('<code', wholeString.substr(0, offset))
		var numberOfPrecedingCodeClosers = numberOfOccurrances('</code', wholeString.substr(0, offset))

		if (numberOfPrecedingCodeOpeners !== numberOfPrecedingCodeClosers) {
			return match
		} else {
			var parsedTemplate = makeNewMixinObject()

			var pieces = templateText.split('|')
			parsedTemplate.postName = pieces.shift(0)
			parsedTemplate.elementId = toolbox.generateId(parsedTemplate.postName)
			parsedTemplate.data = getTemplateDataObject(parentDataObject, pieces)

			mixin.templateElements.push(parsedTemplate)

			return toolbox.generatePostDiv(parsedTemplate.elementId)
		}
	})

	return mixin
}

module.exports = parseTemplate
