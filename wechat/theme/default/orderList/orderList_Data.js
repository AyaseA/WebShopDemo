$(function() {
    var $page = $('#orderList_orderList'),
        pageStr = 'orderList_orderList';

    var contentHeight = $page.height() - $page.find(".nav").height() - $page.find(".header").height();
    $page.find(".content").css("height", contentHeight + "px");
    $page.find(".all").css("height", contentHeight + "px");
    $page.find(".waitPay").css("height", contentHeight + "px");
    $page.find(".waitPost").css("height", contentHeight + "px");
    $page.find(".waitGet").css("height", contentHeight + "px");
    $page.find(".waitRevice").css("height", contentHeight + "px");

    //var Token = "eyJVc2VySUQiOiIxMCIsIk5pY2tOYW1lIjpudWxsLCJHcm91dGhWYWx1ZSI6bnVsbCwiVXNlckFkZHJlc3NJRCI6bnVsbCwiQWRkVGltZSI6IjE0OTYyODA2NDUiLCJVc2VyQ2FySUQiOm51bGwsIkltZyI6bnVsbCwiRW5hYmxlIjoiMSIsIk1vYmlsZSI6IjE1MDY2NjcwMzIwIiwiU2Vzc2lvbklEIjoiMSIsIlR5cGUiOiJVc2VyIiwiVUlEIjoiNWEzYzY5YWYwOWU4ZDA1ODBlN2QwZTdjZTY1NjdlMWUifQ%3D%3D";
    var Token = $$.getToken();

    //$$.post("http://192.168.1.110:8000/CSL/Order/QueryOrderList",{},)
    var url=""   
    //设置全局参数
    var n = 1,
    isLoad = 0,
    noDate = 0,
    
    thisLoaded = {
        all:0,
        waitPay:0,
        waitPost:0,
        waitGet:0,
        waitRevice:0,
    },

    haveLoad = {
        all:0,
        waitPay:0,
        waitPost:0,
        waitGet:0,
        waitRevice:0,
    };

    //底部加载
    loadList({ "Token": Token, "N": n }, ".all","all");
    
    //点击支付按钮事件  
    $page.off("click", ".PayBtn").on("click", ".PayBtn", function() {
        var orderId = $(this).parent().parent().children(".pieceHeader").children(".orderID").children().html();
        if ($(this).html() == "支付") {
            $$.redirect("payCenter/payCenter.html?oid=" + orderId);
        } else if ($(this).html() == "确定收货") {
            $$.redirect("commit/commit.html?oid=" + orderId);
        }else if ($(this).html() == "点评") {
            $$.redirect("orderCommit/orderCommit.html?oid=" + orderId);
        }

    });

    //点击按钮跳转订单详情界面
    $page.off("click", ".pieceContent").on("click", ".pieceContent", function() {
        var orderId = $(this).parent().children(".pieceHeader").children(".orderID").children().html();
        $$.redirect("orderDetail/orderDetail.html?oid=" + orderId);
    });

    //进入主界面加载数据
    function loadList(postData, area, scrollArea) {
        var pageNum = postData.N || 1;
        $.ajax({
            type: "POST",
            url: "http://192.168.1.110:8000/CSL/Order/QueryOrderList",
            data: postData,
            success: function(data) {
                if(thisLoaded[scrollArea] == 0){
                data = $$.eval(data);
               
                if(data.Status != 0){
                    console.log(data.Status);
                    alert("服务有问题");
                }

                var list = $$.eval(data).Data.Rows;
                $page.listNum = list.length;
                for (var i = 0; i < list.length; i++) {
                    //用creatElement方法增加列表
                    //              var onePiece=document.createElement("div");
                    //              onePiece.className="onePiece";
                    //              var pieceHeader=document.createElement("div");
                    //              pieceHeader.className="pieceHeader";
                    //              var pieceHeaderNode='<p class="pieceStatus">状态</p>';
                    //              pieceHeader.innerHTML=""+pieceHeaderNode;
                    //              var pieceContent=document.createElement("div");
                    //              pieceContent.className="pieceContent";
                    //              var piecePay=document.createElement("div");
                    //              piecePay.className="piecePay";
                    //              $(".onePiece").append(pieceHeader);
                    //              $(".onePiece").append(pieceContent);
                    //              $(".onePiece").append(piecePay);
                    listData = $$.eval(list[i].Data);
                    var contentNodeList = "",
                        onePiece = '';
                    if (listData.length == 1) {
                        if (listData[0].Img == "") {
                            listData[0].Img = "NoImg/" + Math.random() + ".jpg";
                        }
                        if (list[i].StatusID == 1) {
                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'><div><img src='http://192.168.1.110:8000/Img/" + listData[0].Img + "'><div class='pInfo'><p>商品名称:<span>" + listData[0].Name + "</span></p><p>商品单价:<span>" + listData[0].Price + "</span></p></div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'><button class='PayBtn'>支付</button></div></div>";
                            $page.find("" + area).append(onePiece);
                        } else if (list[i].StatusID == 3) {
                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'><div><img src='http://192.168.1.110:8000/Img/" + listData[0].Img + "'><div class='pInfo'><p>商品名称:<span>" + listData[0].Name + "</span></p><p>商品单价:<span>" + listData[0].Price + "</span></p></div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'>等待商家发货<span><button class='PayBtn'>提醒商家</button></span></div></div>";
                            $page.find("" + area).append(onePiece);
                        } else if (list[i].StatusID == 4) {
                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'><div><img src='http://192.168.1.110:8000/Img/" + listData[0].Img + "'><div class='pInfo'><p>商品名称:<span>" + listData[0].Name + "</span></p><p>商品单价:<span>" + listData[0].Price + "</span></p></div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'>买家已发货<span><button class='PayBtn'>确定收货</button></span></div></div>";
                            $page.find("" + area).append(onePiece);
                        }
                    } else {
                        for (var k = 0; k < listData.length; k++) {
                            contentNode = "<img src='http://192.168.1.110:8000/Img/" + listData[k].Img + "'>";
                            contentNodeList += contentNode;
                        }

                        if (list[i].StatusID == 1) {
                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'>" + contentNodeList + "<div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'><button class='PayBtn'>支付</button></div></div>";
                            $page.find("" + area).append(onePiece);
                        } else if (list[i].StatusID == 3) {
                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'>" + contentNodeList + "<div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'>等待商家发货<span><button class='PayBtn'>提醒商家</button></div></div>";
                            $page.find("" + area).append(onePiece);
                        } else if (list[i].StatusID == 4) {
                            onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'>" + contentNodeList + "<div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'>买家已发货<button class='PayBtn'>确定收货</button></div></div>";
                            $page.find("" + area).append(onePiece);
                        }
                    }

                    }
                }



                if(scrollArea == "all"){
                    thisLoaded.all=1;
                }else if(scrollArea == "waitPay"){
                    thisLoaded.waitPay=1;
                }else if(scrollArea == "waitPost"){
                    thisLoaded.waitPost=1;           
                }else if(scrollArea == "waitGet"){
                    thisLoaded.waitGet=1;
                }
                $("#orderList_orderList ."+scrollArea).scroll(function() {
                    var scrollTop = $page.find("."+scrollArea).scrollTop() + $("."+scrollArea).height();
                    var scrollHeight = $page.find("."+scrollArea)[0].scrollHeight;
                    if (noDate == 0) {
                        if (scrollHeight - scrollTop <= 2) {
                            if (isLoad == 0) {
                                $.ajax({
                                    type: "POST",
                                    url: "http://192.168.1.110:8000/CSL/Order/QueryOrderList",
                                    data: $.extend(postData, {"N": ++pageNum}),
                                    success: function(data) {
                                        data = $$.eval(data);
                                        var list = $$.eval(data).Data.Rows;
                                        $page.listNum = list.length;
                                        for (var i = 0; i < list.length; i++) {
                                            //用creatElement方法增加列表
                                            //              var onePiece=document.createElement("div");
                                            //              onePiece.className="onePiece";
                                            //              var pieceHeader=document.createElement("div");
                                            //              pieceHeader.className="pieceHeader";
                                            //              var pieceHeaderNode='<p class="pieceStatus">状态</p>';
                                            //              pieceHeader.innerHTML=""+pieceHeaderNode;
                                            //              var pieceContent=document.createElement("div");
                                            //              pieceContent.className="pieceContent";
                                            //              var piecePay=document.createElement("div");
                                            //              piecePay.className="piecePay";
                                            //              $(".onePiece").append(pieceHeader);
                                            //              $(".onePiece").append(pieceContent);
                                            //              $(".onePiece").append(piecePay);
                                            listData = $$.eval(list[i].Data);
                                            var contentNodeList = "";
                                            var onePiece="";
                                            if (listData.length == 1) {
                                                if (listData[0].Img == "") {
                                                    listData[0].Img = "NoImg/" + Math.random() + ".jpg"
                                                }

                                                if (list[i].StatusID == 1) {
                                                    onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'><div><img src='http://192.168.1.110:8000/Img/" + listData[0].Img + "'><div class='pInfo'><p>商品名称:<span>" + listData[0].Name + "</span></p><p>商品单价:<span>" + listData[0].Price + "</span></p></div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'><button class='PayBtn'>支付</button></div></div>";
                                                    $page.find("" + area).append(onePiece);
                                                } else if (list[i].StatusID == 3) {
                                                    onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'><div><img src='http://192.168.1.110:8000/Img/" + listData[0].Img + "'><div class='pInfo'><p>商品名称:<span>" + listData[0].Name + "</span></p><p>商品单价:<span>" + listData[0].Price + "</span></p></div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'>等待商家发货<span><button class='PayBtn'>提醒商家</button></span></div></div>";
                                                    $page.find("" + area).append(onePiece);
                                                } else if (list[i].StatusID == 4) {
                                                    onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'><div><img src='http://192.168.1.110:8000/Img/" + listData[0].Img + "'><div class='pInfo'><p>商品名称:<span>" + listData[0].Name + "</span></p><p>商品单价:<span>" + listData[0].Price + "</span></p></div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'>买家已发货<span><button class='PayBtn'>确定收货</button></span></div></div>";
                                                    $page.find("" + area).append(onePiece);
                                                } else if (list[i].StatusID == 6) {
                                                    onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'><div><img src='http://192.168.1.110:8000/Img/" + listData[0].Img + "'><div class='pInfo'><p>商品名称:<span>" + listData[0].Name + "</span></p><p>商品单价:<span>" + listData[0].Price + "</span></p></div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'>交易成功<span><button class='PayBtn'>商品评价</button></span></div></div>";
                                                    $page.find("" + area).append(onePiece);
                                                }
                                            } else {
                                                for (var k = 0; k < listData.length; k++) {
                                                    contentNode = "<img src='http://192.168.1.110:8000/Img/" + listData[k].Img + "'>";
                                                    contentNodeList += contentNode;
                                                }

                                                if (list[i].StatusID == 1) {
                                                    onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'>" + contentNodeList + "<div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'><button class='PayBtn'>支付</button></div></div>";
                                                    $page.find("" + area).append(onePiece);
                                                } else if (list[i].StatusID == 3) {
                                                    onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'>" + contentNodeList + "<div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'>等待商家发货<span><button class='PayBtn'>提醒商家</button></div></div>";
                                                    $page.find("" + area).append(onePiece);
                                                } else if (list[i].StatusID == 4) {
                                                    onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'>" + contentNodeList + "<div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'>买家已发货<button class='PayBtn'>确定收货</button></div></div>";
                                                    $page.find("" + area).append(onePiece);
                                                } else if (list[i].StatusID == 6) {
                                                    onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + list[i].ID + "</span><p class='pieceStatus'>" + showStatus(list[i].StatusID) + "</p></div><div class='pieceContent'>" + contentNodeList + "<div></div><p style='float:right'>实付金额:<span class='sum'>" + list[i].OutPocket + "</span></p></div><div class='piecePay'>交易成功<button class='PayBtn'>商品评价</button></div></div>";
                                                    $page.find("" + area).append(onePiece);
                                                }

                                            }

                                        }


                                    }

                                });
                            }
                            //全部加载完成
                            if ($page.listNum < 10) {
                                isLoad = 1;
                                var loadMsg = "<div class='loadMsg'>已加载全部订单<div>";
                                $page.find("."+scrollArea).append(loadMsg);
                                noDate = 1;
                                if(scrollArea == "all"){
                                    haveLoad.all=1;
                                }else if(scrollArea == "waitPay"){
                                    haveLoad.waitPay=1;
                                }else if(scrollArea == "waitPost"){
                                    haveLoad.waitPost=1;           
                                }else if(scrollArea == "waitGet"){
                                    haveLoad.waitGet=1;
                                }
                            }
                        }
                    }
                });
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
        if(haveLoad.all == 0){          
            n = 1;
            isLoad = 0;
            noDate = 0;
            loadList({ "Token": Token, "N": n }, ".all", "all");
        }

    });

    //点击待付款事件
    $page.off("click", ".waitPayNav").on("click", ".waitPayNav", function() {
        $page.find(".nav ul li").removeClass("on");
        $(this).addClass("on");
        $page.find(".content").children().hide();
        $page.find(".waitPay").fadeIn(500);
         $page.find(".waitPay").fadeIn(500);
        //重置参数
        if(haveLoad.waitPay == 0){
            n = 1;
            isLoad = 0;
            noDate = 0;
            loadList({ "Token": Token, "N": n, "StatusID": 1 }, ".waitPay", "waitPay");
        }
    });

    //点击待发货事件
    $page.off("click", ".waitPostNav").on("click", ".waitPostNav", function() {
        //重置参数
        $page.find(".nav ul li").removeClass("on");
        $(this).addClass("on");
        $page.find(".content").children().hide();
        $page.find(".waitPost").fadeIn(500);
        if(haveLoad.waitPost == 0){            
            n = 1;
            isLoad = 0;
            noDate = 0;
            loadList({ "Token": Token, "N": n, "StatusID": 3 }, ".waitPost", "waitPost");
        }

    });

    //点击待收货
    $page.off("click", ".waitGetNav").on("click", ".waitGetNav", function() {
        //重置参数
        $page.find(".nav ul li").removeClass("on");
        $(this).addClass("on");
        $page.find(".content").children().hide();
        $page.find(".waitGet").fadeIn(500);
        if(haveLoad.waitGet == 0){
            n = 1;
            isLoad = 0;
            noDate = 0;
            loadList({ "Token": Token, "N": n, "StatusID": 4 }, ".waitGet", "waitGet");
        }

    });

    //点击待评价
    $page.off("click", ".waitReviceNav").on("click", ".waitReviceNav", function() {
        $page.find(".nav ul li").removeClass("on");
        $(this).addClass("on");
        $page.find(".content").children().hide();
        $page.find(".waitRevice").fadeIn(500);
        if(haveLoad.waitRevice == 0){           
            $.ajax({
                type:"POST",
                url:"http://192.168.1.110:8000/CSL/Review/ProductReviewList",
                data:{"Token":Token,IsReview:0},
                success:function (Data){
                    Data=$$.eval(Data);
                    console.log(Data);
                    var list = Data.Data.Rows;
                    console.log(list);
                    for(var i = 0;i < list.length;i++){
                        var orderID=list[i].OrderID;
                        console.log(orderID);
                        $.ajax({
                            type:"POST",
                            url:"http://192.168.1.110:8000/Product/Prod/QueryDetail",
                            data:{"ID":list[i].ProductID},
                            success:function (Data){
                                productInfo = $$.eval(Data).Data; 
                                onePiece = "<div class='onePiece'><div class='pieceHeader'><span class='orderID'>订单号：<span style='color:red'>" + orderID+ "</span><p class='pieceStatus'>订单完成</p></div><div class='pieceContent'><div><img src='http://192.168.1.110:8000/Img/" + productInfo.Img + "'><div class='pInfo'><p>商品名称:<span>"+productInfo.Name+"</span></p><p>商品单价:<span>"+productInfo.Price+"</span></p></div></div></div><div class='piecePay'><button class='PayBtn'>点评</button></div></div>";
                                $page.find(".waitRevice").append(onePiece);    
                            }
                        });
                        
                    }
                    haveLoad.waitRevice = 1;
                },
            });
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
});

