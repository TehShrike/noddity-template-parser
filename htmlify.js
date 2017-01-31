var Remarkable = require('remarkable')
var decode = require('ent/decode')

var md = new Remarkable('full', {
	html: true,
	linkify: true
}).use(function(remarkable) {
	remarkable.renderer.rules.heading_open = function(tokens, idx) {
		var hLevel = tokens[idx].hLevel
		var slug = slugify(tokens[idx + 1].content)
		return '<h' + hLevel + ' id="' + slug + '">'
	}
})

function slugify(str) {
	return str.split(/\W+/).filter(function(w) {
		return w
	}).join('-').toLowerCase()
}

module.exports = function htmlify(content) {
	return decodeRactiveExpressions(md.render(content))
}

function decodeRactiveExpressions(html) {
	return html.replace(/\{\{(.+?)\}\}/g, function(m, content) {
		return '{{' + decode(content) + '}}'
	})
}
