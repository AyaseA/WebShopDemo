$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_address'),
        pageStr = 'home_address';
    

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

    // 设置默认地址
    $page.on('click', '>div.main div.item >i', function() {
        var $this = $(this);
        setDefaultAddr($this.attr('data-id'), function() {
            $this.parent().addClass('default').siblings().removeClass('default');
        });
    });
    // 删除地址
    $page.on('click', '>div.main div.item a.delete', function() {
        if ($page.find('div.confirm').is(':visible')) {
            return false;
        }
        $page.find('div.confirm').show();
        $page.find('div.confirm').find('p').text('确认删除该收货地址？');
        
        $page.find('div.confirm button.confirm').attr('data-id', $(this).attr('data-id'));
    });
    // 删除前确认相关
    $page.on('click', 'div.confirm button.confirm', function() {
        deleteAddr($(this).attr('data-id'), function() {
            $page.find('div.confirm').hide();
            getAddrList();
        });
    });
    // 删除前确认相关
    $page.on('click', 'div.confirm, div.confirm button.cancel', function() {
        $page.find('div.confirm').hide();
    });
    // 删除前确认相关
    $page.on('click', 'div.confirm >div', function(e) {
        e.stopPropagation();
    });

    function getAddrList() {
        $$.post('CSL/UserInfo/QueryAddressList', {
            Rows: 9999
        }, function(res) {
            if (res.Status == 0 && res.Data.Rows) {
                $page.find('div.addrList').html(template(pageStr + '_addrList', {
                    list: res.Data.Rows,
                    userAddressID: $$.getUserInfo().UserAddressID
                }));
            }
        });
    }
    function deleteAddr(id, calback) {
        $$.post(
            'CSL/UserInfo/DelAddress',
            {
                'ID': id
            },
            function(res) {
                if (res.Status != 0 && res.Data == 'Succ') {
                    return false;
                }
                if (calback) {
                    calback();
                }
            }
        );
    }
    function setDefaultAddr(id, calback) {
        $$.post(
            'CSL/UserInfo/UpdateAddressDefault',
            {
                'ID': id
            },
            function(res) {
                if (res.Status != 0 && res.Data == 'Succ') {
                    return false;
                }
                $$.setUserInfo('UserAddressID', id);
                if (calback) {
                    calback();
                }
            }
        );
    }
});