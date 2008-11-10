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
 * @version    0.1
 * @link       elastic/dev/helpers.js
 * @since      0.1
*/
(function($){
	$(function(){
		$('div.two-columns > div.fixed-left-column, div.three-columns > div.fixed-left-column').each(function(){
			$('div.elastic-column', this.parentNode).css('margin-left', $(this).css('width'))
		});
		
		$('div.two-columns > div.fixed-right-column, div.three-columns > div.fixed-right-column').each(function(){
			$('div.elastic-column', this.parentNode).css('margin-right', $(this).css('width'))
		});
		
		$('div.same-height').each(function(){
			var height = $(this).height() - ( this.clientHeight - $(this).height() );
			$('> div', this).each(function(){
				$(this).css('height', height);
			});
		});
		
		$('div.full-height').each(function(){
			$(this).css('height', $(this.parentNode).height() - ( $(this).outerHeight(true) - $(this).height() ));
		});
	});
})(jQuery);
