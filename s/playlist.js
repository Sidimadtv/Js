/*
Playlist Feature
Author: BeeTeam368
Author URI: http://themeforest.net/user/beeteam368
License: Themeforest Licence
License URI: http://themeforest.net/licenses
*/

;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var $d = $(document);
    var $w = $(window);
    var _d = document;
    var _w = window;
    var $h = $('html');
    var $b = $('body');
	
	$d.ready(function () {
		var instances = OverlayScrollbars(document.querySelectorAll('.main-playlist-items-control'), {
			scrollbars: {
				autoHide: 'leave',
			},
			overflowBehavior: {
				x: 'hidden',
				y: 'scroll',
			}
		});

		if(typeof(instances) !== 'undefined'){
			if(typeof(instances.length) !== 'undefined' && instances.length > 0){
				for(var i = 0; i < instances.length; i++) {
					if(typeof(instances[i]) !== 'undefined') {
						var $target_element = $(instances[i].getElements('target'));
						instances[i].scroll({ el : $target_element.find('.playlist-item.active-item'), scroll: 'ifneeded', block: ['begin', 'never'] }, 368);
					}
				}
			}else{
				var $target_element = $(instances.getElements('target'));
				instances.scroll({ el : $target_element.find('.playlist-item.active-item'), scroll: 'ifneeded', block: ['begin', 'never'] }, 368);
			}
		}
		
    });
}));