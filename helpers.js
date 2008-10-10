/*
No Conflict
*/

(function($){
	/*
	.same-height helper: makes every div child of .same-height of same height
	*/
	$(function(){
		$('.same-height').each(function(){
			var maxHeight = 0;
			$('> div.column', this).each(function(){
				maxHeight = (this.clientHeight > maxHeight) ? this.clientHeight : maxHeight;
			});
			$('> div.column', this).each(function(){
				$(this).css('height', maxHeight)
			});
		});
	});
})(jQuery);
