$.fn.infiniteTweets = function() {
  return this.each(function() {
    new $.InfiniteTweets(this);
  });
};

$.InfiniteTweets = function(el){
  this.$el = $(el);
  this.$ul = this.$el.find('#feed');
  this.$fetch = this.$el.find('.fetch-more');
  this._template = _.template(this.$el.find("#tweets-template").html());
  this.maxCreatedAt = null;
  this.bindEvents();
  this.$fetch.trigger('click');
};

$.extend($.InfiniteTweets.prototype, {
  bindEvents: function(){
    this.$fetch.on('click', this.fetchTweets.bind(this));
    this.$ul.on('insert-tweet', function(event, tweets) {
      this.insertTweets([tweets], true);
    }.bind(this));
  },

  insertTweets: function(tweets, bottom){
    if(bottom) {
      this.$ul.prepend(this._template({ tweets: tweets }));
    } else {
      this.$ul.append(this._template({ tweets: tweets }));
    }
  },

  fetchTweets: function(e){
    var query =  {};

    if (this.maxCreatedAt !== null) {
      query.max_created_at = this.maxCreatedAt;
    }

    $.ajax({
      url: '/feed',
      data: query,
      dataType: 'json',
      success: function(response){
        this.insertTweets(response);
        this.maxCreatedAt = response[response.length - 1].created_at;
        if (response.length < 20) {
          this.$fetch.detach();
          this.$el.append("No more tweets");
        }
      }.bind(this)
    });
  }
});



$(function(){
  $('.infinite-tweets').infiniteTweets();
});
