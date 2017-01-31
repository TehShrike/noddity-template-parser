var htmlify = require('./htmlify.js')
var turnContentIntoAnArrayOfObjects = require('./noddity-template-transformer.js')

module.exports = function(post, linkifier, options) {
	var convertToHtml = post.metadata.markdown !== false

	if (options && options.convertToHtml === false) {
		convertToHtml = false
	}

	var linkifiedContent = linkifier.linkify(post.content)
	var html = convertToHtml ? htmlify(linkifiedContent) : linkifiedContent
	return turnContentIntoAnArrayOfObjects(html)
}
