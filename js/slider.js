var petition;

$(document).ready()
{
  // For IE8, can't start with opacity in the HTML, so we made things display: none.  Now we show them but
  // set opacity to 0, ready for code to start showing them by fading them in.

  $(".highlighted-image-2 div.slides").css({display: "block", opacity: 0});

  $("#fullwidth0").css({ opacity: 1});


  // Use retina versions of the hero background images if on a retina display.
  $(".highlighted-image-2 div.slides").each(function()
  {
    var imageUrl = $(this).data('background-image');
    var imagePos = $(this).data('background-position');
    /*if (window.devicePixelRatio >= 2)
    {
      imageUrl = imageUrl.replace(".jpg", "_2x.jpg");
    }
    */
    $(this).css('background-image', 'url(/img/highlighted/dots.png),url('+imageUrl+')');
    $(this).css('background-position', 'center,'+imagePos);

  });

}


function showSlide(lastImage, nextImage) {
/*
  $('#control_paging li').removeClass('active');
  $($('#control_paging li')[nextImage]).addClass('active');
*/
  if(nextImage>lastImage){
    $("#fullwidth" + nextImage).fadeTo(2000, 1,function(){
      $("#fullwidth" + lastImage).css('opacity',0);
    });

  }
  else{
    $("#fullwidth" + nextImage).css('opacity',1);
    $("#fullwidth" + lastImage).fadeTo(2000, 0);
  }

}

var currentImage = 0;
var timerId;

function cycleImage() {
  var numWideHeroes = $(".slides").length;
  var nextImage = (currentImage + 1) % numWideHeroes;
  showSlide(currentImage, nextImage);
  currentImage = nextImage;
}

$.ready()
{
  timerId = setInterval(cycleImage, 9000);
}