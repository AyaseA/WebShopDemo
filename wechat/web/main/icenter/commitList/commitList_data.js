$(function() {
    var $page = $("#icenter_commitList");

    var contentHeight=window.innerHeight-$page.find(".header").height()-$page.find(".nav").height()-$page.find(".empty").height();
    $page.find(".content").height(contentHeight);

    $page.off("click",".waitRevice .onePiece button").on("click",".waitRevice .onePiece button",function(){
        $$.redirect("icenter/orderCommit.html?oid=" + $(this).attr("data-oid") + "&pid=" + $(this).attr("data-pid"));
    });

    $page.off("click",".hadRevice .addRevice").on("click",".hadRevice .addRevice",function(){
        layer.alert("暂不支持");
    });

    $page.off("click",".hadRevice .checkRevice").on("click",".hadRevice .checkRevice",function(){
        $$.redirect("icenter/checkCommit.html?oid=" + $(this).attr("data-oid") + "&pid=" + $(this).attr("data-pid"));
    });


    $$.post($$.serverAddr + "CSL/Review/QueryReviewCount", {
            IsReview: 0
        },
        function(txt) {
            if (txt.Status == 0) {
                $page.find(".waitReviceNum").text(txt.Data);
            }
        }
    );

    $$.post($$.serverAddr + "CSL/Review/QueryReviewCount", {
            IsReview: 1
        },
        function(txt) {
            if (txt.Status == 0) {
                $page.find(".hadReviceNum").text(txt.Data);
            }
        }
    );

    $$.post($$.serverAddr + "CSL/Review/ProductReviewList", {
            IsReview: 0
        },
        function(txt) {
            if (txt.Status == 0) {
                $page.find(".waitRevice").empty();
                var productList = txt.Data.Rows;
                var noReviceNode = "";
                for (var i = 0; i < productList.length; i++) {
                    noReviceNode += '<div class="onePiece">' +
                        '<img src="'+$$.serverAddr+'Img/'+(productList[i].ProductImg||"1.png")+'">' +
                        '<div class="prodInfo">' +
                        '<p><b>'+productList[i].ProductName+'</b></p>' +
                        '<p class="descri">'+showJsonDescri(productList[i].ProductDescri)+'</p>' +
                        '<p class="rewardPoint">评价最多可得20积分</p>' +
                        '<button data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ProductID+'">评价</button>' +
                        '</div>' +
                        '</div>';
                }
                $page.find(".waitRevice").append(noReviceNode);
            }
        }
    );

    $$.post($$.serverAddr + "CSL/Review/ProductReviewList", {
            IsReview: 1
        },
        function(txt) {
            if (txt.Status == 0) {
                $page.find(".hadRevice").empty();
                var productList = txt.Data.Rows;
                var hadReviceNode = "";
                if(productList.length==0){
                    hadReviceNode = "<div class='noData'><img src='images/orders/no_orders.png'><p>暂无记录</p><div>";
                }
                for (var i = 0; i < productList.length; i++) {
                    hadReviceNode += '<div class="onePiece">' +
                        '<img src="'+$$.serverAddr+'Img/'+(productList[i].ProductImg||"1.png")+'">' +
                        '<div class="prodInfo">' +
                        '<p><b>'+productList[i].ProductName+'</b></p>' +
                        '<p class="descri">'+showJsonDescri(productList[i].ProductDescri)+'</p>' +
                        '<p class="rewardPoint">评价最多可得20积分</p>' +
                        '<button class="checkRevice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ProductID+'">查看评价</button>'+
                        '<button class="addRevice" data-oid="'+productList[i].OrderID+'" data-pid="'+productList[i].ProductID+'">追加评价</button>' +
                        '</div>' +
                        '</div>';
                }
                $page.find(".hadRevice").append(hadReviceNode);
            }
        }
    );


    function showJsonDescri(json){
        json = JSON.parse(json);
        if(json.text){
            return Base64.decode(unescape(json.text)); 
        }
    }

    function bottomToLoad(){
        
    }
});
