jQuery(document).ready(function($){







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

        textMessage += "<br>You must use a laptop/desktops for this class. No chromebooks, iPads or tablets. Your child must also use a headset.";





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

        }).then((result) => {

            if (result.value) {

                window.location.href=link

            }

        });

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
    
               // Фильтрация по классам 
                $('[data-title="Class"]').each(function () {
                    let Class =  $('a', this).attr('title');
                    Class=Class.split(':')[0];
                    Class=Class.split(' Level')[0];
                    $(this).attr('rel', Class);
                });
    
                function detectRange(str) {
                    var parts = str.split("-");
                    if (parts[0] == "K (graduated) "){
                        parts[0] = '0';
                        
                    }
                    return [parseInt(parts[0]), parseInt(parts[1])];
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
                    var rows = $("tbody > tr", tObj);
                    rows.hide();
                    if ($(":checked", fObj).length == 0 || $(":checked", fObj).length == $("input[type='checkbox']", fObj)) {
                        return;
                    }
                    var filter = [], range;
                    $(":checked", fObj).each(function(i, el) {
                        filter.push(parseInt($(el).val()));
                    });
                    rows.each(function(i, r) {
                        range = detectRange($('[data-title="Grade level"]', r).text().trim());
                        var hit = 0;
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
    
                        
                $(".FilterFormClasses").find("input:checkbox").click(function() {
                    $(this).parents(".filterTable").find(".FilterFormGrades").find("input:checkbox").prop('checked', false);
                    $(this).parents(".pb-text").find($('tr')).not(':first').hide();
                    $('input:checkbox:checked').each(function() {
                        var status = $(this).attr('rel');
                        var value = $(this).val();
                        $('[rel="' + value + '"]').parent('tr').show();
                    });
                    if ($(this).parents(".FilterFormClasses").find("input:checkbox").filter(':checked').length > 0) {
    
                    } else {
                        console.log('nothing checked');
                        $('tr').show();
                    }
                });
    
                $(".FilterFormGrades").find("input:checkbox").click(function() {
                    $(this).parents(".filterTable").find(".FilterFormClasses").find("input:checkbox").prop('checked', false);
                    filterRows($(this).parent(), $(this).parents(".pb-text").find($("table")));
                    if ($(this).parents(".FilterFormGrades").find("input:checkbox").filter(':checked').length > 0) {
    
                    } else {
                        $('tr').show();
                    }
                })
                
                $('[data-title="Class"]').each(function () {
                    var atrr = $(this).attr('rel').replace(/\s+/g, '');
                        switch (atrr){
                            case 'ScratchJr': $(this).find('a').attr('data-tooltip-content', "#tooltip_ScratchJr");
                                              $(this).parent('tr').css({"border-left":"6px solid #f0e247","border-right":"6px solid #f0e247"});
                                    break;
                            case '3DVideoGameDesign': $(this).find('a').attr('data-tooltip-content', "#tooltip_3DVideoGameDesign");
                                              $(this).parent('tr').css({"border-left":"6px solid #f0e247","border-right":"6px solid #f0e247"});
                                    break;
                            case 'Scratch': $(this).find('a').attr('data-tooltip-content', "#tooltip_Scratch");
                                              $(this).parent('tr').css({"border-left":"6px solid #d35347","border-right":"6px solid #d35347"});
                                    break;
                            case 'MinecraftClub': $(this).find('a').attr('data-tooltip-content', "#tooltip_MinecraftClub");
                                              $(this).parent('tr').css({"border-left":"6px solid #f0e247","border-right":"6px solid #f0e247"});
                                break;
                            case 'RobloxBuild': $(this).find('a').attr('data-tooltip-content', "#tooltip_RobloxBuild");
                                              $(this).parent('tr').css({"border-left":"6px solid #f0e247","border-right":"6px solid #f0e247"});
                                break;
                            case 'RobloxCode': $(this).find('a').attr('data-tooltip-content', "#tooltip_RobloxCode");
                                              $(this).parent('tr').css({"border-left":"6px solid #5cb8d7","border-right":"6px solid #5cb8d7"});
                                break;
                            case 'Python': $(this).find('a').attr('data-tooltip-content', "#tooltip_Python");
                                              $(this).parent('tr').css({"border-left":"6px solid #5cb8d7","border-right":"6px solid #5cb8d7"});
                                break;
                            case 'WebDevelopment': $(this).find('a').attr('data-tooltip-content', "#tooltip_WebDevelopment");
                                              $(this).parent('tr').css({"border-left":"6px solid #5cb8d7","border-right":"6px solid #5cb8d7"});
                                break;
                            case 'MinecraftJavaMods': $(this).find('a').attr('data-tooltip-content', "#tooltip_MinecraftJavaMods");
                                $(this).parent('tr').css({"border-left":"6px solid #d35347","border-right":"6px solid #d35347"});
                                break;
                            case 'MinecraftModding': $(this).find('a').attr('data-tooltip-content', "#tooltip_MinecraftModding");
                                $(this).parent('tr').css({"border-left":"6px solid #5cb8d7","border-right":"6px solid #5cb8d7"});
                                break;
                            default: console.log(" ")
                                break;
                        }
                    $(this).find('a').addClass("tooltip");
                });
                
    
                $('.tooltip').tooltipster({
                    theme: 'tooltipster-shadow',
                    contentCloning: true
                });
    
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



});