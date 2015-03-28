$.fn.followToggle = function() {
  return this.each(function() {
    new $.FollowToggle(this);
  });
};

$.FollowToggle = function(el){
  this.$el = $(el);
  this.userId = this.$el.data('user-id');
  this.followState = this.$el.data('initial-follow-state');
  this.render();
  this.bindEvents();
};

$.extend($.FollowToggle.prototype, {
  updateFollowers: function(response) {

  },

  toggleFollowState: function() {
    switch(this.followState) {
      case 'unfollowed':
        this.followState = 'following';
        break;
      case 'following':
        this.followState = "followed";
        break;
      case 'followed':
        this.followState = 'unfollowing';
        break;
      case 'unfollowing':
        this.followState = "unfollowed";
        break;
      default:
        break;
      }
  },

  render: function(){
    var text;
    switch(this.followState) {
      case 'unfollowed':
        text = 'Follow';
        this.$el.prop('disabled', false);
        break;
      case 'followed':
        text = 'Unfollow';
        this.$el.prop('disabled', false);
        break;
      default:
        text = this.followState;
        this.$el.prop('disabled', true);
    }
    this.$el.text(text);
  },

  bindEvents: function(){
    this.$el.on("click", this.handleClick.bind(this));
  },

  handleClick: function(e){
    e.preventDefault();
    var httpMethod = "POST";

    if (this.followState === "followed") {
      httpMethod = "DELETE";
    }
    this.toggleFollowState();
    this.render();
    $.ajax({
      url: "/users/"+this.userId+"/follow",
      method: httpMethod,
      dataType: "json",
      success: function(response) {
        this.toggleFollowState();
        this.render();
      }.bind(this)
    });
  },


});


$(function() {
  $('button.follow-toggle').followToggle();
});
