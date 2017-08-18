$(function() {
    var $page = $("#icenter_appointmentList");
    var contentHeight = window.innerHeight - $page.find(".header").height() - $page.find(".nav").height();
    $page.find(".content").height(contentHeight);

    var token = $$.getToken();
    var type = $$.getQueryString("type");

    if (type == "commission") {
        showArea("notAppoint");
    } else if (type == "appointed") {
        showArea("hadAppoint");
    } else if (type == "confirm") {
        showArea("notVerify");
    } else if (type == "complete") {
        showArea("hadComplite");
    }

    $$.post("CSL/Service/QueryMyService", { Status: -1 }, function(txt) {
        var notAppoint = [],
            hadComplite = [];

        var list = txt.Data.Rows;

        for (var i = 0; i < list.length; i++) {
            if (list[i].Status == 0) {
                notAppoint.push(list[i]);
            } else if (list[i].Status == 1) {
                hadComplite.push(list[i]);
            }
        }

        $page.find(".notAppoint").html(
            template('icenter_appointmentList_notAppoint', {
                notAppointData: notAppoint,
                notAppointLength: notAppoint.length,
                serverAddr: $$.serverAddr
            })
        );

        $page.find(".hadComplite").html(
            template('icenter_appointmentList_hadComplite', {
                hadCompliteData: hadComplite,
                hadCompliteLength: hadComplite.length,
                serverAddr: $$.serverAddr
            })
        );

        $page.off("click", ".appointFoot .appointBtn").on("click", ".appointFoot .appointBtn", function() {
            var sid = $(this).attr("data-id"),
                pid = $(this).attr("data-pid"),
                storeid = $(this).attr("data-storeid"),
                serviceType = $(this).attr("data-stype");

            $$.redirect("icenter/appointServer.html?sid=" + sid + "&pid=" + pid + "&storeid=" + storeid+"&stype="+serviceType);
        });

        $page.off("click", ".appointFoot .makeCode").on("click", ".appointFoot .makeCode", function() {
            makeCode($(this).attr("data-id"),$(this).attr("data-num"));
        });

        $page.off("click", ".appointFoot .checkAppoint").on("click", ".appointFoot .checkAppoint", function() {
            $$.redirect("icenter/appointDetail.html?aid=" + $(this).attr("data-id") + "&status=0");
        });

        $page.off("click", ".appointFoot .commit").on("click", ".appointFoot .commit", function() {
            $$.redirect("icenter/commitList.html");
        });
    });

    $$.post("CSL/Appointment/QueryAppointList", {}, function(txt) {
        var hadAppoint = [],
            notVerify = [];

        var slist = txt.Data.Rows;

        for (var i = 0; i < slist.length; i++) {
            if (slist[i].Status == 0) {
                hadAppoint.push(slist[i]);
            } else if (slist[i].Status == 1) {
                notVerify.push(slist[i]);
            }
        }

        $page.find(".hadAppoint").html(
            template('icenter_appointmentList_hadAppoint', {
                hadAppointData: hadAppoint,
                hadAppointLength: hadAppoint.length,
                serverAddr: $$.serverAddr
            })
        );

        $page.find(".notVerify").html(
            template('icenter_appointmentList_notVerify', {
                hadCompliteData: notVerify,
                notVerifyLength: notVerify.length,
                serverAddr: $$.serverAddr
            })
        );
    });

    //未预约
    function makeCode(id,num) {
        var imgurl = $$.serverAddr + "CSL/Service/QueryMyServiceImgBySID?ID=" + id + "&WToken=" + token;
        var codeTime = 120;
        var checkTime = 0;
        time = setInterval(function() {
            codeTime -= 1;
            checkTime += 1;

            if (checkTime < 15) {
                checkServiceCode(id);
            } else if (checkTime > 15 && checkTime < 30) {
                if (checkTime % 2 == 0) {
                    checkServiceCode(id);
                }
            } else if (checkTime > 30 && checkTime < 60) {
                if (checkTime % 3 == 0) {
                    checkServiceCode(id);
                }
            } else {
                if (checkTime % 4 == 0) {
                    checkServiceCode(id);
                }
            }

            if (codeTime == 5) {
                changeImgurl = $$.serverAddr + "CSL/Service/QueryMyServiceImgBySID?ID=" + id + "&WToken=" + token + "&t=" + Math.random();
                codeTime = 120;
                $(".appointment_strCode").attr("src", changeImgurl);
            }
        }, 1000);
        layer.open({
            title: "商家扫描二维码",
            content: "<img style='width:59vw;' class='appointment_strCode' src='" + imgurl + "'>",
            area: ["50vw", "80vw"],
            btn: [],
            cancel: function() {
                clearInterval(time);
            }
        });
        confirmService(id,num);
    }

    function checkServiceCode(sid,num) {
        $$.post("CSL/Service/ConfirmMyService", {
                ID: sid,
                ServiceNum: num
            },
            function(txt) {
                if (txt.Status == 0) {
                    layer.msg("二维码已被成功扫描");
                    clearInterval(time);
                    $$.redirect("icenter/checkSucc.html");
                }
            }
        );
    }

    function showArea(area) {
        $page.find(".content").children().removeClass("active");
        $page.find(".nav ul li").removeClass("active");
        $page.find("."+area).addClass("active");
        for (var i = 0; i < $page.find(".nav ul li").length; i++) {
            if($($page.find(".nav ul li")[i]).attr("data-pane") == area){
                $($page.find(".nav ul li")[i]).addClass("active");
            }
        }
    }

});