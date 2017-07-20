$(function() {
    var $page = $('#icenter_storefront'),
        pageStr = 'icenter_storefront';

    $page.find(".header a").click(function(){
        $$.goBack();
    });

    $page.find(".header span").click(function(){
        $page.find(".header span").removeClass("on");
        $(this).addClass("on");
        $(".storeContent,.productContent").hide();
        $("."+$(this).attr("data-content")).show();
    });

});