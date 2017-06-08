$(function() {
    var REFormObj = document.getElementById('REForm');
    var submitREObj = document.getElementById('submitRE');

    submitREObj.onclick = function() {
        var mobile = document.getElementById('mobile').value;
        mobile = mobile.replace(/^\s+/, '').replace(/\s+$/, '');

        var mobileReg = /^1\d{10}$/;
        if (!mobileReg.test(mobile)) {
            layer.msg('请输入正确地手机号！');

            return false;
        }

        layer.prompt({
            formType: 3,
            // value: '初始值',
            placeHolder: 'wertyuio',
            title: '请输入手机验证码领取优惠',
            // area: ['800px', '350px'] //自定义文本域宽高
        }, function(value, index, elem) {
            alert(value); //得到value
            layer.close(index);
        });


        REFormObj.submit();
    }
});
