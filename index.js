var htmlify = require('./htmlify.js')
var turnContentIntoAnArrayOfObjects = require('./noddity-template-transformer.js')

module.exports = function(post, linkifier, options) {
	var convertToHtml = post.metadata.markdown !== false

	if (options && options.convertToHtml === false) {
		convertToHtml = false
	}

	var html = convertToHtml ? htmlify(linkifier.linkify(post.content)) : linkifier.linkify(post.content)
	return turnContentIntoAnArrayOfObjects(html)
}
