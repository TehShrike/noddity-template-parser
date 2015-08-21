var test = require('tape').test
var Renderer = require('../')
var linkify = require('noddity-linkifier')('').linkify
var testState = require('./helpers/test-state')

require('ractive').DEBUG = false

test('Embeds a template', function(t) {
	var state = testState()

	state.retrieval.addPost('file1.md', { title: 'Some title', date: new Date() }, 'This is a ::file2.md:: post that I *totally* wrote')
	state.retrieval.addPost('file2.md', { title: 'Some title', date: new Date() }, 'lol yeah')

	t.plan(3)
	var renderer = new Renderer(state.butler, linkify)

	state.butler.getPost('file1.md', function(err, post) {
		t.notOk(err, 'No error')
		renderer.renderPost(post, function(err, html) {
			t.notOk(err, 'No error')
			t.equal(html, '<p>This is a </p><p>lol yeah</p>\n post that I <em>totally</em> wrote<p></p>\n')
			state.butler.stop()
			t.end()
		})
	})
})

test('Embeds a template with arguments', function(t) {
	var state = testState()

	state.retrieval.addPost('file1.md', { title: 'Some title', date: new Date() }, 'This is a ::file2.md:: post that I *totally* wrote')
	state.retrieval.addPost('file2.md', { title: 'Some title', date: new Date() }, 'lol yeah ::herp|wat:: ::herp|huh::')
	state.retrieval.addPost('herp', { title: 'Some title', date: new Date(), markdown: false }, 'lookit {{1}}')

	t.plan(3)
	var renderer = new Renderer(state.butler, linkify)

	state.butler.getPost('file1.md', function(err, post) {
		t.notOk(err, 'No error')
		renderer.renderPost(post, function(err, html) {
			t.notOk(err, 'No error')
			t.equal(html, '<p>This is a </p><p>lol yeah lookit wat lookit huh</p>\n post that I <em>totally</em> wrote<p></p>\n')
			state.butler.stop()
			t.end()
		})
	})
})

test('Using current in a template', function(t) {
	var state = testState()

	state.retrieval.addPost('file1.md', { title: 'Some title', date: new Date() }, 'This is a ::file2.md:: post at {{current}}')
	state.retrieval.addPost('file2.md', { title: 'Some title', date: new Date() }, 'lol yeah')

	t.plan(3)
	var renderer = new Renderer(state.butler, linkify)

	state.butler.getPost('file1.md', function(err, post) {
		t.notOk(err, 'No error')
		renderer.renderPost(post, function(err, html) {
			t.notOk(err, 'No error')
			t.equal(html, '<p>This is a </p><p>lol yeah</p>\n post at file1.md<p></p>\n')
			state.butler.stop()
			t.end()
		})
	})
})

test('Using arbitrary data in the root Ractive', function(t) {
	var state = testState()

	state.retrieval.addPost('file1.md', { title: 'Some title', date: new Date() }, 'This is a ::file2.md:: post at {{noddityRoot}}')
	state.retrieval.addPost('file2.md', { title: 'Some title', date: new Date() }, 'lol yeah {{otherThing}} {{noddityRoot}}')

	t.plan(3)
	var renderer = new Renderer(state.butler, linkify)

	state.butler.getPost('file1.md', function(err, post) {
		t.notOk(err, 'No error')
		renderer.renderPost(post, {
			noddityRoot: 'theRoot',
			otherThing: 'w00t'
		}, function(err, html) {
			t.notOk(err, 'No error')
			t.equal(html, '<p>This is a </p><p>lol yeah w00t theRoot</p>\n post at theRoot<p></p>\n')
			state.butler.stop()
			t.end()
		})
	})
})
