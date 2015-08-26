var test = require('tape')
var ntt = require('../noddity-template-transformer.js')

test('Noddity Template Transformer', function (t) {
	t.equal(ntt('no template here'), 'no template here')
	t.equal(ntt('<code>::dont.md|parse|me::</code>'), '<code>::dont.md|parse|me::</code>')
	t.equal(ntt('<code>\n\n::dont.md|parse|me::\n\n</code>'), '<code>\n\n::dont.md|parse|me::\n\n</code>')
	t.equal(ntt('::do.md|parse|me::'),
		'<span class=\'noddity-template\' data-noddity-post-file-name=\'do.md\' ' +
		'data-noddity-template-arguments=\'{"1":"parse","2":"me"}\'></span>')
	t.equal(ntt('::two.in::::a.row::'),
		'<span class=\'noddity-template\' data-noddity-post-file-name=\'two.in\' ' +
		'data-noddity-template-arguments=\'{}\'></span>' +
		'<span class=\'noddity-template\' data-noddity-post-file-name=\'a.row\' ' +
		'data-noddity-template-arguments=\'{}\'></span>')
	t.equal(ntt('::do.md|parse=me::'),
		'<span class=\'noddity-template\' data-noddity-post-file-name=\'do.md\' ' +
		'data-noddity-template-arguments=\'{"parse":"me"}\'></span>')

	t.end()
})
