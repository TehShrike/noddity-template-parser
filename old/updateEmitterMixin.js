module.exports = function updateEmitterMixinFactory(butler) {
	var mixinsByPostName = {}

	butler.on('post changed', function(postName, newPost, oldPost) {
		if (mixinsByPostName[postName]) {
			mixinsByPostName[postName].forEach(function(mixin) {
				mixin.emit('post changed', newPost)
			})
		}
	})

	return function updateEmitterMixin(mixin) {
		if (typeof mixinsByPostName[mixin.postName] === 'undefined') {
			mixinsByPostName[mixin.postName] = []
		}
		mixinsByPostName[mixin.postName].push(mixin)
		mixin.ractive.on('teardown', function() {
			mixinsByPostName[mixin.postName] = mixinsByPostName[mixin.postName].filter(function(mixinInList) {
				return mixinInList !== mixin
			})
		})
	}
}
