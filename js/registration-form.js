jQuery(document).ready(function($) {
    let stateActive = function(){
        let isState = $('#pb_country  option:selected').data('state');

        $('#pb_state').prop('disabled',!isState);

    };
    let bindRegForm = function(){
        stateActive();
        $('#pb_country').change(function(){
            stateActive();
        });
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
                p.find(".student-info").prop("disabled",true);
                $(this).parent().animate({width: '100%'}, 600);
            } else {
                p.find(".student-info").prop("disabled",false);
                $(this).parent().animate({width: '49%'}, 600);
                p.find(".studentInfo").show("slow");
            }
        });
        $('.grades-check').change(function(){
            let out = $(this.options[this.selectedIndex]).data("out");
            if(out===true){
                let textMessage = "This class is recommended for students in grades " + $(this).data("grades") + ".  We suggest that you register your child in a class more suitable for his or her grade.";
                Swal.fire({
                    html: textMessage,
                    width: 600,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Browse Classes',
                    cancelButtonText: 'Dismiss'
                }).then(function(result)  {
                    if (result.value) {
                        window.location.href="/online-coding-classes-for-kids"
                    }
                });
            }
        });
        $('#forgotPwd').click(function(e){
            e.preventDefault();
            let email = $('input[name=login]').val();
            getOTP(email);
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
            if(!isValidEmail($(frm).find('input[name="sign-up-email"]').val())) {
                er = 'Please check your email address';
            }
            if (er) {
                Swal.fire(
                    'Required fields!',
                    er,
                    'error'
                )
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
            if(!isValidEmail($(frm).find('input[name="login"]').val())) {
                er = 'Please check your email address';
            }
            if (er) {
                Swal.fire(
                    'Required fields!',
                    er,
                    'error'
                )
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
    $('#checkPromo').click(function(){
        var code = $('#pb_promo_code').val();
        $('#pmsg').html("");
        $.ajax({
            type: "get",
            url: '/promo-validator',
            dataType: 'json',
            data: $('#orderForm').serialize(),
            success: function(jsn){
                if(jsn['price']){
                    var total = 0;
                    jsn['price'].forEach(function(item, i, arr) {
                        var elm = $('.pcost')[i];
                        total += item.price;
                        if(item.discount){
                            $(elm).parent('span').css({"color":"#CCC", "text-decoration":"line-through"});
                            if(item.price) {
                                $(elm).parents('.order-program-block').find(".dcost").html(' $' + item.price).css({"color":"#F00"});

                            }
                            else {
                                $(elm).parents('.order-program-block').find(".dcost").html(' FREE').css({"color":"#F00"});
                            }
                        } else {
                            $(elm).parent('span').css({"color":"inherit", "text-decoration":"none"});
                        }
                    });
                    if(total){
                        $('#ptotal').text("$"+total);
                    } else {
                        $('#ptotal').text("FREE");
                    }
                }
                else if(jsn.discount) {
                    let total = 0;
                    $('.pcost').each(function(){
                        let orig =  $(this).text();
                        let np = orig;
                        if(jsn.fix){
                            np = orig-jsn.fix;
                        } else {
                            np = Math.round(orig*((100-jsn.discount)/100));
                        }
                        if(np<0){
                            np = 0;
                        }

                        $(this).parent('span').css({"color":"#CCC", "text-decoration":"line-through"});
                        if(np) {
                            $(this).parents('.order-program-block').find(".dcost").html(' $' + np).css({"color":"#F00"});
                        }
                        else {
                            $(this).parents('.order-program-block').find(".dcost").html(' FREE').css({"color":"#F00"});
                        }
                        total += np;


                    });
                    if(total){
                        $('#ptotal').text("$"+total);
                    } else {
                        $('#ptotal').text("FREE");
                    }
                }
                else {
                    $(".pcost").parent('span').css({"color":"inherit", "text-decoration":"none"});
                    let total = 0;
                    $('.pcost').each(function(){
                        total += $(this).text()*1;
                    });
                    $('#ptotal').text("$"+total);
                    $(".dcost").html("");
                    if(jsn.error){
                        $('#pmsg').css({"color":"red"}).html(jsn.error);
                    } else if(code) {
                        $('#pmsg').html("Please enter a valid promo code");
                    }


                }
                if(jsn.error){
                    $('#pmsg').css({"color":"red"}).html(jsn.error);
                }
            }
        });
    });



    let gtag_report_conversion = function(url) {




        return false;
    };


    let isValidEmail = function(email) {
        var ml = email.trim();
        var patternMail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        var check_email =  patternMail.test(ml);
        return (check_email);
    };
    $('#registrationFormBlock')
        .on('click','.go-to-log-in',function(e){
            e.preventDefault();
            $('#logInTab').click();
        })
        .on('click','.get-one-time-password', function(e){
            e.preventDefault();
            let email = $('input[name=sign-up-email]').val();
            console.log(email);
            getOTP(email);
        })
        .on('click','#submitRegistration',function(e){
            e.preventDefault();
            let frm = $(this).parents('form').css({'position': "relative"});
            let er = false;

            $(frm).find('input:required:not(:disabled), select:required:not(:disabled)').each(function () {
                if (this.value.length < 1) {
                    er = 'Please fill in all required fields!';
                }
            });
            if(!isValidEmail($(frm).find('input[name="email"]').val())) {
                er = 'Please check your email address';
            }

            if (!er && $(frm).find('input[name="agree"]').prop('checked') == false) {
                er = 'Please read and accept Terms and Conditions!';
            }
            if (!er && $(frm).find('input[name="program-accept"]:not(:checked)').length) {
                er = 'Please accept all the terms';
            }

            if (er) {
                Swal.fire(
                    'Required fields!',
                    er,
                    'error'
                )
            } else {
                if(typeof localStorage.cart !== "undefined") {
                    localStorage.removeItem('cart');
                }
                gtag_report_conversion();
                $('#reg_promo_code').val($('#pb_promo_code').val());
                $('<div class="loading">').appendTo($('#registrationFormBlock'));
                $.ajax({
                    type: "post",
                    url: '/checkout-proceed',
                    dataType: 'html',
                    data: $(frm).serialize(),
                    success: function(dat){
                        $('.registration-info-block').remove();
                        $('#registrationFormBlock').html(dat);
                        $('#payform_proceed').submit();
                    }
                });

            }
        });
    $('.pb-students').change(function(){
        let cnt = $(this).val();
        if(!cnt){
            $(this).val("1");
            cnt = 1;

            let progField = $(this).prop('id').replace("students","program");
            let $frm = $(this).parents('form');
            if($('.pb-students').length>1){
                Swal.fire({
                    html: "Do you really want to remove this course? ",
                    width: 600,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Yes',
                    reverseButtons: true,
                }).then(function(result) {
                    if (result.value) {
                        let pnm = $frm.find("#"+progField).val();
                       if(typeof localStorage.cart !== "undefined") {
                            let classesInCart = JSON.parse(localStorage.getItem('cart'));
                            classesInCart.forEach(function (item, i, arr) {
                                if (item['id'] === pnm) {
                                    classesInCart.splice(i, 1);
                                }
                            });
                            localStorage.setItem('cart', JSON.stringify(classesInCart));
                        }

                        let idsCart = [];
                        $frm.find("input[name*=program]").each(function (item) {
                            if ($(this).val()!== pnm) {
                                idsCart.push($(this).val());
                            }
                        });
                        window.location.href="/online-registration?id="+idsCart.join("-");
                    }
                });
            } else {

                Swal.fire(
                    '',
                    'Please choose the number of students',
                    'error'
                );
            }
        }
            let $prog = $(this).parents('.order-program-block');
            let costElm = $prog.find('.pcost');
            let cost = costElm.data("cost") * cnt;
            costElm.text(cost);
            let total = 0;
            $('.pcost').each(function () {
                total += $(this).text() * 1;
            });
            $('#ptotal').text("$" + total);


            $('#checkPromo').click();
            if ($('#submitRegistration')[0]) {
                loadStudentForm();
            }


    });
    let getOTP = function(email){
        Swal.fire({
            title:"Password assistance",
            html:"<p>Enter the email address associated with your CodeAdvantage account.</p>",
            input: 'text',
            inputValue:email,
            inputAttributes: {
                placeholder: 'Email'
            },
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: 'Continue',
            showLoaderOnConfirm: true,
            preConfirm: function(login) {
                return fetch('/password/get-one-time?email='+login)
                    .then( function(response) { return response.json()})
                    .then( function(result)  {
                        if (!result.ok) {
                          //  throw new Error(result.error)
                            Swal.showValidationMessage(
                                result.error
                            );
                        }
                        return result
                    });
            }
        }).then(function(result) {
            if (result.value) {
                loginOTP(result.value.email);


            }
        })
    };

    let loginOTP = function(email){
        Swal.fire({
            title: "Authentication required",
            html: "<p>For your security, we need to authenticate your request. We've sent a One Time Password (OTP) to the email " + email + ". Please enter it below. </p>",
            input: 'text',
            inputAttributes: {
                placeholder: 'Enter OTP'
            },
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: 'Continue',
            showLoaderOnConfirm: true,
            preConfirm: function(otp) {
                return fetch("/auth/one-time?email="+email+"&otp="+otp)
                    .then(function(response) { return response.json()})
                    .then(function(result) {
                        if (!result.ok) {
                            Swal.showValidationMessage(
                                result.error
                            )
                        }
                        return result
                    });
            }
        }).then(function(result) {
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