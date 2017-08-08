$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#icenter_contact'),
        pageStr = 'icenter_contact',
        headerHeight = $page.find('>div.header').height();
    // 设置界面高度
    $page.find('>div.main').height(
        bodyHeight - headerHeight - 1
    );

    // 返回按钮
    $$.setGoBack($page.find('>div.header >a.goBack'));

    $page.on('click', 'a.button', function() {
        var code = $(this).attr('data-code');
        getToUserId(code);
    });

    function getToUserId(code) {
        $$.post(
            'CSL/P_Msg/TriCall',
            {
                Code: code
            },
            function(res) {
                if (res.Status == 0) {
                    callUser(res.Data, code);
                }
            }
        );
    }
    function callUser(uid, code) {
        $.ajax({
            url: $$.config.serverAddr + 'CSL/P_Msg/CallUser',
            type: 'post',
            data: {
                WToken: $$.getToken(),
                ToUserID: uid
            },
            dataType: 'json',
            success: function(res) {
                console.log(res.code);
                if (res.code == '0') {
                    $page.find('div.warp').html(template(pageStr + '_content', {
                        type: 'succ',
                        code: code
                    }));
                } else {
                    $page.find('div.warp').html(template(pageStr + '_content', {
                        type: 'err',
                        code: code
                    }));
                }
            }
        });
    }
});