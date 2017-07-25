// JavaScript Document
$(function() {
    var bodyH = window.innerHeight || document.body.clientHeight,
        $page = $('#shop_shopList'),
        pageStr = 'shop_shopList',
        headerH = $page.find(".header").height(),
        selectorH = $page.find('.selectShop').height(),
        footerH = $page.find(".footer").height();

    // 获取位置
    $page.find('>div.header >a.location >span').text(
        $$.getLocationInfo().name
    );
});