$(document).ready(function(){
    var surQ = 0;
    $('.sur-btn').click(function(){
        $(this).parents('label').find('input').prop('checked',true);
        var blk = $(this).parents('.sur-elm');
        blk.css({'width':blk.width(),'position':'absolute'}).fadeOut();
        blk.next().fadeIn();
    });
    $('.sur-show').click(function(){
        var ablk = $(this).parents('.sur-a').find('.sur-ans-txt');
        $(this).parents('.sur-a').find('.sur-show').hide();
        if($(this).data('id')==1) {
            ablk.show();
        }
        else {
            ablk.hide();
            ablk.find('textarea').val("");
            $(this).parents('.sur-a').find('.sur-btn').click();
        }
    });



    $('#survey_form').ajaxForm({
        url: '/staff-survey.json',
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
