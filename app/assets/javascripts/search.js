$.fn.search = function() {
  return this.each(function(){
    new $.Search(this);
  });
};

$.Search = function(el) {
  this.$el = $(el);
  this.$input = this.$el.find('input');
  this.$ul = this.$el.find('.users');
  this.bindEvents();
};

$.extend($.Search.prototype, {
  bindEvents: function(){
    this.$input.on('input', this.handleInput.bind(this) );
  },

  handleInput: function(e) {
    var query = $(e.currentTarget).val();
    $.ajax({
      url: '/users/search',
      data: {
        query: query
      },
      dataType: 'json',
      success: function (response) {
        this.renderResults(response);
      }.bind(this)
    });
  },

  renderResults: function(response) {
    this.$ul.empty();
    var htmlLoad = "";
    for (var i = 0; i < response.length; i++) {
      var user = response[i];
      htmlLoad += "<li><a href=/users/" + user.id + ">" + user.username + "</a>";
      htmlLoad += "<button class='follow-toggle' data-user-id="+
                    user.id + " data-initial-follow-state=" +
                    (user.followed ? 'followed' : 'unfollowed') +
                    "></button></li>";
    }
    this.$ul.append(htmlLoad);
    this.$ul.find('.follow-toggle').followToggle();
  },

});







$(function() {
  $('.users-search').search();
});
