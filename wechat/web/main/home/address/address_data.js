$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_address'),
        pageStr = 'home_address';

    if ($$.isLogin(true)) {
        getAddressList();
    }
    function getAddressList() {
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
});