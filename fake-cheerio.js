module.exports = {
	load: function load(html) {
		return {
			html: function() {
				return html
			}
		}
	}
}
