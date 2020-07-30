let getCookie =  function(name) {

  let value = "; " + document.cookie;

  let parts = value.split("; " + name + "=");

  if (parts.length === 2) return parts.pop().split(";").shift();

};

let setCookie =  function(name) {

  let  date = new Date();

  date.setTime(date.getTime() + (180*24*60*60*1000));

  let expires = "; expires=" + date.toUTCString();

  document.cookie = name + "=1"   + expires + "; path=/";

};

jQuery(document).ready(function($) {

  if(!getCookie('ca_subscribe')){





    setCookie('ca_subscribe');



    $.get( "/subscribe", function( data ) {

      $('body').append(data);

      $('#getPromo').show();

      $('#popupCloseButton').click(function(){

        $('#getPromo').remove();

      });

      $('#formGetPromo').submit(function(e){

        e.preventDefault();

        let $form = $(this);

        $('#popupBody').append('<div class="loading"></div>');

        $.ajax({

          type: "post",

          url: '/get-promo',

          dataType: 'json',

          data: $form.serialize(),

          success: function(data){

            $('.loading').remove();

            $('#beforeSuggestion').hide();

            if(data.error){

              $('#popupError').show();

            } else {

              $('#afterSuggestion').show();



            }

          }

        });

      });

    });

  }


});







