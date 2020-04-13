$(document).ready(function(){
    if($('h2').length) {
        $('h2').each(function(ind,elm){
            var text = $(elm).text();
            $(elm).css({"position":"relative"});
            var canvas = $('<canvas>').prependTo($(elm));
            canvas.css({
                "position": "absolute",
                "top":0,
                "left":0
                }).prop({
                height:$(elm).height()+10,
                width:$(elm).width()
            });
            var ctx = canvas[0].getContext("2d");
            ctx.font = '40px "Dosis"';



            ctx.shadowColor = "#999";
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 2;
            ctx.lineWidth=9;
            ctx.strokeStyle = "#FFF";
            ctx.strokeText(text, 4, 36);
            ctx.shadowBlur = 0;
            ctx.fillStyle   = "#06B1DA";
            ctx.fillText(text, 4, 36);

        });
    }



    
});
