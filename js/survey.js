$(document).ready(function(){
    $('#survey_form').validator();

    $('#survey_form').ajaxForm({
        url: '/survey.json',
        type: 'post',
        dataType: 'json',
        beforeSubmit: function(arr, form, options) {

            var fm = $(form).css({'position':"relative"});
            $('<div class="loading">').appendTo(fm);
        },
        success:function(jsn){
            if(jsn.error) {
                $('#survey_form').find('.loading').remove();
                alert(jsn.error);
            }
            else if(jsn.result) {
                $('#survey_form').html(jsn.result);
            }


    }});




    
});
