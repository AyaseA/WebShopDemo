$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#icenter_appointDetail'),
        pageStr = 'icenter_appointDetail',
        headerHeight = $page.find('>div.header').height(),
        appointId = $$.getQueryString('aid'),
        appointStatus,
        serviceNum,
        serviceId;

    var token = $$.getToken();

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
                    serviceNum = d.ServiceNum;
                    serviceId = d.ServiceID;
                	var hours = $$.timeToStr(d.AppointTimeS, 'HH'),
                        amOrPm;

                    if (hours > 12) {
                        amOrPm = '下午';
                    } else {
                        amOrPm = '上午';
                    }
                    $page.find('>div.confirm')
                         .find('p >span').text(d.StoreTel || d.StorePhone)
                         .end().find('a.confirm').attr('href', 'tel:' + (d.StoreTel || d.StorePhone));
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
                    $$.redirect("icenter/appointmentList.html?type=commission");
                }
            }
        );
    }
    //未预约
    function makeCode() {
        var imgurl = $$.serverAddr + "CSL/Service/QueryMyServiceImgByAID?ID=" + appointId + "&WToken=" + $$.getToken()+ "&t=" + Math.random();
        console.log(imgurl)
        var codeTime = 120;
        var checkTime = 0;
        time = setInterval(function() {
            codeTime -= 1;
            checkTime += 1;

            if (checkTime < 15) {
                checkServiceCode(serviceId);
            } else if (checkTime > 15 && checkTime < 30) {
                if (checkTime % 2 == 0) {
                    checkServiceCode(serviceId);
                }
            } else if (checkTime > 30 && checkTime < 60) {
                if (checkTime % 3 == 0) {
                    checkServiceCode(serviceId);
                }
            } else {
                if (checkTime % 4 == 0) {
                    checkServiceCode(serviceId);
                }
            }

            if (codeTime == 5) {
                changeImgurl = $$.config.serverAddr + "CSL/Service/QueryMyServiceImgByAID?ID=" + appointId + "&WToken=" + token + "&t=" + Math.random();
                codeTime = 120;
                $(".appointment_strCode").attr("src", changeImgurl);
            }
        }, 1000);
        layer.open({
            title: "<img src='images/code/qr_code.png' style='width: 6vw;position: absolute;top: 2.8vw;'><span style='margin-left: 8vw;color:#f60'>商家扫描二维码</span>",
            content: "<p style='text-align:center;font-size:3.3vw;color:#8e8c8c;margin-bottom: 2vw;'>请向商家出示二维码，扫一扫，即可验证</p><img style='width:70vw;' class='appointment_strCode' src='" + imgurl + "'>"+
            "<p style='margin-top:2vw'><img src='images/code/logo.png' style='width:25vw;'></p>",
            area: ["80vw", "115vw"],
            btn: [],
            cancel: function() {
                clearInterval(time);
            }
        });
    }

    function checkServiceCode(sid) {
        $.ajax({
            url: $$.serverAddr + "CSL/Service/ConfirmMyService",
            type: "POST",
            data: {
                WToken: $$.getToken(),
                ID: sid,
                ServiceNum: serviceNum
            },
            dataType: "json",
            success: function(txt) {
                if (txt.Status == 0) {
                    layer.msg("二维码已被成功扫描");
                    clearInterval(time);
                    $$.redirect("icenter/checkSucc.html");
                } else if (txt.Status == -1) {
                    clearInterval(time);
                    $$.authConfirm();       
                }
            }
        });
    }
});