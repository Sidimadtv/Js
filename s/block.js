/*
Block Feature
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
	
	$d.on('click', '.filter-action-control', function(e){
		
		var $t = $(this);
		var $parent = $t.parents('.filter-block-control');
		var $filter_wrapper = $t.parents('.top-block-header-wrapper');
				
		var query_id = $parent.attr('data-query-id');		
		var $page_settings = $('.beeteam368-pagination[data-query-id="'+(query_id)+'"]');
		var params = (query_id)+'_params';
		
		var filter_item_id = $t.attr('data-id');
		var filter_item_tax = $t.attr('data-taxonomy');
		var filter_item_text = $t.attr('data-text');
		
		var $default_item_text = $parent.find('.default-item-text-control');
		
		if(typeof(vidmov_jav_js_object) !== 'undefined' && typeof(vidmov_jav_js_object[params]) !== 'undefined'){
			
			if(typeof(vidmov_jav_js_object[params]['beeteam368_query_filter']) === 'undefined'){
				vidmov_jav_js_object[params]['beeteam368_query_filter'] = [];
			}
			
			var block_filter_id = $parent.attr('data-block-filter-id');			
			
			vidmov_jav_js_object[params]['beeteam368_query_filter'] = vidmov_jav_js_object[params]['beeteam368_query_filter'].filter(function( obj ) {
				return obj.block_filter_id !== block_filter_id;
			});
			
			vidmov_jav_js_object[params]['beeteam368_query_filter'].push({'filter_item_id':filter_item_id, 'filter_item_tax': filter_item_tax, 'block_filter_id': block_filter_id});
			
			$default_item_text.text(filter_item_text);			
		
			var append_id = '#'+(query_id);
			var $append_id = $(append_id);			
			
			$parent.addClass('filter-action-loading').find('.default-item-control').removeClass('active-item');		
			$filter_wrapper.find('.filter-block-control').addClass('filter-action-loading');	
			$page_settings.addClass('filter-action-loading');				
			$append_id.addClass('filter-action-loading');			
			
			var data = {
				'action': 		'beeteam368_filter_posts',				
				'params':		vidmov_jav_js_object[params],
				'old_query_id': query_id,
				'security':		vidmov_jav_js_object.security,
			}
			
			$.ajax({
				type: 		'POST',
				url: 		vidmov_jav_js_object.admin_ajax,
				cache: 		false,
				data: 		data,
				dataType: 	'json',
				success: 	function(data, textStatus, jqXHR){
					if(typeof(data) === 'object'){
						
						if(data.max_num_pages > 1){							
							$append_id.after(data.pag_html);
							$page_settings.remove();
							
							$page_settings = $('.beeteam368-pagination[data-query-id="'+(query_id)+'"]');	
							$page_settings.attr({'data-total-pages': data.max_num_pages, 'data-percent-items': data.percent_items, 'data-paged': 1});
							
						}else{
							$page_settings.remove();
						}
						
						$append_id.html(data.html);						
						vidmov_jav_js_object[query_id] = data.query_vars;
						
					}
					
					$parent.removeClass('filter-action-loading');
					$filter_wrapper.find('.filter-block-control').removeClass('filter-action-loading');
					$page_settings.removeClass('filter-action-loading');
					$append_id.removeClass('filter-action-loading');
					
				},
				error: function( jqXHR, textStatus, errorThrown ){
					$parent.removeClass('filter-action-loading');
					$filter_wrapper.find('.filter-block-control').removeClass('filter-action-loading');
					$page_settings.removeClass('filter-action-loading')
					$append_id.removeClass('filter-action-loading');
				}
			});
			
		}
		
		e.stopPropagation();		
        return false;
		
	});
}));