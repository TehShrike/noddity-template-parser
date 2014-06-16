var test = require('tape').test
var Butler = require('noddity-butler')
var TestRetrieval = require('noddity-butler/test/retrieval/stub.js')
var render = require('../').makeHtmlFromPostName
var levelmem = require('level-mem')
var linkify = require('noddity-linkifier')('')
var fs = require('fs')

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

	render(state.butler.getPost, linkify, 'file1.md', {}, function(err, html) {
		t.notOk(err, 'No error')
		t.equal(html, '<p>This is a </p><p>lol yeah</p> post that I <em>totally</em> wrote<p></p>')
		state.butler.stop()
		t.end()
	})
})

test('My mysqli post', function(t) {
	var state = testState()

	state.retrieval.addPost('file1.md', 'Some title', new Date(), fs.readFileSync('../joshduff.com-content/2011-05-10-why-you-should-not-be-using-mysqli-prepare.md', { encoding: 'utf8' }))
	state.retrieval.addPost('file2.md', 'Some title', new Date(), 'lol yeah')

	t.plan(1)

	render(state.butler.getPost, linkify, 'file1.md', {}, function(err, html) {
		t.notOk(err, 'No error')
		console.log(err)
		state.butler.stop()
		t.end()
	})
})
