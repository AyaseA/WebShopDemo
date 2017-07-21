$(function() {
    var $page = $('#icenter_storefront'),
        pageStr = 'icenter_storefront';

    var contentHeight=window.innerHeight-$page.find(".header").height();
    $page.find(".content").height(contentHeight);

    $page.find(".header a").click(function(){
        $$.goBack();
    });

    
});