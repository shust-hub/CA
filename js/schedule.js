var  checkSelect;

jQuery(document).ready(function($){

    checkSelect = function(s){

        let hv = $(s).find("option:selected").text();

        let alrt = $('#swalMessage');

        if(!alrt[0]){

            alrt = $('<div>').attr("id","swalMessage").css({"color":"red"});

            $(s).after(

                alrt

            );

        }

        if(hv=="Tablet"||hv=="iPad") {

            alrt.text('We highly recommend a second device so your child can use zoom better to interact with the instructor and class.');

        } else {

            alrt.empty();

        }

    };



    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    function showTime() {

        let times = $('.section-start');

        for(let i=0;times[i];i++){

            let s = $(times[i]).data("start");

            let e = $(times[i]).data("end");



            let ms = moment.tz(s, 'America/New_York');

            let msl = ms.clone().tz(timezone);

            let mso = ms.clone().tz('America/New_York');

            let me = moment.tz(e, 'America/New_York');

            let mel = me.clone().tz(timezone);

            let meo = me.clone().tz('America/New_York');

            let text = "";



            if(mso.format("h:mm A") !== msl.format("h:mm A")){

                text += msl.format("h:mm A") + " - " + mel.format("h:mm A z");

                ms.utcOffset(-5*60);

                me.utcOffset(-5*60);

                text += "<br><span style='font-size: 12px'>("+  mso.format("h:mm A") + " - " + meo.format("h:mm A [NYC Time -] z") + ")</span>";

            } else {

                text += msl.format("h:mm A") + " - " + mel.format("h:mm A [NYC Time -] z");

            }



            $(times[i]).html(text);

        }

    }

    showTime();



    let showCartIcon = function(){

        let link = false;

        if(typeof localStorage.cart !== "undefined") {

            link = "/online-registration?id=";

            let time = new Date().getTime();

            let classesInCart = JSON.parse(localStorage.getItem('cart'));

            let idsCart = [];

            let inCart = 0;

            classesInCart.forEach(function (item, i, arr) {

                if (item['time'] < time - 86400000) {

                } else {

                    inCart++;

                    idsCart.push(item['id']);

                }

            });

            if (inCart) {

                if(!$('#cart')[0]){

                    $('body').append('<div id="cart"><a class="cart"><div class="pulse"></div><div class="notice"></div></a></div>');

                }

                $('#cart .notice').text(inCart);

                link += idsCart.join("-");

                $('#cart .cart').prop('href',link);

                $('#cart').show();

            } else {

                $('#cart').hide();

                link = false;

            }

        }

        return link;

    };



    showCartIcon();



    let addToCart = function(id){

        if(typeof localStorage.cart == "undefined"){

            localStorage.setItem('cart', JSON.stringify([]));

        }



        let classesInCart = JSON.parse(localStorage.getItem('cart'));



        let classAdd = false;



        classesInCart.forEach(function(item, i, arr) {

            if(item['id']===id){

                classesInCart[i] = {

                    "id":id,

                    "cnt": item['cnt']+1,

                    "time": new Date().getTime()

                };

                classAdd = true;

            }

        });



        if(!classAdd){

            classesInCart.push({

                "id":id,

                "cnt": 1,

                "time": new Date().getTime()

            });

        }

        localStorage.setItem('cart', JSON.stringify(classesInCart));

    };







    $('.section-register').click(function(e){

        e.preventDefault();

        let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        let id = $(this).data("id");

        let cl = $(this).parents("tr");

        let weeks = cl.find('.section-start').data("weeks");

        let days = cl.find('.section-start').data("days");

        let className = cl.find('.class-name').text();

        let startEST = moment.tz(cl.find('.section-start').data("start"), 'America/New_York');

        let startTime = startEST.format("ddd, MMMM Do [at] h:mm A [NYC Time -] z");



        let beginningDate = startEST.format("ddd [beginning] MMMM Do");

        let startLocal =  startEST.clone().tz(timezone).format("h:mm A z");

        let startLocalName =  startEST.clone().tz(timezone).format("zz");



        let textMessage = "You have selected the "+className+" class, beginning on "+startTime;

        if(startEST.format("h:mm A")!==startEST.clone().tz(timezone).format("h:mm A")){

            textMessage += " which is "+startLocal+"  (if you will be taking the class in the "+startLocalName+" zone)";

        }

        if(weeks) {

            textMessage += ".<br>The class will be held every " + beginningDate + " for a period of " + weeks + " weeks.";

        }

        let textMessage2 = "<br>You must use a laptop/desktops for this class. No chromebooks, iPads or tablets. Your child must also use a headset.";



        let hw = $(this).data("hw");

        console.log(hw);

        if(hw){

            textMessage2 = "Please select the device your child will use in class from the allowed options below. A headset and a webcam is also required.";



            Swal.fire({

                html: textMessage2,

                width: 600,

                icon: 'question',

                input: 'select',

                inputOptions: hw,

                inputPlaceholder:"Select the device",

                inputAttributes: {

                    'onchange': 'checkSelect(this);'

                },

                inputValidator: function(value) {

                    return new Promise(function(resolve){

                        if (value) {

                            resolve();

                        } else {

                            resolve('Please select the device your child will use in class')

                        }

                    })

                },

                showCancelButton: true,

                confirmButtonColor: '#3085d6',

                confirmButtonText: 'Next',

                cancelButtonText: 'Cancel',

                reverseButtons: true,

            }).then(function(result) {

                console.log(result,1);

                if (result.value) {

                    addToCart(id);

                    let link = showCartIcon();



                    Swal.fire({

                        html: textMessage,

                        width: 600,

                        icon: 'success',

                        showCancelButton: true,

                        confirmButtonColor: '#3085d6',

                        confirmButtonText: 'Continue to check out',

                        cancelButtonText: 'Add another class',

                        reverseButtons: true,

                    }).then(function(result) {

                        if (result.value) {

                            window.location.href=link

                        } else {

                            console.log(result,1);

                        }

                    });







                }

            });



        } else {

            addToCart(id);



            let link = showCartIcon();

            Swal.fire({

                html: textMessage + textMessage2,

                width: 600,

                icon: 'success',

                showCancelButton: true,

                confirmButtonColor: '#3085d6',

                confirmButtonText: 'Continue to check out',

                cancelButtonText: 'Add another class',

                reverseButtons: true,

            }).then(function(result) {

                if (result.value) {

                    window.location.href=link

                }

            });

        }





    });

    // Работа кнопок фильтров 

    $('.GradesFilterButton').click(function(){
        $(this).parents().find('.FilterFormClasses').hide();
        $(this).parent().find('.FilterFormGrades').animate({
                height: "toggle"
            }, 500, function() {
        });
        $(this).toggleClass('clicked');
        $('.ClassesFilterButton').removeClass('clicked');
    })
    $('.ClassesFilterButton').click(function(){
        $(this).parents().find('.FilterFormGrades').hide();
        $(this).parent().find('.FilterFormClasses').animate({
                height: "toggle"
            }, 500, function() {
        });

        $(this).toggleClass('clicked');
        $('.GradesFilterButton').removeClass('clicked');
    })


    $('.accordeon').each(function(){
        $(this).next().hide();
    })
    $('.accordeon').next().hide();
    $('.accordeon').click(function(){
        $(this).toggleClass("open"); 
        $(this).next().animate({
                height: "toggle"
            }, 500, function() {
        });
    })

    // $('div.tags').find('input:checkbox').live('click', function () {
    //     $('.results > li').hide();
    //     $('div.tags').find('input:checked').each(function () {
    //         $('.results > li.' + $(this).attr('rel')).show();
    //     });
    // });

    function detectRange(str) {
        console.log(str);
        let parts = str.replace(/[^0-9\s]/gi, '');
        console.log(parts)
        let partsLast = str.substr(str.length - 1);
        console.log(parseInt(parts[0]), parseInt(partsLast))
        return [parseInt(parts[0]), parseInt(partsLast)];
    }

    function inRange(n, r) {
        var i = r[0];
        var result = false;
        for (i; i <= r[1]; i++) {
            if (n == i) {
                result = true;
            }
        }
        return result;
    }

    function filterRows(fObj, tObj) {
        let rows = $("tbody > tr", tObj);
        rows.hide();

        if ($(":checked", fObj).length == 0 || $(":checked", fObj).length == $("input[type='checkbox']", fObj)) {
            return;
        }

        let filter = [], range;
        $(":checked", fObj).each(function(i, el) {
            filter.push(parseInt($(el).val()));
        });

        rows.each(function(i, r) {
            range = detectRange($('tr').attr("data-grades", r).trim());
            let hit = 0;
            $.each(filter, function(j, f) {
                if (inRange(f, range)) {
                    hit++;
                }
            });
            if (hit != 0) {
                $(r).show();
            }
        });
    }
    
    $('.FilterFormClasses').find('input:checkbox').live('click', function () {
        $(this).parents(".filterTable").find(".FilterFormGrades").find("input:checkbox").prop('checked', false);
        $(this).parents(".sheduleTable").find($('tr')).not(':first').hide();
        $(this).parents(".sheduleTable").find('.FilterFormClasses').find('input:checked').each(function () {
            let value = $(this).attr('value');
            $(this).parents(".sheduleTable").find($('[data-program="' + value + '"]')).show();
        });
    })

    $(".FilterFormGrades").find("input:checkbox").click(function() {
        $(this).parents(".filterTable").find(".FilterFormClasses").find("input:checkbox").prop('checked', false);
        filterRows($(this).parent(), $(this).parents(".sheduleTable").find($(".table")));
        if ($(this).parents(".FilterFormGrades").find("input:checkbox").filter(':checked').length > 0) {
        } else {
            $('tr').show();
        }

    })

});