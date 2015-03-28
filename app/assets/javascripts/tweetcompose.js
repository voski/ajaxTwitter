$.fn.tweetCompose = function(){
  return this.each(function(){
    new $.TweetCompose(this);
  });
};

$.TweetCompose = function (el) {
  this.$el = $(el);
  this.$ul = $('#feed');
  this.$el.data('tweets-ul', '#feed');
  this.$textArea = this.$el.find("textarea");
  this.$inputs = this.$el.find(':input');
  this.$strong = this.$el.find("strong.chars-left");
  this.$mentionScript =  this.$el.find('script');
  this.$mentionDiv = this.$el.find('.mentioned-users');
  this.bindEvents();
};

$.extend($.TweetCompose.prototype = {
  bindEvents: function(){
    this.$el.on("submit", this.submit.bind(this));
    this.$textArea.on('input', this.charsLeft.bind(this));
    this.$el.find('a.add-mentioned-user').on('click', this.addMentionedUser.bind(this));
    this.$mentionDiv.on('click', 'a.remove-mentioned-user', this.removeMentionedUser.bind(this));
  },

  addMentionedUser: function(e){
    this.$mentionDiv.append(this.$mentionScript.html());
  },

  removeMentionedUser: function(e){
    $(e.currentTarget).parent('div').remove();
  },

  charsLeft: function(){
    var _charsLeft = 140 - this.$textArea.val().length;
    this.$strong.text(_charsLeft);
  },

  clearInput: function(){
    this.$inputs.val('');
    this.$mentionDiv.empty();
  },

  handleSuccess: function(response){
    this.clearInput();
    this.$inputs.prop('disabled', false);

    this.$ul.trigger('insert-tweet', response);
    this.charsLeft();
  },

  submit: function(e) {
    e.preventDefault();
    var serialized = this.$el.serializeJSON();
    this.$inputs.prop('disabled', true);
    $.ajax({
      url: "/tweets",
      method: "POST",
      data: serialized,
      dataType: "json",
      success: function(response) {
        this.handleSuccess(response);
      }.bind(this)
    });
  },

});


$(function () {
  $('.tweet-compose').tweetCompose();
});
