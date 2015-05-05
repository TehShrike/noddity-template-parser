var test = require('tape').test
var Butler = require('noddity-butler')
var TestRetrieval = require('noddity-butler/test/retrieval/stub.js')
var Renderer = require('../')
var levelmem = require('level-mem')
var linkify = require('noddity-linkifier')('')

function testState() {
	var retrieval = new TestRetrieval()
	var db = levelmem('no location', {
		valueEncoding: require('noddity-butler/test/retrieval/encoding.js')
	})
	var butler = new Butler(retrieval, db, {
		refreshEvery: 100
	})

	return {
		butler: butler,
		retrieval: retrieval,
		db: db
	}
}

test('Embeds a template', function(t) {
	var state = testState()

	state.retrieval.addPost('file1.md', 'Some title', new Date(), 'This is a ::file2.md:: post that I *totally* wrote')
	state.retrieval.addPost('file2.md', 'Some title', new Date(), 'lol yeah')

	t.plan(3)
	var renderer = new Renderer(state.butler, linkify)

	state.butler.getPost('file1.md', function(err, post) {
		t.notOk(err, 'No error')
		renderer.renderPost(post, function(err, html) {
			t.notOk(err, 'No error')
			t.equal(html, '<p>This is a </p><p>lol yeah</p>\n post that I <em>totally</em> wrote<p>\n</p>')
			state.butler.stop()
			t.end()
		})
	})
})

test('Embeds a template with arguments', function(t) {
	var state = testState()

	state.retrieval.addPost('file1.md', 'Some title', new Date(), 'This is a ::file2.md:: post that I *totally* wrote')
	state.retrieval.addPost('file2.md', 'Some title', new Date(), 'lol yeah ::herp|wat:: ::herp|huh::')
	state.retrieval.addPost('herp', 'Some title', new Date(), 'lookit {{1}}')
	state.retrieval.getPostSync('herp').metadata.markdown = false

	t.plan(3)
	var renderer = new Renderer(state.butler, linkify)

	state.butler.getPost('file1.md', function(err, post) {
		t.notOk(err, 'No error')
		renderer.renderPost(post, function(err, html) {
			t.notOk(err, 'No error')
			t.equal(html, '<p>This is a </p><p>lol yeah lookit wat lookit huh</p>\n post that I <em>totally</em> wrote<p>\n</p>')
			state.butler.stop()
			t.end()
		})
	})
})
