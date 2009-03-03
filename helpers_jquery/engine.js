(function($){	
	var elastic = function Elastic(){
		var getElasticElements = function(){
			var expression     = /(^|\s)(two\-columns|three\-columns|four\-columns|auto\-columns)($|\s)/
			var elements       = document.getElementsByTagName('*');
			var elementsLength = elements.length;
			var foundElements  = new Object(HTMLCollection);
			var counter = 0;
			var currentElement;

			for(var i = 0; i < elementsLength; i++){
				currentElement = elements[i];
				if(expression.test(currentElement.className)){
					foundElements[counter++] = currentElement;
				}
			}

			foundElements.item      = function(){};
			foundElements.namedItem = function(){};
			foundElements.length    = counter;

			return foundElements;
		};
		
		$.each(getElasticElements(), function(){
			var element = $(this);
			
			var foundColumns = $('> .column, > .container > .column,'
			              + '> .fixed-column, > .container > .fixed-column,' 
			              + '> .fixed-left-column, > .container > .fixed-left-column,'
			              + '> .fixed-right-column, > .container > .fixed-right-column,'
			              + '> .elastic-column, > .container > .elastic-column,'
			              + '> .fixed-center-column, > .container > .fixed-center-column,'
			              + '> .elastic-left-column, > .container > .elastic-right-column,'
			              + '> .elastic-right-column, > .container > .elastic-right-column,', this);
			
			if(element.hasClass('two-columns')){
				var maxMembers = 2;
			}
			if(element.hasClass('three-columns')){
				var maxMembers = 3;
			}
			if(element.hasClass('four-columns')){
				var maxMembers = 4;
			}
			if(element.hasClass('auto-columns')){
				var maxMembers = foundColumns.size();
			}
			
			if ($('> .container', element).size() > 0)
			{
				element = $($('> .container', element).get(0));
			}
			
			var columnGroups       = [];
			var columnGroup        = [];
			var counted            = 0;
			var nextValueOfCounted = 0;
			
			// determination of groups
			foundColumns.each(function(){
				var reg = /(^|\s+)span\-(\d+)(\s+|$)/;
				var counts = 0;
				if(reg.test($(this).attr('className')))
				{
					counts = Number(RegExp.$2);
				}
				else
				{
					counts = 1;
				}
				
				nextValueOfCounted = counted + counts;
				
				if(nextValueOfCounted < maxMembers)
				{
					columnGroup.push(this);
					counted = nextValueOfCounted;
					return;
				}
				
				if(nextValueOfCounted == maxMembers)
				{
					columnGroup.push(this);
					columnGroups.push( [].concat(columnGroup) )
					columnGroup = [];
					counted = 0;
					return;	
				}
				
				if(nextValueOfCounted > maxMembers)
				{
					columnGroups.push( [].concat(columnGroup) )
					columnGroup = [this];					
					counted = counts;
					return;	
				}
				
				if(this == foundColumns[ foundColumns.length - 1 ]){
					columnGroups.push([].concat(columnGroup));
					counted = 0;
				}
			});
			
			// determination of sizes
			$.each(columnGroups, function(){
				
				var elasticColumns = [];
				var fixedColumns   = [];
				var columns        = [];
				var unitarySize    = Math.round(element.width() / maxMembers);
				
				$.each(this, function(){
					var classes = $(this).attr('className');
					if(/fixed/.test(classes)){
						fixedColumns.push(this);
					}
					else if(/elastic/.test(classes)){
						elasticColumns.push(this);
					}
					else
					{
						columns.push(this);
					}
				});
				
				var totalWidth          = 0;
				var columnsWidth        = 0;
				var fixedColumnsWidth   = 0;
				var elasticColumnsWidth = 0;
				
				if(fixedColumns.length > 0)
				{
					$.each(fixedColumns, function(){
						$(this).css('width', Math.round( $(this).width() ) );
						fixedColumnsWidth += $(this).width();
					});
				}
				
				if(columns.length > 0){
					$.each(columns, function(){
						var spans = 0;
						
						var reg = /(^|\s+)span\-(\d+)(\s+|$)/;
						var spans = 0;
						if(reg.test($(this).attr('className')))
						{
							spans = Number(RegExp.$2);
						}
						else
						{
							spans = 1;
						}
						
						if (this !== columns[ columns.length - 1 ]){
							$(this).css('width', unitarySize * spans);
							columnsWidth += (unitarySize * spans);
						}
						else if ( elasticColumns.length > 0 )
						{
							$(this).css('width', unitarySize * spans);
							columnsWidth += (unitarySize * spans);
						}
						else
						{
							$(this).css('width', ( element.width() - ( columnsWidth + fixedColumnsWidth ) ) );
						}
					});
				}
				
				if(elasticColumns.length > 0){
					$.each(elasticColumns, function(){
						if(this !== elasticColumns[elasticColumns.length - 1 ]){
							$(this).css('width', Math.round( ( element.width() -  ( columnsWidth + fixedColumnsWidth ) ) / elasticColumns.length  ) );
							elasticColumnsWidth += $(this).width();
						}
						else
						{
							$(this).css('width', ( element.width() - ( columnsWidth + fixedColumnsWidth + elasticColumnsWidth ) ) );
						}
					});
				}
			});
		});
		
		elastic.version = '1.0 RC1';
		
		$('.full-width').each(function(){
			$(this).width( $(this.parentNode).width() - ( $(this).outerWidth(true) - $(this).width() ) );
		});
		
		$('.same-height').each(function(){
			var height = $(this).outerHeight(true) - ( $(this).outerHeight(true) - $(this).height() );
			$('> *', this).each(function(){
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
	
	var elastic_refesh = function(){
		$('.same-height > .column, .same-height > .container > .column, .full-height, .equalized-height').css('height', '');
		$('.vertical-center, .center').each(function(){
			$(this.parentNode).css('padding-top', '');
		});
		$('.column, .fixed-left-column, .fixed-right-column, fixed-center-column, .elastic-column, .elastic-left-column, .elastic-right-column, .elastic-center-column, ').css('width', '');
		elastic();
		$(document).trigger('elastic:refresh');
	}
	
	$(function(){
		elastic();
		$(document).bind('elastic', elastic_refesh);
		$(window).bind('resize', elastic_refesh);
		
		if(!$.browser.msie){
			$(window).bind('load', elastic_refesh)
		}
	});
	
	window.Elastic = elastic;
})(jQuery);
