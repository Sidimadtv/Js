;(function ($, window, document, undefined) {
	'use strict';
	$.scrollClass=function(l,o){var n=this;n.$el=$(l),n.el=l,n.$win=$(window),n.$doc=$(document);var t,a=!1,i=n.$el.data("scrollDelay")?n.$el.data("scrollDelay"):10;n.init=function(){n.options=$.extend({},o)},n.scrollHandler=function(){a||n.onScroll()},n.onScroll=function(){if(n.inViewport())return 0!==i?(window.clearTimeout(t),t=window.setTimeout(n.addScrollClass,i)):n.addScrollClass(),"function"==typeof n.options.callback&&n.options.callback.call(l),void(a=!0)},n.addScrollClass=function(){var l=n.$el.data("scrollClass");n.$el.addClass(l)},n.inViewport=function(){var l=n.el.getBoundingClientRect(),o=n.$win.height(),t=n.$el.data("scrollThreshold")?n.$el.data("scrollThreshold"):50;o<l.height&&(t=50);var a=t/100*l.height;return l.top+a<=o&&l.bottom-a>=0},n.init(),n.$win.on("scroll load",n.scrollHandler)},$.fn.scrollClass=function(l){return this.each(function(){new $.scrollClass(this,l)})};    
	  
	// Initialize
	$('[data-scroll-class]').scrollClass();        
})(jQuery, window, document);