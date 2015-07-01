var TestRetrieval = require('noddity-butler/test/retrieval/stub.js')
var levelmem = require('level-mem')
var Butler = require('noddity-butler')

module.exports = function testState() {
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
