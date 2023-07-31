jQuery(document).ready(function()
{
	// accordion
    jQuery(document).on('click', '.cwp-list-content-accordion', function()
	{
        var id = jQuery(this).data('id');
		var parent = jQuery(this).closest('.wp-block-cwp-accordion');
        
		/* do not collapse other
		jQuery('.cwp-list-content-accordion').each(function()
		{
            jQuery('.cwp-list-content-panel').slideUp("slow");
            jQuery('.cwp-list-content-panel').removeClass('active');
        });*/

        if(jQuery(this).hasClass('active'))
		{
            parent.find('.show-panel' + id).slideUp('fast');
            parent.find('.show-panel' + id).removeClass('active');
            jQuery(this).removeClass('active');
        }
		else
		{
			parent.find('.show-panel' + id).slideDown('fast');
            parent.find('.show-panel' + id).addClass('active');
            jQuery(this).addClass('active');
        }
    });
	
	// countdown
	var countdownInterval = [];
	jQuery('.countdown-timer').each(function(i)
	{
		var counter = i;
		var current = jQuery(this);

		// Update the count down every 1 second
		countdownInterval[counter] = setInterval(function()
		{
			var date_time = current.data('time');
			var countDownDate = new Date(date_time).getTime();
			
			// Get todays date and time
			var now = new Date().getTime();

			// Find the distance between now and the count down date
			var distance = countDownDate - now;

			// Time calculations for days, hours, minutes and seconds
			var years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
			var months = Math.floor(distance % (1000 * 60 * 60 * 24 * 365) / (1000 * 60 * 60 * 24 * 31));
			var days = Math.floor(distance % (1000 * 60 * 60 * 24 * 31) / (1000 * 60 * 60 * 24));
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			// If the count down is over, write some text 
			if(distance < 0 || isNaN(countDownDate))
			{
				current.find('.clockdiv').hide();
				current.find('.clockdiv-msg').show();
				current.find('.clockdiv-msg').html("Time expired")
				clearInterval(countdownInterval[counter]);
			}
			else
			{
				current.find('.clockdiv').show();
				current.find('.clockdiv-msg').hide();
				current.find('.countdown-years').html(years);
				current.find('.countdown-months').html(months);
				current.find('.countdown-days').html(days);
				current.find('.countdown-hours').html(hours);
				current.find('.countdown-minutes').html(minutes);
				current.find('.countdown-seconds').html(seconds);
			}
		});
	});
	
	// Container fancy animated
	jQuery('.wp-block-cwp-container-fancy-animated').waypoint(function()
	{
		if(jQuery('.wp-block-cwp-container-fancy-animated.cwp-calc-auto').length)
		{
			fancyContainerDoResize(jQuery(this.element));
		}
		
		jQuery(this.element).find('.cwp-inner-block-image').addClass('cwp-visible');
		jQuery(this.element).find('.cwp-main-wrapper').addClass('cwp-visible');
	}, { offset: '100%' });
	
	// auto size background
	if(jQuery('.wp-block-cwp-container-fancy-animated.cwp-calc-auto').length)
	{
		var fancyContainerResizingTimeout;
		jQuery(window).resize(function() {
			clearTimeout(fancyContainerResizingTimeout);
			fancyContainerResizingTimeout = setTimeout(fancyContainerDoneResizing, 500);
		});
	}
	
	// resize timeout to append auto background size
	function fancyContainerDoneResizing()
	{
		jQuery('.wp-block-cwp-container-fancy-animated.cwp-calc-auto').each(function()
		{
			fancyContainerDoResize(jQuery(this));
		});
	}
	
	// really do resize: called before animate and after resize
	function fancyContainerDoResize(element)
	{
		var blockAutoID = element.find('.cwp-common-main-wrap-inner').attr('id');

		var windowWidth = jQuery('body').width();
		var containerWidth = element.find('.cwp-common-main-wrap-inner').width();
		var imageContainerWidth = element.find('.cwp-inner-block-image').width();

		var calcSize = ((windowWidth - containerWidth) / 2) + (imageContainerWidth / 2);

		if(element.hasClass('cwp-image-left')) {
			element.find('style.cwp-auto-calc-settings').html('.wp-block-cwp-container-fancy-animated.cwp-image-left #' + blockAutoID + ' .cwp-main-wrapper.cwp-visible::before { left:' + calcSize + 'px }');
		}
		else if(element.hasClass('cwp-image-right')) {
			element.find('style.cwp-auto-calc-settings').html('.wp-block-cwp-container-fancy-animated.cwp-image-right #' + blockAutoID + ' .cwp-main-wrapper.cwp-visible::before { right:' + calcSize + 'px }');
		}
	}
	
	// Count Up
	jQuery('.wp-block-cwp-countup').waypoint(function()
	{
		if(jQuery(this.element).data('finished') !== true)
		{
			jQuery(this.element).data('finished', true);
			jQuery(this.element).find('.cwp-main-target').each(function(i, el)
			{
				setTimeout(function()
				{
					dataTarget = jQuery(el).data('target')
					jQuery(el).find('.cwp-main-target-value').countTo({
						from: 0,
						to: dataTarget,
						speed: 1000,
						refreshInterval: 50,
					});
				}, 500+(i*500));
			});
		}
	}, { offset: '100%' });
	
	// launch
	jQuery(document).on('click', '.wp-block-cwp-launch .cwp-image > img', function()
	{
		if(!jQuery(this).hasClass('animate'))
		{
			jQuery(this).addClass('animate');
			jQuery(this).animate({ left:'-100%' }, 1000, function(){
				jQuery(this).css({left:'auto', display:'none'}).fadeIn(500, function() {
					jQuery(this).removeClass('animate');
				});
			});	
		}
	});
	
	// Progress
	jQuery('.wp-block-cwp-progress').waypoint(function()
	{
		if(jQuery(this.element).data('finished') !== true)
		{
			jQuery(this.element).data('finished', true);
			var progress = jQuery(this.element).find('.cwp-progress');
			
			progress.find('.cwp-progress-inner-bar').css({
				width: progress.data('target')+'%'
			});
		}
	}, { offset: '100%' });

	// slider
    if(jQuery('.cwp-slider').length > 0)
	{
        var $column = jQuery('.cwp-slider').data('column');
        jQuery('.cwp-slider').slick({
            infinite: false,
            slidesToShow: $column,
            slidesToScroll: $column,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: $column,
                        slidesToScroll: $column,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
});

// Donation
jQuery(document).ready(function()
{
	// getScript only if donation is present
    if(jQuery('.wp-block-cwp-donations').length > 0)
	{
		if(typeof(StripeCheckout) === "undefined")
		{
			jQuery.getScript('https://checkout.stripe.com/checkout.js', function(data, textStatus, jqxhr)
			{
				if(typeof(StripeCheckout) === "object")
				{
					var stripeAmount = '';
					var stripeHandler = StripeCheckout.configure({
						key: php_vars.stripeKey,
						locale: 'auto',
						image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
						token: function(stripeToken) {
							jQuery('.wp-block-cwp-donations').find('.cwp-stripe-charge').hide();
							jQuery('.wp-block-cwp-donations').find('.cwp-stripe-charge-processing').show();
							jQuery.ajax({
								method: 'POST',
								dataType: 'json',
								url: php_vars.stripeUrl,
								data: {
									token: stripeToken,
									amount: stripeAmount
								},
								error: function(err)
								{
									jQuery('.wp-block-cwp-donations').find('.cwp-stripe-charge').hide();
									jQuery('.wp-block-cwp-donations').find('.cwp-stripe-charge-error').show();
								}
							}).done(function(data)
							{
								jQuery('.wp-block-cwp-donations').find('.cwp-stripe-charge').hide();
								if(data.status === 'success')
								{
									jQuery('.wp-block-cwp-donations').find('.cwp-stripe-charge-success').show(); }
								else
								{
									jQuery('.wp-block-cwp-donations').find('.cwp-stripe-charge-error').show();
									jQuery('.wp-block-cwp-donations').find('.cwp-stripe-charge-error-message').html(data.message).show();
								}
							});
						}
					});

					jQuery('.cwp-content-donation > ul > li').click(function(e)
					{
						e.preventDefault();

						stripeAmount = jQuery(this).text();
						stripeAmount = jQuery.trim(stripeAmount);
						if(jQuery.isNumeric(stripeAmount)) { stripeAmount = stripeAmount*100; }

						stripeHandler.open({
							name: php_vars.stripeName,
							currency: php_vars.stripeCurrency,
							amount: stripeAmount
						});
					});

					jQuery('.cwp-custom-pay-amount').keypress(function(e){
						if(e.which == 13)
						{
							stripeDonor = jQuery(this).closest('.wp-block-cwp-donations');
							customDonorAmount(stripeDonor);
						}
					});

					jQuery('.cwp-custom-pay-amount-button').click(function(e)
					{
						e.preventDefault();

						stripeDonor = jQuery(this).closest('.wp-block-cwp-donations');
						customDonorAmount(stripeDonor);
					});

					function customDonorAmount(stripeDonor)
					{
						stripeAmount = stripeDonor.find('.cwp-custom-pay-amount').val();
						stripeAmount = jQuery.trim(stripeAmount);
						if(jQuery.isNumeric(stripeAmount)) { stripeAmount = stripeAmount*100; }

						if(stripeAmount >= 1)
						{
							stripeHandler.open({
								name: php_vars.stripeName,
								currency: php_vars.stripeCurrency,
								amount: stripeAmount
							});
						}
						else
						{
							stripeDonor.find('.cwp-stripe-charge').hide();
							stripeDonor.find('.cwp-stripe-charge-error').show();
						}
					}
				}
				else
				{
					alert('Connection to payment gateway failed. Please try again later.');
				}
			});
		}
    }
});

// Social media
(function(window, jQuery)
{
	'use strict';

	var popupCenter = function(url, title, w, h)
	{	
		// Fixes dual-screen position Most browsers Firefox
		var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
		var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
		var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
		var left = ((width / 2) - (w / 2)) + dualScreenLeft;
		var top = ((height / 3) - (h / 3)) + dualScreenTop;
		var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

		// Puts focus on the newWindow
		if (window.focus) {
			newWindow.focus();
		}
	};

	jQuery(document).ready(function()
	{
		jQuery(document).on('click', '.wp-block-cwp-social-share .cwp-button', function(e)
		{
			var _this = jQuery(this);
			popupCenter(_this.attr('href'), _this.html(), 580, 470);
			e.preventDefault();

		});
	});

})(window, jQuery);

// Count Up
// https://stackoverflow.com/questions/2540277/jquery-counter-to-count-up-to-a-target-number
(function($) {
    $.fn.countTo = function(options) {
        // merge the default plugin settings with the custom options
        options = $.extend({}, $.fn.countTo.defaults, options || {});

        // how many times to update the value, and how much to increment the value on each update
        var loops = Math.ceil(options.speed / options.refreshInterval),
            increment = (options.to - options.from) / loops;

        return $(this).each(function() {
            var _this = this,
                loopCount = 0,
                value = options.from,
                interval = setInterval(updateTimer, options.refreshInterval);

            function updateTimer() {
                value += increment;
                loopCount++;
                $(_this).html(value.toFixed(options.decimals));

                if (typeof(options.onUpdate) == 'function') {
                    options.onUpdate.call(_this, value);
                }

                if (loopCount >= loops) {
                    clearInterval(interval);
                    value = options.to;

                    if (typeof(options.onComplete) == 'function') {
                        options.onComplete.call(_this, value);
                    }
                }
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0,  // the number the element should start at
        to: 100,  // the number the element should end at
        speed: 1000,  // how long it should take to count between the target numbers
        refreshInterval: 100,  // how often the element should be updated
        decimals: 0,  // the number of decimal places to show
        onUpdate: null,  // callback method for every time the element is updated,
        onComplete: null,  // callback method for when the element finishes updating
    };
})(jQuery);