var htmlify = require('./htmlify.js')
var turnContentIntoAnArrayOfObjects = require('./noddity-template-transformer.js')

module.exports = function (post, linkifier, options) {
	var html = options && options.convertToHtml === false ? post.content : htmlify(post)
	html = linkifier.linkify(html)
	return turnContentIntoAnArrayOfObjects(html)
}
