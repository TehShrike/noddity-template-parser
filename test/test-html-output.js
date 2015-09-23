var test = require('tape')
var Linkify = require('noddity-linkifier')
var renderer = require('../')
var quotemeta = require('quotemeta')

var UUID_V4_REGEX = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}'

test('no changes', function(t) {
	var post = {
		content: 'sup dawg.\n\nI see you like {{prop}} templates',
		metadata: {
			prop: 'val'
		}
	}
	var linkify = Linkify('prefix/')

	var html = renderer(post, linkify)

	t.equal(html, '<p>sup dawg.</p>\n<p>I see you like {{prop}} templates</p>\n')
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

	var html = renderer(post, linkify)

	t.equal(html, '<p><a href="prefix/destination">friendly</a></p>\n<p>I see you like {{prop}} templates</p>\n')
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

	var html = renderer(post, linkify)

	var expectedRegex = new RegExp(quotemeta('<p><span class=\'noddity-template\' data-noddity-post-file-name=\'child\' data-noddity-template-arguments=\'{"1":"arg"}\' data-noddity-partial-name=\'') + UUID_V4_REGEX + quotemeta('\'>{{>') + UUID_V4_REGEX + quotemeta('}}</span></p>\n<p>I see you like {{prop}} templates</p>\n'))

	t.ok(expectedRegex.test(html))
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

	var html = renderer(post, linkify, { convertToHtml: false })

	var expectedRegex = new RegExp(quotemeta('<span class=\'noddity-template\' data-noddity-post-file-name=\'child\' data-noddity-template-arguments=\'{"1":"arg"}\' data-noddity-partial-name=\'') + UUID_V4_REGEX + quotemeta('\'>{{>') + UUID_V4_REGEX + quotemeta('}}</span>\n\nI see you like {{prop}} templates'))

	t.ok(expectedRegex.test(html))
	t.end()
})
