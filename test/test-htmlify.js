var test = require('tape')
var htmlify = require('../htmlify.js')

test('Doesn\'t replace entities inside of Ractive expressions', function(t) {

	t.equal(htmlify('< {{>}}'), '<p>&lt; {{>}}</p>\n')
	t.equal(htmlify('"sup" {{"sup"}}'), '<p>&quot;sup&quot; {{"sup"}}</p>\n')

	t.equal(htmlify('"sup" {{"sup"}} <3 {{1<3}}'), '<p>&quot;sup&quot; {{"sup"}} &lt;3 {{1<3}}</p>\n')
	t.end()
})

test('Put ids on headers', function(t) {
	t.equal(htmlify('# sup dawg\n## everybody say "YEAH"').trim(), '<h1 id="sup-dawg">sup dawg</h1>\n'
		+ '<h2 id="everybody-say-yeah">everybody say &quot;YEAH&quot;</h2>')
	t.end()
})
