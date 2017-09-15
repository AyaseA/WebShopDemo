$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_fillOrder'),
        pageStr = 'home_fillOrder',
        boxWidth = $page.find('>div.header').width(),
        productId = $$.getQueryString('pid'),
        productNum = $$.getQueryString('num') || 1,
        orderType = $$.getQueryString('type') || 0,
        callCode = $$.getQueryString('callcode'),
        total = 0,
        coupon = 0,
        point = 0,
        couponID = '',
        campaignNum = 0,
        detailUrl = 'Product/Prod/QueryProdDetail?ID=',
        serviceDate = '',
        serviceTime = '',
        needDelivery = false;

    var userInfo;
    $$.post("CSL/User/GetInfoByToken", {}, function(txt) {
        userInfo = JSON.parse(Base64.decode(unescape(txt.Data.Info)));
    }, function() {}, 1);

    // 判断是否登录
    if ($$.isLogin(true)) {
        if (orderType == 1) {
            detailUrl = 'Product/StoreService/QueryServiceDetail?ID=';
            setServiceOption();
        } else if (orderType == 5) {
            detailUrl = 'Product/ProdMulti/QueryDetail?ID=';
        }
        // 页面重新显示的一些初始化
        $page.find('>div.couponModal').css({
                'top': bodyHeight,
                'display': 'none'
            }).find('div.usable div.ticket')
            .removeClass('checked');
        $page.find('>div.couponModal button.selectTicket').hide();
        $page.find('>div.footer >button.order').addClass('disabled');

        $page.find('>div.appointmentModal').hide().find('div.warp').css({
            'top': bodyHeight
        });
        $page.find('>div.deliveryModal').hide().find('div.warp').css({
            'top': bodyHeight
        });

        // 优惠券积分
        setCoupon();
		// 获取商品详情
        getProductDetail();
        // 地址
        getAddressList();

        getAppointTime(function(timeArr) {
            $page.find('div.appointmentModal div.timeList >div').html(template(pageStr + '_appointment_time_list', {
                list: timeArr
            }));
        });

        // 确认地址
        $page.off('click dbclick', '>div.appointmentModal div.select')
             .on('click dbclick', '>div.appointmentModal div.select', function() {
            serviceDate = $page.find('>div.appointmentModal span.selected').attr('data-date');
            serviceTime = $page.find('>div.appointmentModal span.selected').attr('data-time');
            setServiceOption();
            $page.find('>div.appointmentModal').find('div.warp').animate({
                'top': bodyHeight
            }, 200).end().fadeOut(200);
        });
        // 确认预约
        $page.off('click dbclick', '>div.appointmentModal div.select')
             .on('click dbclick', '>div.appointmentModal div.select', function() {
            serviceDate = $page.find('>div.appointmentModal span.selected').attr('data-date');
            serviceTime = $page.find('>div.appointmentModal span.selected').attr('data-time');
            setServiceOption();
            $page.find('>div.appointmentModal').find('div.warp').animate({
                'top': bodyHeight
            }, 200).end().fadeOut(200);
        });

        // 点击确定选择优惠券
        $page.off('click dbclick', '>div.couponModal button.selectTicket')
            .on('click dbclick', '>div.couponModal button.selectTicket', function() {
            var $ticket = $page.find('>div.couponModal div.usable div.ticket.checked');
	        coupon = parseFloat($ticket.attr('data-coupon'));
            couponID = $ticket.attr('data-id');
            setCoupon();
            setMoney();
            $page.find('>div.couponModal').animate({
                'top': bodyHeight
            }, 300).fadeOut(400);
        });
        // 立即支付
        $page.off('click dbclick', '>div.footer >button.order').on('click dbclick', '>div.footer >button.order', function() {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            if (campaignNum > 0) {
                getCampaignProduct(function() {
                    addOrder(function(oid) {
                        $$.redirect('home/payCenter.html?oid=' + oid);
                    });
                });
            } else {
                addOrder(function(oid) {
                    $$.redirect('home/payCenter.html?oid=' + oid);
                });
            }
        });
    }
    // 判断限制次数商品是否可用
    function getCampaignProduct(callback) {
        $$.post(
            'CSL/Order/QueryCampaignProduct',
            {
                ProductID: productId
            },
            function(res) {
                if (res.Status != 0) {
                    return false;
                }
                if (res.Data.Code == 1) {
                    callback();
                } else {
                    layer.msg('您已参加过该活动了~');
                }
            }
        );
    }
    // 获取商品详情
    function getProductDetail() {
        $$.get(
            detailUrl + productId,
            function(res) {
                if (res.Status != 0) {
                    return false;
                }
                if (res.Data) {
                    var d = res.Data,
                        descri = '';
                    if (orderType == 1) {
                        total = parseFloat(d.NewPrice);
                        if (d.StoreDescri) {
                            d.StoreDescri = JSON.parse(d.StoreDescri);
                            descri = d.StoreDescri.text ? Base64.decode(unescape(d.StoreDescri.text)) : '';
                        }
                        $page.find('>div.main >div.productInfo').html(
                            template(pageStr + '_service_detail', {
                                'serverAddr': $$.config.serverAddr,
                                'data': d,
                                'count': productNum
                            }));
                    } else {
                        total = parseFloat(d.Price);
                        if (d.Descri) {
                            d.Descri = JSON.parse(d.Descri);
                            descri = d.Descri.text ? Base64.decode(unescape(d.Descri.text)) : '';
                        }
                        $page.find('>div.main >div.productInfo').html(
                            template(pageStr + '_product_detail', {
                                'serverAddr': $$.config.serverAddr,
                                'data': d,
                                'count': productNum,
                                'descri': descri
                            }));
                    }
                    campaignNum = d.CampaignNum || 0;
                    setMoney();
                    $page.find('>div.footer >button.order').removeClass('disabled');
                    getValueVoucher();

                    if (callCode) {
                        needDelivery = false;
                    } else {
                        needDelivery = d.NeedDelivery != null ? (d.NeedDelivery == 1 && d.ProductType == 0 ? true : false) : false
                    }

                    $page.find('div.delivery').html(template(pageStr + '_delivery', {
                        needDelivery: needDelivery
                    })).find('>div').width(
                        boxWidth - 30 - 8 - 10
                    );
                }
            }
        );
    }
    // 优惠券
    function getValueVoucher() {
        $$.post(
            'CSL/ValueVoucher/QueryValueVoucherJson',
            {},
            function(res) {
                if (res.Status != 0) {
                    return false;
                }
                if (res.Data) {
                    var usableCoupons = [],
                        disabledCoupons = [],
                        nowTime = new Date().pattern('yyyy-MM-dd');
                    res.Data.Status0.forEach(function(item) {
                        item = JSON.parse(item.DataVoucherData);
                        var coupon = {
                            ID: item.ID,
                            Name: item.Name,
                            Descri: item.Descri,
                            AboveNum: item.AboveNum,
                            Discount: item.Discount,
                            TimeStart: $$.timeToStr(item.TimeStart),
                            TimeEnd: $$.timeToStr(item.TimeEnd)
                        };
                        if (coupon.AboveNum <= total &&
                            nowTime >= coupon.TimeStart &&
                            nowTime <= coupon.TimeEnd) {
                            usableCoupons.push(coupon);
                        } else {
                            disabledCoupons.push(coupon);
                        }
                    });
                    res.Data.Status1.forEach(function(item) {
                        item = JSON.parse(item.DataVoucherData);
                        disabledCoupons.push({
                            ID: item.ID,
                            Name: item.Name,
                            Descri: item.Descri,
                            AboveNum: item.AboveNum,
                            Discount: item.Discount,
                            TimeStart: $$.timeToStr(item.TimeStart),
                            TimeEnd: $$.timeToStr(item.TimeEnd)
                        });
                    });
                    $page.find('div.couponModal div.usable').html(
                        template(pageStr + '_coupon_item', {
                            list: usableCoupons,
                            enable: true
                        })
                    );
                    $page.find('div.couponModal div.disabled').html(
                        template(pageStr + '_coupon_item', {
                            list: disabledCoupons,
                            enable: false
                        })
                    );
                }
            }
        );
    }
    // 添加订单
    function addOrder(calback) {
        var addressID = $page.find('div.main div.delivery >div').attr('data-id') || '';
        if (needDelivery && addressID == '') {
            $page.find('>div.deliveryModal div.warp').animate({
                'top': bodyHeight * 0.2
            }, 200).parent().fadeIn(200);
            return false;
        }
        $$.post(
            'CSL/Order/AddOrder', {
                'ProdList': productId + '_' + productNum,
                'OrderType': orderType,
                'ValueVoucherID': couponID,
                'ValueVoucherNum': coupon,
                'AddressID': callCode ? '' : addressID,
                'Data': callCode ? ('{QRID: ' + callCode + '}') : ''
            },
            function(res) {
                if (res.Status != 0) {
                    return false;
                }
                if (orderType == 1 && serviceDate != '' && serviceTime != '' && res.Data && res.Data.ServiceID) {
                    appointment(res.Data.ServiceID, function() {
                        if (res.Data && res.Data.ID && calback) {
                            calback(res.Data.ID);
                        }
                    })
                } else if (res.Data && res.Data.ID && calback) {
                    calback(res.Data.ID);
                }
            }
        );
    }

    function appointment(sid, calback) {
        var platform = 13;
        if (navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)) {
            platform = 10;
        } else if (navigator.userAgent.indexOf('csl-ios') != -1) {
            platform = 12;
        } else if (navigator.userAgent.indexOf('csl-android') != -1) {
            platform = 11;
        }
        $$.post(
            'CSL/Appointment/AddAppoint',
            {
                ServiceID: sid,
                Platform: platform,
                AppointDate: $$.get10Time(serviceDate),
                AppointTimeS: $$.get10Time(serviceDate + ' ' + serviceTime.split('-')[0]),
                AppointTimeE: $$.get10Time(serviceDate + ' ' + serviceTime.split('-')[1])
            },
            function(res) {
                if (res.Status == 0) {
                    calback();
                }
            }
        );
    }
    // 设置页面金额
    function setMoney() {
        $page.find('>div.main >div.proMoney').html(
            template(pageStr + '_price_coupon', {
                'total': parseFloat(total).toFixed(2),
                'coupon': coupon
            }));
        $page.find('>div.footer >span').text(parseFloat(total - coupon).toFixed(2));
    }
    // 优惠券积分
    function setCoupon() {
        $page.find('>div.main >div.coupon').html(template(pageStr + '_ticket_point', {
            'ticket': parseFloat(coupon).toFixed(2),
            'point': point
        }));
    }

    function setServiceOption() {
        $page.find('div.appointment').html(template(pageStr + '_appointment_time', {
            time: serviceDate && serviceTime ? (serviceDate + ' ' + serviceTime) : ''
        }));
        $page.find('div.appointment >div').width(
            boxWidth - 30 - 8 - 10
        );
    }
    // 计算预约时间
    function getAppointTime(callback) {
        var timeArr = [];
        for (var i = 1; i <= 30; i++) {
            timeArr.push(
                getDateFromCurrentDate(i)
            );
        }
        callback(timeArr);
    }
    function getDateFromCurrentDate(dayInterval) {
        var curDate = new Date();
        curDate.setDate(curDate.getDate() + dayInterval);
        var year = curDate.getFullYear();
        var month = (curDate.getMonth() + 1) < 10 ? "0" + (curDate.getMonth() + 1) : (curDate.getMonth() + 1);
        var day = curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate();
        return year + "-" + month + "-" + day;
    }
    function getAddressList() {
        $$.post('CSL/UserInfo/QueryAddressList', {
            Rows: 9999
        }, function(res) {
            for (var i = 0 ; i<res.Data.Rows.length; i++){
                if (userInfo.UserAddressID == res.Data.Rows[i].ID){
                    var area = JSON.parse(res.Data.Rows[i].DataField);
                    $page.find(".delivery span").html(area.province + area.city + area.county+res.Data.Rows[i].AddressDetail);
                    $page.find(".delivery div").attr("data-id",res.Data.Rows[i].ID);
                }
            }
            if (res.Status == 0 && res.Data.Rows) {
                $page.find('div.addressData').html(template(pageStr + '_addrList', {
                    list: res.Data.Rows,
                    userAddressID: userInfo.UserAddressID
                }));
            }
        });
    }
});
