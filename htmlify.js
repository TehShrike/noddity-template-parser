var Remarkable = require('remarkable')
var decode = require('ent/decode')

var md = new Remarkable('full', {
	html: true,
	linkify: true
}).use(function(remarkable) {
	remarkable.renderer.rules.heading_open = function(tokens, idx) {
		var hLevel = tokens[idx].hLevel
		var slug = slugify(tokens[idx + 1].content)
		return '<a class="anchor" href="#' + slug + '"><h' + hLevel + ' id="' + slug + '">'
	}
	remarkable.renderer.rules.heading_close = function (tokens, idx) {
		var hLevel = tokens[idx].hLevel
		return '</h' + hLevel + '></a>\n'
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
