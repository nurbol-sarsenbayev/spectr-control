$(function() {

    var $wnd = $(window);
    var $top = $(".page-top");
    var $html = $("html, body");
    var $header = $(".section-header");
    var $menu = $(".main-menu");
    var $loader = $(".preloader");
    var $thanks = $("#thanks");

    var utms = parseGET();

    if(utms && Object.keys(utms).length > 0) {
        window.sessionStorage.setItem('utms', JSON.stringify(utms));
    } else {
        utms = JSON.parse(window.sessionStorage.getItem('utms') || "[]");
    }

    $wnd.scroll(function() { onscroll(); });

    var onscroll = function() {
        if($wnd.scrollTop() > $wnd.height()) {
            $top.addClass('active');
        } else {
            $top.removeClass('active');
        }

        var scrollPos = $wnd.scrollTop() + 83;

        $menu.find("a").each(function() {
            var link = $(this);
            var id = link.attr('href');
            if(id.length > 0 && id.charAt(0) == "#") {
                var section = $(id);
                var sectionTop = section.offset().top;

                if(sectionTop <= scrollPos && (sectionTop + section.height()) >= scrollPos) {
                    link.addClass('active');
                } else {
                    link.removeClass('active');
                }
            }
        });
    }

    onscroll();

    $top.click(function() {
        $html.stop().animate({ scrollTop: 0 }, 'slow', 'swing');
    });

    $(".hamburger").click(function() {
        $this = $(this);

        if(!$this.hasClass("is-active")) {
            $this.addClass('is-active');
            $menu.slideDown('700');
        } else {
            $this.removeClass('is-active');
            $menu.slideUp('700');
        }

        return false;
    });  

    $(".main-menu a").click(function(e) {
        e.preventDefault();
        var $href = $(this).attr('href');
        if($href.length > 0) {
            var dh = 82;
            var top = $href.length == 1 ? 0 : $($href).offset().top - dh;
            $html.stop().animate({ scrollTop: top }, "slow", "swing");
        }
    });

    $(".modal-open").click(function() {
        var id = $(this).data('id');
        var $dialog = $('#'+id);        

        $dialog.fadeIn(500);
        return false;
    });

    $(".modal").click(function() {
        var $modal = $(this);
        closeModal($modal);
    });

    $(".modal-content").click(function(e) {
        e.stopPropagation();
    });

    $(".modal-close").click(function() {
        var $modal = $(this).closest('.modal');
        closeModal($modal);
    });

    function closeModal($modal) {
        $modal.fadeOut(500);

        var $form = $modal.find('form');
        if($form.length > 0) $form[0].reset();

        var $phone = $form.find('.phone');
        if($phone.length > 0) $phone.removeClass('error');
    }

    $(".form-submit").click(function(e) {
        e.preventDefault();
        
        var $form = $(this).closest('form');
        var $requireds = $form.find(':required');
        var formValid = true;

        $requireds.each(function() {
            $elem = $(this);

            if(!$elem.val() || !checkInput($elem)) {
                $elem.addClass('error');
                formValid = false;
            }
        });

        var data = $form.serialize();

        if(Object.keys(utms).length > 0) {
            for(var key in utms) {
                data += '&' + key + '=' + utms[key];
            }
        } else {
            data += '&utm=Прямой переход'
        } 

        if(formValid) {
            $.ajax({
                type: "POST",
                url: "/mail.php",
                data: data
            }).done(function() {                
            });

            $(this).closest('.modal').fadeOut(500);
            $requireds.removeClass('error');
            $form[0].reset();
            $thanks.fadeIn(500);
        }
    });

    $(".modal-submit").click(function(e) {
        e.preventDefault();
        
        
    });

    $(".phone").mask("+7 (999) 999 99 99", {
        completed: function() {
            $(this).removeClass('error');
        }
    });    

    var $catalogs = $(".carousel-catalog");
    var $buttons = $(".section-catalog-buttons .button");
    $buttons.click(function() {
        $buttons.removeClass("inverse");
        $(this).addClass("inverse");
        
        var id = "#" + $(this).data("id");
        $catalogs.removeClass("active");
        $(id).addClass("active");
    })

    $("input:required").keyup(function() {
        var $this = $(this);
        if(!$this.hasClass('phone')) {
            checkInput($this);
        }
    });    

    $(".carousel-certificate").owlCarousel({
        nav: true,
        dots: false,
        loop: false,
        smartSpeed: 500,
        margin: 10,
        navText: ['', ''],
        responsive: {
            0: { items: 1 },
            479: { items: 2 },        
            768: { items: 3 },        
            992: { items: 4 },
        },
    });


});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function checkInput($input) {
    if($input.val()) {
        if($input.attr('type') != 'email' || validateEmail($input.val())) {
            $input.removeClass('error');
            return true;
        }
    }
    return false;
}
    

function parseGET(url){
    var namekey = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    if(!url || url == '') url = decodeURI(document.location.search);
     
    if(url.indexOf('?') < 0) return Array(); 
    url = url.split('?'); 
    url = url[1]; 
    var GET = {}, params = [], key = []; 
     
    if(url.indexOf('#')!=-1){ 
        url = url.substr(0,url.indexOf('#')); 
    } 
    
    if(url.indexOf('&') > -1){ 
        params = url.split('&');
    } else {
        params[0] = url; 
    }
    
    for (var r=0; r < params.length; r++){
        for (var z=0; z < namekey.length; z++){ 
            if(params[r].indexOf(namekey[z]+'=') > -1){
                if(params[r].indexOf('=') > -1) {
                    key = params[r].split('=');
                    GET[key[0]]=key[1];
                }
            }
        }
    }

    return (GET);    
};