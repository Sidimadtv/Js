/*
Player Feature
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
	
	$d.on('click', '.turn-off-light-control', function(e){
		var $t = $(this);
		
		var $main_player = $('.is-single-post-main-player');
		if($main_player.length > 0 && $main_player.find('.light-off-control').length === 0){
			$main_player.find('.beeteam368-player-control').append('<div class="light-off light-off-control"></div>');
			
			setTimeout(function(){
				$b.toggleClass('active-light-player');
			}, 10);
			
		}else{
			$b.toggleClass('active-light-player');
		}		
		
		$t.toggleClass('primary-color-focus').blur();		
		
		return false;		
	});
	
	$d.on('click', '.btn-show-more-cl-control', function(e){
		var $t = $(this);
		var $parents = $t.parents('.tmdb-listing-ct-control');
		
		$parents.toggleClass('full-list-ct');
		
		if(!$parents.hasClass('full-list-ct')){
			$('html, body').stop().animate({scrollTop:$parents.offset().top-200}, {duration:500}, function(){});
		}
	});
}));	