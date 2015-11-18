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
    $('nav').perfectScrollbar('update');
  });

  // $('img').parent().addClass('image');

  /* bourbon refills */
  $('.accordion-tabs').each(function() {
    $(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
  });
  $('.accordion-tabs').on('click', 'li > a.tab-link', function(event) {
    if (!$(this).hasClass('is-active')) {
      event.preventDefault();
      var accordionTabs = $(this).closest('.accordion-tabs');
      accordionTabs.find('.is-open').removeClass('is-open').hide();

      $(this).next().toggleClass('is-open').toggle();
      accordionTabs.find('.is-active').removeClass('is-active');
      $(this).addClass('is-active');
    } else {
      event.preventDefault();
    }
  });
});