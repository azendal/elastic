Elastic.configuration.refreshOnResize = false;

Elastic.widget = {
	scroller : {
		current : false
	} 
};
jQuery(document).bind('elastic:beforeRefresh', function (){
	if(Elastic.widget.scroller.current){ return; }
	$('.scroller .items').css('width', '').find('.item').removeClass('fixed');
});
jQuery(document).bind('elastic:refresh', function (){
	if(Elastic.widget.scroller.current){ return; }	
	$('.items', this).each(function(){
		var w = 0;
		
		$('.item', this).each(function(){
			w += $(this).addClass('fixed').outerWidth(true);
		});
		
		$(this).css('width', w);
		Elastic.widget.scroller.current = true;
		Elastic.refresh($('#gallery-thumbs').get(0));
		Elastic.widget.scroller.current = false;
	});
});
jQuery(document).bind('elastic:initialize', function (){

	$('#opaque-overlay').bind('click', function(){
		$('.box-container').fadeOut();
		$(this).hide();
	});
	
	$('.box .close').bind('click', function(){
		$('.box-container').fadeOut();
		$('#opaque-overlay').hide();
	});
	
	$('.scroller').each(function(){
		var gallery = this;
		
		$('.items', this).each(function(){
			var w = 0;
			
			$('.item', this).each(function(){
				w += $(this).addClass('fixed').outerWidth(true);
			});
			
			$('.item a', this).bind('click', function(e){
				this.data = this.data || eval('(' + $(this).parent().find('.data').html() + ')');
				data = this.data;
				$('.box .title, .box .paint-title').html(data.title);
				$('.box .description').html(data.description);
				$('.box .technique').html(data.technique);
				$('.box .size').html(data.size);
				$('.box .original').html(data.original);
				$('.box .giclees').html(data.giclees);
				
				$('#opaque-overlay').show();
				$('.box img').attr('src', $(this).attr('href'));
				$('.box-container').fadeIn();
				
				Elastic.refresh($('.box-container').get(0));
				
				e.preventDefault();
			});
			
			$(this).css('width', w);
		});
		
		$('.right').bind('click', function(){
			$(gallery).animate({
				'scrollLeft' : ( $(gallery).attr('scrollLeft') + $(gallery).width() )
			}, 500, 'linear');
		});
		
		$('.left').bind('click', function(){
			$(gallery).animate({
				'scrollLeft' : ( $(gallery).attr('scrollLeft') - $(gallery).width() )
			}, 500, 'linear');
		});
	});
	
	Elastic.widget.scroller.current = true;
	Elastic.refresh($('#gallery-thumbs').get(0));
	Elastic.widget.scroller.current = false;
});
/*
jQuery(function($){
	$('.elastic-gallery').each(function(){
		
		$('.thumbs a', this).bind('click', function(event){
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
*/
