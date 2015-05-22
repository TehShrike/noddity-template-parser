var toolbox = require('./templateToolbox.js')
var htmlify = toolbox.htmlify
var EventEmitter = require('events').EventEmitter
var Ractive = require('ractive')
var updateEmitterMixinFactory = require('./updateEmitterMixin.js')
var cheerio = require('cheerio')

var errorTemplate = Ractive.parse('{{error}}')

function render(mixin) {
	var templateHtml = cheerio.load(mixin.renderedHtml || mixin.html).html()

	try {
		return new Ractive({
			el: null,
			data: mixin.data,
			template: templateHtml,
			preserveWhitespace: true
		}).toHTML()
	} catch (err) {
		mixin.emit('error', err)
		return err.message
	}
}

function makeNewMixinObject(post) {
	var mixin = Object.create(new EventEmitter())

	if (post) {
		mixin.post = post
		mixin.postName = post.filename
	}

	return mixin
}

function replaceTemplateElementWithHtml(mixin, childMixin) {
	var spanText = toolbox.generatePostDiv(childMixin.elementId)
	var html = mixin.renderedHtml || mixin.html
	mixin.renderedHtml = html.replace(spanText, childMixin.renderedHtml)
	return mixin
}

function mixinChildPosts(getPost, mixin) {
	var childrenResolved = 0

	function resolve() {
		mixin.emit('all child posts fetched', mixin)
	}
	mixin.templateElements.forEach(function(childMixin) {
		getPost(childMixin.postName, function(err, post) {
			childrenResolved += 1
			if (err) {
				childMixin.err = err
			} else {
				childMixin.post = post
				mixin.emit('child post fetched', childMixin)
			}
			if (childrenResolved === mixin.templateElements.length) {
				resolve()
			}
		})
	})

	if (mixin.templateElements.length === 0) {
		process.nextTick(resolve)
	}
	return mixin
}

function mixinHtml(linkify, mixin) {
	mixin.html = linkify(htmlify(mixin.post))
	return mixin
}

function mixinRenderedHtmlEmitter(mixin) {
	mixin.on('all child posts fetched', function(mixin) {
		if (mixin.templateElements.length === 0) {
			mixin.renderedHtml = render(mixin)
			process.nextTick(function() {
				mixin.emit('final html rendered', mixin)
			})
		} else {
			var mergedSoFar = 0
			var mergeChildHtmlIntoRenderedHtml = function mergeChildHtmlIntoRenderedHtml(childMixin) {
				replaceTemplateElementWithHtml(mixin, childMixin)
				mergedSoFar += 1
				if (mergedSoFar >= mixin.templateElements.length) {
					mixin.renderedHtml = render(mixin)
					mixin.emit('final html rendered', mixin)
				}
			}
			mixin.templateElements.forEach(function(childMixin) {
				childMixin.once('final html rendered', mergeChildHtmlIntoRenderedHtml)
			})
		}
	})

	return mixin
}

function mixinTemplateRactive(mixin) {
	try {
		mixin.ractive = new Ractive({
			el: mixin.elementId,
			data: mixin.data,
			template: mixin.html,
			preserveWhitespace: true
		})
	} catch (err) {
		mixin.ractive = new Ractive({
			el: mixin.elementId,
			data: {
				error: err.message
			},
			template: errorTemplate
		})
		mixin.emit('error', err)
	}
	mixin.emit('ractive created', mixin)
}

function mixinTeardownChildren(mixin) {
	mixin.children = []
	mixin.teardownChildren = function teardownChildren() {
		mixin.children.forEach(function(child) {
			if (child.ractive) {
				child.ractive.teardown()
			}
			child.torndown = true
		})
	}
}

module.exports = function(butler, linkify) {
	return {
		mixinHtml: mixinHtml.bind(null, linkify),
		makeNewMixinObject: makeNewMixinObject,
		mixinRenderedHtmlEmitter: mixinRenderedHtmlEmitter,
		parseTemplate: require('./parseTemplate'),
		mixinChildPosts: mixinChildPosts.bind(null, butler.getPost),
		updateEmitterMixin: updateEmitterMixinFactory(butler),
		mixinTemplateRactive: mixinTemplateRactive,
		mixinTeardownChildren: mixinTeardownChildren
	}
}
