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
		var target = $(element).find('a').attr('href').split(/[#/]/).clean("");
		var path = $(location).attr('pathname').split('/').clean("");

		if (path.first() == target.first() && target.last() == current_work) {
			$(element).addClass('current-nav');
		};
	});
}

$(document).ready(function() {
	
	$('.content section.work').appear({'force_process': true});

	$('.content').on('appear', 'section.work', function(event, $appeared_el) {
		event.preventDefault();

		$appeared_el.each(function(){
			$(this).addClass('in-view');
		})

		changeCurrent();
	});

	$('.content').on('disappear', 'section.work', function(event, $disappeared_el) {
		event.preventDefault();

		$disappeared_el.each(function(){
			$(this).removeClass('in-view');
		})

		changeCurrent();
	});
});

// from http://stackoverflow.com/a/281335
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

// for readability
Array.prototype.first = function () {
  return this[0];
};

Array.prototype.last = function () {
  return this[this.length - 1];
};