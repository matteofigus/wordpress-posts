var restler = require('restler');
var xml = require('xml2js');

exports.get = function(blogUrl, maxItems, callback){
  if(typeof maxItems == 'function'){
    callback = maxItems;
    maxItems = undefined;
  }
  restler.get(blogUrl, {}).on('complete', function (data) {
    xml.parseString(data, function(err, result){
      if(err || !result || !result.rss || !result.rss.channel || result.rss.channel.length <= 0 || !result.rss.channel[0].item) 
        callback(err ? err : "resource not available", []);
      else {
        var items = result.rss.channel[0].item;
        var returnItems = [];
        for(var i = 0; i < (maxItems && maxItems < items.length ? maxItems : items.length); i++){
          returnItems.push({
            title: items[i].title[0],
            link: items[i].link[0],
            date: items[i].pubDate[0],
            description: items[i].description[0],
            comments: items[i]["slash:comments"][0]
          });
        }
        callback(null, returnItems);
      }
    });
  });
};