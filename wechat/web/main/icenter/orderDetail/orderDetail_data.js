$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#icenter_orderDetail'),
        pageStr = 'icenter_orderDetail',
        headerHeight = $page.find('>div.header').height(),
        orderId = $$.getQueryString('oid'),
        orderTabType = $$.getQueryString('type'),
        orderType = $$.getQueryString('otype') || 0,
        childNum;

    var footerHeight = $page.find('>div.footer').height();

    // 设置界面高度
    $page.find('>div.main').height(
        bodyHeight - headerHeight - footerHeight - 1
    );

    $page.off("click", ".chlidHead").on("click", ".chlidHead", function() {
        if ($(this).attr("data-open") == 1) {
            $page.find(".content").animate({
                height: 107 * childNum + "px"
            }, 500);
            $page.find('>div.main').height(
                bodyHeight - headerHeight - footerHeight - 1
            );
            $(this).attr("data-open", "0");
        } else {
            $page.find(".content").animate({
                height: "0px"
            }, 500);
            $page.find('>div.main').height(
                bodyHeight - headerHeight - footerHeight - 1
            );
            $(this).attr("data-open", "1");
        }
    });

    $page.off('click', 'div.product a.contactService').on('click', 'div.product a.contactService', function() {
        var tel = $(this).attr('data-tel') || '0531-85523333';
        $page.find('div.confirm').show()
            .find('p').text(tel)
            .end().find('a.confirm').attr('href', 'tel:' + tel);
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

    $page.off("click", ".parentOrder").on("click", ".parentOrder", function() {
        $$.redirect("icenter/orderDetail.html?oid=" + $(this).attr("data-id") + "&otype=" + $(this).attr("data-otype"));
    });

    $page.off("click", ".childContent button").on("click", ".childContent button", function() {
        $$.redirect("icenter/orderDetail.html?oid=" + $(this).attr("data-id") + "&otype=" + $(this).attr("data-otype"));
    });

    // 设置返回按钮可用
    $page.off('click', '>div.header >a.goBack')
        .on('click', '>div.header >a.goBack', function() {
            if ($$.stack.getLast().indexOf("icenter/orderDetail.html") == -1) {
                $$.redirect("icenter/orderList.html");
            } else {
                $$.goBack();
            }
        });
    // 获取订单详情
    getOrderDetail();

    function getOrderDetail() {
        $$.post(
            'CSL/Order/QueryOrderDetail', {
                'ID': orderId,
                'OrderType': orderType
            },
            function(res) {
                if (res.Status != 0) {
                    return false;
                }
                if (res.Data) {
                    var d = res.Data,
                        productInfo = JSON.parse(d.Data);
                    total = d.OutPocket;
                    var addressJson, address;
                    if (JSON.parse(d.DataAddress).length != 0) {
                        addressJson = JSON.parse(Base64.decode(JSON.parse(d.DataAddress).DataField));
                        address = addressJson.province + addressJson.city + addressJson.county + JSON.parse(d.DataAddress).AddressDetail;
                    }

                    $$.post("CSL/Order/QueryParentDetail", { ID: orderId }, function(txt) {
                        var childobj = txt.Data.ChildList;
                        childNum = childobj.length;
                        if (txt.Status == 0) {
                            $page.find('>div.main').html(template(pageStr + '_detail', {
                                serverAddr: $$.config.serverAddr,
                                proList: productInfo,
                                proType: d.OrderType,
                                oData: d,
                                address: address,
                                name: JSON.parse(d.DataAddress).Name,
                                mobile: JSON.parse(d.DataAddress).Mobile,
                                childList: childobj,
                                childNum: childNum,
                                isPayed: $.inArray(d.StatusID, ['1', '5', '8', '10']) == -1,
                                discountMoney: (parseFloat(d.Discount) +
                                    parseFloat(d.ValueVoucherNum) +
                                    parseFloat(d.RewardPointNum) +
                                    parseFloat(d.GiftVoucherNum)).toFixed(2)
                            }));
                        }
                    });

                    $page.find('>div.main').html(template(pageStr + '_detail', {
                        serverAddr: $$.config.serverAddr,
                        proList: productInfo,
                        proType: d.OrderType,
                        oData: d,
                        address: address,
                        name: JSON.parse(d.DataAddress).Name,
                        mobile: JSON.parse(d.DataAddress).Mobile,
                        isPayed: $.inArray(d.StatusID, ['1', '5', '8', '10']) == -1,
                        discountMoney: (parseFloat(d.Discount) +
                            parseFloat(d.ValueVoucherNum) +
                            parseFloat(d.RewardPointNum) +
                            parseFloat(d.GiftVoucherNum)).toFixed(2)
                    }));
                    var canCancel = $.inArray(d.StatusID, ['1' /*, '2', '3', '4', '8', '10'*/ ]) != -1,
                        canPay = $.inArray(d.StatusID, ['1', '8', '10']) != -1,
                        canReBuy = $.inArray(d.StatusID, ['5']) != -1;
                    // 设置底部按钮
                    $page.find('>div.footer').html(template(pageStr + '_footer', {
                        oData: d,
                        canPay: canPay,
                        canCancel: canCancel,
                        canReBuy: canReBuy,
                        d: d,
                        productInfo: productInfo
                    }));
                }
            }
        );
    }
    // 取消订单
    function cancelOrder() {
        $$.post(
            'CSL/Order/CancelOrder', {
                ID: orderId
            },
            function(res) {
                if (res.Status == 0 && res.Data == 'succ') {
                    layer.msg('订单取消成功！');
                    getOrderDetail();
                }
            }
        );
    }

});