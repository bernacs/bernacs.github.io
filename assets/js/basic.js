$(document).ready(function() {
  // fallback
  var nav_position = $('nav').css('position');
  if (nav_position != 'sticky') {
    $('nav').addClass('fallback');
  };

  $('nav').Stickyfill();

  $('nav').perfectScrollbar({
    suppressScrollX: true
  });

  $(window).resize(function(event) {
    $('nav').perfectScrollbar('update');
  });

  $(window).scroll(function(event) {
    $('nav').perfectScrollbar('update')
  });
});