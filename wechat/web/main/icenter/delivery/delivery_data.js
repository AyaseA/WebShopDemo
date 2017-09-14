$(function() {
    var $page = $("#icenter_delivery"),
        sid = $$.getQueryString("sid");
    var userInfo;
    $$.post("CSL/User/GetInfoByToken", {}, function(txt) {
        userInfo = JSON.parse(Base64.decode(unescape(txt.Data.Info)));
    }, function() {}, 1);

    var carID = userInfo.UserCarID,
        UserAddressID = userInfo.UserAddressID;
    $page.find(".addressInfo").attr("data-id", UserAddressID);
    $page.find(".carInfo").attr("data-id", carID);


    $page.off("click", ".confirmBtn").on("click", ".confirmBtn", function() {
        if ($page.find(".addressInfo").attr("data-id") == 0) {
            layer.msg("请选择收货地址");
        } else if ($page.find(".carInfo").attr("data-id") == 0) {
            layer.msg("请选择车辆");
        } else {
            $$.post("CSL/Service/AddDelivery", {
                    UserServiceID: sid,
                    UserCarID: $page.find(".carInfo").attr("data-id"),
                    UserAddressID: $page.find(".addressInfo").attr("data-id")
                },
                function(txt) {
                    if (txt.Status == 0) {
                        layer.msg("信息提交成功");
                        $$.redirect("icenter/orderList.html?type=waitPost");
                    }
                }
            );
        }
    });

    if (UserAddressID != 0) {
        $$.post("CSL/UserInfo/QueryAddressDetail", { ID: UserAddressID }, function(txt) {
            var addressInfo = txt.Data,
                city = JSON.parse(txt.Data.DataField);
            $page.find(".addressInfo").html(
                template("icenter_delivery_addressInfo", {
                    data: addressInfo,
                    city: city,
                    type: 1
                })
            );
        });
    } else {
        $page.find(".addressInfo").html(
            template("icenter_delivery_addressInfo", {
                type: 0
            })
        );
        /*  $page.find(".addressInfo").html("请先添加收货地址");
          $page.find(".moreAddress src").attr("src", "images/common/round_add.png");*/
    }

    if (carID != 0) {
        $$.post("CSL/UserInfo/QueryCarDetail", { ID: carID }, function(txt) {
            var carinfo = JSON.parse(txt.Data.Data);
            $page.find(".carInfo").html(
                template("icenter_delivery_carInfo", {
                    data: carinfo,
                    type: 1
                })
            );
        });
    } else {
        $page.find(".carInfo").html(
            template("icenter_delivery_carInfo", {
                type: 0
            })
        );
        /*$page.find(".moreCar").html("请先添加车辆");
        $page.find(".moreAddress src").attr("src", "images/common/round_add.png");*/
    }
});