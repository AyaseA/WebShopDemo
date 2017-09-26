$(function() {
    var $page = $("#icenter_appointmentList");
    var contentHeight = window.innerHeight - $page.find(".header").height() - $page.find(".nav").height();
    $page.find(".content").height(contentHeight);

    var token = $$.getToken(),
        type = $$.getQueryString("type"),
        loadComplete;

    var hadChicked = true;

    if (type == "commission") {
        showArea("notAppoint");
    } else if (type == "appointed") {
        showArea("hadAppoint");
    } else if (type == "confirm") {
        showArea("notVerify");
    } else if (type == "complete") {
        showArea("hadComplite");
    } else {
        showArea("notAppoint");
    }

    $page.off("click", ".appointFoot .appointBtn").on("click", ".appointFoot .appointBtn", function() {
        var sid = $(this).attr("data-id"),
            pid = $(this).attr("data-pid"),
            storeid = $(this).attr("data-storeid"),
            serviceType = $(this).attr("data-stype");
        $$.redirect("icenter/appointServer.html?sid=" + sid + "&pid=" + pid + "&storeid=" + storeid + "&stype=" + serviceType);
    });

    $page.off("click", ".appointFoot .makeCode").on("click", ".appointFoot .makeCode", function() {
        makeCode($(this).attr("data-id"), $(this).attr("data-num"));
    });

    $page.off("click", ".appointFoot .checkAppoint").on("click", ".appointFoot .checkAppoint", function() {
        $$.redirect("icenter/appointDetail.html?aid=" + $(this).attr("data-id"));
    });

    $page.off("click",".oneAppoint .appointContent").on("click",".oneAppoint .appointContent",function(){
        var orderId = $(this).attr("data-id");
        $$.redirect("icenter/serverDetail.html?oid=" + orderId);
    });

    $page.off("click", ".appointFoot .postBtn").on("click", ".appointFoot .postBtn", function() {
        var deliveryTime = $(this).attr("data-DeliveryTime");
        var sid = $(this).attr("data-id");
        var ProductNeedDelivery = $(this).attr("data-NeedDelivery");
        var today = $$.get10Time(new Date());
        if(ProductNeedDelivery != 1){
            layer.msg("此商品不需要邮寄");
            $(this).css({
                background:"#ccc",
                border:"#ccc",
                color:"#000"
            });
        } else if (deliveryTime && today - deliveryTime < 2592000){
            layer.msg("您上次邮寄的时间是"+$$.timeToStr(deliveryTime)+",两次邮寄间隔不能少于一个月！");
            $(this).css({
                background:"#ccc",
                border:"#ccc",
                color:"#000"
            });
        }else{
            $$.redirect("icenter/delivery.html?sid=" + sid);
        }
    });

    $$.post("CSL/Service/QueryMyServiceList", { Status: 0, N: 1, Rows: 30 }, function(txt) {
        var today = $$.get10Time(new Date());
        $page.find(".notAppoint").html(
            template('icenter_appointmentList_notAppoint', {
                notAppointData: txt.Data.Rows,
                notAppointLength: txt.Data.Rows.length,
                serverAddr: $$.serverAddr,
                today: today
            })
        );
    });

    $$.post("CSL/Service/QueryMyServiceList", { Status: 1, N: 1, Rows: 30 }, function(txt) {
        $page.find(".hadComplite").html(
            template('icenter_appointmentList_hadComplite', {
                hadCompliteData: txt.Data.Rows,
                hadCompliteLength: txt.Data.Rows.length,
                serverAddr: $$.serverAddr
            })
        );
    });

    $$.post("CSL/Appointment/QueryAppointList", { Status: 0, N: 1, Rows: 30 }, function(txt) {
        $page.find(".hadAppoint").html(
            template('icenter_appointmentList_hadAppoint', {
                hadAppointData: txt.Data.Rows,
                hadAppointLength: txt.Data.Rows.length,
                serverAddr: $$.serverAddr
            })
        );
    });

    $$.post("CSL/Appointment/QueryAppointList", { Status: 4, N: 1, Rows: 30 }, function(txt) {
        $page.find(".notVerify").html(
            template('icenter_appointmentList_notVerify', {
                notVerifyData: txt.Data.Rows,
                notVerifyLength: txt.Data.Rows.length,
                serverAddr: $$.serverAddr
            })
        );
    });

    //未预约
    function makeCode(id, num) {
        var imgurl = $$.serverAddr + "CSL/Service/QueryMyServiceImgBySID?ID=" + id + "&WToken=" + token;
        var codeTime = 120;
        var checkTime = 0;
        time = setInterval(function() {
            codeTime -= 1;
            checkTime += 1;
            if (checkTime < 15) {
                checkServiceCode(id, num);
            } else if (checkTime > 15 && checkTime < 30) {
                if (checkTime % 2 == 0) {
                    checkServiceCode(id, num);
                }
            } else if (checkTime > 30 && checkTime < 60) {
                if (checkTime % 3 == 0) {
                    checkServiceCode(id, num);
                }
            } else {
                if (checkTime % 4 == 0) {
                    checkServiceCode(id, num);
                }
            }

            if (codeTime == 5) {
                changeImgurl = $$.serverAddr + "CSL/Service/QueryMyServiceImgBySID?ID=" + id + "&WToken=" + token + "&t=" + Math.random();
                codeTime = 120;
                $(".appointment_strCode").attr("src", changeImgurl);
            }
        }, 1000);
        layer.open({
            title: "<img src='images/code/qr_code.png' style='width: 6vw;position: absolute;top: 2.8vw;'><span style='margin-left: 8vw;color:#f60'>商家扫描二维码</span>",
            content: "<p style='text-align:center;font-size:3.3vw;color:#8e8c8c;margin-bottom: 2vw;'>请向商家出示二维码，扫一扫，即可验证</p><img style='width:70vw;' class='appointment_strCode' src='" + imgurl + "'>" +
                "<p style='margin-top:2vw'><img src='images/code/logo.png' style='width:25vw;'></p>",
            area: ["80vw", "115vw"],
            btn: [],
            cancel: function() {
                clearInterval(time);
            }
        });
    }

    function checkServiceCode(sid, num) {
        $.ajax({
            url: $$.serverAddr + "CSL/Service/ConfirmMyService",
            type: "POST",
            data: {
                WToken: $$.getToken(),
                ID: sid,
                ServiceNum: num
            },
            dataType: "json",
            success: function(txt) {
                if (txt.Status == 0 && hadChicked) {
                    layer.msg("二维码已被成功扫描");
                    clearInterval(time);
                    hadChicked = false;
                    $$.redirect("icenter/checkSucc.html");
                } else if (txt.Status == -1) {
                    clearInterval(time);
                    $$.authConfirm();
                }
            }
        });
    }

    function showArea(area) {
        $page.find(".content").children().css("display", "none");
        $page.find(".nav ul li").removeClass("active");
        $page.find("." + area).css("display", "block");
        for (var i = 0; i < $page.find(".nav ul li").length; i++) {
            if ($($page.find(".nav ul li")[i]).attr("data-pane") == area) {
                $($page.find(".nav ul li")[i]).addClass("active");
            }
        }
    }

    function isBottom(area) {
        $(area).scroll(function() {
            var scrollTop = $(area).scrollTop() + $(area).height();
            var scrollHeight = $(area)[0].scrollHeight;
            if (scrollHeight - scrollTop < 10 && loadComplete) {
                loadComplete = false;
            }
        });
    }

});
