$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#icenter_orderDetail'),
        pageStr = 'icenter_orderDetail',
        headerHeight = $page.find('>div.header').height(),
        footerHeight = $page.find('>div.footer').height();
    // 设置界面高度
    $page.find('>div.main').height(
        bodyHeight - headerHeight - footerHeight - 1
    );

});