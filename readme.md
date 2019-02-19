[![Build Status](https://travis-ci.org/TehShrike/noddity-template-parser.svg)](https://travis-ci.org/TehShrike/noddity-template-parser)

Turns [Noddity](http://noddity.com) post objects into basic [abstract syntax trees](https://en.wikipedia.org/wiki/Abstract_syntax_tree).

## Example

```js
var parser = require('noddity-template-parser')
var Linkify = require('noddity-linkify')

var linkify = Linkify('#/prefix')

var ast = parser(post, linkify)

var full = ast.reduce(function (full, piece) {
	if (piece.type === 'string') full += piece.value
	if (piece.type === 'template') full += 'TEMPLATE GOES HERE'
	return full
}, '')
```

## API

```js
var parser = require('noddity-template-parser')
```

### `var ast = parser(post, linkify, [options])`

- `post`: a Noddity post object (from a [Noddity Butler](https://github.com/TehShrike/noddity-butler))
- `linkify`: a [Noddity Linkifier](https://github.com/TehShrike/noddity-linkifier)
- `options`: an optional object of options
	- `convertToHtml`: convert posts from markdown to HTML. Defaults to true. (If `markdown: false` is on the post's metadata, it will not be converted, even when this is set to true.)

```js
var ast = parser(post, linkify, { convertToHtml: false })
```

### `ast`

An array of objects returned from `parser()`. Each object has a type property which can be `string`, or `template`.

- `string` type properties:
	- `value` string with html or markdown
- `template` type properties:
	- `filename` string, e.g. `'my-post.md'`
	- `arguments` object, e.g. `{ 1: 'hello', key: 'value' }`

The AST for this post...

```
---
prop: val
---

::child|arg|key=value::

I see you like {{prop}} templates
```

...would look like:

```js
[{
	type: 'string',
	value: '<p>'
}, {
	type: 'template',
	filename: 'child',
	arguments: {
		1: 'arg',
		key: 'value'
	}
}, {
	type: 'string',
	value: '</p>\n<p>I see you like {{prop}} templates</p>\n'
}]
```

## License

[WTFPL](http://wtfpl2.com)
