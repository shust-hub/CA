        jQuery(document).ready(function($){
            $('.GradesFilterButton').click(function(){
                $(this).parent().find('.FilterFormGrades').animate({
                        height: "toggle"
                    }, 500, function() {
                });
            })
            $('.ClassesFilterButton').click(function(){
                $(this).parent().find('.FilterFormClasses').animate({
                        height: "toggle",
                        display: "flex"
                    }, 500, function() {
                });
            })

            $("input:checkbox").click(function() {
                var showAll = true;
                $('tr').not('.first').hide();
                $('input:checkbox:checked').each(function() {
                    showAll = false;
                    var status = $(this).attr('rel');
                    var value = $(this).val();
                    $('td.' + 'status' + '[rel="' + value + '"]').parent('tr').show();
                });
                if (showAll) {
                    $('tr').show();
                }
            });

        })