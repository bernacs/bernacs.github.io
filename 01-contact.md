---
layout: page
title: Contact
permalink: /contact/
---

#Contact

| email: | <a href="#"><span id="email">please enable javascript to view</span></a>
| tel: 	 | <a href="#"><span id="tel">please enable javascript to view</span></a>

<script>
$('#email').html(function(){
	var e = "so",
			f = "nia",
			g = "@",
			h = "ber",
			i = "nac",
			j = ".org",
			k = "mailto:" + e + f + g + h + i + j;
	$(this).parent('a').attr('href', k);
	return e + f + g + h + i + j;
})
$('#tel').html(function(){
	var l = "+44"
			m = "7563"
			n = "255"
			o = "751"
			p = l + "-" + m + "-" + n + o,
			r = "tel:" + p;
	$(this).parent('a').attr('href', r);
	return l + " " + m + " " + n + o;
})
</script>