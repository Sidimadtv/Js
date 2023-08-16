/*
VidMov Megamenu
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
    var $b = $('body');

    var global_megamenu_fetch_data = [];

    $d.on('mouseenter', '.beeteam368-megamenu-control', function (e) {
        var $t = $(this);
        var $chid = $t.find('.megamenu-wrapper-control');
    });

    $d.on('mouseenter', '.megamenu-item-control', function (e) {
        var $t = $(this);
        var id_control = $t.attr('data-id');
        var $parent = $t.parents('.megamenu-wrapper-control');

        $parent.find('.megamenu-item-control, .megamenu-blog-wrapper-control').removeClass('active').addClass('hidden');
        $t.removeClass('hidden').addClass('active');

        var $wrap_blog = $parent.find('.megamenu-blog-wrapper-control[data-id="' + (id_control) + '"]');

        $wrap_blog.removeClass('hidden').addClass('active');
    });

    $d.on('mouseenter', '.beeteam368-megamenu-control', function (e) {

        var $t = $(this);
        var id = $t.attr('id');

        if (typeof (global_megamenu_fetch_data[id]) !== 'undefined' || $t.hasClass('ready-loaded')) {
            return;
        }

        if ($t.find('.megamenu-blog-items-control').length === 0) {

            global_megamenu_fetch_data[id] = true;

            var $blog_control = $t.find('.megamenu-blog-wrapper-control');

            if ($blog_control.length === 0) {
                global_megamenu_fetch_data[id] = true;
                return;
            }

            var arr_data_taxs = [];

            $blog_control.each(function (i, e) {
                arr_data_taxs.push([$(this).attr('data-id'), $(this).attr('data-tax-object'), $(this).attr('data-tax-id')]);
            });

            var data = {
                'action': 'megamenu_first_request',
                'taxs': arr_data_taxs,
                'security': vidmov_jav_js_object.security,
            }

            $.ajax({
                type: 'POST',
                url: vidmov_jav_js_object.admin_ajax,
                cache: true,
                data: data,
                dataType: 'json',
                success: function (data, textStatus, jqXHR) {
                    if (typeof (data) === 'object') {

                        for (var key_item in data) {
                            if (!data.hasOwnProperty(key_item)) {
                                continue;
                            }

                            var pagination = '';
                            var total_pages = data[key_item]['total_pages'];
                            var html = data[key_item]['html'];

                            if (total_pages > 1) {
                                pagination = '<div class="megamenu-blog-paged megamenu-blog-paged-control"><div class="megamenu-prev-next-control prev-next-btn prev-btn hidden" data-action="prev"><i class="fas fa-arrow-left"></i></div><div class="megamenu-prev-next-control prev-next-btn next-btn" data-action="next"><i class="fas fa-arrow-right"></i></div></div>'
                            }

                            if ($t.find('.megamenu-blog-wrapper-control[data-id="' + (key_item) + '"]').length > 0) {
                                $t.find('.megamenu-blog-wrapper-control[data-id="' + (key_item) + '"]').append((html) + (pagination)).attr({
                                    'data-total-pages': total_pages,
                                    'data-current-paged': 1
                                });
                            }
                        }

                        setTimeout(function () {
                            $t.addClass('ready-loaded');
                            global_megamenu_fetch_data[id] = true;
                        }, 368);
                    }
                }
            });
        }
    });

    $d.on('click', '.megamenu-prev-next-control', function (e) {
        var $t = $(this);
        var action = $t.attr('data-action');
        var $parent = $t.parents('.megamenu-blog-wrapper-control');
        var $prevbtn = $parent.find('.megamenu-prev-next-control[data-action="prev"]');
        var $nextbtn = $parent.find('.megamenu-prev-next-control[data-action="next"]');
        var totalPages = parseFloat($parent.attr('data-total-pages'));
        var currentPaged = parseFloat($parent.attr('data-current-paged'));

        var action_data = function (paged, comparePage, act, timeout = 0) {
            setTimeout(function () {
                $parent.find('.megamenu-blog-items-control').removeClass('active');
                $parent.find('.megamenu-blog-items-control[data-paged="' + (paged) + '"]').addClass('active');

                switch (act) {
                    case 'prev':
                        $nextbtn.removeClass('hidden');
                        if (paged === comparePage) {
                            $prevbtn.addClass('hidden');
                        }
                        break;

                    case 'next':
                        $prevbtn.removeClass('hidden');
                        if (paged === comparePage) {
                            $nextbtn.addClass('hidden');
                        }
                        break;
                }

                $parent.attr({'data-current-paged': paged}).removeClass('tax-loading');
            }, timeout);
        }

        switch (action) {
            case 'prev':
                var prevPaged = (currentPaged - 1);
                action_data(prevPaged, 1, action);
                break;

            case 'next':
                if (currentPaged < totalPages) {
                    var nextPaged = (currentPaged + 1);
                    var $nextPagedItem = $parent.find('.megamenu-blog-items-control[data-paged="' + (nextPaged) + '"]');

                    if ($nextPagedItem.length > 0) {
                        action_data(nextPaged, totalPages, action);
                    } else {

                        $parent.addClass('tax-loading');

                        var data = {
                            'action': 'megamenu_blog_request',
                            'tax': [$parent.attr('data-tax-object'), $parent.attr('data-tax-id')],
                            'paged': nextPaged,
                            'security': vidmov_jav_js_object.security,
                        }

                        $.ajax({
                            type: 'POST',
                            url: vidmov_jav_js_object.admin_ajax,
                            cache: true,
                            data: data,
                            dataType: 'html',
                            success: function (data, textStatus, jqXHR) {
                                data = $.trim(data);
                                if (data.toString() !== '' && data.toString() !== '0') {
                                    $parent.prepend(data);
                                    action_data(nextPaged, totalPages, action, 368);
                                }
                            }
                        });
                    }
                }
                break;
        }
    });

}));