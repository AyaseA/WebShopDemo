$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#orderCommit_orderCommit'),
        pageStr = 'orderCommit_orderCommit',
        headerHeight = $page.find('>div.header').height();

    // 设置界面高度
    $page.find('>div.main').height(bodyHeight - headerHeight - 1);
    // 设置返回按钮可用
    $$.setGoBack($page.find('>div.header >a.goBack'));
});