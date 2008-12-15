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
		$('div.fixed-left-column').each(function(){
			$('> div.elastic-column', this.parentNode).css('margin-left', ($(this).css('width') == 'auto') ? $(this).width() : $(this).css('width') )
		});
		
		$('div.fixed-right-column').each(function(){
			$('> div.elastic-column', this.parentNode).css('margin-right', ($(this).css('width') == 'auto') ? $(this).width() : $(this).css('width') )
		});
		
		$('div.same-height').each(function(){
			var height = $(this).outerHeight(true) - ( $(this).outerHeight(true) - $(this).height() );
			$('> div', this).each(function(){
				$(this).css('height', height);
			});
		});
		
		$('div.full-height').each(function(){
			$(this).css('height', $(this.parentNode).height() - ( $(this).outerHeight(true) - $(this).height() ));
		});
		
		$('div.auto-columns').each(function(){
			var container = $('> div.container', this).size()
			var process   = function(jQueryCollection){
				var columns = jQueryCollection.size();
				jQueryCollection.each(function(){
					$(this).css('width', (100/columns) + '%');
				});
			};
			
			if(container > 0){
				process($('> div.container > div.column', this));
			}
			else{
				process($('> div.column', this));
			}
		});
		
		if ($.browser.msie){
			fixIe();
		}
	}
	
	var fixIe = function(){
			$('div.two-columns').each(function(){
				$('> div.column, > div.container > div.column', this).each(function(){
					$(this).css('width', Math.floor($(this.parentNode).width() / 2));
				});
			});
			
			$('div.three-columns').each(function(){
				$('> div.column, > div.container > div.column', this).each(function(){
					if( $(this).hasClass('unit') )
					{
						return;
					}
					
					if( $(this).hasClass('spawn-two') )
					{
						$(this).css('width', Math.floor($(this.parentNode).width() * 0.66));
					}
					else
					{
						$(this).css('width', Math.floor($(this.parentNode).width() * 0.33));
					}
				});
			});
			
			$('div.four-columns').each(function(){
				$('> div.column, > div.container > div.column', this).each(function(){
					if( $(this).hasClass('unit') )
					{
						return;
					}
					
					if( $(this).hasClass('spawn-two') )
					{
						$(this).css('width', Math.floor($(this.parentNode).width() * 0.5 ));
					}
					else if( $(this).hasClass('spawn-three') )
					{
						$(this).css('width', Math.floor($(this.parentNode).width() * 0.75 ));
					}
					else
					{
						$(this).css('width', Math.floor($(this.parentNode).width() *0.25 ));
					}
				});
			});
			
			$('div.four-columns').each(function(){
				var columns      = $('> div.column, > div.container > div.column', this);
				var columnsCount = columns.size();
				columns.each(function(){
					$(this).css('width', Math.floor($(this.parentNode).width() / columnsCount ));
				});
			});
		};
	
	$(function(){
		$('document').bind('elastic', elastic);
		elastic();
		
		if ($.browser.msie){
			$(window).bind('load', fixIe).bind('resize', fixIe);
		}
	});
})(jQuery);
