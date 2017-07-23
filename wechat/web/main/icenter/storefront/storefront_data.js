$(function() {
    var $page = $('#icenter_storefront'),
        pageStr = 'icenter_storefront';

    var type=$$.getQueryString("type");

    if(type=="product"){
        loadProduct();
        $page.find(".header span").removeClass("on");
        $page.find(".header span:first").addClass("on");
      	$page.find(".productContent").show();
      	$page.find(".storeContent").hide();

    }else{
    	loadStore();
    	$page.find(".header span").removeClass("on");
    	$page.find(".header span:last").addClass("on");
    	$page.find(".productContent").hide();
      	$page.find(".storeContent").show();
    }

    function getDesCri(txt) {
        txt = JSON.parse(txt);
        return Base64.decode(unescape(txt.text));
    }

    function noImg(img) {
        if (img) {
            return img;
        } else {
            return "1.png";
        }
    }


    $page.off("click",".header span").on("click",".header span",function(){
        $page.find(".header span").removeClass("on");
        $(this).addClass("on");
        $(".storeContent,.productContent").hide();
        $("."+$(this).attr("data-content")).show();
        if($(this).attr("data-content")=="productContent"){
            loadProduct();
        }else{
            loadStore();
        }
    });


    function loadProduct(){     
        $$.post("http://api.cheshili.com.cn/CSL/Wish/QueryWishList", {},
            function(txt) {
                if (txt.Status == 0) {
                    $page.find(".productContent").empty();
                    var node = "";
                    var data = txt.Data.Rows;
                    if (data.length == 0) {
                        node = "<div class='noOrders'><img src='images/orders/no_orders.png'><p>暂无记录</p></div>";
                        $page.find(".productContent").append(node);
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            node += '<div class="productInfo" data-id="' + data[i].ID + '">' +
                                '<img src="http://api.cheshili.com.cn/Img/' + noImg(data[i].Img) + '">' +
                                '<div class="info">' +
                                '<p class="name"><b>' + data[i].Name + '</b></p>' +
                                '<p class="descri">' + getDesCri(data[i].Descri) + '</p>' +
                                '<p class="time">关注时间:' + $$.timeToStr(data[i].WishAddTime) + '</p>' +
                                '<p class="price">￥' + data[i].Price + '<button data-id="' + data[i].ID + '">立即购买</button></p>' +
                                '</div>' +
                                '</div>';
                        }
                        $page.find(".productContent").append(node);
                        $page.off("click",".price button").on("click",".price button",function(e){
                            $$.redirect("home/fillOrder.html?pid="+$(this).attr("data-id")+"&num=1");
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        $page.off("click",".productInfo").on("click",".productInfo",function(){
                            $$.redirect("home/product.html?pid="+$(this).attr("data-id"));
                        });
                    }
                }
            }
        );
    }

    function loadStore(){
        $$.post("http://api.cheshili.com.cn/CSL/StoreFollow/QueryFollowList", {},
            function(txt) {
                if (txt.Status == 0) {
                    $page.find(".storeContent").empty();
                    var storeNode = "";
                    var storeData = txt.Data.Rows;
                    if (storeData.length == 0) {
                        storeNode = "<div class='noOrders'><img src='images/orders/no_orders.png'><p>暂无记录</p></div>";
                        $page.find(".storeContent").append(storeNode);
                    } else {
                        for (var i = 0; i < storeData.length; i++) {
                            storeNode += '<div class="storeInfo" data-id="'+storeData[i].ID+'">' +
                                '<img src="http://api.cheshili.com.cn/Img/' + noImg(storeData[i].Img) + '">' +
                                '<div class="detail">' +
                                '<p>' + storeData[i].Name + '</p>' +
                                '<p>共' + storeData[i].FollowCount + '人关注</p>' +
                                '</div>' +
                                '</div>';
                            
                        }
                        $page.find(".storeContent").append(storeNode);
                        $page.off("click",".storeInfo");
                        $page.find(".storeInfo").click(function(){
                            $$.redirect("shop/shopDetail.html?ID="+$(this).attr("data-id"));
                        });
                    }
                }
            }
        );
    }

});