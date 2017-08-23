$(function() {
    var $page = $("#icenter_commitList");
    var noData = "<div class='noData'><img src='images/orders/no_orders.png'><p>暂无记录</p></div>";

    var contentHeight=window.innerHeight-$page.find(".header").height()-$page.find(".nav").height()-$page.find(".empty").height();
    var loadComplete;
    $page.find(".content").height(contentHeight);

    $page.off("click",".revice").on("click",".revice",function(){
        $$.redirect("icenter/orderCommit.html?oid=" + $(this).attr("data-oid") + "&pid=" + $(this).attr("data-pid"));
    });

    $page.off("click",".addRevice").on("click",".addRevice",function(){
        layer.msg("暂不支持");
    });

    $page.off("click",".checkRevice").on("click",".checkRevice",function(){
        $$.redirect("icenter/checkCommit.html?oid=" + $(this).attr("data-oid") + "&pid=" + $(this).attr("data-pid") + "&type="+$(this).attr("data-type"));
    });

    
    $$.post($$.serverAddr + "CSL/Review/QueryMyProductReviewList", {
            IsReview: 0
        },
        function(txt) {
            if (txt.Status == 0) {
                $page.find(".waitRevice").empty();
                if(txt.Data.Count == 0){
                    $page.find(".waitRevice").append(noData);
                }else{
                    $page.find(".waitReviceNum").text(txt.Data.Count);
                    var productList = txt.Data.Rows;
                    var noReviceNode = "";
                    for (var i = 0; i < productList.length; i++) {
                        noReviceNode += '<div class="onePiece">' +
                            '<img src="'+$$.serverAddr+'Img/'+(productList[i].ProductImg||"1.png")+'">' +
                            '<div class="prodInfo">' +
                            '<p><b>'+productList[i].ProductName+'</b></p>' +
                            '<p class="descri">'+showJsonDescri(productList[i].ProductDescri)+'</p>' +
                            '<p class="rewardPoint">评价最多可得20积分</p>' +
                            '<button class="revice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ProductID+'">评价</button>' +
                            '</div>' +
                            '</div>';
                    }
                    $page.find(".waitRevice").append(noReviceNode);                  
                }
            }
        }
    );

    $$.post($$.serverAddr + "CSL/Review/QueryMyProductReviewList", {
            IsReview: 1
        },
        function(txt) {
            if (txt.Status == 0) {
                $page.find(".hadRevice").empty();
                if(txt.Data.Count == 0){
                    $page.find(".hadRevice").append(noData);
                }else{
                    $page.find(".hadReviceNum").text(txt.Data.Count);                  
                    var productList = txt.Data.Rows;
                    var hadReviceNode = "";
                    for (var i = 0; i < productList.length; i++) {
                        hadReviceNode += '<div class="onePiece">' +
                            '<img src="'+$$.serverAddr+'Img/'+(productList[i].ProductImg||"1.png")+'">' +
                            '<div class="prodInfo">' +
                            '<p><b>'+productList[i].ProductName+'</b></p>' +
                            '<p class="descri">'+showJsonDescri(productList[i].ProductDescri)+'</p>' +
                            '<p class="rewardPoint">评价最多可得20积分</p>' +
                            '<button class="checkRevice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ProductID+'" data-type="1">查看评价</button>'+
                            '<button class="addRevice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ProductID+'" >追加评价</button>' +
                            '</div>' +
                            '</div>';
                    }
                    $page.find(".hadRevice").append(hadReviceNode);
                }
            }
        }
    );

    $$.post($$.serverAddr + "CSL/Review/QueryMyServiceReviewList", {
            IsReview: 0
        },function(txt){
            if(txt.Status == 0){
                $page.find(".serverRevice").empty();
                if(txt.Data.Count == 0){
                    $page.find(".serverRevice").append(noData);
                }else{
                    $page.find(".serverReviceNum").text(txt.Data.Count);
                    var productList = txt.Data.Rows;
                    var noReviceNode = "";
                    for (var i = 0; i < productList.length; i++) {
                        noReviceNode += '<div class="onePiece">' +
                            '<img src="'+$$.serverAddr+'Img/'+(productList[i].ProductImg||"1.png")+'">' +
                            '<div class="prodInfo">' +
                            '<p><b>'+productList[i].ProductName+'</b></p>' +
                            '<p class="descri">'+showJsonDescri(productList[i].ProductDescri)+'</p>' +
                            '<p class="rewardPoint">评价最多可得20积分</p>' +
                            '<button class="revice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ServiceID+'">评价</button>' +
                            '</div>' +
                            '</div>';
                    }
                    $page.find(".serverRevice").append(noReviceNode);
                }
            }
        }
    );

    $$.post($$.serverAddr + "CSL/Review/QueryMyServiceReviewList", {
            IsReview: 1
        },function(txt){
            if(txt.Status == 0){
                $page.find(".serverReviced").empty();
                if(txt.Data.Count == 0){
                    $page.find(".serverReviced").append(noData);
                }else{
                    $page.find(".serverRevicedNum").text(txt.Data.Count);
                     var productList = txt.Data.Rows;
                    var hadReviceNode = "";
                    for (var i = 0; i < productList.length; i++) {
                        hadReviceNode += '<div class="onePiece">' +
                            '<img src="'+$$.serverAddr+'Img/'+(productList[i].ProductImg||"1.png")+'">' +
                            '<div class="prodInfo">' +
                            '<p><b>'+productList[i].ProductName+'</b></p>' +
                            '<p class="descri">'+showJsonDescri(productList[i].ProductDescri)+'</p>' +
                            '<p class="rewardPoint">评价最多可得20积分</p>' +
                            '<button class="checkRevice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ServiceID+'" data-type="0">查看评价</button>'+
                            '<button class="addRevice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ProductID+'">追加评价</button>' +
                            '</div>' +
                            '</div>';
                    }
                    $page.find(".serverReviced").append(hadReviceNode);
                }
            }
        }
    );

    function showJsonDescri(json){
        json = JSON.parse(json);
        if(json.text){
            return Base64.decode(unescape(json.text)); 
        }
    }

    function isBottom(area) {
        $(area).scroll(function() {
            var scrollTop = $(area).scrollTop() + $(area).height();
            var scrollHeight = $(area)[0].scrollHeight;
            if (scrollHeight - scrollTop < 10 && loadComplete) {
                loadComplete = false;
            }
        });
    }
});
