var test = require('tape').test
var Renderer = require('../')
var linkify = require('noddity-linkifier')('').linkify
var testState = require('./helpers/test-state')

test('Embeds a template', function(t) {
	var state = testState()

	var str = require('fs').readFileSync('./test/helpers/file-with-footnotes.md', { encoding: 'utf8' })
	state.retrieval.addPost('file1.md', 'Some title', new Date(), str)
	state.retrieval.addPost('file2.md', 'Some title', new Date(), 'lol yeah')

	var renderer = new Renderer(state.butler, linkify)

	state.butler.getPost('file1.md', function(err, post) {
		renderer.renderPost(post, function(err, html) {
			t.ok(html.indexOf('<li id="fn1" class="footnote-item"><p><em>Collected Sermons</em> volume 10, p. 310. <a href="#fnref1" class="footnote-backref">↩</a></p>') !== -1)
			state.butler.stop()
			t.end()
		})
	})
})
