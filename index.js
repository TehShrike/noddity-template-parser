var htmlify = require('./htmlify.js')
var turnEmbeddedTemplatesIntoHtmlElements = require('./noddity-template-transformer.js')

module.exports = function (post, linkifier, options) {
	var html = options && options.convertToHtml === false ? post.content : htmlify(post)
	html = linkifier.linkify(html)
	html = turnEmbeddedTemplatesIntoHtmlElements(html)
	return html
}
