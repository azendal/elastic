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
 * @version    1.2.1
 * @link       elastic/dev/helpers.js
 * @since      1.0 RC1
*/
(function($){
	var CStyle = function (element, pseudoElement) {
		if (window.getComputedStyle){
			return getComputedStyle(element, pseudoElement);
		}
		else{
			return element.currentStyle;
		}
	};
	
	var width = function(element){
		var width = CStyle(element).width;
		if(width == 'auto'){
			return $(element).width();
		}else{
			return parseFloat(width);
		}
	};
	
	window.Elastic = function Elastic(context){
		var i,j,k,l,il,jl,kl,ll;
		var econs, econ, econclass, ecols, ecol, ecolclass, eg, egml, egcl, egnl, ecw, ecolgs, escol, rp, ig;
		var efcs, efcsw, eecs, eecsw, eecw, ecs, ecsw, ec, ecclass; 
		var egreg = /(^|\s+)group\-by\-(\d+)(\s+|$)/;
		var esreg = /(^|\s+)span\-(\d+)(\s+|$)/;
		
		eg   = [];
		egcl = egnl = 0;
		 
		econs = $.find('.two-columns, .three-columns, .four-columns, .auto-columns', context);
		for(i = 0, il = econs.length; i < il; i++){
			econ = econs[i];
			econclass = econ.className;
			if(     econclass.indexOf('two-columns')   > -1){ egml = 2; }
			else if(econclass.indexOf('three-columns') > -1){ egml = 3; }
			else if(econclass.indexOf('four-columns')  > -1){ egml = 4; }
			else if(econclass.indexOf('auto-columns')  > -1){ egml = $.find('.column', econ).length;
				if(egreg.test(econclass)){ egml = Number(RegExp.$2);}
			}
			else{continue;}
			econ  = $.find('> .container', econs[i])[0] || econ;
			ecw   = Math.round( width(econ) / egml);
			ecols = $.find('> .column, > .fixed-column, > .elastic-column', econ);
			for(j = 0, jl = ecols.length; j < jl; j++){
				efcs  = [];
				eecs  = [];
				ecs   = [];
				rp    = ig = efcsw = ecsw = 0;
				ecol  = ecols[j];
				escol = 1;
				if(esreg.test(ecol.className)){escol = Number(RegExp.$2);}
				ecol.escol = escol;
				egnl += escol;
				
				if(egnl == egml || j == (jl - 1)){ eg.push(ecol); egcl = 0;     rp = 1;}
				else if(egnl <  egml)            { eg.push(ecol); egcl = egnl;}
				else if(egnl >  egml)            {                egcl = escol; rp = 1; ig = 1;}
				
				if(rp){
					for(k = 0, kl = eg.length; k < kl; k++){
						ec      = eg[k];
						ecclass = ec.className;
						if(     ecclass.indexOf('fixed-')   > -1){ efcs.push(ec); efcsw += width(ec); }
						else if(ecclass.indexOf('elastic-') > -1){ eecs.push(ec); }
						else                                     { ecs.push(ec); ec.style.width = '10px'; ec.style.width = (ecw * ec.escol) + 'px'; ecsw += width(ec); }
					}
					ll = eecs.length;
					if(ll > 0){
						eecw  = Math.round( ( width(econ) - ( ecsw + efcsw ) ) / ll);
						eecsw = eecw * ll;
						if(ll > 1){
							for(l=0; l<ll; l++){ eecs[l].style.width = eecw + 'px'; }
						}
						eecs[ll-1].style.width = ( width(econ) - ( ecsw + efcsw + (eecsw - eecw) ) ) + 'px';
					}
					else if(ecs.length > 0 && egnl == egml){
						ecs[ecs.length - 1].style.width = ( width(econ) - ( (ecsw - width(ecs[ecs.length - 1]) ) + efcsw ) ) + 'px';
					}
					eg = [];
					egnl = 0;
				}
				if(ig){eg = [ecol];}
			}
		}
		for(i in Elastic.helpers){Elastic.helpers[i](context);}
	};
	
	var Elastic = window.Elastic;
	
	Elastic.version = '1.2.1';

	Elastic.reset = function Elastic_reset(context){
		var i,w,wl,h,hl,p,pl;
		h = $.find('.same-height > *, .full-height, .equalized-height', context);
		for(i=0, hl = h.length; i<hl; i++){h[i].style.height = '';}
		p = $.find('.vertical-center, .center', context);
		for(i=0, pl = p.length; i<pl; i++){p[i].parentNode.style.paddingTop = '';}
		w = $('.column, .elastic-column', context);
		for(i=0, wl = w.length; i<wl; i++){w[i].parentNode.style.width = '';}
	};

	Elastic.refresh = function Elastic_refresh(context){
		Elastic.reset(context);
		Elastic(context);
	};

	Elastic.configuration = {
		refreshOnResize : true
	};
	
	Elastic.helpers = {
		'full-width'       : function Elastic_helper_fullWidth(context){
			$('.full-width', context).each(function(){
				$(this).width( $(this.parentNode).width() - ( $(this).outerWidth(true) - $(this).width() ) );
			});
		},
		'same-height'      : function Elastic_helper_sameHeight(context){
			$('.same-height', context).each(function(){
				var height = $(this).outerHeight(true) - ( $(this).outerHeight(true) - $(this).height() );
				$('> *', this).each(function(){
					$(this).css('height', height);
				});
			});
		},
		'equalized-height' : function Elastic_helper_equalizedHeight(context){
			$('.equalized-height', context).each(function(){
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
		},
		'full-height'      : function Elastic_helper_fullHeight(context){
			$('.full-height', context).each(function(){
				$(this).css('height', $(this.parentNode).height() - ( $(this).outerHeight(true) - $(this).height() ));
			});
		},
		'center'           : function Elastic_helper_center(context){
			$('.vertical-center, .center', context).each(function(){
				var paddingTop = ( ( $(this.parentNode).height() - $(this).outerHeight(true) ) / 2 );
				$(this.parentNode).css({
					paddingTop : paddingTop + 'px',
					height     : ( $(this.parentNode).css('height') ) ? ( $(this.parentNode).outerHeight() - paddingTop ) : ''
				});
			});
		}
	};
})(jQuery);

jQuery(window).bind('load', function(){
	jQuery(document).trigger('elastic:beforeInitialize');
	var iw = document.body.clientWidth
	Elastic();
	(iw != document.body.clientWidth){
		Elastic();
	}
	jQuery(window).bind('resize',function(){
		if(Elastic.configuration.refreshOnResize){
			Elastic.refresh();
		}
	});
	jQuery(document).bind('elastic', Elastic.refresh);
});
