var xml = require('xml2js');

var wordpressPosts = {
  get: function(blogUrl, maxItems, callback){
    var that = this;
    if(typeof maxItems == 'function'){
      callback = maxItems;
      maxItems = undefined;
    }
    that.getContentFromUrl(blogUrl, function(err, data){
      if(err)
        return callback(err, null);

      that.parseAndProcessXml(data, maxItems, callback);
    });
  },
  makeRequest: function(url, callback){

    var httpProtocol = url.indexOf('https') == 0 ? 'https' : 'http'; 

    require(httpProtocol).get(url, function(res){

      var data = "";

      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() { callback(null, data); });

    }).on('error', function(e) { callback(e, null);  });

  },
  getContentFromUrl: function(url, callback){
    var that = this;
    this.makeRequest(url, function(err, data) {
      if(err || !data)
        return callback("Resource not available", []);

      var rssLink = that.getRssLinkFromHtml(data);
      var isXml = rssLink == false;

      if(isXml)
        callback(null, data);
      else {
        that.getContentFromUrl(rssLink, callback);
      }
    });
  },
  parseAndProcessXml: function(data, maxItems, callback){
    var that = this;
    xml.parseString(data, function(err, result){
      if(err || !that.isXmlValid(result)) 
        callback(err ? err : "Resource not available", []);
      else {
        var items = result.rss.channel[0].item;
        callback(null, that.getPostsView(items, maxItems));
      }
    });
  },
  getPostView: function(item){
    return {
      title: item.title[0],
      link: item.link[0],
      date: item.pubDate[0],
      description: item.description[0],
      comments: item["slash:comments"][0]
    };
  },
  getPostsView: function(items, maxItems){
    var returnItems = [];
    for(var i = 0; i < (maxItems && maxItems < items.length ? maxItems : items.length); i++){
      returnItems.push(this.getPostView(items[i]));
    }
    return returnItems;
  },
  isXmlValid: function(xmlResult){
    return xmlResult && 
           xmlResult.rss && 
           xmlResult.rss.channel && 
           xmlResult.rss.channel.length > 0 && 
           xmlResult.rss.channel[0].item;
  },
  getRssLinkFromHtml: function(data){
    var rssMeta = "<link rel=\"alternate\" type=\"application\/rss+xml\"";
    var rssLinkPosition = data.indexOf(rssMeta);
    if(rssLinkPosition < 0)
      return false;
    
    var rssLink = data.substr(rssLinkPosition);
    rssLink = rssLink.substr(rssLink.indexOf("href=\"") + 6);
    rssLink = rssLink.substr(0, rssLink.indexOf("\""));

    return rssLink; 
  }
};


exports.get = function(blogUrl, maxItems, callback){
  return wordpressPosts.get(blogUrl, maxItems, callback);
}