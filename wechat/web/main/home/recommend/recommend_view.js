$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_recommend'),
        pageStr = 'home_recommend',
        headerHeight = $page.find('>div.header').height();
    // 设置界面高度
    $page.find('>div.main').height(
        bodyHeight - headerHeight - 1
    );

    // 返回按钮
    $$.setGoBack($page.find('>div.header >a.goBack'));
});