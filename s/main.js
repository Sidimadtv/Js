/*
VidMov Theme Library
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

    /*support function*/
    function updateQueryStringParameter(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }else {
            return uri + separator + key + "=" + value;
        }
    }

    function detectMobileDevice() {
        var isMobile = false;

        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            isMobile = true;
        }

        return isMobile;
    }
	
	$.isNumber = function(n){
		var _ = this;
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	$.getStylesheet = function (href) {
        var $d = $.Deferred();
        var $link = $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: href
        }).appendTo('head');
        $d.resolve($link);
        return $d.promise();
    }

    $.getUrlExtension = function(url) {
        return url.split(/[#?]/)[0].split('.').pop().trim();
    }

    $.getMultiScripts = function(arr, path) {
        var _arr = $.map(arr, function(scr) {
            if($.getUrlExtension(scr) === 'css'){
                return $.getStylesheet( (path||'') + scr );
            }else if($.getUrlExtension(scr) === 'js'){
                return $.getScript( (path||'') + scr );
            }

        });

        _arr.push($.Deferred(function( deferred ){
            $( deferred.resolve );
        }));

        return $.when.apply($, _arr);
    }
    /*support function*/

    $d.on('click', '.oc-btn-control', function (e) {
        var $t = $(this);
        $b.trigger('beeteam368BeforeOpenSideMenu', [$t]);
        $b.toggleClass('sidemenu-active');
        $b.toggleClass('sidemenu-active-mobile');
        $b.trigger('beeteam368AfterOpenSideMenu', [$t]);
        window.dispatchEvent(new Event('resize'));
    });

    $d.on('click', '.oc-mb-mn-btn-control', function (e) {
        var $t = $(this);
        $b.trigger('beeteam368BeforeOpenMobileMenu', [$t]);
        $h.scrollTop(0).toggleClass('mobile-active');
        $b.toggleClass('mobile-active');
		/*$t.toggleClass('active');*/
        $('.oc-mb-mn-btn-control').toggleClass('active');
        $b.trigger('beeteam368AfterOpenMobileMenu', [$t]);
    });

    $d.on('click', '.menu-items-lyt > li.menu-item-has-children > a', function (e) {

        var $t = $(this);
        var $parent = $t.parents('li');

        if (_w.innerWidth < 992) {

            $parent.toggleClass('active-sub-menu');

            return false;
        }

    });

    $d.on('click', '#side-menu-navigation > li > a', function (e) {
        var $t = $(this);

        $b.trigger('beeteam368BeforeOpenSubMenuSide', [$t]);

        var $parent = $t.parents('li.menu-item-has-children');

        if ($parent.length > 0) {
            $parent.toggleClass('active-sub-menu');
            $t.toggleClass('arrow-down');

            $b.trigger('beeteam368AfterOpenSubMenuSide', [$t]);

            return false;
        }

        $b.trigger('beeteam368AfterOpenSubMenuSide', [$t]);
    });

    $d.on('click', '.beeteam368-i-dark-light-btn-control', function (e) {
        var $t = $(this);
        $b.trigger('beeteam368BeforeSwitchDarkMode', [$t]);
        $b.addClass('temp-disable-transition').toggleClass('dark-mode');

        var $mainLogo = $('.main-logo-control');
        var $mobileLogo = $('.mobile-logo-control');
        var sideLogo = $('.side-logo-control');

        if(typeof(vidmov_jav_js_object)!=='undefined' && typeof(vidmov_jav_js_object.logo_switch)!=='undefined'){
            if($b.hasClass('dark-mode')){
                $mainLogo.html(vidmov_jav_js_object.logo_switch.main_dark);
                $mobileLogo.html(vidmov_jav_js_object.logo_switch.mobile_dark);
                sideLogo.html(vidmov_jav_js_object.logo_switch.side_dark);
				Cookies.set('beeteam368_dark_mode', 'true', { expires: 368 });
            }else{
                $mainLogo.html(vidmov_jav_js_object.logo_switch.main_light);
                $mobileLogo.html(vidmov_jav_js_object.logo_switch.mobile_light);
                sideLogo.html(vidmov_jav_js_object.logo_switch.side_light);
				Cookies.set('beeteam368_dark_mode', 'false', { expires: 368 });
            }
        }

        setTimeout(function(){
            $b.removeClass('temp-disable-transition');
        }, 500);
        $b.trigger('beeteam368AfterSwitchDarkMode', [$t]);
    });

    $d.on('focus', '.beeteam368-searchtext-control', function (e) {
        var $t = $(this);
        $b.trigger('beeteam368BeforeFocusSearch', [$t]);
        $t.parents('.beeteam368-searchbox-wrap-control').addClass('focus-active');

        if(detectMobileDevice()){
            $t.addClass('mobile-focus-status');
        }

        $b.trigger('beeteam368AfterFocusSearch', [$t]);
    });
    $d.on('focusout', '.beeteam368-searchtext-control', function (e) {
        var $t = $(this);
        $b.trigger('beeteam368BeforeFocusOutSearch', [$t]);

        if(!detectMobileDevice()) {
            $t.parents('.beeteam368-searchbox-wrap-control').removeClass('focus-active');
        }

        $b.trigger('beeteam368AfterFocusOutSearch', [$t]);
    });
    $d.on('click', '.beetam368-back-focus-control', function (e) {
        var $t = $(this);
        var $parent = $t.parents('.beeteam368-searchbox-wrap-control');
        $b.trigger('beeteam368BeforeFocusOutSearchClick', [$t]);

        $parent.removeClass('focus-active').find('.beeteam368-searchtext-control').removeClass('mobile-focus-status');

        $b.trigger('beeteam368AfterFocusOutSearchClick', [$t]);
    });

    var global_search_action = 1;
    $d.on('keypress keyup keydown focus', '.beeteam368-searchtext-control', function (e) {
        var $t = $(this);
        var value = $.trim($t.val());
        var $parent = $t.parents('.beeteam368-searchbox-wrap-control');
        var $keyword_display = $parent.find('.beeteam368-sg-keyword-control');
        var $uri_search = $parent.find('.beeteam368-suggestion-item-keyword-block-control');
        var default_uri = $uri_search.attr('data-href');

        if(value === ''){
            global_search_action = 1;
            $parent.removeClass('active-search-keyword');
            $uri_search.attr('href', updateQueryStringParameter(default_uri, 's', ''));
            $b.trigger('beeteam368AdvSearchEmpty', [$t, value, $parent, $keyword_display, $uri_search, default_uri, global_search_action]);
        }else{
            global_search_action++;
            $parent.addClass('active-search-keyword');
            $keyword_display.text(value);
            $uri_search.attr('href', updateQueryStringParameter(default_uri, 's', value));
            $b.trigger('beeteam368AdvSearchNotEmpty', [$t, value, $parent, $keyword_display, $uri_search, default_uri, global_search_action]);
        }
    });
	
	$d.on('click', '.default-item-control, .beeteam368-dropdown-items-control', function(e){
		var $t = $(this);
		var $parent = $t.parents('.filter-block-control');
		
		if($t.hasClass('active-item')){
			$('.default-item-control, .beeteam368-dropdown-items-control').removeClass('active-item');
			$t.removeClass('active-item');
			
			if($parent.length > 0){
				$('.filter-block-control').removeClass('priority-in');
				$parent.removeClass('priority-in');
			}
		}else{
			$('.default-item-control, .beeteam368-dropdown-items-control').removeClass('active-item');
			$t.addClass('active-item');
			
			if($parent.length > 0){
				$('.filter-block-control').removeClass('priority-in');	
				$parent.addClass('priority-in');
			}
		}
		
		e.stopPropagation();		
        return false;		
	});
	$d.on('click', '.drop-down-sort-control, .beeteam368-icon-dropdown-control', function(e){
		var $t = $(this);
		e.stopPropagation();	
	});	
	$d.on('click', function(){
        $('.default-item-control, .beeteam368-dropdown-items-control').removeClass('active-item');
    });
	
	$d.on('click', '.open-social-share-control', function(e){
		var $t = $(this);
		
		$('.beeteam368-social-share-after-player-control').toggleClass('active-item');
		$t.toggleClass('primary-color-focus');
		
		var $parents = $t.parents('.beeteam368-dropdown-items-control');
		
		if($parents.length > 0){
			$parents.removeClass('active-item');
		}
		
		e.stopPropagation();		
        return false;
	});
	
	$.ajax_load_posts = function(t, type){
		var $t = t;
		
		var $parents = $t.parents('.beeteam368-pagination');		
				
		var paged = $parents.attr('data-paged');
		
		if(paged == -1 || $t.hasClass('active-loading')){
			$t.blur();
			return false;
		}
		
		if($.isNumber(paged)){
			paged = parseFloat(paged) + 1;
		}else{
			paged = 2;
		}
		
		$t.addClass('active-loading').blur();	
		
		var template = $parents.attr('data-template');
		var style = $parents.attr('data-style');
		var total_pages = $parents.attr('data-total-pages');
		var append_id = $parents.attr('data-append-id');
		var $append_id = $(append_id);
		var query_id = $parents.attr('data-query-id');
		
		var query_vars;
		if(typeof(query_id)==='undefined'){
			query_vars = vidmov_jav_js_object.query_vars;
		}else{
			if(typeof(vidmov_jav_js_object[query_id]) !== 'undefined'){
				query_vars = vidmov_jav_js_object[query_id];
			}else{
				query_vars = {'error':''};
			}
		}
		
		var data = {
			'action': 		'beeteam368_loadmore_posts',
			'template': 	template,			
			'style': 		style,
			'query_vars':	query_vars,
			'paged': 		paged,
			'security':		vidmov_jav_js_object.security,
		}
		
		if(typeof(vidmov_jav_js_object[(query_id)+'_params'])!=='undefined'){
			data.params = vidmov_jav_js_object[(query_id)+'_params'];
		}
		
		var percent_items = $parents.attr('data-percent-items');
		if(typeof(percent_items)!=='undefined' && paged >= total_pages){
			data['percent_items'] = percent_items;
		}
		
		$.ajax({
			type: 		'POST',
			url: 		vidmov_jav_js_object.admin_ajax,
			cache: 		true,
			data: 		data,
			dataType: 	'html',
			success: 	function(data, textStatus, jqXHR){
				if($.trim(data) != ''){
				
					$append_id.append(data);
					
					$parents.attr('data-paged', paged);
					
					$b.trigger('beeteam368AjaxLoadMoreComplete', [$t]);
				
				}else{
					$parents.attr('data-paged', -1);
				}
				
				if(paged == total_pages){
					$parents.attr('data-paged', -1);
					
					if(type === 'loadmore_btn'){
						$t.find('.loadmore-text-control').html('<i class="fas fa-cat"></i> &nbsp; '+ (vidmov_jav_js_object.no_more_posts_to_load_text));
					}else if(type === 'infinite_scroll'){
						$parents.html('<button class="loadmore-btn loadmore-btn-control"><span class="loadmore-text loadmore-text-control"><i class="fas fa-cat"></i> &nbsp; '+(vidmov_jav_js_object.no_more_posts_to_load_text)+'</span></button>');
					}
				}				
								
				$t.removeClass('active-loading').blur();
				
			},
			error: function( jqXHR, textStatus, errorThrown ){
				$parents.attr('data-paged', -1);
				$t.removeClass('active-loading').blur();
			}
		});
	}

    $d.on('click', '.loadmore-btn-control', function (e) {
		var $t = $(this);
		$.ajax_load_posts($t, 'loadmore_btn');		
    });
	
	$.ajax_infinite_scroll = function(){
		var $infinite = $b.find('.infinite-control');
		
		if($infinite.length === 0){			
			return;
		}
		
		$infinite.each(function(index, element){
			var $t = $(this),
				ajaxVisible 	= $t.offset().top,
				ajaxScrollTop 	= $(window).scrollTop()+$(window).height();
				
			if(ajaxVisible <= (ajaxScrollTop) && (ajaxVisible + $(window).height()) > ajaxScrollTop){
				$.ajax_load_posts($t, 'infinite_scroll');
			};	
		});
	}
	
	$d.on('click', '.beeteam368-global-popup-content-control', function (e) {
		e.stopPropagation();
	});
	
	$d.on('click', '.beeteam368-global-popup-control', function (e) {
		var $t = $(this);
		var $popup = $t;
		var $popup_mess = $popup.find('.beeteam368-popup-mess-control');
		var $popup_content = $popup.find('.beeteam368-global-popup-content-control');
		
		var mess = vidmov_jav_js_object.want_to_exit_text;					
		if($popup_content.hasClass('active-loading')){			
			mess = vidmov_jav_js_object.processing_data_do_not_close_text;
		}
		
		$popup_mess.find('.text-mess-control').text(mess);		
		
		if($popup_content.hasClass('active-loading') || $popup_content.find('.form-submit-edit-control[name="submit-edit-posts"]').length > 0){
			$popup_mess.addClass('active-item');
		}else{
			$popup_mess.removeClass('active-item');
			$popup.removeClass('active-item');
		}
		
	});
	
	$d.on('click', '.beeteam368-global-open-popup-control', function (e) {
		
		var $t = $(this);
		var popup_spe = $t.attr('data-popup-id');
		var $popup = $('.beeteam368-global-popup-control[data-popup-id="'+(popup_spe)+'"]');
		var $popup_content = $popup.find('.beeteam368-global-popup-content-control');
		
		if($popup.length === 0){			
			return false;
		}
		
		var action = $t.attr('data-action');;
		
		$b.trigger('beeteam368BeforeClickOpenPopupAction', [$t, popup_spe, $popup, $popup_content, action]);		
		
		var text_replace = $t.attr('data-text-replace');
		var target_element = $t.attr('data-target-element');
		
		if(typeof(text_replace)!=='undefined' && typeof(target_element)!=='undefined'){
			$popup.find(target_element).text(text_replace);
		}
		
		if($popup_content.find('.beeteam368-popup-close-control').length === 0){
			$popup_content.prepend('<span class="beeteam368-icon-item beeteam368-popup-close beeteam368-popup-close-control"><i class="fas fa-times"></i></span>');
		}
		
		if($popup_content.find('.beeteam368-popup-mess-control').length === 0){
			$popup_content.prepend('<span class="beeteam368-popup-mess beeteam368-popup-mess-control"><span class="text-mess text-mess-control">'+(vidmov_jav_js_object.want_to_exit_text)+'</span><button class="beeteam368-sub-popup-stay-control"><i class="icon fas fa-hourglass-end"></i><span>'+(vidmov_jav_js_object.stay_text)+'</span></button> &nbsp; <button class="beeteam368-sub-popup-close-control"><i class="icon far fa-window-close"></i><span>'+(vidmov_jav_js_object.exit_text)+'</span></button></span>');
		}
		
		var $popup_mess = $popup.find('.beeteam368-popup-mess-control');
		
		$popup_content.on('click', '.beeteam368-popup-close-control', function(){			
			var mess = vidmov_jav_js_object.want_to_exit_text;					
			if($popup_content.hasClass('active-loading')){			
				mess = vidmov_jav_js_object.processing_data_do_not_close_text;
			}
			
			$popup_mess.find('.text-mess-control').text(mess);
			
			if($popup_content.hasClass('active-loading') || $popup_content.find('.form-submit-edit-control[name="submit-edit-posts"]').length > 0){
				$popup_mess.addClass('active-item');
			}else{
				$popup_mess.removeClass('active-item');
				$popup.removeClass('active-item');
			}

		});
		
		$popup_content.on('click', '.beeteam368-sub-popup-stay-control', function(){
			$popup_mess.removeClass('active-item');
		});
		
		$popup_content.on('click', '.beeteam368-sub-popup-close-control', function(){
			$popup_mess.removeClass('active-item');
			$popup.removeClass('active-item');
		});
		
		$popup.addClass('active-item');
		
		
		$b.trigger('beeteam368AfterClickOpenPopupAction', [$t, popup_spe, $popup, $popup_content, action]);
		
		e.stopPropagation();
		
		return false;	
	});
	
	$.collapse_content = function(){
		
		var $collapse_content = $('.collapse-content-control');
		
		if($collapse_content.length > 0){
			if($collapse_content.outerHeight() >= 168){
				
				if($('.show-more-content-control').length === 0){
					
					$collapse_content.addClass('collapse-content');
					$collapse_content.after('<div class="show-more-content show-more-content-control"><button class="small-style reverse btn-show-more-content-control"><i class="icon fas fa-angle-double-down"></i><span>'+(vidmov_jav_js_object.show_more_text)+'</span></button></div>');
					
					var $show_more_content_control = $('.btn-show-more-content-control');				
					$show_more_content_control.on('click', function(){
						$collapse_content.toggleClass('collapse-content');
						if($collapse_content.hasClass('collapse-content')){
							$(this).find('span').text(vidmov_jav_js_object.show_more_text);
							$(this).find('i.icon').removeClass('fas fa-angle-double-up').addClass('fas fa-angle-double-down');
						}else{
							$(this).find('span').text(vidmov_jav_js_object.show_less_text);
							$(this).find('i.icon').removeClass('fas fa-angle-double-down').addClass('fas fa-angle-double-up');
						}
					});
					
				}
				
			}else{
				$collapse_content.removeClass('collapse-content');
				if($('.show-more-content-control').length > 0){					
					$('.show-more-content-control').remove();
				}
			}
		}
		
	}

    $d.ready(function () {

        if (vidmov_jav_js_object.side_menu === 'on') {
            OverlayScrollbars(document.getElementById('beeteam368-side-menu-body'), {
                scrollbars: {
                    autoHide: 'leave',
                },
				overflowBehavior: {
					x: 'hidden',
					y: 'scroll',
				}
            });
        }
		
		$b.find('.widget_nav_menu ul.menu > li.menu-item-has-children').each(function(index, element) {
			var $t = $(this);
			var	btn_control_class = 'open-submenu-'+(index);
			$t.append('<span class="open-submenu-mobile '+(btn_control_class)+'"><i class="fas fa-angle-right"></i></span>').find('.'+(btn_control_class)).on('click', function(){
				$t.toggleClass('active-sub-menu').children('ul').slideToggle({duration:368});
			});
		});
		
		$.ajax_infinite_scroll();
		
		if(typeof(vidmov_jav_js_object.collapse_content_check) !== 'undefined'){
			$.collapse_content();
			$w.on('resize', function(){
				$.collapse_content();
			});
		}

		if(typeof(vidmov_jav_js_object.js_library) !== 'undefined' && typeof(vidmov_jav_js_object.js_library.swiper_js) !== 'undefined'){
			if($('.is-single-slider').length > 0){		
				
				var script_arr = [];				
				script_arr.push(vidmov_jav_js_object.js_library.swiper_css);
				script_arr.push(vidmov_jav_js_object.js_library.swiper_js);
				
				$.getMultiScripts(script_arr).done(function() {
                    const beeteam368_gallery_post = new Swiper('.is-single-slider', {	
						effect: 'flip',
						autoHeight: true,
        				grabCursor: true,
						pagination: {
							el: '.swiper-pagination',
							clickable: true,
						},
						navigation: {
							nextEl: '.swiper-button-next',
							prevEl: '.swiper-button-prev',
						},
					});
                }).fail(function(error) {                   
                });						
				
			}
		}
		
    });
	
	if(typeof(vidmov_jav_js_object.sticky_menu) !== 'undefined' && vidmov_jav_js_object.sticky_menu === 'on'){
	
		$('.beeteam368-site-header-control .beeteam368-main-menu-control').clone(true).addClass('sticky-menu sticky-menu-control').appendTo('.beeteam368-site-header-control');
		$('.beeteam368-site-header-control .beeteam368-main-menu-control.sticky-menu-control').find('.beeteam368-megamenu-control').attr('id', function(){return $(this).attr('id') + '-mgmn'}).removeClass('ready-loaded');
		$('.beeteam368-site-header-control .beeteam368-main-menu-control.sticky-menu-control').find('.megamenu-item-control').attr('data-id', function(){return $(this).attr('data-id') + '-mgmn'});
		$('.beeteam368-site-header-control .beeteam368-main-menu-control.sticky-menu-control').find('.megamenu-blog-wrapper-control').attr('data-id', function(){return $(this).attr('data-id') + '-mgmn'}).html('');
	
	}
	
	$.fnc_sticky_menu = function(){
		
		if(typeof(vidmov_jav_js_object.sticky_menu) === 'undefined' || vidmov_jav_js_object.sticky_menu !== 'on'){
			return;
		}
		
		var $site_header = $('.beeteam368-site-header-control');
		
		if($w.scrollTop() > $site_header.offset().top + $site_header.height() + 50 && GlobalBeeTeam368VidMovStickyMenu === 0){
			GlobalBeeTeam368VidMovStickyMenu = 1;
			$b.addClass('beeteam368-sticky-menu');			
			$d.trigger('beeteam368StickyMenuShow', []);			
		}else if($w.scrollTop() <= $site_header.offset().top + $site_header.height() && GlobalBeeTeam368VidMovStickyMenu === 1){
			GlobalBeeTeam368VidMovStickyMenu = 0;			
			$b.removeClass('beeteam368-sticky-menu');
			$d.trigger('beeteam368StickyMenuHide', []);
		}
		
		return false;		
	}
	
	$w.on('scroll', function(){
		$.ajax_infinite_scroll();
		$.fnc_sticky_menu();
	});
	
	if(detectMobileDevice()){
		
		_w.onpageshow = function(e) {
			if (e.persisted) {
				_w.location.reload();
			}	
		}
		
		var detect_class_preview_control = '.preview-mode-control .blog-img-link-control';
		
		$d.on('click', detect_class_preview_control, function(e){
			var $t = $(this);
			if(!$t.hasClass('go-to-link')){
				$((detect_class_preview_control)+'.go-to-link').removeClass('go-to-link');
				$t.addClass('go-to-link');
				e.stopPropagation();
				return false;	
			}
		});
		
		$d.on('mouseleave', detect_class_preview_control, function(e){			
			var $t = $(this);									
			$t.removeClass('go-to-link');
		});
		
		$b.on('beeteam368AfterClickOpenReactions beeteam368AfterClickWatchLaterAction beeteam368AfterClickRegLogAction', function(e, t){
			var $parent = t.parents('.preview-mode-control');
			var $blog_img_link = $parent.find('.blog-img-link-control');
			
			if($parent.length > 0 && $blog_img_link.length > 0){
				$blog_img_link.addClass('go-to-link');
			}
		});
		
	}
}));