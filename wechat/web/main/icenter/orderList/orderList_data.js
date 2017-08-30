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
                waitRevice: 0,
            },

            haveLoad = {
                all: 0,
                waitPay: 0,
                waitPost: 0,
                waitGet: 0,
                waitRevice: 0
            };

        var type = $$.getQueryString("type") || "all";

        function showContent(area, nav, load) {
            $page.find(".all, .waitPost, .waitGet, .waitRevice, .waitPay").empty();
            $page.find(".content").children().hide();
            $page.find(area).fadeIn(500);
            $page.find(".nav ul li").removeClass("on");
            $page.find(nav).addClass("on");
            load;
        }

        if (type == "all") {
            showContent(".all", ".allNav", loadList({ "WToken": Token, "N": n, OrderType: -1 }, ".all", "all"));
        } else if (type == "waitPay") {
            showContent(".waitPay", ".waitPayNav", loadList({ "WToken": Token, "N": n, "StatusID": 1, OrderType: -1 }, ".waitPay", "waitPay"));
        } else if (type == "waitPost") {
            showContent(".waitPost", ".waitPostNav", loadList({ "WToken": Token, "N": n, "StatusID": 3, OrderType: -1 }, ".waitPost", "waitPost"));
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

            if ($(this).html() == "支付") {
                $$.redirect("home/payCenter.html?oid=" + orderId);
            } else if ($(this).html() == "确定收货") {
                $$.redirect("icenter/commit.html?oid=" + orderId);
            } else if ($(this).html() == "前往评价") {
                $$.redirect("icenter/commitList.html");
            } else if ($(this).html() == "重新购买") {
                if (tid == 0) {
                    $$.redirect("home/product.html?pid=" + pId);
                } else if (tid == 1) {
                    $$.redirect("home/prodservice.html?pid=" + pId);
                } else if (tid == 5) {
                    $$.redirect("home/prodmulti.html?pid=" + pId);
                }
            }

        });

        //点击按钮跳转订单详情界面
        $page.off("click", ".pieceContent").on("click", ".pieceContent", function() {
            var orderId = $(this).attr("data-oid");
            $$.redirect("icenter/orderDetail.html?oid=" + orderId);
        });

        $page.off("click", ".noOrders button").on("click", ".noOrders button", function() {
            $$.redirect("home/index.html");
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
                                        if (list[i].OrderType != 1) {
                                            if (listData[0].Img == "") {
                                                listData[0].Img = "NoImg/" + Math.random() + ".jpg";
                                            }
                                            if (list[i].StatusID == 1) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].Img + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>支付</button></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 3) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].Img + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>提醒商家</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 4) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].Img + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>确定收货</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 5) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].Img + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>重新购买</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 6) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].Img + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>前往评价</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            }
                                        } else {
                                            if (listData[0].ProductImg == "") {
                                                listData[0].ProductImg = "NoImg/" + Math.random() + ".jpg";
                                            }
                                            if (list[i].StatusID == 1) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>支付</button></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 3) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>提醒商家</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 4) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>确定收货</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 5) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>重新购买</button></span></div></div>";
                                                $page.find("" + area).append(onePiece);
                                            } else if (list[i].StatusID == 6) {
                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>前往评价</button></span></div></div>";
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
                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn'>支付</button></div></div>";
                                            $page.find("" + area).append(onePiece);
                                        } else if (list[i].StatusID == 3) {
                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn'>提醒商家</button></div></div>";
                                            $page.find("" + area).append(onePiece);
                                        } else if (list[i].StatusID == 4) {
                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn'>确定收货</button></div></div>";
                                            $page.find("" + area).append(onePiece);
                                        } else if (list[i].StatusID == 5) {
                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].Img + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p>< style='width:20vw;display:inline-block;float:right;color:#ea5514'p><span>" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "''>重新购买</button></span></div></div>";
                                            $page.find("" + area).append(onePiece);
                                        } else if (list[i].StatusID == 6) {
                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].Img + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p>< style='width:20vw;display:inline-block;float:right;color:#ea5514'p><span>" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "''>前往评价</button></span></div></div>";
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
                                                data = $$.eval(data);
                                                var list = $$.eval(data).Data.Rows;
                                                $page.listNum = list.length;
                                                for (var i = 0; i < list.length; i++) {
                                                    listData = $$.eval(list[i].Data);
                                                    var contentNodeList = "";
                                                    var onePiece = "";
                                                    if (listData.length == 1) {
                                                        if (list[i].OrderType != 1) {
                                                            if (listData[0].Img == "") {
                                                                listData[0].Img = "NoImg/" + Math.random() + ".jpg";
                                                            }
                                                            if (list[i].StatusID == 1) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].Img + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>支付</button></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 3) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].Img + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>提醒商家</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 4) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].Img + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>确定收货</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 5) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].Img + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>重新购买</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 6) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].Img + "'><div class='pInfo'><p><span>" + listData[0].Name + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].Price + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>前往评价</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            }
                                                        } else {
                                                            if (listData[0].ProductImg == "") {
                                                                listData[0].ProductImg = "NoImg/" + Math.random() + ".jpg";
                                                            }
                                                            if (list[i].StatusID == 1) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>支付</button></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 3) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>提醒商家</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 4) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>确定收货</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 5) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p><p style='width:20vw;display:inline-block;float:right;color:#ea5514'><span>¥" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>重新购买</button></span></div></div>";
                                                                $page.find("" + area).append(onePiece);
                                                            } else if (list[i].StatusID == 6) {
                                                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'><div><img src='" + url + "Img/" + listData[0].ProductImg + "'><div class='pInfo'><p><span>" + listData[0].ProductName + "</span></p>< style='width:20vw;display:inline-block;float:right;color:#ea5514'p><span>" + listData[0].NewPrice + "</span></p></div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn' data-id='" + listData[0].ID + "' data-oid='" + list[i].ID + "' data-tid='" + listData[0].ProductType + "'>前往评价</button></span></div></div>";
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
                                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn'>支付</button></div></div>";
                                                            $page.find("" + area).append(onePiece);
                                                        } else if (list[i].StatusID == 3) {
                                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><span><button class='PayBtn'>提醒商家</button></div></div>";
                                                            $page.find("" + area).append(onePiece);
                                                        } else if (list[i].StatusID == 4) {
                                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn'>确定收货</button></div></div>";
                                                            $page.find("" + area).append(onePiece);
                                                        } else if (list[i].StatusID == 6) {
                                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn'>订单完成</button></div></div>";
                                                            $page.find("" + area).append(onePiece);
                                                        } else if (list[i].StatusID == 5) {
                                                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent' data-oid='" + list[i].ID + "'>" + contentNodeList + "<div></div></div><div class='piecePay'><p style='float:right;color:#a9a9a9'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p><button class='PayBtn'>重新购买</button></div></div>";
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
                loadList({ "WToken": Token, "N": n, "StatusID": 3, OrderType: -1 }, ".waitPost", "waitPost");
            }

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

        });

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
    }

});