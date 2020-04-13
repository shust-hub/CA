/**
 * Bracara v1.0
 * Drupal Multipurpose Theme
 * http://bracara.leaftree.pt
 *
 * leaftree 2013
 * @leaftreeInc
 * http://leaftree.pt
 */
 
(function ($) {
  "use strict";
  
  $(document).ready(function() {
	
	/* video modal*/ 
	$('#show-sign-up').click(function(){
		  $('#sign-up').show();
		  });

    $("#order_form").ajaxForm({url: '/checkout', type: 'post', success:function(dat){
      $('#proceed').html(dat);
      $('#payform_proceed').submit();

    }});
    $("#cart_form").ajaxForm({url: '/checkout-cart', type: 'post', success:function(dat){
      $('#proceed').html(dat);
      $('#payform_proceed').submit();

    }});





    $("[data-toggle=popover]").popover();

    
    $("[data-toggle=tooltip]").tooltip();
    
    // buttons loading
    $('.btn-loading').click(function () {
      var btn = $(this)
      btn.button('loading')
      setTimeout(function () {
        btn.button('reset')
      }, 3000)
    });
    
    if (jQuery().placeholder) {
      $('input, textarea').placeholder();
    }

  });
  
})(jQuery);
