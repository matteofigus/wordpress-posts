wordpress-posts [![Build Status](https://secure.travis-ci.org/matteofigus/wordpress-posts.png?branch=master)](http://travis-ci.org/matteofigus/wordpress-posts)
===============

[![NPM](https://nodei.co/npm/wordpress-posts.png?downloads=true)](https://npmjs.org/package/wordpress-posts)

A simple node.js tool to retrieve the posts from a wordpress blogs (through the rss feed)

# Installation

```shell
	npm install wordpress-posts
```

# Usage

### get(url [, maxPosts], callback)

```js
var wordpressPosts = require('wordpress-posts');
var wordpressSiteUrl = "http://wordpress.org/";
var posts = 4;

wordpressPosts.get(wordpressSiteUrl, posts, function(err, data){
	console.log(data);
});
```

# License

MIT


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/matteofigus/wordpress-posts/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

