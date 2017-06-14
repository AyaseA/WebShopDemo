$(function() {
    var $page = $('#wechatLogin_wechatLogin'),
        pageStr = 'wechatLogin_wechatLogin';

    var phoneNum = $page.find('#wechatLogin_phone_num'); //手机号
    var verify = $page.find('#wechatLogin_verify'); //验证码
    var loginBtn = $page.find('.wechatLogin_in'); //登录按钮
    var verifyBtn = $page.find('#wechatLogin_get_verify'); //验证码按钮
    var timeLabel = $page.find('#num_delete'); //倒计时
    var returnBtn = $page.find('.return_button');
    var timer; //定时器
    var registType = 6; //获取验证码的类型
    
    //返回按钮
    returnBtn.on('click', function(){
        
        $$.goBack();
        clearInterval(timer);
        $page.find('#wechatLogin_get_verify').css('display', 'block');
        $page.find('#wechatLogin_timeclick').css('display', 'none');
        $page.find('#num_delete').html('59');
        

    });
    //登录按钮
    loginBtn.on('click', function() {
        var isPhone = validatePhone(phoneNum, '请输入正确手机号', function(obj, msg) {
            layer.msg(msg);
        });
        if (isPhone) {
            if (registType == 6) {
                regiestUser(phoneNum.val(), verify.val());
            } else if (registType == 7) {
                dynamicLogin(phoneNum.val(), verify.val());

            }
        }

    });
    //动态登录
    function dynamicLogin(phonenumber, verify) {

        var params = { Mobile: phonenumber, VC: verify };
        $.post($$.serverAddr + 'CSL/Login/LGDynamic', params, function(res) {
            var data = $$.eval(res);
            console.log('dynamicLogin'+data);
            if (data.Status == 0) {
                layer.msg('微信绑定成功');
                $$.redirect("index/index.html");
            } else if (-3 == data.Status) {

                layer.msg('验证码输入错误,请重新输入');

            } else {
                layer.msg('微信绑定失败');
            }
        });

    }
    //注册用户
    function regiestUser(phonenumber, verify) {


        var params = {
            Mobile: phonenumber,
            SessionID: 1,
            RegisterFrom: $$.getQueryString('RegisterFrom') || 1,
            RegisterCont: $$.getQueryString('RegisterCont') || 1,
            VC: verify
        };

        $.post($$.serverAddr + 'CSL/Login/RegisterMobile', params, function(res) {
            var data = $$.eval(res);
            console.log('regiestUser'+data);
            if (data.Status == 0) {
                layer.msg('微信绑定成功');
                $$.redirect("index/index.html");
            } else if (-3 == data.Status) {

                layer.msg('验证码输入错误,请重新输入');


            } else {
                layer.msg('微信绑定失败');
            }
        });
    }
    //获取验证码
    verifyBtn.on('click', function() {
        if (phoneNum.val() == "") {
            layer.msg('请输入手机号');
            return;
        }
        var isPhone = validatePhone(phoneNum, '请输入正确手机号', function(obj, msg) {
            layer.msg(msg);
        });
        if (isPhone) {


            var param = { Mobile: phoneNum.val()};
            $.post($$.serverAddr + 'CSL/Login/HasUserMobile', param, function(res) {
                var data = $$.eval(res);
                if (data.Status == 0) {
                    registType = 7;
                }else{
                    registType = 6;
                }
                sendVerify(phoneNum.val());
            });


        }


    });
    //发送验证码
    function sendVerify(phonenumber) {
        var params = { Mobile: phonenumber, Type: registType, PType: 0 };
        $.post($$.serverAddr + 'Product/Info/SendVerifiedCode', params, function(res) {
            var data = $$.eval(res);

            if (data.Status == 0) {
                layer.msg('验证码已经发送到您的手机');
                $page.find('#wechatLogin_get_verify').css('display', 'none');
                $page.find('#wechatLogin_timeclick').css('display', 'block');
                timer = setInterval(timeControl, 1000);
            } else {
                layer.msg('网络异常');
            }
        });
    }
    //定时器方法
    function timeControl() {
        var time = timeLabel.html();

        if (time <= 0) {
            $page.find('#wechatLogin_get_verify').css('display', 'block');
            $page.find('#wechatLogin_timeclick').css('display', 'none');
            $page.find('#num_delete').html('59');
            clearInterval(timer);
        } else {
            time--;
            $page.find('#num_delete').html(time);

        }
    }
    //  监听input
    $page.on('input propertychange', function() {
        var num = phoneNum.val();
        var verf = verify.val();


        if (num.length == 11 && verf.length > 3) {

            loginBtn.attr("disabled", false);
            loginBtn.removeClass('wechatLogin_in_disable');
            loginBtn.addClass('wechatLogin_in_able');

        } else {
            loginBtn.attr("disabled", true);
            loginBtn.removeClass('wechatLogin_in_able');
            loginBtn.addClass('wechatLogin_in_disable');
        }

    });

});
