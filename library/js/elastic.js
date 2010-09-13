/**
Elastic CSS Framework JavaScript Runtime
Released under the MIT, BSD, and GPL Licenses.
More information http://www.elasticss.com
@file         'elastic.js
@author       'Fernando Trasviña (@azendal)
@collaborator 'Sergio de la Garza (@sgarza)
@collaborator 'Javier Ayala (@javi_ayala)
@copyright    '2010 Elastic CSS framework
@version      '2.1.0 RC
**/

var Elastic = function Elastic(context, includeContext) {
	var helper, columnsElements, i, l, columnsIterator, $context;
	
	context         = context || document;
	$context        = $(context);
	columnsElements = Elastic.querySelectorAll('.columns', context);
	l               = columnsElements.length;
	columnsIterator = Elastic.columnsIterator;
	
	for(i = 0; i < l; i++) {
		columnsIterator(columnsElements[i]);
	}
	
	for(helper in Elastic.helpers) {
		if(Elastic.helpers.hasOwnProperty(helper)) {
			Elastic.helpers[helper]($context);
		}
	}
};

Elastic.VERSION                     = '2.1.0 RC';
Elastic.COLUMNS_PER_ROW_EXPRESSION  = /(^|\s+)on\-(\d+)(\s+|$)/;
Elastic.COLUMN_SPAN_EXPRESSION      = /(^|\s+)span\-(\d+)(\s+|$)/;
Elastic.FIXED_COLUMN_EXPRESSION     = /(^|\s+)fixed(\s+|$)/;
Elastic.ELASTIC_COLUMN_EXPRESSION   = /(^|\s+)elastic(\s+|$)/;
Elastic.ADAPTIVE_COLUMNS_EXPRESSION = /(^|\s+)adaptive\-(\d+)\-(\d+)(\s+|$)/;
Elastic.FINAL_COLUMN_EXPRESSION     = /(^|\s+)final(\s+|$)/;
Elastic.DISPLAY_LAYOUT_EXPRESSION   = /(^|\s+)display\s+([\w\_\-\d]+)(\s+|$)/;

Elastic.configuration = {
	refreshOnResize : true,
	includeContext  : true
};

Elastic.columnsIterator = function columnsElementsIteration(columnsElement) {
	
	var container, columnElements, lastColumn, columnsPerRow, containerWidth, columnWidths, 
		elasticColumns, rowColumns, columnsOnRow, nextColumnsOnRow, fixedColumnsWidth, currentColumn, 
		fixedColumnWidth, minWidth, maxWidth;
	
	container         = Elastic.querySelectorAll('> .container', columnsElement)[0] || columnsElement;
	columnElements    = Elastic.querySelectorAll('> .column', container);
	if(columnElements.length == 0){
		return;
	}
	lastColumn        = columnElements[columnElements.length - 1];
	columnsPerRow     = Elastic.getColumnsPerRow(columnsElement, columnElements);
	containerWidth    = Elastic.getInnerWidth(container);
	columnWidths      = Elastic.round(containerWidth, columnsPerRow);
	
	if(Elastic.ADAPTIVE_COLUMNS_EXPRESSION.test(columnsElement.className)) {
		minWidth = Number(RegExp.$2);
		maxWidth = Number(RegExp.$3);
		
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
		if(Elastic.FIXED_COLUMN_EXPRESSION.test(currentColumn.className)) {
			fixedColumnWidth          = Elastic.getOuterWidth(currentColumn);
			currentColumn.columnWidth = fixedColumnWidth;
			currentColumn.isFixed     = true;
			fixedColumnsWidth        += fixedColumnWidth;
		}
		else if(Elastic.ELASTIC_COLUMN_EXPRESSION.test(currentColumn.className)) {
			currentColumn.isElastic = true;
			elasticColumns.push(currentColumn);
		}
		else {
			currentColumn.isRegular = true;
		}
		
		if(Elastic.FINAL_COLUMN_EXPRESSION.test(currentColumn.className)) {
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
	var columnsPerRow, fixedColumnsPerRow;
	
	columnsPerRow      = columnElements.length,
	fixedColumnsPerRow = false;
	
	if(Elastic.COLUMNS_PER_ROW_EXPRESSION.test(columnsElement.className)) {
		columnsPerRow      = Number(RegExp.$2);
		fixedColumnsPerRow = true;
	}
	
	for(var i = 0, l = columnElements.length; i < l; i++) {
		if(Elastic.COLUMN_SPAN_EXPRESSION.test(columnElements[i].className)) {
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
	
	if(fixedColumnsWidth >= containerWidth){
	    return;
	}
	
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

	if(elasticColumns.length > 0){
	    elasticColumnWidths = Elastic.round(containerWidth - columnsWidth, elasticColumns.length);

    	for(i = 0, l = elasticColumns.length; i < l; i++) {
    		elasticColumns[i].style.width = elasticColumnWidths[i].width + 'px';
    	}
	}
	
	if(lastColumn.isFinal) {
		lastColumn.style.marginRight = (containerWidth - columnsWidth) + 'px';
	}

};

Elastic.round = function ElasticRoundingAlgorithm(containerWidth, columns) {
	var cache, i, column, columnPercentage, columnWidths, columnWidth, columnWidthTally, difference, 
	    absDifference, positionDivision, increment, direction;
	
	cache = Elastic.round.cache;
	
	if(cache[containerWidth] && cache[containerWidth][columns]) {
		return cache[containerWidth][columns];
	}
	
	column;
	columnPercentage = 100 / columns;
	columnWidths     = [];
	columnWidth      = Math.round(containerWidth * ( columnPercentage / 100 ));
	columnWidthTally = columnWidth * columns;
	
	for(i = 0; i < columns; i++) {
		columnWidths.push({width:columnWidth});
	}
	
	difference       = containerWidth - columnWidthTally;
	absDifference    = Math.abs(difference);
	positionDivision = columns / (absDifference + 1);
	increment        = (difference > 0);
	direction        = -1;
	
	if(difference !== 0) {
		for(i = 1; i <= (Math.abs(difference)); i++) {
			if(direction == -1) {
				column = columnWidths[ columnWidths.length - Math.floor( positionDivision * Math.round(i/2) ) ];
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
	'full-width'       : function fullWidthHelper($context) {
		var i, $element, $elements, elementsLength;
		
		$elements      = $context.find('.full-width');
		elementsLength = $elements.length;
		
		for(i = 0; i < elementsLength; i++) {
			$element = $($elements[i]);
			$element.width( $element.parent().width() - ( $element.outerWidth(true) - $element.width() ) );
		}
		
		return this;
	},
	'same-height'      : function sameHeightHelper($context) {
	    var i, j, currentHeight, maxHeight, $elementColumns, elementColumnsLength, $elements, elementsLength;
		
		$elements       = $context.find('.same-height');
		elementsLength  = $elements.length;
		
		for(i = 0; i < elementsLength; i++) {
			$elementColumns      = $($elements[i]).find('> *');
			elementColumnsLength = $elementColumns.length;
			maxHeight            = 0;
			
			for(j = 0; j < elementColumnsLength; j++){
			    currentHeight = $($elementColumns[j]).outerHeight(true);
    			maxHeight     = (maxHeight > currentHeight) ? maxHeight : currentHeight;   
			}
			
			for(j = 0; j < elementColumnsLength; j++) {
    			$($elementColumns[j]).css('height', maxHeight);
    		}
		}
		
		return this
	},
	'same-min-height'  : function sameMinHeightHelper($context) {
		var i, j, currentHeight, maxHeight, $elementColumns, elementColumnsLength, $elements, elementsLength;
		
		$elements       = $context.find('.same-min-height');
		elementsLength  = $elements.length;
		
		for(i = 0; i < elementsLength; i++) {
			$elementColumns      = $($elements[i]).find('> *');
			elementColumnsLength = $elementColumns.length;
			maxHeight            = 0;
			
			for(j = 0; j < elementColumnsLength; j++){
			    currentHeight = $($elementColumns[j]).outerHeight(true);
    			maxHeight     = (maxHeight > currentHeight) ? maxHeight : currentHeight;   
			}
			
			for(j = 0; j < elementColumnsLength; j++) {
    			$($elementColumns[j]).css('min-height', maxHeight);
    		}
		}
		
		return this;
	},
	'full-height'      : function fullHeightHelper($context) {
		var i, $element, newHeight, $elements, elementsLength;
		
		$elements = $context.find('.full-height');
		elementsLength = $elements.length;
		
		for (var i=0; i < elementsLength; i++) {
		  $element = $($elements[i]);
		  newHeight = $element.parent().height() - ( $element.outerHeight(true) - $element.height() );
		  if( newHeight < 0 || isNaN( Number(newHeight) ) ){
		      continue;
		  }
		  $element.css('height', newHeight);
		}
		
		return this;
	},
	'full-min-height'  : function fullMinHeightHelper($context) {
		var i, $element, newHeight, $elements, elementsLength;
		
		$elements      = $context.find('.full-min-height');
		elementsLength = $elements.length;
		
		for (var i=0; i < elementsLength; i++) {
		  $element = $($elements[i]);
		  newHeight = $element.parent().height() - ( $element.outerHeight(true) - $element.height() );
		  if( newHeight < 0 || isNaN( Number(newHeight) ) ){
		      continue;
		  }
		  $element.css('min-height', newHeight);
		}
		
		return this;
	},
	'elastic-height'   : function elasticHeightHelper($context) {
		var i, j, $elements, $siblings, siblingsLength, siblingsHeight, elementsLength;
		
		$elements      = $context.find('.elastic-height');
		siblingsHeight = 0;
		elementsLength = $elements.length;
		
		for (var i=0; i < elementsLength; i++) {
		  $element       = $($elements[i]);
		  $siblings      = $element.parent().find('> *:not(.elastic-height)');
		  siblingsLength = $siblings.length;
		  siblingsHeight = 0;
		  
		  for (var j=0; j < siblingsLength; j++) {
		      siblingsHeight = siblingsHeight + $($siblings[j]).outerHeight(true);
		  }
		 
		  if( siblingsHeight < 0 || isNaN( Number(siblingsHeight) ) ){
  		      continue;
  		  }
  		  
  		  $element.css('height', $element.parent().height() - siblingsHeight);
		}
		
		return this;
	},
	'center'           : function centerHelper($context) {
		var i, $elements, $elementsLength, $element, paddingTop, $parent;
		
		$elements       = $context.find('.vertical-center, .center');
		$elementsLength = $elements.length;
		paddingTop      = 0;
		
		for (var i=0; i < $elementsLength; i++) {
		  $element = $($elements[i]);
		  $parent = $($elements[i]).parent();
		  paddingTop = Math.round( ( $parent.height() - $element.outerHeight(true) ) / 2 );
		  if( paddingTop < 0 || isNaN( Number(paddingTop) ) ){
  		      continue;
  		  }
  		  $parent.css({
  		      paddingTop : paddingTop + 'px',
  		      height     : ( $parent.css('height') ) ? ( $parent.height() - paddingTop ) : ''
  		  })
		}
		
		return this;
	},
	'bottom'           : function bottomHelper($context) {
		var i, $elements, $elementsLength, $element, paddingTop, $parent;
		
		var $elements       = $context.find('.bottom');
		var $elementsLength = $elements.length;
		var paddingTop      = 0;
		
		for (var i=0; i < $elementsLength; i++) {
		  $element = $($elements[i]);
		  $parent = $($elements[i]).parent();
		  paddingTop = Math.round( $parent.height() - $element.outerHeight(true) );
		  if( paddingTop < 0 || isNaN( Number(paddingTop) ) ){
  		      continue;
  		  }
  		  $parent.css({
  		      paddingTop : paddingTop + 'px',
  		      height     : ( $parent.css('height') ) ? ( $parent.outerHeight() - paddingTop ) : ''
  		  })
		}
		
		return this;
	}
};

Elastic.$window = $(window);

Elastic.$documentElement = $(document);

Elastic.reset = function Elastic_reset(context) {
	var i,w,wl,h,hl,p,pl,m,ml,n,nl,doc;
	doc = Elastic.$documentElement;
	context = $(context || document);
	doc.trigger('elastic:beforeReset');
	
	h = context.find('.same-height > .column, .full-height, .elastic-height');
	n = context.find('.same-min-height > .column, .full-min-height');
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
	
	for(i = 0, nl = n.length; i < nl; i++){
	  n[i].style.minHeight = '';
	}
	
	doc.trigger('elastic:reset');
	
	return this;
};

Elastic.refresh = function Elastic_refresh(context){
	var doc = Elastic.$documentElement;
	doc.trigger('elastic:beforeRefresh', context);
	Elastic.reset(context)(context);
	doc.trigger('elastic:refresh', context);
	return this;
};

Elastic.getComputedStyle = function getComputedStyle(element) {
	if(element.currentStyle) {
	    Elastic.getComputedStyle = function(element){
	        return element.currentStyle;
	    }
		return element.currentStyle;
	}
	
	Elastic.getComputedStyle = function(element){
	    return window.getComputedStyle(element, true);
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
	if(isNaN(innerWidth)){
	    innerWidth = $(element).width();
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
	
	if(isNaN(outerWidth)){
    	outerWidth = $(element).outerWidth(true);
    }
	
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
	var r = Elastic.DISPLAY_LAYOUT_EXPRESSION;
	$('.display').each(function Elastic_layout(){
		var c;
		if(r.test(this.className)) {
			c = '.position-' + RegExp.$2;
			$(c).removeClass(c).appendTo(this);
		}
	});
	
	return null;
});

jQuery.fn.ready(function Loader(){
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