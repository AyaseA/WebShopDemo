$(function() {
    //qq分享
    if((navigator.userAgent.indexOf("QQ") !=-1)&&(navigator.userAgent.indexOf("MicroMessenger") ==-1)){
        $$.redirect("icenter/login.html");
    }
    //测试qqq分享--end;
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_wechatLogin'),
        pageStr = 'home_wechatLogin',
        titleHeight = $page.find('>div.clause >div.title').height();

    var phoneNum = $page.find('#wechatLogin_phone_num'); //手机号
    var verify = $page.find('#wechatLogin_verify'); //验证码
    var loginBtn = $page.find('.wechatLogin_in'); //登录按钮
    var verifyBtn = $page.find('#wechatLogin_get_verify'); //验证码按钮
    var timeLabel = $page.find('#num_delete'); //倒计时
    var returnBtn = $page.find('.return_button');
    var timer; //定时器
    var registType = 8; //获取验证码的类型
    // 设置高度
    $page.find('>div.clause >div.content').height(bodyHeight - titleHeight - 1);
    $page.on('click', '>div.clause a.closeModal', function() {
        $page.find('>div.clause').animate({
            'top': bodyHeight
        }, 200).fadeOut(200);
    });
    $page.on('click', '>aside.wechatLogin_aside a.showClause', function() {
        $page.find('>div.clause').show().animate({
            'top': 0
        }, 200);
    });
    //返回按钮
    returnBtn.on('click', function() {
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
            regiestUser(phoneNum.val(), verify.val());
        }
    });
    //注册用户
    function regiestUser(phonenumber, verify) {
        var RegisterFrom = $$.getQueryString('RegisterFrom') || 0,
            RegisterCont = $$.getQueryString('RegisterCont'),
            goBackUrl = 'home/index.html';
        RegisterCont = RegisterCont ? parseInt(Base64.decode(RegisterCont)) : '';
        if ($$.stack.getLast()) {
            goBackUrl = $$.stack.pop();
        }
        if ($$.getQueryString('redirecturl')) {
            goBackUrl = unescape($$.getQueryString('redirecturl'));
        }
        $.ajax({
            url: $$.config.serverAddr + 'Product/Info/TestVerifiedCode',
            type: 'POST',
            data: {
                Mobile: phonenumber,
                Type: 8,
                PType: 0,
                VC: verify
            },
            dataType: 'json',
            success: function(res) {
                if (res.Status == 0) {
                    location.href = wechatAuthUrl(phonenumber, verify, RegisterFrom, RegisterCont, goBackUrl);
                } else {
                    layer.msg('验证码无效！');
                }
            }
        });
    }
    // 微信授权url
    function wechatAuthUrl(phonenumber, verify, RegisterFrom, RegisterCont, url) {
        return 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
               'appid=' + $$.config.wxAppID + '&redirect_uri=' + escape($$.config.serverAddr).replace(/\//g, '%2F') +
               'CSL%2FLogin%2FHandleWAuth%3Furl%3D' +
               escape(escape(url).replace(/\//g, '%2F')) +
               '&response_type=code&scope=snsapi_base&state=' + phonenumber +
               'A' + verify + 'A' + RegisterFrom + 'A' + RegisterCont + '#wechat_redirect';
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
            /*$$.get(
                'CSL/Login/IsAuth?Mobile=' + phoneNum.val(),
                function(res) {
                    if (res.Status == 0 && res.Data == 'Succ') {
                        layer.msg('您的手机号已注册！');
                    } else if (res.Status == 1 && res.Data == 'Not Auth') {
                        sendVerify(phoneNum.val());
                    }
                }
            );*/
            sendVerify(phoneNum.val());
        }
    });
    //发送验证码
    function sendVerify(phonenumber) {
        var params = { Mobile: phonenumber, Type: registType, PType: 0 };
        $.post($$.config.serverAddr + 'Product/Info/SendVerifiedCode', params, function(res) {
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
    $page.on('input', 'input.wechatLogin_input', function() {
        loginBtnStatuc();
    });
    $page.on('click', 'aside.wechatLogin_aside >p >span', function() {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $(this).addClass('selected');
        }
        loginBtnStatuc();
    });
    function loginBtnStatuc() {
        var num = phoneNum.val(),
            verf = verify.val(),
            isCheck = $page.find('aside.wechatLogin_aside >p >span').hasClass('selected');
        if (num.length == 11 && isCheck && verf.length > 3) {
            loginBtn.attr("disabled", false);
            loginBtn.removeClass('wechatLogin_in_disable');
            loginBtn.addClass('wechatLogin_in_able');
        } else {
            loginBtn.attr("disabled", true);
            loginBtn.removeClass('wechatLogin_in_able');
            loginBtn.addClass('wechatLogin_in_disable');
        }
    }
});
