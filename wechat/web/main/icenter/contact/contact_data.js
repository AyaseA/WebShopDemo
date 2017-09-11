$(function () {
    var $page = $('#icenter_contact'),
        pageStr = 'icenter_contact',
        callCode = $$.getQueryString('CallCode');
    
    if ($$.isLogin(true)) {
        $$.post('CSL/P_Msg/TriCall', {
            CallCode: callCode
        }, function(res) {
            if (res.Status == 0) {
                $page.find('>div.main').show();
                $page.find('>div.check').hide();
            } else if (res.Status == 95) {
                layer.msg('该二维码未绑定用户');
                $$.goBack();
            } else if (res.Status == 96) {
                $page.find('>div.main').hide();
                $page.find('>div.check').show();
            } else if (res.Status == 97) {
                layer.msg('不能给自己打电话');
                $$.goBack();
            } else if (res.Status == 98) {
                layer.msg('二维码不可用');
                $$.goBack();
            } else if (res.Status == 99) {
                layer.msg('拨打的号码不存在');
                $$.goBack();
            } else if (res.Status == 999) {
                layer.msg('未知错误');
                $$.goBack();
            }
        });

        $page.off('click dbclick', '>div.check >p >span, >div.check >a')
             .on('click dbclick', '>div.check >p >span, >div.check >a', function() {
            $$.redirect('home/fillOrder.html?pid=48&type=0&callcode=' + callCode);
        });

        $$.config.hideGlobalMenu();
        
        $page.find('div.warp').html(template(pageStr + '_content', {
            type: 'msg',
            callCode: callCode
        }));
    }
});