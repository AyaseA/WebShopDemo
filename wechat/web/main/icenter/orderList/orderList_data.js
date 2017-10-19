$(function() {
    var $page = $('#icenter_orderList'),
        pageStr = 'icenter_orderList';

    if ($$.isLogin(true)) {
        var contentHeight = window.innerHeight - $page.find(".nav").height() - $page.find(".header").height();
        $page.find(".content").height(contentHeight);
        $page.find(".all").height(contentHeight);
        $page.find(".waitPay").height(contentHeight);
        $page.find(".waitPost").height(contentHeight);
        $page.find(".waitGet").height(contentHeight);
        $page.find(".waitRevice").height(contentHeight);

        //var Token = "eyJVc2VySUQiOiIxMCIsIk5pY2tOYW1lIjpudWxsLCJHcm91dGhWYWx1ZSI6bnVsbCwiVXNlckFkZHJlc3NJRCI6bnVsbCwiQWRkVGltZSI6IjE0OTYyODA2NDUiLCJVc2VyQ2FySUQiOm51bGwsIkltZyI6bnVsbCwiRW5hYmxlIjoiMSIsIk1vYmlsZSI6IjE1MDY2NjcwMzIwIiwiU2Vzc2lvbklEIjoiMSIsIlR5cGUiOiJVc2VyIiwiVUlEIjoiNWEzYzY5YWYwOWU4ZDA1ODBlN2QwZTdjZTY1NjdlMWUifQ%3D%3D";
        var Token = $$.getToken();

        //$$.post("http://192.168.1.110:8000/CSL/Order/QueryOrderList",{},)
        var url = $$.config.serverAddr;
        //设置全局参数
        var n = 1,
            isLoad = 0,
            noDate = 0,

            loadComplete = true;

        thisLoaded = {
                all: 0,
                waitPay: 0,
                waitPost: 0,
                waitGet: 0,
                waitRevice: 0
            },

            haveLoad = {
                all: 0,
                waitPay: 0,
                waitPost: 0,
                waitGet: 0,
                waitRevice: 0
            };

        var type = $$.getQueryString("type") || "all";

        if (type == "all") {
            showContent(".all", ".allNav", loadList({ "WToken": Token, "N": n, OrderType: -1 }, ".all", "all"));
        } else if (type == "waitPay") {
            showContent(".waitPay", ".waitPayNav", loadList({ "WToken": Token, "N": n, "StatusID": 1, OrderType: -1 }, ".waitPay", "waitPay"));
        } else if (type == "waitPost") {
            showContent(".waitPost", ".waitPostNav", loadList({ "WToken": Token, "N": n, "StatusID": 2, OrderType: -1 }, ".waitPost", "waitPost"));
        } else if (type == "waitGet") {
            showContent(".waitGet", ".waitGetNav", loadList({ "WToken": Token, "N": n, "StatusID": 4, OrderType: -1 }, ".waitGet", "waitGet"));
        } else if (type == "waitRevice") {
            showContent(".waitRevice", ".waitReviceNav", loadList({ "WToken": Token, "N": n, "StatusID": 6, OrderType: -1 }, ".waitRevice", "waitRevice"));
        }

        //点击支付按钮事件
        $page.off("click", ".PayBtn").on("click", ".PayBtn", function() {
            var orderId = $(this).attr("data-oid");
            var tId = $(this).attr("data-tid");
            var pId = $(this).attr("data-id");
            var _this = $(this);
            if ($(this).html() == "支付") {
                $$.redirect("home/payCenter.html?oid=" + orderId + "&type=waitPay");
            } else if ($(this).html() == "确定收货") {
                $$.post("CSL/Order/ConfrimDelivery", { ID: orderId }, function(txt) {
                    if (txt.Status == 0) {
                        layer.msg("收货成功");
                        _this.hide();
                    }
                });
            } else if ($(this).html() == "前往评价") {
                $$.redirect("icenter/commitList");
            } else if ($(this).html() == "重新购买") {
                if (tId == 0) {
                    $$.redirect("home/product.html?pid=" + pId);
                } else if (tId == 1) {
                    $$.redirect("home/prodservice.html?pid=" + pId);
                } else if (tId == 5) {
                    $$.redirect("home/prodmulti.html?pid=" + pId);
                }
            } else if ($(this).html() == "已评价") {
                $$.redirect("icenter/commitList.html");
            } else if ($(this).html() == "前往预约") {
                $$.redirect("icenter/appointmentList.html");
            } else if ($(this).html() == "提醒商家") {
                $$.post("CSL/Order/PressOrder", { ID: orderId }, function(txt) {
                    if (txt.Status == 0) {
                        layer.msg("已提醒商家发货");
                    }else if(txt.Status == 90){
                        layer.msg("您已提醒商家发货，请稍候再试");
                    }
                });
                //$(this).css("background", "#ccc");
                //$(this).attr("disabled", true);
            } else if ($(this).html() == "查看物流") {
                var postID = $(this).attr("data-postID"),
                    dtype = $(this).attr("data-dType");
                $$.redirect("icenter/logistics.html?postID=" + postID + "&oid=" + orderId + "&dType=" + dtype);
            }
        });

        //点击按钮跳转订单详情界面
        $page.off("click", ".pieceContent").on("click", ".pieceContent", function() {
            var orderId = $(this).attr("data-oid"),
                oType = $(this).attr("data-tid");
            $$.redirect("icenter/orderDetail.html?oid=" + orderId + "&otype =" + oType);
        });
        $page.off("click", ".noOrders button").on("click", ".noOrders button", function() {
            $$.redirect("home/index.html");
        });

        //查看主订单
        $page.off("click",".piecePay p").on("click",".piecePay p",function(){
            if($(this).attr("data-oid")){
                var orderId = $(this).attr("data-oid"),
                    oType = $(this).attr("data-tid");
                $$.redirect("icenter/orderDetail.html?oid=" + orderId + "&otype =" + oType);
            }
        });

        //进入主界面加载数据
        function loadList(postData, area, scrollArea) {
            var pageNum = postData.N || 1;
            $.ajax({
                type: "POST",
                url: url + "CSL/Order/QueryOrderList",
                data: postData,
                dataType: 'json',
                success: function(data) {
                    if (thisLoaded[scrollArea] == 0) {
                        if (data.Status == -1) {
                            if (navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)) {
                                $$.refreshConfirm();
                            } else {
                                $$.authConfirm();
                            }
                        } else {
                            var list = data.Data.Rows;
                            var buttonNode,
                                parentNode,
                                btnNode;
                            $page.listNum = list.length;
                            if ($page.listNum == 0) {
                                var noOrders = "<div class='noOrders'><img src='images/orders/no_orders.png'><p>暂无记录</p><button>最新优惠</button></div>";
                                $page.find(area).append(noOrders);
                            } else {
                                for (var i = 0; i < list.length; i++) {
                                    listData = $$.eval(list[i].Data);
                                    var contentNodeList = "",
                                        onePiece = '';
                                    if (listData.length == 1) {
                                        if (list[i].OrderType == 0) {
                                            if ($$.smallImg(listData[0].Img) == "") {
                                                $$.smallImg(listData[0].Img) = "NoImg/" + Math.random() + ".jpg";
                                            }
                                            if (list[i].StatusID == 1) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>支付</button></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 2) {
                                                if (list[i].ParentID == 0 || !list[i].ParentID) {
                                                    parentNode = "<p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p>";
                                                } else {
                                                    parentNode = "<p style='text-align:left' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ParentID + "'>注:本订单属于订单号为" + list[i].ParentID + "的订单,查看主订单<img src='images/common/right.png' style='float:right;width:2.5vw;margin-top:3vw'></p>";
                                                }

                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "'  data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'>"+parentNode+"<span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>提醒商家</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 4) {
                                                if (list[i].ParentID == 0 || !list[i].ParentID) {
                                                    parentNode = "<p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p>";
                                                } else {
                                                    parentNode = "<p style='text-align:left' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ParentID + "'>注:本订单属于订单号为" + list[i].ParentID + "的订单,查看主订单<img src='images/common/right.png' style='float:right;width:2.5vw;margin-top:3vw'></p>";
                                                }

                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'>"+parentNode+"<span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>确定收货</button><button class='PayBtn' data-postID='" + list[i].DeliveryNO + "' data-oid='" + list[i].ID + "' data-dType='" + list[i].DeliveryType + "'>查看物流</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 5) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='rt'></p><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>重新购买</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 6) {
                                                if (list[i].ShowReview == 0) {
                                                    buttonNode = "已评价";
                                                } else {
                                                    buttonNode = "前往评价";
                                                }

                                                if (list[i].ParentID == 0 || !list[i].ParentID) {
                                                    parentNode = "<p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p>";
                                                    if(list[i].OrderType == 0){//修改
                                                        btnNode = "<button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>" + buttonNode + "</button>";
                                                    }
                                                    //btnNode = "<button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>" + buttonNode + "</button>";
                                                } else {
                                                    parentNode = "<p style='text-align:left' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ParentID + "'>注:本订单属于订单号为" + list[i].ParentID + "的订单,查看主订单<img src='images/common/right.png' style='float:right;width:2.5vw;margin-top:3vw'></p>";
                                                    btnNode = "<button class='PayBtn' data-postID='" + list[i].DeliveryNO + "' data-oid='" + list[i].ID + "' data-dType='" + list[i].DeliveryType + "'>查看物流</button>";
                                                }

                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='rt'></p><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'>" + parentNode + "<span>" + btnNode + "</span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            }
                                        } else {
                                            if (listData[0].ProductImg == "") {
                                                listData[0].ProductImg = "NoImg/" + Math.random() + ".jpg";
                                            }
                                            if (list[i].StatusID == 1) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>支付</button></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 2) {
                                                if (list[i].ParentID == 0 || !list[i].ParentID) {
                                                    parentNode = "<p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p>";
                                                } else {
                                                    parentNode = "<p style='text-align:left' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ParentID + "'>注:本订单属于订单号为" + list[i].ParentID + "的订单,查看主订单<img src='images/common/right.png' style='float:right;width:2.5vw;margin-top:3vw'></p>";
                                                }
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'>"+parentNode+"<span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>提醒商家</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 4) {
                                                if (list[i].ParentID == 0 || !list[i].ParentID) {
                                                    parentNode = "<p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p>";
                                                } else {
                                                    parentNode = "<p style='text-align:left' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ParentID + "'>注:本订单属于订单号为" + list[i].ParentID + "的订单,查看主订单<img src='images/common/right.png' style='float:right;width:2.5vw;margin-top:3vw'></p>";
                                                }
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'>"+parentNode+"<span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>确定收货</button><button class='PayBtn' data-postID='" + list[i].DeliveryNO + "' data-oid='" + list[i].ID + "' data-dType='" + list[i].DeliveryType + "'>查看物流</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 5) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='rt'></p><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>重新购买</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 6) {

                                                if (list[i].ShowReview == 0) {
                                                    buttonNode = "已评价";
                                                } else {
                                                    buttonNode = "前往评价";
                                                }

                                                if (list[i].ParentID == 0 || !list[i].ParentID) {
                                                    parentNode = "<p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p>";
                                                    if(list[i].OrderType == 0){//修改
                                                        btnNode = "<button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>" + buttonNode + "</button>";
                                                    }
                                                    //btnNode = "<button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>" + buttonNode + "</button>";
                                                } else {
                                                    parentNode = "<p style='text-align:left' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ParentID + "'>注:本订单属于订单号为" + list[i].ParentID + "的订单,查看主订单<img src='images/common/right.png' style='float:right;width:2.5vw;margin-top:3vw'></p>";
                                                    btnNode = "<button class='PayBtn' data-postID='" + list[i].DeliveryNO + "' data-oid='" + list[i].ID + "' data-dType='" + list[i].DeliveryType + "'>查看物流</button>";
                                                }

                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='rt'></p><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p  style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'>" + parentNode + "<span>" + btnNode + "</span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            }
                                        }
                                    } else {
                                        //多个商品
                                        for (var k = 0; k < 3; k++) {
                                            if (listData[k].Img == "") {
                                                listData[k].Img = "NoImg/" + Math.random() + ".jpg";
                                            }
                                            contentNode = "<img src='" + url + "Img/" + listData[k].Img + "'>";
                                            contentNodeList += contentNode;
                                        }

                                        if (list[i].StatusID == 1) {
                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn'>支付</button></div></div>";
                                            $page.find("" + area).append(onePiece);
                                        } else if (list[i].StatusID == 2) {
                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn'>提醒商家</button></div></div>";
                                            $page.find("" + area).append(onePiece);
                                        } else if (list[i].StatusID == 4) {
                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn'>确定收货</button><button class='PayBtn' data-postID='" + list[i].DeliveryNO + "' data-oid='" + list[i].ID + "' data-dType='" + list[i].DeliveryType + "'>查看物流</button></div></div>";
                                            $page.find("" + area).append(onePiece);
                                        } else if (list[i].StatusID == 5) {
                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p  style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "''>重新购买</button></span></div></div>";
                                            $page.find("" + area).append(onePiece);
                                        } else if (list[i].StatusID == 6) {
                                            //onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "''>前往评价</button></span></div></div>";
                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span>";
                                            if(list[i].OrderType == 0){//修改
                                                "<button class='PayBtn' data-id='" + listData[0].ID + "''>前往评价</button></span></div></div>";
                                            }else{
                                               "</span></div></div>"
                                            }
                                            $page.find("" + area).append(onePiece);
                                        }
                                    }

                                }
                            }
                        }

                        if (scrollArea == "all") {
                            thisLoaded.all = 1;
                        } else if (scrollArea == "waitPay") {
                            thisLoaded.waitPay = 1;
                        } else if (scrollArea == "waitPost") {
                            thisLoaded.waitPost = 1;
                        } else if (scrollArea == "waitGet") {
                            thisLoaded.waitGet = 1;
                        }
//***************************************懒加载********************************************************************/
                        $("#icenter_orderList ." + scrollArea).scroll(function() {
                            var scrollTop = $page.find("." + scrollArea).scrollTop() + $("." + scrollArea).height();
                            var scrollHeight = $page.find("." + scrollArea)[0].scrollHeight;

                            if (noDate == 0) {
                                if (scrollHeight - scrollTop <= 10 && loadComplete) {
                                    if (isLoad == 0) {
                                        loadComplete = false;
                                        $.ajax({
                                            type: "POST",
                                            url: url + "CSL/Order/QueryOrderList",
                                            data: $.extend(postData, { "N": ++pageNum }),
                                            success: function(data) {
                                                var buttonNode,
                                                    parentNode,
                                                    btnNode;
                                                data = $$.eval(data);
                                                var list = $$.eval(data).Data.Rows;
                                                $page.listNum = list.length;
                                                for (var i = 0; i < list.length; i++) {
                                                    listData = $$.eval(list[i].Data);
                                                    var contentNodeList = "";
                                                    var onePiece = "";
                                                    if (listData.length == 1) {
                                                        if (list[i].OrderType != 0) {
                                                            if ($$.smallImg(listData[0].Img) == "") {
                                                                $$.smallImg(listData[0].Img) = "NoImg/" + Math.random() + ".jpg";
                                                            }
                                                            if (list[i].StatusID == 1) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>支付</button></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 2) {
                                                                if (list[i].ParentID == 0 || !list[i].ParentID) {
                                                                    parentNode = "<p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p>";
                                                                } else {
                                                                    parentNode = "<p style='text-align:left' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ParentID + "'>注:本订单属于订单号为" + list[i].ParentID + "的订单,查看主订单<img src='images/common/right.png' style='float:right;width:2.5vw;margin-top:3vw'></p>";
                                                                }

                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'>" + parentNode + "<span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>提醒商家</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 4) {
                                                                if (list[i].ParentID == 0 || !list[i].ParentID) {
                                                                    parentNode = "<p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p>";
                                                                } else {
                                                                    parentNode = "<p style='text-align:left' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ParentID + "'>注:本订单属于订单号为" + list[i].ParentID + "的订单,查看主订单<img src='images/common/right.png' style='float:right;width:2.5vw;margin-top:3vw'></p>";
                                                                }

                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'>" + parentNode + "<span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>确定收货</button><button class='PayBtn' data-postID='" + list[i].DeliveryNO + "' data-oid='" + list[i].ID + "' data-dType='" + list[i].DeliveryType + "'>查看物流</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 5) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='rt'></p><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>重新购买</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 6) {
                                                                if (list[i].ShowReview == 0) {
                                                                    buttonNode = "已评价";
                                                                } else {
                                                                    buttonNode = "前往评价";
                                                                }

                                                                if (list[i].ParentID == 0 || !list[i].ParentID) {
                                                                    parentNode = "<p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p>";
                                                                   if(list[i].OrderType==0){//修改
                                                                       btnNode = "<button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>" + buttonNode + "</button>";
                                                                   }//修改
                                                                    //btnNode = "<button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>" + buttonNode + "</button>";
                                                                } else {
                                                                    parentNode = "<p style='text-align:left' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ParentID + "'>注:本订单属于订单号为" + list[i].ParentID + "的订单,查看主订单<img src='images/common/right.png' style='float:right;width:2.5vw;margin-top:3vw'></p>";
                                                                    btnNode = "<button class='PayBtn' data-postID='" + list[i].DeliveryNO + "' data-oid='" + list[i].ID + "' data-dType='" + list[i].DeliveryType + "'>查看物流</button>";
                                                                }

                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='rt'></p><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + $$.smallImg(listData[0].Img) + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'>" + parentNode + "<span>" + btnNode + "</span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            }
                                                        } else {
                                                            if (listData[0].ProductImg == "") {
                                                                listData[0].ProductImg = "NoImg/" + Math.random() + ".jpg";
                                                            }
                                                            if (list[i].StatusID == 1) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>支付</button></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 2) {
                                                                if (list[i].ParentID == 0 || !list[i].ParentID) {
                                                                    parentNode = "<p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p>";
                                                                } else {
                                                                    parentNode = "<p style='text-align:left' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ParentID + "'>注:本订单属于订单号为" + list[i].ParentID + "的订单,查看主订单<img src='images/common/right.png' style='float:right;width:2.5vw;margin-top:3vw'></p>";
                                                                }

                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'>" + parentNode + "<span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>提醒商家</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 4) {
                                                                if (list[i].ParentID == 0 || !list[i].ParentID) {
                                                                    parentNode = "<p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p>";
                                                                } else {
                                                                    parentNode = "<p style='text-align:left' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ParentID + "'>注:本订单属于订单号为" + list[i].ParentID + "的订单,查看主订单<img src='images/common/right.png' style='float:right;width:2.5vw;margin-top:3vw'></p>";
                                                                }

                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'>" + parentNode + "<span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>确定收货</button><button class='PayBtn' data-postID='" + list[i].DeliveryNO + "' data-oid='" + list[i].ID + "' data-dType='" + list[i].DeliveryType + "'>查看物流</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 5) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='rt'></p><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>重新购买</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 6) {
                                                                if (list[i].ShowReview == 0) {
                                                                    buttonNode = "已评价";
                                                                } else {
                                                                    buttonNode = "前往评价";
                                                                }

                                                                if (list[i].ParentID == 0 || !list[i].ParentID) {
                                                                    parentNode = "<p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p>";
                                                                    if(list[i].OrderType==0){//修改
                                                                        btnNode = "<button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>" + buttonNode + "</button>";
                                                                    }
                                                                    //btnNode = "<button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + list[i].OrderType + "'>" + buttonNode + "</button>";
                                                                } else {
                                                                    parentNode = "<p style='text-align:left' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ParentID + "'>注:本订单属于订单号为" + list[i].ParentID + "的订单,查看主订单<img src='images/common/right.png' style='float:right;width:2.5vw;margin-top:3vw'></p>";
                                                                    btnNode = "<button class='PayBtn' data-postID='" + list[i].DeliveryNO + "' data-oid='" + list[i].ID + "' data-dType='" + list[i].DeliveryType + "'>查看物流</button>";
                                                                }

                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='rt'></p><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p  style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'>" + parentNode + "<span>" + btnNode + "</span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            }
                                                        }
                                                    } else {
                                                        //多个商品
                                                        for (var k = 0; k < 3; k++) {
                                                            if (listData[k].Img == "") {
                                                                listData[k].Img = "NoImg/" + Math.random() + ".jpg";
                                                            }
                                                            contentNode = "<img src='" + url + "Img/" + listData[k].Img + "'>";
                                                            contentNodeList += contentNode;
                                                        }

                                                        if (list[i].StatusID == 1) {
                                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn'>支付</button></div></div>";
                                                            $page.find("" + area).append(onePiece);
                                                        } else if (list[i].StatusID == 2) {
                                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn'>提醒商家</button></div></div>";
                                                            $page.find("" + area).append(onePiece);
                                                        } else if (list[i].StatusID == 4) {
                                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn'>确定收货</button><button class='PayBtn' data-postID='" + list[i].DeliveryNO + "' data-oid='" + list[i].ID + "' data-dType='" + list[i].DeliveryType + "'>查看物流</button></div></div>";
                                                            $page.find("" + area).append(onePiece);
                                                        } else if (list[i].StatusID == 6) {
                                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn'>订单完成</button></div></div>";
                                                            $page.find("" + area).append(onePiece);
                                                        } else if (list[i].StatusID == 5) {
                                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='rt'></p><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-tid='" + list[i].OrderType + "' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn'>重新购买</button></div></div>";
                                                            $page.find("" + area).append(onePiece);
                                                        }
                                                    }
                                                    loadComplete = true;
                                                }
                                            }

                                        });
                                    }
                                    //全部加载完成
                                    if (haveLoad[scrollArea] == 0) {
                                        if ($page.listNum < 10) {
                                            isLoad = 1;
                                            var loadMsg = "<div class='loadMsg'>已加载全部订单<div>";
                                            $page.find("." + scrollArea).append(loadMsg);
                                            noDate = 1;
                                            if (scrollArea == "all") {
                                                haveLoad.all = 1;
                                            } else if (scrollArea == "waitPay") {
                                                haveLoad.waitPay = 1;
                                            } else if (scrollArea == "waitPost") {
                                                haveLoad.waitPost = 1;
                                            } else if (scrollArea == "waitGet") {
                                                haveLoad.waitGet = 1;
                                            } else if (scrollArea == "waitRevice") {
                                                haveLoad.waitRevice = 1;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }



        //点击全部事件
        $page.off("click", ".allNav").on("click", ".allNav", function() {
            //重置参数
            $page.find(".nav ul li").removeClass("on");
            $(this).addClass("on");
            $page.find(".content").children().hide();
            $page.find(".all").fadeIn(500);
            if (haveLoad.all == 0) {
                n = 1;
                isLoad = 0;
                noDate = 0;
                loadComplete = true;
                loadList({ "WToken": Token, "N": n, OrderType: -1 }, ".all", "all");
            }
            setActiveTab(this);
        });

        //点击待付款事件
        $page.off("click", ".waitPayNav").on("click", ".waitPayNav", function() {
            $page.find(".nav ul li").removeClass("on");
            $(this).addClass("on");
            $page.find(".content").children().hide();
            $page.find(".waitPay").fadeIn(500);
            //重置参数
            if (haveLoad.waitPay == 0) {
                n = 1;
                isLoad = 0;
                noDate = 0;
                loadComplete = true;
                loadList({ "WToken": Token, "N": n, "StatusID": 1, OrderType: -1 }, ".waitPay", "waitPay");
            }
            setActiveTab(this);
        });

        //点击待发货事件
        $page.off("click", ".waitPostNav").on("click", ".waitPostNav", function() {
            //重置参数
            $page.find(".nav ul li").removeClass("on");
            $(this).addClass("on");
            $page.find(".content").children().hide();
            $page.find(".waitPost").fadeIn(500);
            if (haveLoad.waitPost == 0) {
                n = 1;
                isLoad = 0;
                noDate = 0;
                loadComplete = true;
                loadList({ "WToken": Token, "N": n, "StatusID": 2, OrderType: -1 }, ".waitPost", "waitPost");
            }
            setActiveTab(this);
        });

        //点击待收货
        $page.off("click", ".waitGetNav").on("click", ".waitGetNav", function() {
            //重置参数
            $page.find(".nav ul li").removeClass("on");
            $(this).addClass("on");
            $page.find(".content").children().hide();
            $page.find(".waitGet").fadeIn(500);
            if (haveLoad.waitGet == 0) {
                n = 1;
                isLoad = 0;
                noDate = 0;
                loadComplete = true;
                loadList({ "WToken": Token, "N": n, "StatusID": 4, OrderType: -1 }, ".waitGet", "waitGet");
            }
            setActiveTab(this);
        });

        //点击待评价
        $page.off("click", ".waitReviceNav").on("click", ".waitReviceNav", function() {
            $page.find(".nav ul li").removeClass("on");
            $(this).addClass("on");
            $page.find(".content").children().hide();
            $page.find(".waitRevice").fadeIn(500);
            if (haveLoad.waitRevice == 0) {
                n = 1;
                isLoad = 0;
                noDate = 0;
                loadComplete = true;
                loadList({ "WToken": Token, "N": n, "StatusID": 6, OrderType: -1 }, ".waitRevice", "waitRevice");
            }
            setActiveTab(this);
        });

    }

    function showContent(area, nav, load) {
        $page.find(".all, .waitPost, .waitGet, .waitRevice, .waitPay").empty();
        $page.find(".content").children().hide();
        $page.find(area).fadeIn(500);
        $page.find(".nav ul li").removeClass("on");
        $page.find(nav).addClass("on");
        load;
    }

    function showStatus(data) {
        if (data == 1) {
            return "等待买家付款";
        } else if (data == 2) {
            return "等待发货";
        } else if (data == 3) {
            return "买家已付款";
        } else if (data == 4) {
            return "卖家已发货";
        } else if (data == 5) {
            return "交易关闭";
        } else if (data == 6) {
            return "交易成功";
        } else if (data == 7) {
            return "退款中的订单";
        } else if (data == 8) {
            return "定金已付";
        } else if (data == 9) {
            return "异常订单";
        } else if (data == 10) {
            return "付款确认中";
        }
    }

//修改
    //删除订单
    $page.off("click", "p.rt").on("click", "p.rt", function(){
        var orderID=$(this).siblings("span").text();
        var _this=this;
        layer.confirm("您确定要删除"+orderID+"这条订单？",function(){
            $$.post("CSL/Order/DelOrder",{OrderID:orderID},function(data){
                if(data.Status==0){
                    layer.msg("删除成功");
                    $(_this).parents("div.onePiece").remove();
                }else{
                    layer.msg("删除失败");
                }
            });
            layer.close();
        })
    });

    function setActiveTab(thisD){
        var _thisTag=$(thisD).attr("data-toggle");
        sessionStorage.setItem("pageTab",_thisTag );
    }

//修改
    var pageTab=sessionStorage.getItem("pageTab");
    $(" li[data-toggle='"+pageTab+"']").addClass("on").siblings("li").removeClass("on");
    $page.find("." + pageTab).show().siblings("div").hide();
});