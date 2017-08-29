$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_addAddr'),
        pageStr = 'home_addAddr',
        addrId = $$.getQueryString('aid');

    if ($$.isLogin(true)) {
        if (addrId && addrId != '') {
            getAddressDetail();
        } else {
            resetAddr();
        }
        $page.off('click', 'div.addressData >button')
             .on('click', 'div.addressData >button', function() {
            if (validate()) {
                saveAddr();
            }
        });
    }
    function saveAddr() {
        var data = getAddr(),
            method = 'AddAddress';
        if (addrId && addrId != '') {
            data.ID = addrId;
            method = 'UpdateAddress';
        }
        $$.post('CSL/UserInfo/' + method, data, function(res) {
            if (res.Status == 0 && res.Data) {
                layer.msg('保存成功！');
                if (data.IsDefault == 1) {
                    setDefaultAddr(res.Data.ID || addrId, function() {
                        $$.goBack();
                    });
                } else {
                    setDefaultAddr('', function() {
                        $$.goBack();
                    });
                }
            }
        });
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
    function getAddressDetail() {
        $$.post('CSL/UserInfo/QueryAddressDetail', {
            ID: addrId
        }, function(res) {
            if (res.Status == 0 && res.Data) {
                setAddr(res.Data);
            }
        });
    }
    function getAddr() {
        var addr = {};
        addr.Name = $page.find('input[name="receiver"]').val();
        addr.TheMobile = $page.find('input[name="thePhone"]').val();
        addr.Tel = $page.find('input[name="tel"]').val();
        addr.ProvinceID = $page.find('input[name="area"]').attr('data-pro-id');
        addr.CityID = $page.find('input[name="area"]').attr('data-city-id');
        addr.CountyID = $page.find('input[name="area"]').attr('data-coun-id');
        addr.AddressDetail = $page.find('textarea[name="addressDetail"]').val();
        addr.PostCode = $page.find('input[name="postCode"]').val();
        addr.DataField = {
            "province": $page.find('input[name="area"]').attr('data-pro-name'),
            "city": $page.find('input[name="area"]').attr('data-city-name'),
            "county": $page.find('input[name="area"]').attr('data-coun-name')
        };
        addr.IsDefault = $page.find('div.setDefault').hasClass('default') ? 1 : 0;
        addr.DataField = JSON.stringify(addr.DataField);
        return addr;
    }
    function setAddr(addr) {
        if (addr.DataField) {
            addr.DataField = JSON.parse(addr.DataField);
        }
        $page.find('input[name="receiver"]').val(addr.Name);
        $page.find('input[name="thePhone"]').val(addr.Mobile == '0' ? '' : addr.Mobile);
        $page.find('input[name="tel"]').val(addr.Tel == '0' ? '' : addr.Tel);
        $page.find('input[name="area"]').attr('data-pro-id', addr.ProvinceID);
        $page.find('input[name="area"]').attr('data-city-id', addr.CityID);
        $page.find('input[name="area"]').attr('data-coun-id', addr.CountyID);
        $page.find('textarea[name="addressDetail"]').val(addr.AddressDetail);
        $page.find('input[name="postCode"]').val(addr.PostCode);
        $page.find('input[name="area"]').attr('data-pro-name', addr.DataField.province || '');
        $page.find('input[name="area"]').attr('data-city-name', addr.DataField.city || '');
        $page.find('input[name="area"]').attr('data-coun-name', addr.DataField.county || '');
        var area = '';
        if (addr.DataField.province && addr.DataField.city && addr.DataField.county) {
            area = addr.DataField.province + ' - ' + addr.DataField.city + ' - ' + addr.DataField.county;
        }
        $page.find('input[name="area"]').val(area);
        $page.find('div.setDefault').removeClass('default');
        if (addr.ID == $$.getUserInfo().UserAddressID) {
            $page.find('div.setDefault').addClass('default');
        }
    }
    function resetAddr() {
        $page.find('input[name="receiver"]').val('');
        $page.find('input[name="thePhone"]').val('');
        $page.find('input[name="tel"]').val('');
        $page.find('input[name="area"]').attr('data-pro-id', '');
        $page.find('input[name="area"]').attr('data-city-id', '');
        $page.find('input[name="area"]').attr('data-coun-id', '');
        $page.find('textarea[name="addressDetail"]').val('');
        $page.find('input[name="postCode"]').val('');
        $page.find('input[name="area"]').attr('data-pro-name', '');
        $page.find('input[name="area"]').attr('data-city-name', '');
        $page.find('input[name="area"]').attr('data-coun-name', '');
        $page.find('div.setDefault').removeClass('default');
        $page.find('input[name="area"]').val('');
    }
    function validate() {
        var name = $.trim($page.find('input[name="receiver"]').val());
        var mobile = $.trim($page.find('input[name="thePhone"]').val());
        var tel = $.trim($page.find('input[name="tel"]').val());
        var area = $.trim($page.find('input[name="area"]').val());
        var post = $.trim($page.find('input[name="postCode"]').val());
        var detail = $.trim($page.find('textarea[name="addressDetail"]').val());
        if (!name) {
            layer.msg('请填写收货人！');
            return false;
        }
        if (!mobile) {
            layer.msg('请填写手机号！');
            return false;
        } else if (!/^[1]{1}[0-9]{10}$/.test(mobile)) {
            layer.msg('请填写正确的手机号！');
            return false;
        }
        if (tel && !/^[0-9]*$/.test(tel)) {
            layer.msg('请填写正确的固定电话！');
            return false;
        }
        if (!area) {
            layer.msg('请选择所在地区！');
            return false;
        }
        if (post && !/^[0-9]{6}$/.test(post)) {
            layer.msg('请填写正确的邮政编码！');
            return false;
        }
        if (!detail) {
            layer.msg('请填写详细地址！');
            return false;
        }
        return true;
    }
});