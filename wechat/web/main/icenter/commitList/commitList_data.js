$(function() {
    var $page = $("#icenter_commitList");
    var noData = "<div class='noData'><img src='images/orders/no_orders.png'><p>暂无记录</p></div>";

    var contentHeight=window.innerHeight-$page.find(".header").height()-$page.find(".nav").height()-$page.find(".empty").height();
    var loadComplete;
    $page.find(".content").height(contentHeight);
    $page.find(".waitRevice").empty();
    $page.find(".hadRevice").empty();
    $page.find(".serverRevice").empty();
    $page.find(".serverReviced").empty();

    $page.off("click",".revice").on("click",".revice",function(){
        $$.redirect("icenter/orderCommit.html?oid=" + $(this).attr("data-oid") + "&pid=" + $(this).attr("data-pid") + "&stype=" + $(this).attr("data-type"));
    });

    $page.off("click",".addRevice").on("click",".addRevice",function(){
        layer.msg("暂不支持");
    });

    $page.off("click",".checkRevice").on("click",".checkRevice",function(){
        $$.redirect("icenter/checkCommit.html?oid=" + $(this).attr("data-oid") + "&pid=" + $(this).attr("data-pid") + "&type="+$(this).attr("data-type"));
    });

    $page.find(".waitReviceNum").text("0");
    $page.find(".hadReviceNum").text("0");
    $page.find(".serverReviceNum").text("0");
    $page.find(".serverRevicedNum").text("0");
    
    loadWaitRevice({IsReview:0,N:1});
    loadHadRevice({IsReview:1,N:1});
    loadServerRevice({IsReview:0,N:1});
    loadServerReviced({IsReview:1,N:1});

    function loadWaitRevice(data){       
        $$.post($$.serverAddr + "CSL/Review/QueryMyProductReviewList",data,
            function(txt) {
                if (txt.Status == 0) {               
                    if(txt.Data.Count == 0){
                        $page.find(".waitRevice").append(noData);
                    }else{
                        if(data.N == 1){
                            $page.find(".waitReviceNum").text(txt.Data.Count);
                        }
                        data.N += 1;
                        loadComplete = true;
                        var productList = txt.Data.Rows;
                        var noReviceNode = "";
                        if(productList.length == 0){
                            hadReviceNode = '<div class="loadAll">已加载全部数据</div>';
                            $page.find(".waitRevice").unbind("scroll");
                        }else{
                            for (var i = 0; i < productList.length; i++) {
                                noReviceNode += '<div class="onePiece">' +
                                    '<img src="'+$$.serverAddr+'Img/'+ $$.smallImg(productList[i].ProductImg||"1.png")+'">' +
                                    '<div class="prodInfo">' +
                                    '<p><b>'+productList[i].ProductName+'</b></p>' +
                                    '<p class="descri">'+showJsonDescri(productList[i].ProductDescri)+'</p>' +
                                    '<p class="rewardPoint">评价最多可得20积分</p>' +
                                    '<button class="revice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ProductID+'" data-type="0">评价</button>' +
                                    '</div>' +
                                    '</div>';
                            }
                            isBottom("#icenter_commitList .waitRevice",data,1);
                        }
                        $page.find(".waitRevice").append(noReviceNode);
                    }
                }
            }
        );
    }

    function loadHadRevice(data){
        $$.post($$.serverAddr + "CSL/Review/QueryMyProductReviewList", data,
            function(txt) {
                if (txt.Status == 0) {
                    if(txt.Data.Count == 0){
                        $page.find(".hadRevice").append(noData);
                    }else{
                        if(data.N == 1){
                            $page.find(".hadReviceNum").text(txt.Data.Count);
                        }                  
                        loadComplete = true;
                        data.N += 1;
                        var productList = txt.Data.Rows;
                        var hadReviceNode = "";
                        if(productList.length == 0){
                            hadReviceNode = '<div class="loadAll">已加载全部数据</div>';
                            $page.find(".hadRevice").unbind("scroll");
                        }else{
                            for (var i = 0; i < productList.length; i++) {
                                hadReviceNode += '<div class="onePiece">' +
                                    '<img src="'+$$.serverAddr+'Img/'+$$.smallImg(productList[i].ProductImg||"1.png")+'">' +
                                    '<div class="prodInfo">' +
                                    '<p><b>'+productList[i].ProductName+'</b></p>' +
                                    '<p class="descri">'+showJsonDescri(productList[i].ProductDescri)+'</p>' +
                                    '<p class="rewardPoint">评价最多可得20积分</p>' +
                                    '<button class="checkRevice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ProductID+'" data-type="1">查看评价</button>'+
                                    /*'<button class="addRevice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ProductID+'" >追加评价</button>' +*/
                                    '</div>' +
                                    '</div>';
                            }
                            isBottom("#icenter_commitList .hadRevice",data,2);
                        }
                        $page.find(".hadRevice").append(hadReviceNode);
                    }
                }
            }
        );
    }

    function loadServerRevice(data){
        $$.post($$.serverAddr + "CSL/Review/QueryMyServiceReviewList", data,function(txt){
                if(txt.Status == 0){
                    if(txt.Data.Count == 0){
                        $page.find(".serverRevice").append(noData);
                    }else{
                        if(data.N == 1){
                            $page.find(".serverReviceNum").text(txt.Data.Count);
                        }
                        data.N += 1;
                        loadComplete = true;
                        var productList = txt.Data.Rows;
                        var noReviceNode = "";
                        if(productList.length == 0){
                            hadReviceNode = '<div class="loadAll">已加载全部数据</div>';
                            $page.find(".serverRevice").unbind("scroll");
                        }else{ 
                            for (var i = 0; i < productList.length; i++) {
                                noReviceNode += '<div class="onePiece">' +
                                    '<img src="'+$$.serverAddr+'Img/'+$$.smallImg(productList[i].ProductImg||"1.png")+'">' +
                                    '<div class="prodInfo">' +
                                    '<p><b>'+productList[i].ProductName+'</b>(第<b>'+productList[i].ServiceNum+'</b>次服务)</p>' +
                                    '<p class="descri">'+showJsonDescri(productList[i].ProductDescri)+'</p>' +
                                    '<p class="rewardPoint">评价最多可得20积分</p>' +
                                    '<button class="revice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ID+'" data-type="1">评价</button>' +
                                    '</div>' +
                                    '</div>';
                            }
                            isBottom("#icenter_commitList .serverRevice",data,3);
                        }
                        $page.find(".serverRevice").append(noReviceNode);
                    }
                }
            }
        );
    }

    function loadServerReviced(data){
        $$.post($$.serverAddr + "CSL/Review/QueryMyServiceReviewList", data,function(txt){
                if(txt.Status == 0){
                    if(txt.Data.Count == 0){
                        $page.find(".serverReviced").append(noData);
                    }else{
                        if(data.N == 1){
                            $page.find(".serverRevicedNum").text(txt.Data.Count);
                        }
                        data.N += 1;
                        loadComplete = true;
                        var productList = txt.Data.Rows;
                        var hadReviceNode = "";
                        if(productList.length == 0){
                            hadReviceNode = '<div class="loadAll">已加载全部数据</div>';
                            $page.find(".serverReviced").unbind("scroll");
                        }else{
                            for (var i = 0; i < productList.length; i++) {
                                hadReviceNode += '<div class="onePiece">' +
                                    '<img src="'+$$.serverAddr+'Img/'+$$.smallImg(productList[i].ProductImg||"1.png")+'">' +
                                    '<div class="prodInfo">' +
                                    '<p><b>'+productList[i].ProductName+'</b>(第'+productList[i].ServiceNum+'次服务)</p>' +
                                    '<p class="descri">'+showJsonDescri(productList[i].ProductDescri)+'</p>' +
                                    '<p class="rewardPoint">评价最多可得20积分</p>' +
                                    '<button class="checkRevice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ID+'" data-type="0">查看评价</button>'+
                                    /*'<button class="addRevice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ProductID+'">追加评价</button>' +*/
                                    '</div>' +
                                    '</div>';
                            }
                            isBottom("#icenter_commitList .serverReviced",data,4);
                        }
                        $page.find(".serverReviced").append(hadReviceNode);
                    }
                }
            }
        );
    }

    function showJsonDescri(json){
        json = JSON.parse(json);
        if(json.text){
            return Base64.decode(unescape(json.text));
        }else{
            return "暂无描述";
        }
    }

    function isBottom(area,data,type) {
        $(area).scroll(function() {
            var scrollTop = $(area).scrollTop() + $(area).height();
            var scrollHeight = $(area)[0].scrollHeight;
            if (scrollHeight - scrollTop < 10 && loadComplete) {
                loadComplete = false;
                if (type == 1){
                    loadWaitRevice(data);
                }else if(type == 2){
                    loadHadRevice(data);
                }else if(type == 3){
                    loadServerRevice(data);
                }else if(type == 4){
                    loadServerReviced(data);
                }
            }
        });
    }
    //修改
    var comUrl =$$.getQueryString("tab");
    $page.find("li[data-content="+comUrl+"]").addClass("active").siblings().removeClass("active");
});
