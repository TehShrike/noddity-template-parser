var test = require('tape')
var htmlify = require('../htmlify.js')

function contentToHtml(content) {
	return htmlify({ content: content, metadata: { markdown: true }})
}

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

	t.equal(contentToHtml('< {{>}}'), '<p>&lt; {{>}}</p>\n')
	t.equal(contentToHtml('"sup" {{"sup"}}'), '<p>&quot;sup&quot; {{"sup"}}</p>\n')

	t.equal(contentToHtml('"sup" {{"sup"}} <3 {{1<3}}'), '<p>&quot;sup&quot; {{"sup"}} &lt;3 {{1<3}}</p>\n')
	t.end()
})

test('Put ids on headers', function(t) {
	t.equal(contentToHtml('# sup dawg\n## everybody say "YEAH"').trim(), '<h1 id="sup-dawg">sup dawg</h1>\n'
		+ '<h2 id="everybody-say-yeah">everybody say &quot;YEAH&quot;</h2>')
	t.end()
})
