var test = require('tape').test
var Renderer = require('../')
var linkify = require('noddity-linkifier')('').linkify
var testState = require('./helpers/test-state')

test('Embeds a template', function(t) {
	var state = testState()

	state.retrieval.addPost('img', { title: 'Some title', date: new Date(), markdown: false }, '<img src="{{ \'hello\' }}">')
	state.retrieval.addPost('file.md', { title: 'Some title', date: new Date() }, 'one ::img|file.png:: two')

	var renderer = new Renderer(state.butler, linkify)

	state.butler.getPost('file.md', function(err, post) {
		renderer.renderPost(post, function(err, html) {
			t.notOk(err)
			t.ok(html.indexOf('"hello"') !== -1)
			state.butler.stop()
			t.end()
		})
	})
})
