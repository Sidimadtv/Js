/*
Live Search
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

    var global_search_action_pro = 1;

    $b.on('beeteam368AdvSearchEmpty', function(e, t, value, parent, keyword_display, uri_search, default_uri, global_search_action){
        global_search_action_pro = global_search_action;

        var $sg_control = parent.find('.beeteam368-live-search-control');

        parent.removeClass('live-search-loading live-search-display');
        $sg_control.find('.beeteam368-suggestion-item-dynamic').remove();
    });

    $b.on('beeteam368AdvSearchNotEmpty', function(e, t, value, parent, keyword_display, uri_search, default_uri, global_search_action){

        global_search_action_pro = global_search_action;

        var $sg_control = parent.find('.beeteam368-live-search-control');

        parent.addClass('live-search-loading');

        setTimeout(function(){

            if(global_search_action_pro > global_search_action || global_search_action_pro === 1){
                return false;
            }

            var query = {
                'action': 'live_search_request',
                'keyword': value,
                'security': vidmov_jav_js_object.security,
            }

            $.ajax({
                type: 'POST',
                url: vidmov_jav_js_object.admin_ajax,
                cache: true,
                data: query,
                dataType: 'json',
                success: function(data, textStatus, jqXHR){

                    if(global_search_action_pro > global_search_action || global_search_action_pro === 1){
                        return false;
                    }

                    if(typeof(data) === 'object' && typeof(data.result) !== 'undefined'){
                        var posts = $.trim(data.result);

                        if(posts != ''){
                            $sg_control.find('.beeteam368-suggestion-item-dynamic').remove();
                            $sg_control.append(posts);
                            parent.addClass('live-search-display');
                        }
                    }

                    parent.removeClass('live-search-loading');
                },
                error: function( jqXHR, textStatus, errorThrown ){
                }
            });

        }, 368);

    });

}));