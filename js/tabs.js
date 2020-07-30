
jQuery(document).ready(function($) {
    $('.tabs__link').click(function(e){

            if($(this).hasClass('tabs__link_active')){
                $(this).removeClass('tabs__link_active').siblings().removeClass('tabs__link_active')
                let idTab = $(this).attr('href');
                $(''+idTab+'').removeClass('tabs__pane_show').siblings().removeClass('tabs__pane_show');

              }else{
                $(this).addClass('tabs__link_active').siblings().removeClass('tabs__link_active')
                let idTab = $(this).attr('href');
                $(''+idTab+'').addClass('tabs__pane_show').siblings().removeClass('tabs__pane_show');
              }
    })
})
