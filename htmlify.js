var Remarkable = require('remarkable')

var md = new Remarkable('full', {
	html: true,
	linkify: true
})

module.exports = function htmlify(linkifier, post) {
	var convertToHtml = post.metadata.markdown !== false
	var content = convertToHtml ? md.render(post.content) : post.content
	return linkifier.linkify(content)
}
