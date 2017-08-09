$(function() {
    var $page = $('#icenter_login'),
        pageStr = 'icenter_login',
        timer,
        type = 2,
        registerFrom = $$.getQueryString('rfrom') || '',
        registerCont = $$.getQueryString('rcont') || '';

    $$.config.hideGlobalMenu();

    if (type == 2) {
        statusLogin();
        resetVCode();
    }
    $page.off('click', 'a.goback').on('click', 'a.goback', function() {
        if (type == 2) {
            $$.goBack();
        } else {
            statusLogin();
            resetVCode();
        }
        $page.find('input[name=vcode], input[name=invitecode]').val('');
        validate();
    });
    $page.off('click', 'a.register').on('click', 'a.register', function() {
        statusRegister();
    });
    $page.off('click', 'a.forget').on('click', 'a.forget', function() {
        statusForget();
    });
    $page.off('click', 'button.commit').on('click', 'button.commit', function(e) {
        e.preventDefault();
        if (!$(this).hasClass('disabled')) {
            var phone = $page.find('input[name=phone]').val();
            var pwd = $page.find('input[name=pwd]').val();
            if (type == 2) {
                // 登录
                login(phone, pwd, '登录成功');
            } else if (type == 0) {
                // 注册
                var vcode = $page.find('input[name=vcode]').val();
                var invitecode = $page.find('input[name=invitecode]').val();
                register(phone, pwd, vcode, invitecode);
            } else if (type == 1) {
                // 找回密码
                var vcode = $page.find('input[name=vcode]').val();
                forget(phone, pwd, vcode);
            }
        }
    });
    $page.off('click', 'button.getVCode').on('click', 'button.getVCode', function(e) {
        e.preventDefault();
        if (!$(this).hasClass('sending')) {
            var phone = $.trim($page.find('input[name=phone]').val());
            if (phone.length == 11 && /^1[3|4|5|7|8]\d{9}$/.test(phone)) {
                sendingVCode({
                    Mobile: phone,
                    Type: type,
                    PType: 0
                });
            } else {
                layer.msg('请输入正确的手机号');
            }
        }
    });
    $page.off('input onpropertychange', 'input[name=phone]')
         .on('input onpropertychange', 'input[name=phone]', function() {
        var phone = $.trim($(this).val());
        if (phone.length > 11 || !/^[1-9]{1}[0-9]*$/.test(phone)) {
            phone = phone.substring(0, phone.length - 1);
        }
        $(this).val(phone);
        validate();
    });
    $page.off('input onpropertychange', 'input[name=pwd]')
         .on('input onpropertychange', 'input[name=pwd]', function() {
        validate();
    });
    $page.off('input onpropertychange', 'input[name=vcode]')
         .on('input onpropertychange', 'input[name=vcode]', function() {
        var vcode = $.trim($(this).val());
        if (vcode.length > 6 || !/^[0-9]*$/.test(vcode)) {
            vcode = vcode.substring(0, vcode.length - 1);
        }
        $(this).val(vcode);
        validate();
    });
    function login(phone, pwd, msg) {
        $.ajax({
            url: $$.config.serverAddr + 'CSL/Login/LG',
            type: 'POST',
            data: {
                Mobile: phone,
                Password: pwd,
                Platform: 13
            },
            dataType: 'json',
            success: function(res) {
                if (res.Status == 0) {
                    if (res.Data.WToken) {
                        $$.setToken(res.Data.WToken);
                        layer.msg(msg);
                        $$.goBack();
                    }
                }
            }
        });
    }
    function forget(phone, pwd, vcode) {
        $.ajax({
            url: $$.config.serverAddr + 'CSL/Login/ResetPwdByPhone',
            type: 'POST',
            data: {
                Mobile: phone,
                NewPwd: pwd,
                VC: vcode
            },
            dataType: 'json',
            success: function(res) {
                if (res.Status == 0 && res.Data == 'Succ') {
                    login(phone, pwd, '密码找回并登录成功');
                }
            }
        });
    }
    function register(phone, pwd, vcode, invitecode) {
        if (!registerFrom) {
            if (registerCont.length > 0) {
                registerFrom = 1;
            } else {
                registerFrom = 0;
            }
        }
        $.ajax({
            url: $$.config.serverAddr + 'CSL/Login/RegisterUser',
            type: 'POST',
            data: {
                Mobile: phone,
                Password: pwd,
                Platform: 13,
                RegisterFrom: registerFrom,
                RegisterCont: registerCont,
                VC: vcode
            },
            dataType: 'json',
            success: function(res) {
                if (res.Status == 0) {
                    if (res.Data.WToken) {
                        $$.setToken(res.Data.WToken);
                        layer.msg('登录成功');
                        $$.goBack();
                    }
                }
            }
        });
    }
    function validate() {
        if (type == 2) {
            if (validPhonePwd()) {
                $page.find('button.commit').removeClass('disabled');
            } else {
                $page.find('button.commit').addClass('disabled');
            }
        } else if (type == 0 || type == 1) {
            if (validPhonePwd() && validVCode()) {
                $page.find('button.commit').removeClass('disabled');
            } else {
                $page.find('button.commit').addClass('disabled');
            }
        }
    }
    function validPhonePwd() {
        var phone = $page.find('input[name=phone]').val();
        var pwd = $page.find('input[name=pwd]').val();
        if (phone.length == 11 &&
            /^1[3|4|5|7|8]\d{9}$/.test(phone) &&
            pwd.length >= 6 &&
            pwd.length <= 20) {
            return true;
        } else {
            return false;
        }
    }
    function validVCode() {
        var vcode = $page.find('input[name=vcode]').val();
        if (vcode.length == 6 &&
            /^[0-9]{6}$/.test(vcode)) {
            return true;
        } else {
            return false;
        }
    }
    function sendingVCode(data) {
        resetVCode();
        $.ajax({
            url: $$.config.serverAddr + 'Product/Info/SendVerifiedCode',
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function(res) {
                if (res.Status == 0) {
                    tickVCode();
                }
            }
        });
    }
    function tickVCode() {
        var tick = 60;
        $page.find('button.getVCode').addClass('sending').text(tick + 'S后重发');
        timer = setInterval(function() {
            if (tick == 1) {
                resetVCode();
            } else {
                $page.find('button.getVCode').text(--tick + 'S后重发');
            }
        }, 1000);
    }
    function resetVCode() {
        clearInterval(timer);
        $page.find('button.getVCode').removeClass('sending').text('获取验证码');
    }

    function statusLogin() {
        type = 2;
        $page.find('form').find('label, a').show();
        $page.find('label.vcode, label.invitecode').hide();
        $page.find('button.commit').addClass('disabled').text('登录');
    }
    function statusRegister() {
        type = 0;
        $page.find('form').find('label, a').show();
        $page.find('a.register, a.forget').hide();
        $page.find('button.commit').addClass('disabled').text('注册并登录');
    }
    function statusForget() {
        type = 1;
        $page.find('form').find('label, a').show();
        $page.find('label.invitecode').hide();
        $page.find('a.register, a.forget').hide();
        $page.find('button.commit').addClass('disabled').text('修改并登录');
    }
});