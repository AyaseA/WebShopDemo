$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#recommend_recommend'),
        pageStr = 'recommend_recommend',
        headerHeight = $page.find('>div.header').height();
    // 设置界面高度
    $page.find('>div.main').height(
        bodyHeight - headerHeight - 1
    );


});