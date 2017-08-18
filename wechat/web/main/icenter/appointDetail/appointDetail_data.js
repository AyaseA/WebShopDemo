$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#icenter_appointDetail'),
        pageStr = 'icenter_appointDetail',
        headerHeight = $page.find('>div.header').height(),
        appointId = $$.getQueryString('aid'),
        appointStatus;

    $page.off('click', 'div.product a.contactService').on('click','div.product a.contactService', function() {
        $page.find('div.confirm').show();
    });
    $page.off('click', 'div.confirm, div.confirm button.cancel')
        .on('click', 'div.confirm, div.confirm button.cancel', function() {
        $page.find('div.confirm').hide();
    });
    $page.off('click', 'div.confirm >div').on('click', 'div.confirm >div', function(e) {
        e.stopPropagation();
    });
    $page.off('click', 'button.cancelOrder').on('click', 'button.cancelOrder', function() {
        layer.confirm('确认取消订单？', { icon: 3, title: '提示' }, function(index) {
            cancelOrder();
            layer.close(index);
        });
    });
    $page.off('click', '>div.footer >a').on('click', '>div.footer >a', function() {
        makeCode();
    });
    $page.off('click', '>div.footer >button').on('click', '>div.footer >button', function() {
        layer.confirm('取消预约？', { icon: 3, title: '提示' }, function(index) {
            cancelAppoint();
            layer.close(index);
        });
    });
    // 获取订单详情
	getAppointDetail();
	function getAppointDetail() {
		$$.post(
			'CSL/Appointment/QueryServiceAppointDetail',
			{
				'ID': appointId
			},
			function(res) {
				if (res.Status != 0) {
                    return false;
                }
                if (res.Data) {
                	var d = res.Data;
                    appointStatus = d.Status;
                	var hours = $$.timeToStr(d.AppointTimeS, 'HH'),
                        amOrPm;

                    if (hours > 12) {
                        amOrPm = '下午';
                    } else {
                        amOrPm = '上午';
                    }

                    $page.find('>div.main').html(template(pageStr + '_detail', {
                        serverAddr: $$.config.serverAddr,
                        data: d,
                        appointStatus: appointStatus,
                        appointTime: $$.timeToStr(d.AppointDate) + ' ' + amOrPm,
                        discount: parseFloat(d.AllMoney - d.OrderOutPocket).toFixed(2)
                    }));

                    $page.find('>div.footer').html(template(pageStr + '_footer', {
                        appointStatus: appointStatus
                    }));
                }
			}
		);
	}
    function cancelAppoint() {
        $$.post(
            'CSL/Appointment/CancelAppoint',
            {
                ID: appointId
            },
            function(res) {
                if (res.Status == 0) {
                    layer.msg('预约取消成功');

                }
            }
        );
    }
    //未预约
    function makeCode() {
        var imgurl = $$.serverAddr + "CSL/Service/QueryMyServiceImgByAID?ID=" + appointId + "&WToken=" + $$.getToken();
        console.log(imgurl)
        var codeTime = 120;
        var checkTime = 0;
        time = setInterval(function() {
            codeTime -= 1;
            checkTime += 1;

            if (checkTime < 15) {
                checkServiceCode(appointId);
            } else if (checkTime > 15 && checkTime < 30) {
                if (checkTime % 2 == 0) {
                    checkServiceCode(appointId);
                }
            } else if (checkTime > 30 && checkTime < 60) {
                if (checkTime % 3 == 0) {
                    checkServiceCode(appointId);
                }
            } else {
                if (checkTime % 4 == 0) {
                    checkServiceCode(appointId);
                }
            }

            if (codeTime == 5) {
                changeImgurl = $$.config.serverAddr + "CSL/Service/QueryMyServiceImgByAID?ID=" + appointId + "&WToken=" + token + "&t=" + Math.random();
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
    }

    function checkServiceCode(sid) {
        $$.post("CSL/Service/ConfirmMyService", {
                ID: sid
            },
            function(txt) {
                if (txt.Status == 0) {
                    layer.msg("二维码已被成功扫描");
                    clearInterval(time);
                    $$.redirect("icenter/c.heckSucc.html");
                }
            }
        );
    }
});