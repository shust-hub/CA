jQuery(document).ready(function($) {




    let isValidEmail = function(email) {
        var ml = email.trim();
        var patternMail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        var check_email =  patternMail.test(ml);
        return (check_email);
    };

    $('#pb_students_num').change(function(){
        let cnt = $(this).val()*1;
        if(!cnt){
            $(this).val("1");

        }
        let blocks = $('#studentBlock .well');
        if(cnt>blocks.length){
            for(let c= blocks.length+1; c<=cnt;c++){
                let nb = $(blocks[0]).clone();
                nb.find('input, select').val("");
                nb.appendTo($('#studentBlock'));
            }
        }
        if(cnt<blocks.length){
            for(let c= cnt; c<blocks.length;c++){
                $(blocks[c]).remove();
            }
        }


    });
    if(typeof localStorage.trial !== "undefined") {
        let parentData = JSON.parse(localStorage.getItem('trial'));
        $.each(parentData, function(index, value) {
            $('#'+index).val(value);
        });
    }
    $('#newOrderForm').submit(function(e){
        e.preventDefault();
        let er = "";
        let frm = $(this);
        $(frm).find('input:required:not(:disabled), select:required:not(:disabled)').each(function () {
            if (this.value.length < 1) {
                er = 'Please fill in all required fields!';
            }
        });
        if(!isValidEmail($(frm).find('input[name="email"]').val())) {
            er = 'Please check your email address';
        }

        if (er) {
            Swal.fire(
                'Required fields!',
                er,
                'error'
            )
        } else {
            if(typeof localStorage.trial == "undefined"){
                localStorage.setItem('trial', JSON.stringify([]));
            }
            let parentFields = ['pb_firstname','pb_lastname','pb_cellphone','pb_email','pb_country','pb_city'];
            let parentData = {};
            parentFields.forEach(function (item) {
                parentData[item]=$('#'+item).val();
            });
            localStorage.setItem('trial', JSON.stringify(parentData));

            $('<div class="loading">').appendTo($('#registrationTrialBlock'));
            $.ajax({
                type: "post",
                url: '/trial-registration',
                dataType: 'html',
                data: $(frm).serialize(),
                success: function(data){
                    $('.loading').remove();
                    if(data.error){
                        Swal.fire(
                            '',
                            data.error,
                            'error'
                        )
                    } else {
                        $('#step1').hide();
                        $('#step2').show();
                        location.href = "#trialSchedule";
                    }
                }
            });
        }
    });

    $('.section-register').click(function(e){
        e.preventDefault();
        var id = $(this).data("id");
        $('.program-id').val(id);
        let frm = $('#newOrderForm');
        $('<div class="loading">').appendTo($('#registrationTrialBlock'));
        $.ajax({
            type: "post",
            url: '/checkout-proceed',
            dataType: 'html',
            data: $(frm).serialize(),
            success: function(dat){
                $('.registration-info-block').remove();
                $('#registrationTrialBlock').html(dat);
                $('#payform_proceed').submit();
            }
        });
    });






});