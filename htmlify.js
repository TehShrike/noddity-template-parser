var Remarkable = require('remarkable')
var decode = require('ent/decode')

var md = new Remarkable('full', {
	html: true,
	linkify: true
})

module.exports = function htmlify(post) {
	var convertToHtml = post.metadata.markdown !== false
	var content = convertToHtml ? decodeRactiveExpressions(md.render(post.content)) : post.content
	return content
}

function decodeRactiveExpressions(html) {
	return html.replace(/\{\{(.+)\}\}/g, function(m, content) {
		return '{{' + decode(content) + '}}'
	})
}
