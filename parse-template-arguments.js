module.exports = function getTemplateDataObject(pieces) {
	var unnamedParameters = 0

	return pieces.reduce(function(memo, piece) {
		var keyAndValue = piece.split('=', 2)
		var value = keyAndValue.pop()
		var key = keyAndValue.pop() || ++unnamedParameters

		memo[key] = value
		return memo
	}, {})
}
