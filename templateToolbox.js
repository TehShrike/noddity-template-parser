var Converter = require('pagedown').Converter
var converter = new Converter()

var rgxPostDivId = /noddity_post_(.+)_[\da-z]{12}4[\da-z]{19}/

function htmlify(post) {
	return (post.metadata.markdown !== false) ? converter.makeHtml(post.content) : post.content
}

function UUIDv4() {
	return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}

function generateId(postName) {
	return 'noddity_post_' + postName + '_' + UUIDv4()
}

function getPostName(id) {
	var result = rgxPostDivId.exec(id)
	if (result !== null) {
		return result[1]
	}
}

function isAPostDiv(id) {
	return rgxPostDivId.test(id)
}

function generatePostDiv(postId) {
	return '<span class="noddity-template" id="' + postId + '"></span>'
}

function getTemplateDataObject(pieces, parentDataObject) {
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

module.exports = {
	generateId: generateId,
	getPostName: getPostName,
	generatePostDiv: generatePostDiv,
	isAPostDiv: isAPostDiv,
	getTemplateDataObject: getTemplateDataObject,
	htmlify: htmlify
}
