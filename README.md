wordpress-posts
===============

A simple node.js tool to retrieve the posts from a wordpress blogs (through the rss feed)

# Installation

	npm install wordpress-posts

# Usage

	var wordpressPosts = require('wordpress-posts');
	var feedUrl = "http://wordpress.org/news/feed/";
	var posts = 4;
	
	var posts = wordpressPosts.get(feedUrl, posts, function(err, data){
		console.log(data);
	});
