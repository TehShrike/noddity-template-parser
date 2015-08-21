var Mixins = require('./mixins')
var extend = require('xtend')

function Renderer(butler, linkify) {
	var mixins = Mixins(butler, linkify)

	function renderMixin(mixin) {
		mixins.mixinHtml(mixin)
		mixins.parseTemplate(mixin)
		mixins.mixinChildPosts(mixin)
		mixins.mixinRenderedHtmlEmitter(mixin)

		mixin.on('all child posts fetched', function(mixin) {
			mixin.templateElements.forEach(renderMixin)
		})
	}

	function renderMarkdown(post, rootData, cb) {
		if (typeof rootData === 'function') {
			cb = rootData
			rootData = {}
		}

		rootData.current = post.filename

		var mixin = mixins.makeNewMixinObject(post)

		mixin.rootData = rootData

		mixin.html = linkify(post.content) // skip the html step entirely for the top-level post
		mixins.parseTemplate(mixin)
		mixins.mixinChildPosts(mixin)

		mixin.on('all child posts fetched', function(mixin) {
			mixin.templateElements.forEach(renderMixin)
			mixins.renderChildrenIntoTemplates(mixin, function(mixin) {
				cb(null, mixin.renderedHtml)
			})
		})
	}

	function renderPost(post, rootData, cb) {
		if (typeof rootData === 'function') {
			cb = rootData
			rootData = {}
		}
		rootData.current = post.filename

		var mixin = mixins.makeNewMixinObject(post)
		mixin.rootData = rootData

		renderMixin(mixin)

		mixin.on('final html rendered', function(mixin) {
			cb(null, mixin.renderedHtml)
		})
	}

	function createChildRactive(mixin) {
		mixins.mixinHtml(mixin)
		mixins.parseTemplate(mixin)
		mixins.mixinTemplateRactive(mixin)
		mixins.updateEmitterMixin(mixin)
		mixins.mixinTeardownChildren(mixin)
		mixins.mixinChildPosts(mixin)

		mixin.on('child post fetched', function(childMixin) {
			if (!mixin.torndown) {
				createChildRactive(childMixin)
				mixin.children.push(childMixin)
			}
		})

		mixin.on('post changed', function(newPost) {
			var replacement = mixins.makeNewMixinObject(newPost)
			replacement.elementId = mixin.elementId
			replacement.data = mixin.data

			mixin.ractive.teardown()
			mixin.removeAllListeners()
			createChildRactive(replacement)
		})

		mixin.ractive.on('teardown', function teardown() {
			mixin.torndown = true
			mixin.teardownChildren()
			mixin.removeAllListeners()
		})
	}

	function mixinRootPostChangeWatcher(mixin) {
		function update(newPost) {
			mixin.teardownChildren()
			populateRootRactive(newPost, mixin.ractive)
		}

		mixin.on('post changed', update)

		mixin.change = function(newPost) {
			mixin.removeListener('post changed', update)
			update(newPost)
		}

		mixin.ractive.on('teardown', function() {
			mixin.teardownChildren()
			mixin.torndown = true
		})
	}

	function populateRootRactive(post, ractive, rootData) {
		var mixin = mixins.makeNewMixinObject(post)
		mixin.ractive = ractive
		mixins.mixinHtml(mixin)
		mixins.parseTemplate(mixin)
		mixins.updateEmitterMixin(mixin)
		mixins.mixinTeardownChildren(mixin)
		mixins.mixinChildPosts(mixin)
		mixinRootPostChangeWatcher(mixin)

		mixin.on('child post fetched', function(childMixin) {
			if (!mixin.torndown) {
				createChildRactive(childMixin)
				mixin.children.push(childMixin)
			}
		})

		ractive.set({
			html: mixin.html,
			metadata: post.metadata,
			current: post.filename
		})

		return mixin.change
	}

	return {
		populateRootRactive: populateRootRactive,
		renderPost: renderPost,
		renderMarkdown: renderMarkdown
	}
}

module.exports = Renderer
