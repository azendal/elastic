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
			$('> .elastic-column', this.parentNode).css('margin-left', ($(this).css('width') == 'auto') ? $(this).width() : $(this).css('width') )
		});
		
		$('.fixed-right-column').each(function(){
			$('> .elastic-column', this.parentNode).css('margin-right', ($(this).css('width') == 'auto') ? $(this).width() : $(this).css('width') )
		});
		
		$('.fixed-center-column').each(function(){
			$('> .elastic-left-column, > .elastic-right-column', this.parentNode).css('width', $(this.parentNode).width() / 2 - $(this).width() / 2 );
		});
		
		$('.auto-columns').each(function(){
			var columns = $('> .column, > .container > .column', this);
			var columnsSize = columns.size();
			columns.each(function(){
				$(this).css('width', (100/columnsSize) + '%');
			});
		});
		
		$('.full-width').each(function(){
			$(this).width( $(this.parentNode).width() - ( $(this).outerWidth(true) - $(this).width() ) );
		});
		
		$('.same-height').each(function(){
			var height = $(this).outerHeight(true) - ( $(this).outerHeight(true) - $(this).height() );
			$('> .column, > .container > .column', this).each(function(){
				$(this).css('height', height);
			});
		});
		
		$('.equalized-height').each(function(){
			var columns = $('> .column, > .container > .column', this);
			var maxHeight = 0;
			columns.each(function(){
				var currentHeight = $(this).outerHeight(true);
				maxHeight = (maxHeight > currentHeight) ? maxHeight : currentHeight;
			})
			.each(function(){
				$(this).css('height', maxHeight)
			});
		});
		
		$('.full-height').each(function(){
			$(this).css('height', $(this.parentNode).height() - ( $(this).outerHeight(true) - $(this).height() ));
		});
		
		$('.vertical-center, .center').each(function(){
			var paddingTop = ( ( $(this.parentNode).height() - $(this).outerHeight(true) ) / 2 );
			$(this.parentNode).css({
				paddingTop : paddingTop + 'px',
				height     : ( $(this.parentNode).css('height') ) ? ( $(this.parentNode).outerHeight() - paddingTop ) : ''
			});
		});
	};
	
	elastic.reset = function(){
		$('.same-height > .column, .same-height > .container > .column, .full-height, .equalized-height').css('height', '');
		$('.vertical-center, .center').each(function(){
			$(this.parentNode).css('padding-top', '');
		});
		$('.auto-columns > div, .full-width').css('width', '');
	};
	
	elastic.refresh = function(){
		elastic.reset();
		if($.browser.msie){
			elastic.ie.forceWidth();
			if($.browser.version < 8.0){
				elastic.ie.forceClear();
			}
		}
		elastic();
	};
	
	elastic.ie = {
		forceClear : function(){
			$('.two-columns, .three-columns, .four-columns, .column, .unit, .container').append('<hr class="clearfix" />');
		},
		forceWidth : function(){
			$('.two-columns').each(function(){
				$('> .column, > .container > .column', this).each(function(){
					$(this).css('width', Math.floor($(this.parentNode).width() / 2));
				});
			});
			
			$('.three-columns').each(function(){
				$('> .column, > .container > .column', this).each(function(){
					if( $(this).hasClass('unit') ){
						return;
					}
					if( $(this).hasClass('span-2') ){
						$(this).css('width', Math.floor($(this.parentNode).width() * 0.66));
					}
					else{
						$(this).css('width', Math.floor($(this.parentNode).width() * 0.33));
					}
				});
			});
			
			$('.four-columns').each(function(){
				$('> .column, > .container > .column', this).each(function(){
					if( $(this).hasClass('unit') ){
						return;
					}
					
					if( $(this).hasClass('span-2') ){
						$(this).css('width', Math.floor($(this.parentNode).width() * 0.5 ));
					}
					else if( $(this).hasClass('span-3') ){
						$(this).css('width', Math.floor($(this.parentNode).width() * 0.75 ));
					}
					else{
						$(this).css('width', Math.floor($(this.parentNode).width() * 0.25 ));
					}
				});
			});
			
			$('.auto-columns').each(function(){
				var columns = $('> .container > .column, > .column', this);
				var columnsLength = columns.size();
				columns.each(function(){
					$(this).css('width', Math.floor($(this.parentNode).width() / columns ));
				});
			});
		}
	};
	
	if($.browser.msie){
		$(window)
			.bind('resize', elastic.refresh)
			.bind('load', function(){
				$(document).bind('elastic', elastic.refresh);
				elastic.ie.forceWidth();
				if($.browser.version < 8.0){
					elastic.ie.forceClear();
				}
				elastic();
			});
	}
	else{
//		$(elastic);
//		$(function(){
//			$(document).bind('elastic', elastic.refresh);
//			$(window).bind('resize', elastic.refresh);
//			elastic();
//		});
		$(window)
			.bind('resize', elastic.refresh)
			.bind('load', function(){
				$(document).bind('elastic', elastic.refresh);
				elastic.ie.forceWidth();
				if($.browser.version < 8.0){
					elastic.ie.forceClear();
				}
				elastic();
			});
	}
	
})(jQuery);
