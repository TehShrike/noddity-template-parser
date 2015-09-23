var test = require('tape')
var ntt = require('../noddity-template-transformer.js')
var quotemeta = require('quotemeta')

var UUID_V4_REGEX = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}'

function matches(input, str) {
	return new RegExp(quotemeta(str).replace(/UUID_HERE/g, UUID_V4_REGEX)).test(input)
}

test('Noddity Template Transformer', function (t) {
	t.equal(ntt('no template here'), 'no template here')
	t.equal(ntt('<code>::dont.md|parse|me::</code>'), '<code>::dont.md|parse|me::</code>')
	t.equal(ntt('<code>\n\n::dont.md|parse|me::\n\n</code>'), '<code>\n\n::dont.md|parse|me::\n\n</code>')
	t.ok(matches(ntt('::do.md|parse|me::'),
		'<span class=\'noddity-template\' data-noddity-post-file-name=\'do.md\' ' +
		'data-noddity-template-arguments=\'{"1":"parse","2":"me"}\' data-noddity-partial-name=\'UUID_HERE\'>{{>UUID_HERE}}</span>'))
	t.ok(matches(ntt('::two.in::::a.row::'),
		'<span class=\'noddity-template\' data-noddity-post-file-name=\'two.in\' ' +
		'data-noddity-template-arguments=\'{}\' data-noddity-partial-name=\'UUID_HERE\'>{{>UUID_HERE}}</span>' +
		'<span class=\'noddity-template\' data-noddity-post-file-name=\'a.row\' ' +
		'data-noddity-template-arguments=\'{}\' data-noddity-partial-name=\'UUID_HERE\'>{{>UUID_HERE}}</span>'))
	t.ok(matches(ntt('::do.md|parse=me::'),
		'<span class=\'noddity-template\' data-noddity-post-file-name=\'do.md\' ' +
		'data-noddity-template-arguments=\'{"parse":"me"}\' data-noddity-partial-name=\'UUID_HERE\'>{{>UUID_HERE}}</span>'))

	t.end()
})
