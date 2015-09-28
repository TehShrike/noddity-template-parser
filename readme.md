[![Build Status](https://travis-ci.org/TehShrike/noddity-template-parser.svg)](https://travis-ci.org/TehShrike/noddity-template-parser)

Turns [Noddity](http://noddity.com) post objects into HTML and handles turning inter-site links into <a> tags and generating `<span class=\'noddity-template\' data-noddity-post-file-name=\'child\' data-noddity-template-arguments=\'{"1":"arg"}\'></span>` span elements for embedded templates.

## Usage


```js

var render = require('noddity-template-parser')
var Linkify = require('linkify')

var linkify = Linkify('#/prefix')

var html = render(post, linkify)

```

To produce Markdown files instead of HTML, pass in an `options` object with `convertToHtml` set to false:

```js
var html = render(post, linkify, { convertToHtml: false })
```

## License

[WTFPL](http://wtfpl2.com)
