/*	
	heading highlighting
	using jquery.appear plugin by @morr
 */

// custom trigger line
function scanlineDiff (element) {
	var scanline_y_offset = -$(window).height() / 4,
			scanline = $(window).scrollTop() + $(window).height() / 2 + scanline_y_offset,
			element_mid = $(element).offset().top + $(element).height() / 2,
			diff = Math.abs(element_mid - scanline);

	// console.log(
	// 	"%d » scanline: %d;\telement-mid: %d;\tdiff: %d",
	// 	index, scanline, element_mid, diff);

	return diff;
}

// select current element and append classes to element and navigation
function changeCurrent() {
	$('section.work').removeClass('current');
	
	if ($('.in-view')) {
		if ($(window).height() <= 1440) {
			// inspired by http://stackoverflow.com/a/11985695
			var closest = [].reduce.call($('.in-view'), function(closer, current) {
				return scanlineDiff($(closer)) < scanlineDiff($(current)) ? closer : current;
			})

			$(closest).addClass('current');

		} else{
			$('.in-view').first().addClass('current');
		};
	};

	var current_work = $('section.current').data('work');

	$('nav li.work').removeClass('current-nav').each(function(index, element) {
		var hlink = $(element).find('a').attr('href').split('#')[1];
		if (hlink == current_work) {
			$(element).addClass('current-nav');
		};
	});
}

$(document).ready(function() {
	
	$('.content section.work').appear();

	$('.content').on('appear', 'section.work', function(event, $appeared_el) {
		event.preventDefault();
		/* Act on the event */

		$appeared_el.each(function(){
			$(this).addClass('in-view');
		})

		changeCurrent();
	});

	$('.content').on('disappear', 'section.work', function(event, $disappeared_el) {
		event.preventDefault();
		/* Act on the event */

		$disappeared_el.each(function(){
			$(this).removeClass('in-view');
		})

		changeCurrent();
	});
});