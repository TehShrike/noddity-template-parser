var test = require('tape')
var Linkify = require('noddity-linkifier')
var parser = require('../')

test('no changes', function(t) {
	var post = {
		content: 'sup dawg.\n\nI see you like {{prop}} templates',
		metadata: {
			prop: 'val'
		}
	}
	var linkify = Linkify('prefix/')

	var pieces = parser(post, linkify)

	t.deepEqual(pieces, [
		{
			type: 'string',
			value: '<p>sup dawg.</p>\n<p>I see you like {{prop}} templates</p>\n'
		}
	])
	t.end()
})

test('with a link', function(t) {
	var post = {
		content: '[[destination|friendly]]\n\nI see you like {{prop}} templates',
		metadata: {
			prop: 'val'
		}
	}
	var linkify = Linkify('prefix/')

	var pieces = parser(post, linkify)

	t.deepEqual(pieces, [
		{
			type: 'string',
			value: '<p><a href="prefix/destination">friendly</a></p>\n<p>I see you like {{prop}} templates</p>\n'
		}
	])
	t.end()
})

test('with an embedded template', function(t) {
	var post = {
		content: '::child|arg::\n\nI see you like {{prop}} templates',
		metadata: {
			prop: 'val'
		}
	}
	var linkify = Linkify('prefix/')

	var pieces = parser(post, linkify)

	t.deepEqual(pieces, [
		{
			type: 'string',
			value: '<p>'
		}, {
			type: 'template',
			filename: 'child',
			arguments: {
				1: 'arg'
			}
		}, {
			type: 'string',
			value: '</p>\n<p>I see you like {{prop}} templates</p>\n'
		}
	])
	t.end()
})

test('no html output', function(t) {
	var post = {
		content: '::child|arg::\n\nI see you like {{prop}} templates',
		metadata: {
			prop: 'val'
		}
	}
	var linkify = Linkify('prefix/')

	var pieces = parser(post, linkify, { convertToHtml: false })

	t.deepEqual(pieces, [
		{
			type: 'template',
			filename: 'child',
			arguments: {
				1: 'arg'
			}
		}, {
			type: 'string',
			value: '\n\nI see you like {{prop}} templates'
		}
	])
	t.end()
})

test('no html output, with html entities', function(t) {
	var post = {
		content: '> block quote!',
		metadata: {
			prop: 'val'
		}
	}
	var linkify = Linkify('prefix/')

	var pieces = parser(post, linkify, { convertToHtml: false })

	t.deepEqual(pieces, [
		{
			type: 'string',
			value: '> block quote!'
		}
	])
	t.end()
})

test('curly braces in code blocks (single tick) should be replaced with html entities', function(t) {
	var linkify = Linkify('prefix/')
	var post = {
		content: 'an {{expression}} and `another {{expression}} in code`',
		metadata: {
			expression: 'arglebarg'
		}
	}

	var pieces = parser(post, linkify)

	t.deepEqual(pieces, [{
		type: 'string',
		value: '<p>an {{expression}} and <code>another &#123;&#123;expression&#125;&#125; in code</code></p>\n'
	}])

	t.end()
})

test('curly braces in code blocks (triple tick) should be replaced with html entities', function(t) {
	var linkify = Linkify('prefix/')
	var post = {
		content: ['another',
			'```',
			'{{code}}',
			'```',
			'block'].join('\n'),
		metadata: {
			expression: 'arglebarg'
		}
	}

	var pieces = parser(post, linkify)

	t.deepEqual(pieces, [{
		type: 'string',
		value: '<p>another</p>\n<pre><code>&#123;&#123;code&#125;&#125;\n</code></pre>\n<p>block</p>\n'
	}])

	t.end()
})
