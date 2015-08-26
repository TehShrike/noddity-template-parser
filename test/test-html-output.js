var test = require('tape')
var Linkify = require('noddity-linkifier')
var renderer = require('../')

test('no changes', function(t) {
	var post = {
		content: 'sup dawg.\n\nI see you like {{prop}} templates',
		metadata: {
			prop: 'val'
		}
	}
	var linkify = Linkify('prefix/')

	var html = renderer(post, linkify)

	t.equal(html, '<p>sup dawg.</p><p>I see you like {{prop}} templates</p>')
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

	t.equal(html, '<p><a href="prefix/destination">friendly</a></p><p>I see you like {{prop}} templates</p>')
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

	t.equal(html, '<p><span class="noddity-template" data-noddity-post-file-name="child" data-noddity-template-arguments="{ \\"0\\": \\"arg\\" }"></span></p><p>I see you like {{prop}} templates</p>')
	t.end()
})
