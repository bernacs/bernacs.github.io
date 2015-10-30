---
layout: default
title: Project - Index
tag: project
---

# Project Index

{% for page in site.pages %}
{% unless page.exclude %}
{{ forloop.index }} – {{ page.title }}
{% endunless %}
{% endfor %}

<hr />

<ul>
{% for page in site.pages %}
	<li><a href="{{ page.url }}">{{ page.title }}</a></li>
{% endfor %}
</ul>

<hr />

<p><a href="{{ site.url }}/test/test-1/#test-test-1">Hej</a></p>