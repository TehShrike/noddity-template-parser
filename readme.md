[![Build Status](https://travis-ci.org/TehShrike/noddity-renderer.svg)](https://travis-ci.org/TehShrike/noddity-renderer)

This single module is responsible for taking a Noddity post and rendering it as html.

This seems like a pretty simple task, considering that Noddity posts are just Markdown files.  The real trick comes from the fact that Noddity posts can embed other posts as templates.

This module has two flavors of rendering: generating static html in a one-time step, and keeping a Ractive element up to date with the current version of a post, and also making sure that all embeded templates are kept up to date recursively as well.

Usage
=====

The module exports a single constructor function that takes two arguments: a [noddity-butler](https://github.com/TehShrike/noddity-butler), and the linkify function of a [noddity-linkifier](https://github.com/TehShrike/noddity-linkifier).

```js
var Butler = require('noddity-butler')
var Linkifier = require('noddity-linkifier')
var Renderer = require('noddity-renderer')

var linkifyEmitter = new Linkifier('http://yoursite.com/#!post/')
var butler = new Butler(noddityRoot, yourDb, butlerOptions)
var renderer = new Renderer(butler, linkifyEmitter.linkify)
```

The Noddity renderer has two functions, each almost entirely different in purpose.  I was very tempted to release them as two modules, but I was having a real difficult time figuring out how to share code between them, since their flows are so different.

The two functions exposed are:

populateRootRactive(post, [rootData], ractive)
-----

`post` is an an object returned by [noddity-retrieval](https://github.com/TehShrike/noddity-retrieval), and "ractive" is an insantiated [Ractive](http://www.ractivejs.org/) object.

`rootData` is the default data passed to ractive.

Three values will be set on the given ractive element:

- html: the rendered html from the given post, including the template elements which will have their own Ractive elements automatically created and populated
- metadata: the metadata object from the post
- current: the current filename of the post

The renderer will watch for a teardown event and will tear down all the child/template Ractive elements when it is observed.

renderPost(post, [rootData], cb)
-----

Calls the callback with the rendered html for the given post.  To do this, it recursively renders all embedded/template posts in the root post.

`rootData` is the default data passed to ractive.

The callback should expect the traditional error-first arguments `(err, html)` - though, uh,
