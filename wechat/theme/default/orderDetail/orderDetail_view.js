$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#orderDetail_orderDetail'),
        pageStr = 'orderDetail_orderDetail',
        headerHeight = $page.find('>div.header').height(),
        footerHeight = $page.find('>div.footer').height();
    // 设置界面高度
    $page.find('>div.main').height(
        bodyHeight - headerHeight - footerHeight - 1
    );
    // 设置返回按钮可用
    $$.setGoBack($page.find('>div.header >a.goBack'));

});