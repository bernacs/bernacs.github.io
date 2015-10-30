---
layout: default
title: Test - Index
tag: test
---

# Test Index

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

<hr />

{% for tag in site.tags %}
	{% for posts in tag %}
		{% for post in posts %}
			<p>{{ post.title }}</p>
		{% endfor %}
	{% endfor %}
{% endfor %}

<hr />