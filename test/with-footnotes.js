var test = require('tape').test
var Butler = require('noddity-butler')
var TestRetrieval = require('noddity-butler/test/retrieval/stub.js')
var Renderer = require('../')
var levelmem = require('level-mem')
var linkify = require('noddity-linkifier')('').linkify

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

	var str = require('fs').readFileSync('./test/file-with-footnotes.md', { encoding: 'utf8' })
	state.retrieval.addPost('file1.md', 'Some title', new Date(), str)
	state.retrieval.addPost('file2.md', 'Some title', new Date(), 'lol yeah')

	var renderer = new Renderer(state.butler, linkify)

	state.butler.getPost('file1.md', function(err, post) {
		renderer.renderPost(post, function(err, html) {
			// console.log(html)
			t.ok(html.indexOf('<li id="fn1" class="footnote-item"><p><em>Collected Sermons</em> volume 10, p. 310. <a href="#fnref1" class="footnote-backref">↩</a></p>') !== -1)
			state.butler.stop()
			t.end()
		})
	})
})
