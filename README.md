wordpress-posts
===============
[![Build Status](https://secure.travis-ci.org/matteofigus/wordpress-posts.png?branch=master)](http://travis-ci.org/matteofigus/wordpress-posts)

A simple node.js tool to retrieve the posts from a wordpress blogs (through the rss feed)

# Installation

	npm install wordpress-posts

# Usage

### get(url [, maxPosts], callback)

	var wordpressPosts = require('wordpress-posts');
	var wordpressSiteUrl = "http://wordpress.org/";
	var posts = 4;
	
	wordpressPosts.get(wordpressSiteUrl, posts, function(err, data){
		console.log(data);
	});

# License

MIT
