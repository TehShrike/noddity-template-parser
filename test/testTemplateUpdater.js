var test = require('tape').test
var Butler = require('noddity-butler')
var TestRetrieval = require('noddity-butler/test/retrieval/stub.js')
var updater = require('../templateUpdater.js')
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

	t.plan(2)

	var res = updater(state.butler, linkify, {}, 'file1.md', function(err, html) {
		t.notOk(err, 'No error')
		t.equal(html, '<p>This is a <p>lol yeah</p> post that I <em>totally</em> wrote</p>')
		res.emit('teardown')
		state.butler.stop()
		t.end()
	})
})
