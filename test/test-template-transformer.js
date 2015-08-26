var test = require('tape')
var ntt = require('../noddity-template-transformer.js')

function makeSpan(filename, args) {
	return '<span class=\'noddity-template\' data-noddity-post-file-name=\'' +
		filename + '\' data-noddity-template-arguments=\'' + args + '\'></span>'
}

test('Noddity Template Transformer', function (t) {
	t.equal(ntt('no template here'), 'no template here')
	t.equal(ntt('<code>::dont.md|parse|me::</code>'), '<code>::dont.md|parse|me::</code>')
	t.equal(ntt('<code>\n\n::dont.md|parse|me::\n\n</code>'), '<code>\n\n::dont.md|parse|me::\n\n</code>')
	t.equal(ntt('::do.md|parse|me::'), makeSpan('do.md', '{"1":"parse","2":"me"}'))
	t.equal(ntt('::two.in::::a.row::'), makeSpan('two.in', '{}') + makeSpan('a.row', '{}'))
	t.equal(ntt('::do.md|parse|me::'), makeSpan('do.md', '{"1":"parse","2":"me"}'))

	t.end()
})
