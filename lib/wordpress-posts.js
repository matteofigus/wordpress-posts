var restler = require('restler');
var xml = require('xml2js');


var wordpressPosts = {
  get: function(blogUrl, maxItems, callback){
    var that = this;
    if(typeof maxItems == 'function'){
      callback = maxItems;
      maxItems = undefined;
    }
    restler.get(blogUrl, {}).on('complete', function (data, response) {
      if(!response)
        return callback("Page not available", null);

      if(!that.isHtml(data))
        that.parseXml(data, maxItems, callback);
      else {
        restler.get(that.getRssLinkFromHtml(data), {}).on('complete', function(data){
          that.parseXml(data, maxItems, callback);
        });
      }

    });
  },
  parseXml: function(data, maxItems, callback){
    var that = this;
    xml.parseString(data, function(err, result){
      if(err || !that.isXmlValid(result)) 
        callback(err ? err : "resource not available", []);
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
  isHtml: function(data){
    var rssMeta = "<link rel=\"alternate\" type=\"application\/rss+xml\"";
    var rssLinkPosition = data.indexOf(rssMeta);
    return (rssLinkPosition > 0);
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