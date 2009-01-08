/**
 * Elastic Helpers
 *
 * Helper functions serve to easily accomplish common task that either are too dificult to implement with pure css
 * or are only possible with javascript.
 * That is why helpers serve as a compliment for the DOM so classes have an expected behaviour easily
 *
 * LICENSE: It is planned to release it as MIT
 *
 * @author     Fernando Trasviña
 * @copyright  2008 Elastic css framework
 * @license    MIT
 * @version    0.2
 * @link       elastic/dev/helpers.js
 * @since      0.1
*/
(function($){
	var elastic = function(){		
		$('.fixed-left-column').each(function(){
			$('> div.elastic-column', this.parentNode).css('margin-left', ($(this).css('width') == 'auto') ? $(this).width() : $(this).css('width') )
		});
		
		$('.fixed-right-column').each(function(){
			$('> div.elastic-column', this.parentNode).css('margin-right', ($(this).css('width') == 'auto') ? $(this).width() : $(this).css('width') )
		});
		
		$('.same-height').each(function(){
			var height = $(this).outerHeight(true) - ( $(this).outerHeight(true) - $(this).height() );
			$('> div', this).each(function(){
				$(this).css('height', height);
			});
		});
		
		$('.full-height').each(function(){
			$(this).css('height', $(this.parentNode).height() - ( $(this).outerHeight(true) - $(this).height() ));
		});
		
		$('.auto-columns').each(function(){
			var container = $('> div.container', this).size()
			var process   = function(jQueryCollection){
				var columns = jQueryCollection.size();
				jQueryCollection.each(function(){
					$(this).css('width', (100/columns) + '%');
				});
			};
			
			if(container > 0){
				process($('> .container > .column', this));
			}
			else{
				process($('> .column', this));
			}
		});
	};
	
	elastic.reset = function(){
		$('.same-height > .column, .full-height').css('height', '');
		$('.auto-columns > div').css('width', '');
	};
	
	elastic.refresh = function(){
		elastic.reset();
		elastic();
	};
	
	if($.browser != msie)
	{
		$(elastic);
	}
	
	$(function(){
		$('document').bind('elastic', elastic.refresh);
		$(window).bind('resize', elastic.refresh).bind('load', elastic.refresh);
	});
	
})(jQuery);
