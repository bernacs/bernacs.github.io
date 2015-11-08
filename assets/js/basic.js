$(document).ready(function() {
  $('nav').fixTo('.main-container');
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