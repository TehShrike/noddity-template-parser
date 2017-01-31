var htmlify = require('./htmlify.js')
var turnContentIntoAnArrayOfObjects = require('./noddity-template-transformer.js')

module.exports = function(post, linkifier, options) {
	var convertToHtml = true

	if (options && options.convertToHtml === false) {
		convertToHtml = false
	}

	var html = convertToHtml ? htmlify(post, linkifier.linkify) : linkifier.linkify(post.content)
	return turnContentIntoAnArrayOfObjects(html)
}
