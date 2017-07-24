// JavaScript Document
$(function() {
    var bodyH = window.innerHeight || document.body.clientHeight,
        $page = $('#shop_shopList'),
        pageStr = 'shop_shopList',
        headerH = $page.find(".header").height(),
        selectorH = $page.find('.selectShop').height(),
        footerH = $page.find(".footer").height();

    //设置内容高度    
    var contentHeight = window.innerHeight - $page.find(".header").height() - $page.find(".footer").height() - $page.find(".selectShop").height();
    $page.find(".shopList").css({
        'height': bodyH - headerH - selectorH - footerH - 1,
        'top': headerH + selectorH
    });
});