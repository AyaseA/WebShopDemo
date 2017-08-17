$(function() {
    var $page = $("#icenter_appointmentList");
    var contentHeight = window.innerHeight - $page.find(".header").height() - $page.find(".nav").height();
    $page.find(".content").height(contentHeight);

    var token = $$.getToken();

    $$.post("CSL/Service/QueryMyService", { Status: -1 }, function(txt) {
        var notAppoint = [],
            hadComplite = [];

        var list = txt.Data.Rows;

        for (var i = 0; i < list.length; i++) {
            if (list[i].Status == 0) {
            	notAppoint.push(list[i]);
            }else if(list[i].Status == 1){
            	hadComplite.push(list[i]);
            }
        }

        $page.find(".notAppoint").html(
            template('icenter_appointmentList_notAppoint', {
                notAppointData: notAppoint,
                serverAddr: $$.serverAddr
            })
        );

        $page.find(".hadComplite").html(
            template('icenter_appointmentList_hadComplite', {
                hadCompliteData: hadComplite,
                serverAddr: $$.serverAddr
            })
        );

        $page.off("click", ".appointFoot .appointBtn").on("click", ".appointFoot .appointBtn", function() {
            var sid = $(this).attr("data-id");
            $$.redirect("icenter/appointServer.html?sid=" + sid);
        });

        $page.off("click", ".appointFoot .makeCode").on("click", ".appointFoot .makeCode", function() {
            makeCode($(this).attr("data-id"));
        });

        $page.off("click", ".appointFoot .checkAppoint").on("click", ".appointFoot .checkAppoint", function() {
            $$.redirect("icenter/appointDetail.html?aid="+$(this).attr("data-id")+"&status=0");
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
            }else if(slist[i].Status == 1){
            	notVerify.push(slist[i]);
            }
        }

    	$page.find(".hadAppoint").html(
            template('icenter_appointmentList_hadAppoint', {
                hadAppointData: hadAppoint,
                serverAddr: $$.serverAddr
            })
        );

        $page.find(".notVerify").html(
            template('icenter_appointmentList_notVerify', {
                hadCompliteData: notVerify,
                serverAddr: $$.serverAddr
            })
        );
    });

    //未预约
    function makeCode(id) {
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
        confirmService(id);
    }


    function checkServiceCode(sid) {
        $$.post("CSL/Service/ConfirmMyService", {
                ID: sid
            },
            function(txt) {
                if (txt.Status == 0) {
                    layer.msg("二维码已被成功扫描");
                    clearInterval(time);
                }
            }
        );
    }
});