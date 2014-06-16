var Ractive = require('ractive')
var toolbox = require('./templateToolbox.js')
var parseTemplate = require('./parseTemplate')
var htmlify = toolbox.htmlify

function render(templateHtml, data, cb) {
	try {
		var html = new Ractive({
			el: null,
			data: data,
			template: templateHtml,
			preserveWhitespace: true
		}).toHTML()
		cb(null, html)
	} catch (err) {
		cb(err)
	}
}

function makeHtmlFromPostName(getPost, linkify, postName, data, cb) {
	getPost(postName, function(err, post) {
		if (err) {
			cb(err)
		} else {
			makeHtmlFromPost(getPost, linkify, post, data, cb)
		}
	})
}

function makeHtmlFromPost(getPost, linkify, post, data, cb) {
	var templatesFromHtml = parseTemplate(data, linkify(htmlify(post)))
	var html = templatesFromHtml.html
	var templateContentsResolved = 0

	templatesFromHtml.elements.forEach(function(templateData) {
		makeHtmlFromPostName(getPost, linkify, templateData.postName, templateData.data, function(err, childHtml) {
			templateContentsResolved += 1
			if (err) {
				console.log(err.message)
			} else {
				html = templatesFromHtml.replaceTemplateElementWithHtml(html, templateData.elementId, childHtml)
			}
			if (templateContentsResolved === templatesFromHtml.elements.length) {
				render(html, templateData.data, cb)
			}
		})
	})
	if (templatesFromHtml.elements.length === 0) {
		render(html, data || {}, cb)
	}
}


/////////// live refreshing version ///////////

function populateTemplateDivsInPost(butler, linkify, ractive, post, data, templatesFromHtml) {
	var childRactives = []

	if (!templatesFromHtml) {
		templatesFromHtml = parseTemplate(data, linkify(htmlify(post)))
	}

	var html = templatesFromHtml.html

	ractive.set('html', html)
	ractive.set('metadata', post.metadata)

	templatesFromHtml.elements.forEach(function(templateData) {
		createRactiveElementFromPostName(butler, linkify, templateData, function(err, childRactive) {
			childRactives.push(childRactive)
		})
	})

	function teardownChildren() {
		childRactives.forEach(function(ractive) {
			ractive.teardown()
		})
	}

	ractive.on('teardown', teardownChildren)

	return teardownChildren
}

function imprintPostOnRactiveElement(butler, linkify, ractive, post, parentDataObject, templatesFromHtml) {
	butler.setMaxListeners(20)
	var teardownChildren = null
	function updatePostContent(key, newValue, oldValue) {
		if (key === post.filename) {
			if (typeof teardownChildren === 'function') {
				teardownChildren()
			}
			teardownChildren = populateTemplateDivsInPost(butler, linkify, ractive, newValue, parentDataObject, templatesFromHtml)
		}
	}

	updatePostContent(post.filename, post, null)

	butler.on('post changed', updatePostContent)

	ractive.on('teardown', function() {
		butler.removeListener('post changed', updatePostContent)
		teardownChildren()
	})
}


function createRactiveElementFromPostName(butler, linkify, templateData, cb) {
	var postName = templateData.postName
	var element = templateData.elementId
	var data = templateData.data

	butler.getPost(postName, function(err, post) {
		var ractive

		if (err) {
			 ractive = new Ractive({
				el: element,
				data: data,
				template: '{{error}}'
			})
			ractive.set('error', 'Error loading post! ' + err.message)
		} else {
			var templatesFromHtml = parseTemplate(data, linkify(htmlify(post)))
			ractive = new Ractive({
				el: element,
				data: data,
				template: templatesFromHtml.html
			})
			imprintPostOnRactiveElement(butler, linkify, ractive, post, data, templatesFromHtml)
		}

		cb(err, ractive)
	})
}


module.exports = {
	makeHtmlFromPost: makeHtmlFromPost,
	makeHtmlFromPostName: makeHtmlFromPostName,
	imprintPostOnRactiveElement: imprintPostOnRactiveElement
}
