var test = require('tape').test
var Renderer = require('../')
var linkify = require('noddity-linkifier')('').linkify
var testState = require('./helpers/test-state')

test('Embeds a template and spits out markdown', function(t) {
	var state = testState()

	state.retrieval.addPost('file1.md', { title: 'Some title', date: new Date() }, 'Check it out ::file2.md:: \n\n[^1]:	*Collected Sermons* volume 10, p. 310.\n')
	state.retrieval.addPost('file2.md', { title: 'Some title', date: new Date() }, 'lol yeah')

	var renderer = new Renderer(state.butler, linkify)

	state.butler.getPost('file1.md', function(err, post) {
		renderer.renderMarkdown(post, function(err, html) {
			t.equal(html, 'Check it out <p>lol yeah</p>\n \n\n[^1]:	*Collected Sermons* volume 10, p. 310.\n')

			state.butler.stop()
			t.end()
		})
	})
})
