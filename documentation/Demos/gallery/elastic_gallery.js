jQuery(function($){
	$('.elastic-gallery').each(function(){
		var gallery = this;
		$('.right', this).click(function(){
			$('.thumbnails-display-container', gallery).animate({
				'scrollLeft' : ( $('.thumbnails-display-container', gallery).attr('scrollLeft') + $('.thumbnails-display-container', gallery).width() )
			}, 500, 'linear');
		});
		$('.left', this).click(function(){
			$('.thumbnails-display-container', gallery).animate({
				'scrollLeft' : ( $('.thumbnails-display-container', gallery).attr('scrollLeft') - $('.thumbnails-display-container', gallery).width() )
			}, 500, 'linear');
		});
		
		var imagesWidth = 0;
		$('.thumbnail', this).each(function(){
			imagesWidth += $(this).outerWidth(true);
		});
		
		$('.thumbnails', this).css('width', imagesWidth);
		
		$('.thumbnail a', this).bind('click', function(event){
			var img = new Image();
			$(img).load(function(){
				var current  = $('.image', gallery);
				var next     = current.clone(true);
				next.hide();
				next.find('img').attr('src', img.src);
				$('.image-container', gallery).append(next);
				next.fadeIn(500, function(){
					current.remove();
				});
			}).error(function(){
				alert('error');
			}).attr('src', $(this).attr('href'));
			event.preventDefault();
		});
	});
});
