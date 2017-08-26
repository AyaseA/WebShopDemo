$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_addAddr'),
        pageStr = 'home_addAddr';
    
    if ($$.config.isCompatibleIOSTop && navigator.userAgent.indexOf('csl-ios') != -1) {
        $page.find('>div.main').css({
            'top': '64px'
        }).end().find('>div.header').height(64);
    }

    var headerHeight = $page.find('>div.header').height();

    // 设置界面高度
    $page.find('>div.main').height(
        bodyHeight - headerHeight
    );
    // 返回按钮
    $$.setGoBack($page.find('>div.header >a.goBack'));

    // 点击label也能触发input的touchstart事件
    $page.on('click dbclick', '#home_addAddr_trlinkall', function(e) {
        e.stopPropagation();
    });
    $page.on('click dbclick', 'label.trlinkall_label', function() {
        var event = document.createEvent('Events');
        event.initEvent('touchstart', true, true); 
        $('#home_addAddr_trlinkall')[0].dispatchEvent(event);
    })
    // 设置默认
    $page.on('click dbclick', 'div.setDefault', function() {
        if ($(this).hasClass('default')) {
            $(this).removeClass('default');
        } else {
            $(this).addClass('default');
        }
    });
    // 省市县
    ;(function() {
        $$.get('Product/Info/TriLinkAll', function(res) {
            if (res.Status == 0) {
                var triArr = [];
                res.Data.forEach(function(itemA) {
                    var childA = [];
                    itemA.children.forEach(function(itemB) {
                        var childB = [];
                        itemB.children.forEach(function(itemC) {
                            childB.push({
                                id: itemC.ID,
                                value: itemC.Name
                            });
                        });
                        childA.push({
                            id: itemB.ID,
                            value: itemB.Name,
                            child: childB
                        });
                    });
                    triArr.push({
                        id: itemA.ID,
                        value: itemA.Name,
                        child: childA
                    });
                });
                new MultiPicker({
                    input: 'home_addAddr_trlinkall',
                    container:'home_addAddr_trlinkall_modal',
                    jsonData: triArr,
                    success: function(arr) {
                        $('#home_addAddr_trlinkall').val(arr[0].value + ' - ' +
                                                           arr[1].value + ' - ' +
                                                           arr[2].value)
                            .attr('data-pro-id', arr[0].id)
                            .attr('data-pro-name', arr[0].value)
                            .attr('data-city-id', arr[1].id)
                            .attr('data-city-name', arr[1].value)
                            .attr('data-coun-id', arr[2].id)
                            .attr('data-coun-name', arr[2].value);
                    }
                });
            }
        });
    }());
});