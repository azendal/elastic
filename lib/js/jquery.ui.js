/*
	Elastic CSS Framework
	Released under the MIT, BSD, and GPL Licenses.
	More information http://elasticss.com
	
	Elastic jQueryUIWrapper Module
	Provides
		Convenience initializers for jQuery UI
		Convenience event handlers for jQuery UI
	Requires
		jQueryUI
*/
(function($){
	$(function(){
		$(document).bind('elastic:Initialize', function(){
			$.datepicker.regional['es']
			$('.elastic-ui-datepicker').each(function(){
				$(this).datepicker({
					changeMonth : true,
					changeYear : true, 
					yearRange : '-10:+10'
				});
			});
			
			$('form').submit(function(){
				$('.elastic-ui-datepicker').each(function(e){
					var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
					var dates = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
					var date = $(this).datepicker('getDate');
					if(date){
						$(this).val( [date.getFullYear(), months[date.getMonth()], dates[date.getDate()] ].join('-') );
					}
				});
			});
		});
	});
})(jQuery);
