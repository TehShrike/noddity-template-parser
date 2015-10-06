var test = require('tape')
var htmlify = require('../htmlify.js')

test('Respects post.metadata.markdown field', function (t) {
	var originalContent = 'Post content.\n\nMore post content.'

	var post1 = { content: originalContent, metadata: { markdown: false } }
	var content1 = htmlify(post1)
	t.equal(content1, originalContent, 'Does not turn content into HTML when markdown = false')

	var post2 = { content: originalContent, metadata: {} }
	var content2 = htmlify(post2)
	t.equal(content2.match(/<p>/g).length, 2, 'Turns content into HTML when markdown = undefined')

	var post3 = { content: originalContent, metadata: { markdown: true } }
	var content3 = htmlify(post3)
	t.equal(content3.match(/<p>/g).length, 2, 'Turns content into HTML when markdown = true')

	t.end()
})

test('Doesn\'t replace entities inside of Ractive expressions', function(t) {
	function html(content) {
		return htmlify({ content: content, metadata: { markdown: true }})
	}

	t.equal(html('< {{>}}'), '<p>&lt; {{>}}</p>\n')
	t.equal(html('"sup" {{"sup"}}'), '<p>&quot;sup&quot; {{"sup"}}</p>\n')
	t.end()
})
