$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_search'),
        pageStr = 'home_search',
        headerHeight = $page.find('>div.header').height(),
        mainHeight = bodyHeight - headerHeight,
        boxWidth = $page.find('>div.header').width();
    // 设置界面高度
    if ($$.config.isCompatibleIOSTop && navigator.userAgent.indexOf('csl-ios') != -1) {
        $page.find('>div.header').height(102);
    }

    // 返回按钮
    $$.setGoBack($page.find('>div.header a.goback'));

    $page.find('div.search-cnt').width(boxWidth * 3)
         .find('>div').width(boxWidth).height(mainHeight);
    $page.find('div.result-cnt').height(mainHeight);
         
    $page.on('click dbclick', 'div.header ul.tabs >li', function() {
        if (!$(this).hasClass('on')) {
            $(this).addClass('on').siblings('li').removeClass('on');
            var index = +$(this).attr('data-index');
            $page.find('div.search-cnt').animate({
                'margin-left': -1 * index * boxWidth
            }, 200);
        }
    });

});