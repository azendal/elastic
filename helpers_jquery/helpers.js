(function($){
	
	var gridjs = function(){
		$('.two-columns > .column, .two-columns > .container > .column').css({
			width : '50%'
		});
		
		$('.column,'
		+ '.two-columns > .fixed-left-column,'
		+ '.two-columns > .container > .fixed-left-column,'
		+ '.three-columns > .elastic-left-column,'
		+ '.three-columns > .container > .elastic-left-column').css({
			float : 'left'
		});
		
		$('.two-columns > .fixed-right-column,'
		+ '.two-columns > .container > .fixed-right-column,'
		+ '.three-columns > .elastic-right-column,'
		+ '.three-columns > .container > .elastic-right-column').css({
			float : 'right'
		});
		
		$('.three-columns > .column, .three-columns > .container > .column').css({
			width : '33.33%'
		});
		
		$('.three-columns > .fixed-center-column,'
		+ '.three-columns > .container > .fixed-center-column').css({
			margin : 'auto'
		});
		
		$('.three-columns > .span-2,'
		+ '.three-columns > .container > .span-2').css({
			width : '66.66%'
		});
		
		$('.four-columns > .column,'
		+ '.four-columns > .container > .column').css({
			width : '25%'
		});
		
		$('.four-columns > .span-2,'
		+ '.four-columns > .container > .span-2').css({
			width : '50%'
		});
		
		$('.four-columns > .span-3,'
		+ '.four-columns > .container > .span-3').css({
			width : '75%'
		});
	};
	
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
		
		if($.browser.msie){
			if($.browser.version < 7){
				gridjs();
			}
			
			$('.two-columns > .column, .two-columns > .container > .column').each(function(){
				$(this).css({
					width : Math.floor( $(this.parentNode).width() / 2 )
				});
			});
			
			$('.three-columns > .column, .three-columns > .container > .column').each(function(){
				if( $(this).hasClass('span-2') ){
					$(this).css({
						width : Math.floor($(this.parentNode).width() * 0.66 )
					});
				}
				else{
					$(this).css({
						width : Math.floor( $(this.parentNode).width() / 3 )
					});
				}
			});
			
			$('.four-columns > .column, .four-columns > .container > .column').each(function(){
				
				if( $(this).hasClass('span-2') ){
					$(this).css({
						width : Math.floor($(this.parentNode).width() * 0.5 )
					});
				}
				else if( $(this).hasClass('span-3') ){
					$(this).css({
						width : Math.floor($(this.parentNode).width() * 0.75 )
					});
				}
				else{
					$(this).css({
						width : Math.floor($(this.parentNode).width() * 0.25 )
					});
				}
			});
			
			$('.auto-columns').each(function(){
				var columns = $('> .column, > .container > .column', this);
				var columnsSize = columns.size();
				columns.each(function(){
					$(this).css({
						width : Math.floor( $(this.parentNode).width() / columnsSize )
					});
				});
			});
		}
		else{
			$('.auto-columns').each(function(){
				var columns = $('> .column, > .container > .column', this);
				var columnsSize = columns.size();
				columns.each(function(){
					$(this).css({
						width : (100 / columnsSize) + '%' 
					});
				});
			});
		}
		
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
	
	var elastic_refesh =function(){
		$('.same-height > .column, .same-height > .container > .column, .full-height, .equalized-height').css('height', '');
		$('.vertical-center, .center').each(function(){
			$(this.parentNode).css('padding-top', '');
		});
		$('.auto-columns > div, .full-width').css('width', '');
		elastic();
	}
	
	$(function(){
		elastic();
		$(document).bind('elastic', elastic_refesh);
		$(window).bind('resize', elastic_refesh);
		
		if(!$.browser.msie){
			$(window).bind('load', elastic_refesh)
		}
	});
})(jQuery);
