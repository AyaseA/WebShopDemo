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
        var param = { Mobile: mobile };
        $$.post('CSL/Login/HasUserMobile', param, function(data) {
            if (data.Status > 0) {
                sendVerify();
            } else if (data.Status == 0) {
                layer.msg('用户已经注册!');
            }
        }, function(error) {
            layer.msg('请求失败,请检查网络设置!');
        });

        function sendVerify() {
            var params = { Mobile: mobile, Type: 6, PType: 0 };
            $$.post('Product/Info/SendVerifiedCode', params, function(data) {
                if (data.Status == 0) {
                    showPrompt();
                } else {
                    layer.msg('网络异常');
                }
            }, function(error) {
                layer.msg('请求失败,请检查网络设置!');
            });
        }

        function regiestUser(phoneNum, verify,index) {


            var params = { Mobile: mobile, SessionID: 1, RegisterFrom: 2, RegisterCont: 1, VC:verify };

            $$.post('CSL/Login/RegisterMobile', params, function(data) {
                console.log(1);
                if (data.Status == 0) {
                console.log(2);

                    layer.msg('注册成功');
                    layer.close(index);
                } else if (-3 == data.Status) {
                    
                    layer.msg('验证码输入错误,请重新输入');
                }else{

                }
            }, function(error) {

                layer.msg('请求失败,请检查网络设置!');
            });
        }


        // post: function(url, data, succfunc, errfunc) 
        function showPrompt() {
            layer.prompt({
                formType: 3,
                // value: '初始值
                title: '请输入手机验证码领取优惠',
                // area: ['800px', '350px'] //自定义文本域宽高
            }, function(value, index, elem) {
              regiestUser(mobile,value,index);
            });
        }



        // REFormObj.submit();
    }
});
