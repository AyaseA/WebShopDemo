$(function() {
    var $page = $("#icenter_appointmentList");
    var contentHeight = window.innerHeight - $page.find(".header").height() - $page.find(".nav").height();
    $page.find(".content").height(contentHeight);

    var token = $$.getToken();

    $$.post("CSL/Service/QueryMyService", {}, function(txt) {
        if (txt.Data.Count != 0) {
            $page.find(".notAppoint").html(
                template('icenter_appointmentList_notAppoint', {
                    notAppointData: txt.Data.Rows,
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
        }
    });

    $$.post("");



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