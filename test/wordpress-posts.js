var should = require('should');

var worpressPosts = require('./../index');

describe('The posts retriever', function(){
  it('should show an error if the blog feed is not available', function(done) {
    worpressPosts.get("http://www.thiswebsitedoesnotexistimveryverysure.com", 10, function(err, res){
      should.exist(err);
      done();
    });
  });

  it('should not show an error if the blog feed is available', function(done) {
    worpressPosts.get("http://wordpress.org/news/feed/", 3, function(err, res){
      should.not.exist(err);
      done();
    });
  });

  it('should show the correct number of posts', function(done) {
    var postsToRetrieve = 3;
    worpressPosts.get("http://wordpress.org/news/feed/", postsToRetrieve, function(err, res){
      res.length.should.be.within(0, postsToRetrieve);
      done();
    });
  });

});