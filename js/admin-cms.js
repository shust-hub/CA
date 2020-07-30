function slug(input,  connector) {
    if (typeof connector == "undefined") connector = '-';

    var v = input;
    // Remove accents ...
    var from = '¹²³°æǽÀÁÂÃÅǺĂǍÆǼàáâãåǻăǎª@ĈĊĉċ©ÐĐðđÈÉÊËĔĖèéêëĕėƒĜĠĝġĤĦĥħÌÍÎÏĨĬǏĮĲìíîïĩĭǐįĳĴĵĹĽĿĺľŀÑñŉÒÔÕŌŎǑŐƠØǾŒòôõōŏǒőơøǿºœŔŖŕŗŜȘŝșſŢȚŦÞţțŧþÙÚÛŨŬŰŲƯǓǕǗǙǛùúûũŭűųưǔǖǘǚǜŴŵÝŸŶýÿŷЪЬАБЦЧДЕЁЭФГХИЙЯЮКЛМНОПРСШЩТУВЫЗЖъьабцчдеёэфгхийяюклмнопрсшщтувызжÄÖÜßäöüÇĞİŞçğışĀĒĢĪĶĻŅŪāēģīķļņūҐІЇЄґіїєČĎĚŇŘŠŤŮŽčďěňřšťůžĄĆĘŁŃÓŚŹŻąćęłńóśźżΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώϐϑϒأبتثجحخدذرزسشصضطظعغفقكلمنهويạảầấậẩẫằắặẳẵẹẻẽềếệểễịỉọỏồốộổỗờớợởỡụủừứựửữỳỵỷỹẠẢẦẤẬẨẪẰẮẶẲẴẸẺẼỀẾỆỂỄỊỈỌỎỒỐỘỔỖỜỚỢỞỠỤỦỪỨỰỬỮỲỴỶỸ',
        to = '1230aeaeAAAAAAAAAEAEaaaaaaaaaatCCcccDjDdjdEEEEEEeeeeeefGGggHHhhIIIIIIIIIJiiiiiiiiijJjLLLlllNnnOOOOOOOOOOOEooooooooooooeRRrrSSsssTTTTHtttthUUUUUUUUUUUUUuuuuuuuuuuuuuWwYYYyyyABCChDEEEFGHIJJaJuKLMNOPRSShShchTUVYZZhabcchdeeefghijjajuklmnoprsshshchtuvyzzhAEOEUEssaeoeueCGIScgisAEGIKLNUaegiklnuGIJiYegijiyeCDENRSTUZcdenrstuzACELNOSZZacelnoszzABGDEZEThIKLMNXOPRSTYPhChPsOIYaeeiYabgdezethiklmnxoprsstyphchpsoiyoyobthYabtthghkhdthrzsshsdtthaaghfkklmnhoyaaaaaaaaaaaaeeeeeeeeiioooooooooooouuuuuuuyyyyAAAAAAAAAAAAEEEEEEEEIIOOOOOOOOOOOOUUUUUUUYYYY';
    for (var i = 0, len = from.length; i < len; ++i) {
        v = v.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    var output = v.replace(/<.*?>/g, "").replace(/[^a-z0-9-]+/gi, '-').replace(/\-+/g, '-').replace(/^\-|\-$/g, "").toLowerCase().replace(/\-/g, connector);
    return output;

}
jQuery(document).ready(function($){

    tinymce.init({
        theme: "modern",
        menubar: false,
        plugins: [
            "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
            "searchreplace wordcount visualblocks visualchars codemagic fullscreen insertdatetime media nonbreaking",
            "save table contextmenu directionality template paste textcolor codesample",
            "visualblocks"
        ],
        toolbar: "insertfile undo redo | styleselect formatselect template visualblocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist   | link image media | fullpage | forecolor backcolor codemagic",
        content_css : '/css/editor-area.css,/css/styleBlog.css',
        style_formats: [
            {title: 'Callout box', block: 'div', classes: 'blogPage__calloutBox', wrapper: true},
            {title: 'Attention', block: 'div', classes: 'blogPage__atention', wrapper: true}

        ],
        templates: [
            {title: 'Quote Block', description: 'Quote Block', content: '<div class="blogPage__blockquote">\n' +
                    '    <div>\n' +
                    '        <img src="/images/avatar.png" alt="">\n' +
                    '        <cite>Leland Melvin (Astronaut, NASA Education Administrator)</cite>\n' +
                    '    </div>\n' +
                    '    <blockquote>\n' +
                    '        <p>\n' +
                    '            Computers play an increasingly larger role in all fields of science; they are\n' +
                    '            helping us explore outer-space and our solar system. Whether you want to become a doctor or an astronaut, \n' +
                    '            it would help to learn the basics of computer programming.\n' +
                    '        </p>\n' +
                    '    </blockquote> \n' +
                    '</div>'}
        ],

        height : "880",
        relative_urls : false,
        cleanup : true,
        verify_html : false,

        file_browser_callback: function(field_name, url, type, win) {
            console.log(field_name, url, type, win);
            if(type=='image') {
                var dir = $('#file_dir').val();


                $.get( "/admin/file-manager", { dir: dir}, function( data ) {
                    tinymce.activeEditor.windowManager.open({
                        title: 'File Manager',
                        html: data ,
                        width: 650,
                        height: 550,
                        bodyType: 'tabpanel',
                        buttons: [{
                            text: 'Insert',
                            onclick: function(){
                                var id_win = this._id;
                                console.log($('#' + id_win).parents('.mce-window').find('input:checked'));

                                var file = $('#' + id_win).parents('.mce-window').find('input:checked').val();
                                $('#' + field_name).val(file);
                                tinyMCE.activeEditor.windowManager.close();

                            }
                        }]
                    });
                });

                $('#upload_form input[type=file]').click();

                $('#upload_form input[type=file]').change(function(){

                    $('#upload_form').ajaxSubmit({url: '/upload.json', type: 'post', dataType:'json', success:function(jsn){
                            $('#'+field_name).val(jsn.file);
                            //callback(jsn.files.file.name, {alt: 'My alt text'});
                        }});
                });





            }
        },
        image_class_list: [
            {title: 'Responsive', value: 'img-responsive'},
            {title: 'Zoom', value: 'img-responsive img-zoom'},
            {title: 'Lightbox', value: 'lightbox'}
        ]
    });

    $('#uploadImage').fileupload({
        url: '/admin/upload',
        dataType: 'json',
        done: function (e, data) {
            var jsn = data.result;
            var wrp = $('<div>').addClass('col-sm-4 img-wrapper').appendTo($('#imgContainer'));
            $('<p><img src="'+ jsn.file +'" class="img-responsive"></p>').appendTo(wrp);
            var cv = $('<div>').addClass("row").appendTo(wrp);
            $('<div class="col-sm-6"><div class="radio radio-primary"><input type="radio" name="cover" id="radio'+jsn.id+'" value="'+jsn.id+'"><label for="radio'+jsn.id+'"> Cover </label></div></div>').appendTo(cv);
            $('<div class="col-sm-6 text-right"><button type="button" class="fcbtn btn btn-danger btn-outline btn-1b btn-sm delete-img" data-id="'+jsn.id+'"> delete </button></div>').appendTo(cv);
            $('<p>').html(jsn.text).appendTo(wrp);
            $('#uploaderProgress .progress-bar').css(
                'width', 0
            );

        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#uploaderProgress .progress-bar').css(
                'width',
                progress + '%'
            );
        }
    }).bind('fileuploadsubmit', function (e, data) {
        var $this = $(this);
        var title = $('#uploadText').val();
        var original = $('#uploadOriginalSize').prop('checked');

        data.formData = {
            product: $this.data("product"),
            crop: $this.data("crop"),
            dir: $this.data("dir"),
            id: $this.data("id"),
            original: original?1:0,
            text: title?title:""
        };
    });

    $('#imgContainer').on('click','.delete-img',function(){
        var uin = $(this).data("id");
        var wrapper = $(this).parents(".img-wrapper");
        Swal.fire({
            html: "Удалить изображение?",
            width: 600,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    url: '/admin/image',
                    type: 'POST',
                    data: {id: uin, go: 'delete'},
                    dataType: 'json',
                    success: function (jsn) {
                        wrapper.remove();
                    }
                });
            }
        });

    })
        .on('click','input[name=cover]',function(){
            var uin = $(this).val();
            $.ajax({
                url: '/admin/image',
                type: 'POST',
                data: {id: uin, go: 'setCover'},
                dataType: 'json',
                success: function (jsn) {

                }
            });
        });


});
