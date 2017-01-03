var test = require('tape')
var ntt = require('../noddity-template-transformer.js')

test('Noddity Template Transformer', function (t) {
	t.deepEqual(ntt('no template here'), [{
		type: 'string',
		value: 'no template here'
	}])
	t.deepEqual(ntt('<code>::dont.md|parse|me::</code>'), [{
		type:'string',
		value: '<code>::dont.md|parse|me::</code>'
	}])
	t.deepEqual(ntt('::dont.md|parse|me\n::'), [{
		type:'string',
		value: '::dont.md|parse|me\n::'
	}])
	t.deepEqual(ntt('<code>\n\n::dont.md|parse|me::\n\n</code>'), [{
		type: 'string',
		value: '<code>\n\n::dont.md|parse|me::\n\n</code>'
	}])
	t.deepEqual(ntt('::do.md|parse|me::'), [{
		type: 'template',
		filename: 'do.md',
		arguments: {
			1: 'parse',
			2: 'me'
		}
	}])
	t.deepEqual(ntt('<code></code>::do.parse::<code></code>'), [
		{
			type: 'string',
			value: '<code></code>'
		}, {
			type: 'template',
			filename: 'do.parse',
			arguments: {}
		}, {
			type: 'string',
			value: '<code></code>'
		}
	])
	t.deepEqual(ntt('::two.in::::a.row::'), [
		{
			type: 'template',
			filename: 'two.in',
			arguments: {}
		}, {
			type: 'template',
			filename: 'a.row',
			arguments: {}
		}
	])
	t.deepEqual(ntt('::do.md|parse=me::'), [{
		type: 'template',
		filename: 'do.md',
		arguments: {
			parse: 'me'
		}
	}])
	t.deepEqual(ntt('::do parse.md|me::'), [{
		type: 'template',
		filename: 'do parse.md',
		arguments: {
			1: 'me'
		}
	}])

	t.end()
})
