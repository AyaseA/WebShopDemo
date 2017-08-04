$(function() {
    $page = $("#icenter_checkCommit");

    var contentHeight=window.innerHeight-$page.find(".header").height();
    $page.find(".content").height(contentHeight);

    var orderID = $$.getQueryString("oid");
    var productID = $$.getQueryString("pid");

    function changeDetailTime(time) {
        return new Date(time * 1000).pattern('yyyy-MM-dd HH:mm:ss');
    }

    $$.post($$.serverAddr + "CSL/Review/QueryReviewListDetail", {
            OrderID: orderID,
            ProductID: productID
        },
        function(txt) {
            if (txt.Status == 0) {
                $page.find(".conmmitContent img").remove();
                $($page.find(".stars").children()).attr("src","images/common/stars/star.png");
            	var info=txt.Data.Rows[0];
                $page.find(".telephone").text(info.UserMobile);
                $page.find(".date").text(changeDetailTime(info.AddTime));
                $page.find(".commitText").text(info.Cont);
                var starNum = Number(info.Rating) / 20;
                for (var i = 0; i < starNum; i++) {
                	$($page.find(".stars").children()[i]).attr("src","images/common/stars/star_fill.png");
                }
                if(info.ImgList){
                	var imgList=info.ImgList.split(","),
                    imgNode="";
                    for(var i=0;i<imgList.length;i++){
                        imgNode += "<img src='"+$$.serverAddr+"Img/"+imgList[i]+"'>";
                    }
                    $page.find(".conmmitContent").append(imgNode);
                }

            }
        }
    );
});