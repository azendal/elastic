/**
 * Elastic Engine Module
 *
 * Provides a rendering fix for all browsers to render pixel perfect layouts
 *
 * LICENSE: It is planned to release it as MIT
 *
 * @author     Fernando Trasviña
 * @core team  Sergio de la Garza
 * @copyright  2008 Elastic css framework
 * @license    MIT
 * @version    1.1
 * @link       elastic/dev/helpers.js
 * @since      1.0 RC1
*/
(function($){	
	var Elastic = function (){
		$('.two-columns, .three-columns, .four-columns, .auto-columns').each(function(){
			var element = $(this);
			
			var foundColumns = $('> .column, > .container > .column,'
			              + '> .fixed-column, > .container > .fixed-column,'
			              + '> .elastic-column, > .container > .elastic-column,', this);
			
			if(element.hasClass('two-columns')){
				var maxMembers = 2;
			}
			else if(element.hasClass('three-columns')){
				var maxMembers = 3;
			}
			else if(element.hasClass('four-columns')){
				var maxMembers = 4;
			}
			else if(element.hasClass('auto-columns')){
				var maxMembers = foundColumns.size();
			}
			
			if ($('> .container', this).size() > 0)
			{
				element = $($('> .container', this).get(0));
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
					columnGroup.push(this);
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
						//$(this).css('width', Math.round( $(this).width() ) );
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
		
		Elastic.version = '1.1';
		
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
	
	Elastic.refesh = function(){
		$('.same-height > *, > .column, .full-height, .equalized-height').css('height', '');
		$('.vertical-center, .center').each(function(){
			$(this.parentNode).css('padding-top', '');
		});
		$('.column, .elastic-column').css('width', '');
		Elastic();
		$(document).trigger('elastic.refresh');
	}
	
	$(function(){
		Elastic();
		$(document).bind('elastic', Elastic.refesh);
		$(window).bind('resize', Elastic.refesh);
		
		if(!$.browser.msie){
			$(window).bind('load', Elastic.refesh)
		}
	});
	
	window.Elastic = Elastic;
})(jQuery);
