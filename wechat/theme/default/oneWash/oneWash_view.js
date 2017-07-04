// JavaScript Document
$(function() {
    var $page = $("#oneWash_oneWash");
    var phoneNumReg = /^1[3|4|5|7|8]\d{9}$/;


    //验证
    $page.on("blur", ".phoneInput", function() {

        if (!phoneNumReg.test($(this).val())) {
            /* layer.msg('您输入的手机号格式错误');*/
        }
    });


    //按钮显示方法
    function time(index) {
        var i = 60;
        var _this = index;
        _this.attr("disabled", true);
        var time = setInterval(function() {
            _this.html(i);
            i -= 1;
            _this.css("background", "#878585");
            if (i == 0) {
                _this.html("获取验证码");
                _this.attr("disabled", false);
                _this.css("background", "linear-gradient(#F47C49, #EC5A1C)");
                i = 60;
                clearInterval(time);
            }
        }, 1000);
    }

    //获取验证码
    $page.on("click", ".getMsg", function() {
        if (phoneNumReg.test($page.find(".phoneInput").val())) {
            $.ajax({
                type: "POST",
                url: "http://api.cheshili.com.cn/Product/Campaign/QueryMyDetail",
                data: {
                    CampaignID: 31,
                    TheMobile: $page.find(".phoneInput").val(),
                },
                dataType: "json",
                success: function(txt) {
                    if (txt.Status == 0 && txt.Data.Count == 1) {
                        $page.find(".baseInfo").hide();
                        $page.find(".haveResgn").show();
                        getUserInfo($page.find(".phoneInput").val(), "haveResgn");
                    } else {
                        time($page.find(".getMsg"));
                        $.ajax({
                            type: "POST",
                            url: "http://api.cheshili.com.cn/Product/Info/SendMsg",
                            data: {
                                Mobile: $page.find(".phoneInput").val(),
                                SendVC: 1,
                                Msg: "验证手机号，免费洗车",
                                PType: 0
                            },
                            dataType: "json",
                            success: function(txt) {
                                if (txt.Status == 0) {
                                    layer.msg('信息已发送');
                                }
                            }
                        });
                    }
                }
            });

        } else {
            layer.msg('请输入有效的手机号');
        }
    });

    //加载中奖信息
    function getUserInfo(num, area) {
        $.ajax({
            type: "POST",
            url: "http://api.cheshili.com.cn/Product/Campaign/QueryMyDetail",
            data: {
                CampaignID: 31,
                TheMobile: num,
            },
            dataType: "json",
            success: function(txt) {
                $page.find("." + area + " .phoneNum").html("" + txt.Data.Rows[0].TheMobile);
                $page.find("." + area + " .name").html("" + txt.Data.Rows[0].UserName);
            }
        });

    }


    //点击提交事件
    $page.on("click", ".baseInfo .submitBtn", function() {
        if (!$page.find(".phoneInput").val()) {
            layer.msg('请输入手机号');
        } else if (!$page.find(".phone").val()) {
            layer.msg('请输入正确验证码');
        } else if (!$page.find(".userName").val()) {
            layer.msg('姓名不能为空');
        } else {
            $.ajax({
                type: "POST",
                url: "http://api.cheshili.com.cn/Product/Campaign/AddCampaignReward",
                data: {
                    CampaignID: 31,
                    UserName: $page.find(".userName").val(),
                    TheMobile: $page.find(".phoneInput").val(),
                    VC: $page.find(".phone").val()
                },
                dataType: "json",
                success: function(txt) {
                    if (txt.Status == 0) {
                        $page.find(".baseInfo").hide();
                        $page.find(".getWashCard").show();
                        getUserInfo($page.find(".phoneInput").val(), "getWashCard");
                    } else {
                        layer.msg('验证码错误');
                    }
                }
            });
        }

    });



});
