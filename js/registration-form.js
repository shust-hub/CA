jQuery(document).ready(function($) {
    let bindRegForm = function(){
        $('.formLogIn').find('input, textarea').on('keyup blur focus', function (e) {

            var $this = $(this),
                label = $this.prev('label');

            if (e.type === 'keyup') {
                if ($this.val() === '') {
                    label.removeClass('active highlight');
                } else {
                    label.addClass('active highlight');
                }
            } else if (e.type === 'blur') {
                if( $this.val() === '' ) {
                    label.removeClass('active highlight');
                } else {
                    label.removeClass('highlight');
                }
            } else if (e.type === 'focus') {

                if( $this.val() === '' ) {
                    label.removeClass('highlight');
                }
                else if( $this.val() !== '' ) {
                    label.addClass('highlight');
                }
            }

        });

        $('.top-areaTab a').on('click', function (e) {

            e.preventDefault();

            $(this).parent().addClass('active');
            $(this).parent().siblings().removeClass('active');

            target = $(this).attr('href');

            $('.tab-content > div').not(target).hide();

            $(target).fadeIn(600);

        });
        $('.previouslyRegistered').change(function() {
            var x = this.selectedIndex;
            var p = jQuery(this).parents(".well");
            if (x != "") {
                p.find(".studentInfo").hide("slow");
                $(this).parent().animate({width: '100%'}, 600);
            } else {
                $(this).parent().animate({width: '49%'}, 600);
                p.find(".studentInfo").show("slow");
            }
        });
        $('.grades-check').change(function(){
            let out = $(this.options[this.selectedIndex]).data("out");
            if(out===true){
                let textMessage = "Only grades " + $(this).data("grades") + " can register for this class. Please email us at <a href='mailto:office@codeadvantage.org'>office@codeadvantage.org</a> if you have questions.";
                this.value="";
                Swal.fire({
                    html: textMessage,
                    width: 600,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Browse Classes'
                }).then((result) => {
                    if (result.value) {
                        window.location.href="/online-coding-classes-for-kids"
                    }
                });
            }
        });
        $('#forgotPwd').click(function(e){
            e.preventDefault();
            Swal.fire({
                title:"Password assistance",
                html:"<p>Enter the email address associated with your CodeAdvantage account.</p>",
                input: 'text',
                inputAttributes: {
                    placeholder: 'Email'
                },
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonText: 'Continue',
                showLoaderOnConfirm: true,
                preConfirm: (login) => {
                    return fetch(`/password/get-one-time?email=${login}`)
                        .then(response => response.json())
                        .then(result => {
                            if (!result.ok) {
                                throw new Error(result.error)
                            }
                            return result
                        })
                        .catch(error => {
                            Swal.showValidationMessage(
                                error
                            )
                        })
                }
            }).then(result => {
                if (result.value) {
                    loginOTP(result.value.email);


                }
            })
        });
        $('#signupForm').submit(function(e){
            e.preventDefault();

            let frm = $(this);
            let er = false;
            frm.find('input:required, select:required').each(function () {
                if (this.value.length < 1) {
                    er = 'Please fill in all required fields!';
                }
            });
            if (er) {
                alert(er);
            } else {
                $('#signupMsg').empty();
                $('<div class="loading">').appendTo($('#registrationFormBlock'));
                $.ajax({
                    type: "post",
                    url: '/auth/signup',
                    dataType: 'json',
                    data: frm.serialize(),
                    success: function(dat){
                        if(dat.error){
                            $('#signupMsg').html(dat.error);
                            $('.loading').remove();
                        } else {
                            loadStudentForm();
                        }
                    }
                });

            }
        });
        $('#loginForm').submit(function(e){
            e.preventDefault();

            let frm = $(this);
            let er = false;
            frm.find('input:required, select:required').each(function () {
                if (this.value.length < 1) {
                    er = 'Please fill in all required fields!';
                }
            });
            if (er) {
                alert(er);
            } else {
                $('#loginMsg').empty();
                $('<div class="loading">').appendTo($('#registrationFormBlock'));
                $.ajax({
                    type: "post",
                    url: '/auth/login',
                    dataType: 'json',
                    data: frm.serialize(),
                    success: function(dat){
                        if(dat.error){
                            $('#loginMsg').html(dat.error);
                            $('.loading').remove();
                        } else {
                            loadStudentForm();
                        }
                    }
                });

            }

        });
    };
    $('.pb-students').change(function(){
        let cnt = $(this).val();
        let $prog = $(this).parents('.order-program-block');
        let costElm = $prog.find('.pcost');
        let cost = costElm.data("cost")*cnt;
        costElm.text(cost);
        let total = 0;
        $('.pcost').each(function(){
            total += $(this).text()*1;
        });
        $('#ptotal').text("$"+total);



        $('#checkPromo').click();
        if($('#submitRegistration')[0]){
            loadStudentForm();
        }

    });

    let loginOTP = function(email){
        Swal.fire({
            title: "Authentication required",
            html:`<p>For your security, we need to authenticate your request. We've sent a One Time Password (OTP) to the email ${email}. Please enter it below. </p>`,
            input: 'text',
            inputAttributes: {
                placeholder: 'Enter OTP'
            },
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: 'Continue',
            showLoaderOnConfirm: true,
            preConfirm: (otp) => {
                return fetch(`/auth/one-time?email=${email}&otp=${otp}`)
                    .then(response => response.json())
                    .then(result => {
                        if (!result.ok) {
                            throw new Error(result.error)
                        }
                        return result
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                            error
                        )
                    })
            }
        }).then(result => {
            if (result.value) {
                loadStudentForm();
            }
        });
    };

    let loadStudentForm = function(){
        $('<div class="loading">').appendTo($('#registrationFormBlock'));
        $.ajax({
            type: "post",
            url: '/registration-form',
            dataType: 'html',
            data: $('#orderForm').serialize(),
            success: function(dat){
                $('#registrationFormBlock').html(dat);
                bindRegForm();
            }
        });
    };

    loadStudentForm();





});