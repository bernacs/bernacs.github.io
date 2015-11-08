$(document).ready(function() {
  // $('nav').fixTo('.main-container', {
  //   'useNativeSticky': false
  // });
  // $('nav').pin();
  // $('nav').sticky();
  // $('nav').stick_in_parent();
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