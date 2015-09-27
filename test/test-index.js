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
			type: 'template',
			filename: 'child',
			arguments: {
				1: 'arg'
			}
		}, {
			type: 'string',
			value: '\n\n<p>I see you like {{prop}} templates</p>'
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
