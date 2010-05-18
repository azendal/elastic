/*
	Elastic CSS Framework
	Released under the MIT, BSD, and GPL Licenses.
	More information http://www.elasticss.com
	@author     Fernando Trasviña (@azendal)
	@core team  Sergio de la Garza (@sgarza), Javier Ayala (@javi_ayala)
	@copyright  2010 Elastic CSS framework
	@version    2.1
*/

var Elastic = function Elastic(context, includeContext) {
	var helper, columnsElements, i, l, columnsIterator;
	
	context         = context || document;
	columnsElements = Elastic.querySelectorAll('.columns', context);
	i               = 0;
	l               = columnsElements.length;
	columnsIterator = Elastic.columnsIterator;
	
	for(i = 0; i < l; i++) {
		columnsIterator(columnsElements[i]);
	}
	
	for(helper in Elastic.helpers) {
		if(Elastic.helpers.hasOwnProperty(helper)) {
			Elastic.helpers[helper](context);
		}
	}
};

Elastic.version                   = '2.1.0';
Elastic.columnsPerRowExpression   = /(^|\s+)on\-(\d+)(\s+|$)/;
Elastic.columnSpanExpression      = /(^|\s+)span\-(\d+)(\s+|$)/;
Elastic.fixedColumnExpression     = /(^|\s+)fixed(\s+|$)/;
Elastic.elasticColumnExpression   = /(^|\s+)elastic(\s+|$)/;
Elastic.adaptiveColumnsExpression = /(^|\s+)adaptive\-(\d+)\-(\d+)(\s+|$)/;
Elastic.finalColumnExpression     = /(^|\s+)final(\s+|$)/;
Elastic.configuration             = {
	refreshOnResize : true,
	includeContext  : true
};

Elastic.columnsIterator = function columnsElementsIteration(columnsElement) {
	
	var container, columnElements, lastColumn, columnsPerRow, containerWidth, columnWidths, 
		elasticColumns, rowColumns, columnsOnRow, nextColumnsOnRow, fixedColumnsWidth, currentColumn, fixedColumnWidth;
	
	container         = Elastic.querySelectorAll('> .container', columnsElement)[0] || columnsElement;
	columnElements    = Elastic.querySelectorAll('> .column', container);
	lastColumn        = columnElements[columnElements.length - 1];
	columnsPerRow     = Elastic.getColumnsPerRow(columnsElement, columnElements);
	containerWidth    = Elastic.getInnerWidth(container);
	columnWidths      = Elastic.round(containerWidth, columnsPerRow);
	
	if(Elastic.adaptiveColumnsExpression.test(columnsElement.className)) {
		var minWidth = Number(RegExp.$2);
		var maxWidth = Number(RegExp.$3);
		
		if(columnWidths[0].width > maxWidth) {
			while(columnWidths[0].width > maxWidth) {
				columnsPerRow = columnsPerRow + 1;
				columnWidths = Elastic.round(containerWidth, columnsPerRow);
				if(columnWidths[0].width < minWidth){
					break;
				}
			}
		}
		
		if(columnWidths[0].width < minWidth) {
			while(columnWidths[0].width < minWidth) {
				columnsPerRow = columnsPerRow - 1;
				columnWidths = Elastic.round(containerWidth, columnsPerRow);
				if(columnWidths[0].width > maxWidth){
					break;
				}
			}
		}
	}
	
	elasticColumns    = [];
	rowColumns        = [];
	columnsOnRow      = 0;
	nextColumnsOnRow  = 0;
	fixedColumnsWidth = 0;
	
	for(var i = 0, l = columnElements.length; i < l; i++) {
		currentColumn = columnElements[i];
		if(Elastic.fixedColumnExpression.test(currentColumn.className)) {
			fixedColumnWidth          = Elastic.getOuterWidth(currentColumn);
			currentColumn.columnWidth = fixedColumnWidth;
			currentColumn.isFixed     = true;
			fixedColumnsWidth        += fixedColumnWidth;
		}
		else if(Elastic.elasticColumnExpression.test(currentColumn.className)) {
			currentColumn.isElastic = true;
			elasticColumns.push(currentColumn);
		}
		else {
			currentColumn.isRegular = true;
		}
		
		if(Elastic.finalColumnExpression.test(currentColumn.className)) {
			currentColumn.isFinal = true;
		}
		
		nextColumnsOnRow = columnsOnRow + currentColumn.spanWidth;
		
		if(nextColumnsOnRow >= columnsPerRow || currentColumn == lastColumn || currentColumn.isFinal) {
			rowColumns.push(currentColumn);
			Elastic.processRow(rowColumns, containerWidth, fixedColumnsWidth, elasticColumns, columnWidths);
			fixedColumnsWidth = 0;
			columnsOnRow      = 0;
			nextColumnsOnRow  = 0;
			elasticColumns    = [];
			rowColumns        = [];
			continue;
		}
		
		rowColumns.push(currentColumn);
		columnsOnRow += currentColumn.spanWidth;
	}
	
	return this;
};

Elastic.getColumnsPerRow = function getColumnsPerRow(columnsElement, columnElements) {
	var columnsPerRow      = columnElements.length;
	var fixedColumnsPerRow = false;
	
	if(Elastic.columnsPerRowExpression.test(columnsElement.className)) {
		columnsPerRow      = Number(RegExp.$2);
		fixedColumnsPerRow = true;
	}
	
	for(var i = 0, l = columnElements.length; i < l; i++) {
		if(Elastic.columnSpanExpression.test(columnElements[i].className)) {
			columnElements[i].spanWidth = Number(RegExp.$2);
			if(fixedColumnsPerRow !== true) {
				columnsPerRow += columnElements[i].spanWidth - 1;
			}
		}
		else {
			columnElements[i].spanWidth = 1;
		}
	}
	
	return columnsPerRow;
};

Elastic.processRow = function processRow(columns, containerWidth, fixedColumnsWidth, elasticColumns, columnWidths) {
	
	var currentColumn, computedWidth, columnPosition, columnsWidth, lastColumn, i, j, l, elasticColumnWidths;
	
	computedWidth  = 0;
	columnPosition = 0;
	columnsWidth   = fixedColumnsWidth;
	lastColumn     = columns[columns.length - 1];
	
	for(i = 0, l = columns.length; i < l; i++) {
		currentColumn = columns[i];
		if(currentColumn.isRegular) {
			if(currentColumn.spanWidth >= columnWidths.length) {
				currentColumn.style.width = containerWidth + 'px';
				continue;
			}
			
			for(j = columnPosition; j < (columnPosition + currentColumn.spanWidth); j++) {
				computedWidth += columnWidths[j].width;
			}
			
			columnsWidth             += computedWidth;
			columnPosition           += currentColumn.spanWidth;
			currentColumn.style.width = computedWidth + 'px';
			computedWidth             = 0;
		}
	}
	
	for(i = 0, l = elasticColumns.length; i < l; i++) {
		elasticColumnWidths    = Elastic.round(containerWidth - columnsWidth, elasticColumns.length);
		for(j = 0, l = elasticColumns.length; j < l; j++) {
			elasticColumns[j].style.width = elasticColumnWidths[j].width + 'px';
		}
	}
	
	if(lastColumn.isFinal) {
		lastColumn.style.marginRight = (containerWidth - columnsWidth) + 'px';
	}

};

Elastic.round = function ElasticRoundingAlgorithm(containerWidth, columns) {
	var cache = Elastic.round.cache, i;
	
	if(cache[containerWidth] && cache[containerWidth][columns]) {
		return cache[containerWidth][columns];
	}
	
	var column;
	var columnPercentage = 100 / columns;
	var columnWidths     = [];
	var columnWidth      = Math.round(containerWidth * ( columnPercentage / 100 ));
	var columnWidthTally = columnWidth * columns;
	
	for(i = 0; i < columns; i++) {
		columnWidths.push({width:columnWidth});
	}
	
	var difference       = containerWidth - columnWidthTally;
	var absDifference    = Math.abs(difference);
	var positionDivision = columns / (absDifference + 1);
	var increment        = (difference > 0);
	var direction        = -1;
	
	if(difference !== 0) {
		for(i = 1; i <= (Math.abs(difference)); i++) {
			if(direction == -1) {
				column = columnWidths[columnWidths.length - Math.floor( positionDivision * Math.round(i/2) )];
			}
			else {
				column = columnWidths[Math.floor( positionDivision * Math.round(i/2) ) - 1];
			}
			
			if(increment) {
				column.width = columnWidth + 1;
			}
			else {
				column.width = columnWidth - 1;
			}
			direction = direction * -1;
		}
	}
	
	if(!cache[containerWidth]) {
		cache[containerWidth] = {};
	}
	
	cache[containerWidth][columns] = columnWidths;
	
	return columnWidths;
};

Elastic.round.cache = {};

Elastic.helpers = {
	'full-width'       : function fullWidthHelper(context) {
		var i, $el;
		var els = $.find('.full-width', context);
		var elsl = els.length;
		
		for(i = 0; i < elsl; i++) {
			$el = $(els[i]);
			$el.width( $el.parent().width() - ( $el.outerWidth(true) - $el.width() ) );
		}
		
		return this;
	},
	'same-height'      : function sameHeightHelper(context) {
		$('.same-height', context).each(function(){
			var columns = $('> *', this);
			var maxHeight = 0;
			columns.each(function() {
				var currentHeight = $(this).outerHeight(true);
				maxHeight = (maxHeight > currentHeight) ? maxHeight : currentHeight;
			}).each(function() {
				$(this).css('height', maxHeight);
			});
		});
		
		return this;
	},
	'full-height'      : function fullHeightHelper(context) {
		$('.full-height', context).each(function() {
			var _this = $(this);
			_this.css('height', $(this.parentNode).height() - ( _this.outerHeight(true) - _this.height() ));
		});
		
		return this;
	},
	'elastic-height'   : function elasticHeightHelper(context) {
		$('.elastic-height', context).each(function() {
			var _this = $(this);
			var h = 0;
			$('> *:not(.elastic-height)', this.parentNode).each(function() {
				h += $(this).outerHeight(true);
			});
			var height = Math.round(_this.parent().height() - h);
			if(height <  0.1) {
				return;
			}
			_this.css('height', height);
			Elastic.refresh(this);
		});
		
		return this;
	},
	'center'           : function centerHelper(context) {
		$('.vertical-center, .center', context).each(function() {
			var parentNode = $(this.parentNode);
			var paddingTop = Math.round( ( parentNode.height() - $(this).outerHeight(true) ) / 2 );
			if(paddingTop < 0.1) {
				return;
			}
			parentNode.css({
				paddingTop : paddingTop + 'px',
				height     : ( parentNode.css('height') ) ? ( parentNode.outerHeight() - paddingTop ) : ''
			});
		});
		
		return this;
	},
	'bottom'           : function bottomHelper(context) {
		$('.bottom', context).each(function(){
			var parentNode = $(this.parentNode);
			var paddingTop = Math.round( parentNode.height() - $(this).outerHeight(true) );
			if(paddingTop < 0.1) {
				return true;
			}
			parentNode.css({
				paddingTop : paddingTop + 'px',
				height     : ( parentNode.css('height') ) ? ( parentNode.outerHeight() - paddingTop ) : ''
			});
		});
		
		return this;
	}
};

Elastic.$documentElement = $(document);

Elastic.reset = function Elastic_reset(context) {
	var i,w,wl,h,hl,p,pl,m,ml,doc;
	doc = Elastic.$documentElement;
	context = $(context || document);
	doc.trigger('elastic:beforeReset');
	
	h = context.find('.same-height > .column, .full-height, .elastic-height');
	p = context.find('.vertical-center, .center, .bottom');
	w = context.find('.column:not(.fixed), .full-width');
	m = context.find('.column.final');
	
	for(i = 0, hl = h.length; i < hl; i++) {
		h[i].style.height = '';
	}
	
	for(i = 0, pl = p.length; i < pl; i++) {
		p[i].parentNode.style.paddingTop = ''; p[i].parentNode.style.height = '';
	}
	
	for(i = 0, wl = w.length; i < wl; i++) {
		w[i].style.width = '';
	}
	
	for(i = 0, ml = m.length; i < ml; i++){
		m[i].style.marginLeft = ''; m[i].style.marginRight = '';
	}
	
	doc.trigger('elastic:reset');
	
	return this;
};

Elastic.refresh = function Elastic_refresh(context){
	var doc = Elastic.$documentElement;
	doc.trigger('elastic:beforeRefresh');
	Elastic.reset(context)(context);
	doc.trigger('elastic:refresh');
	return this;
};

Elastic.getComputedStyle = function getComputedStyle(element) {
	if(element.currentStyle) {
		return element.currentStyle;
	}
	
	return window.getComputedStyle(element, true);
};

Elastic.getInnerWidth = function(element) {
	var computedStyle, innerWidth;
	
	computedStyle = Elastic.getComputedStyle(element);
	innerWidth    = parseFloat( (computedStyle.width == 'auto') ? element.offsetWidth : computedStyle.width.replace('px', '') );
	
	if(computedStyle.width == 'auto') {
		innerWidth = innerWidth
			- parseFloat(computedStyle.paddingLeft.replace('px', ''))
			- parseFloat(computedStyle.paddingRight.replace('px', ''))
			- parseFloat(computedStyle.borderLeftWidth.replace('px', ''))
			- parseFloat(computedStyle.borderRightWidth.replace('px', ''));
	}
	return Math.floor(innerWidth);
};

Elastic.getOuterWidth = function(element) {
	var computedStyle, innerWidth, outerWidth;
	
	computedStyle = Elastic.getComputedStyle(element);
	innerWidth    = parseFloat( (computedStyle.width == 'auto') ? element.offsetWidth : computedStyle.width.replace('px', '') );
	
	if(computedStyle.width == 'auto') {
		innerWidth = innerWidth
			- parseFloat(computedStyle.paddingLeft.replace('px', ''))
			- parseFloat(computedStyle.paddingRight.replace('px', ''))
			- parseFloat(computedStyle.borderLeftWidth.replace('px', ''))
			- parseFloat(computedStyle.borderRightWidth.replace('px', ''));
	}
	
	outerWidth = innerWidth
		+ parseFloat(computedStyle.marginLeft.replace('px', '')) 
		+ parseFloat(computedStyle.marginRight.replace('px', ''));
	
	return Math.ceil(outerWidth);
};

Elastic.querySelectorAll = function(selector, context){
	var result;
	if(document.querySelectorAll) {
		if(context){
			if(selector.substr(0,1) == '>'){
				if(context.id){
					result = document.querySelectorAll('#' + context.id + selector);
				}
				else{
					context.id = '___elastic_temporal_id___';
					result = document.querySelectorAll('#' + context.id + selector);
					context.id = '';
				}
			}
			else{
				result = context.querySelectorAll(selector);
			}
		}
		else{
			result = document.querySelectorAll(selector);
		}
	}
	else {
		if(context){
			result = $(context).find(selector);
		}
		else{
			result = $(selector);
		}
	}
	
	return result;
};

Elastic.$documentElement.bind('elastic:beforeInitialize', function() {
	var r = /(^|\s+)display\s+([\w\_\-\d]+)(\s+|$)/;
	$('.display').each(function Elastic_layout()
	{
		var c;
		if(r.test(this.className)) {
			c = '.position-' + RegExp.$2;
			$(c).removeClass(c).appendTo(this);
		}
	});
	
	return null;
});

jQuery(function Loader(){
	var doc = Elastic.$documentElement;
	var iw  = document.body.clientWidth;
	doc.trigger('elastic:beforeInitialize');
	Elastic();
	if(iw != document.body.clientWidth){
		Elastic.refresh(); 
	}
	jQuery(window).bind('resize',function ElasticResizeHandler(){
		if(Elastic.configuration.refreshOnResize){
			Elastic.refresh();
		}
	});
	doc.bind('elastic', Elastic.refresh);
	doc.trigger('elastic:initialize');
	return null;
});