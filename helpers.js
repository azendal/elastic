(function($){
	$(function(){
		$('div.two-columns > div.fixed-left-column').each(function(){
			$('div.elastic-column', this.parentNode).css('margin-left', $(this).css('width'))
		});
		
		$('div.two-columns > div.fixed-right-column').each(function(){
			$('div.elastic-column', this.parentNode).css('margin-right', $(this).css('width'))
		});
		
		$('div.same-height').each(function(){
			var maxHeight = 0;
			$('> div', this).each(function(){
				maxHeight = (this.clientHeight > maxHeight) ? this.clientHeight : maxHeight;
			});
			$('> div', this).each(function(){
				$(this).css('height', maxHeight)
			});
		});
		
		$('div.full-height').each(function(){
			$(this).css('height', $(this.parentNode).height() - ( this.clientHeight - $(this).height() ));
		});
	});
})(jQuery);
