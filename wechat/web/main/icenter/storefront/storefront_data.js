$(function() {
    var $page = $('#icenter_storefront'),
        pageStr = 'icenter_storefront';

    var type = $$.getQueryString("type"),
    loadComplete,node,data,storeNode,storeData;

    $page.find(".productContent").empty();
    $page.find(".storeContent").empty();
    loadProduct({N:1});
    loadStore({N:1});

    $page.off("click", ".price button").on("click", ".price button", function(e) {
        var tid = $(this).attr("data-tid");
        $$.redirect("home/fillOrder.html?pid=" + $(this).attr("data-id") + "&num=1&type="+tid);
        e.preventDefault();
        e.stopPropagation();
    });
    $page.off("click", ".productInfo").on("click", ".productInfo", function() {
        var pid = $(this).attr("data-id");
        var tid = $(this).attr("data-tid");
        if (tid == 0) {
            $$.redirect("home/product.html?pid=" + pid);
        } else if (tid == 1) {
            $$.redirect("home/prodservice.html?pid=" + pid);
        } else if (tid == 5) {
            $$.redirect("home/prodmulti.html?pid=" + pid);
        }
    });

    $page.off("click", ".storeInfo").on("click", ".storeInfo", function() {
        $$.redirect("shop/shopDetail.html?ID=" + $(this).attr("data-id"));
    });

    if (type == "product") {
        $page.find(".header span").removeClass("on");
        $page.find(".header span:first").addClass("on");
        $page.find(".productContent").show();
        $page.find(".storeContent").hide();
    } else {
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

    $page.off("click", ".header span").on("click", ".header span", function() {
        $page.find(".header span").removeClass("on");
        $(this).addClass("on");
        $(".storeContent,.productContent").hide();
        $("." + $(this).attr("data-content")).show();
        if ($(this).attr("data-content") == "productContent") {
        } else {
        }
    });


    function loadProduct(pdata) {
        $$.post("CSL/Wish/QueryWishList", pdata,
            function(txt) {
                if (txt.Status == 0) {
                	loadComplete = true;
                    node = "";
                    data = txt.Data.Rows;
                    if (txt.Data.Count == 0 && pdata.N == 1) {
                        node = "<div class='noOrders'><img src='images/orders/no_orders.png'><p>暂无记录</p></div>";
                        $page.find(".productContent").append(node);
                    } else {
                        if(data.length == 0){
                            node = '<div class="loadMsg">加载全部数据</div>';
                            $page.find(".productContent").unbind("scroll");
                        }else{    
                            for (var i = 0; i < data.length; i++) {
                                node += '<div class="productInfo" data-tid="'+data[i].ProductType+'" data-id="' + data[i].ID + '">' +
                                    '<img src="' + $$.config.serverAddr + 'Img/' + noImg(data[i].Img) + '">' +
                                    '<div class="info">' +
                                    '<p class="name"><b>' + data[i].Name + '</b></p>' +
                                    '<p class="descri">' + getDesCri(data[i].Descri) + '</p>' +
                                    '<p class="time">关注时间:' + $$.timeToStr(data[i].WishAddTime) + '</p>' +
                                    '<p class="price">￥' + data[i].Price + '<button data-id="' + data[i].ID + '" data-tid="'+data[i].ProductType+'">立即购买</button></p>' +
                                    '</div>' +
                                    '</div>';
                            }
                            pdata.N += 1; 
                            isProdBottom("#icenter_storefront .productContent",pdata);
                        }
                        $page.find(".productContent").append(node);
                    }
                }
            }
        );
    }

    function loadStore(sdata) {
        $$.post("CSL/StoreFollow/QueryFollowList", sdata,
            function(txt) {
                if (txt.Status == 0) {
                	loadStoreComplete = true;
                    storeNode = "";
                    storeData = txt.Data.Rows;
                    if (txt.Data.Count == 0 && sdata.N == 1) {
                        storeNode = "<div class='noOrders'><img src='images/orders/no_orders.png'><p>暂无记录</p></div>";
                        $page.find(".storeContent").append(storeNode);
                    } else {
                        if(storeData.length == 0){
                            storeNode = '<div class="loadMsg">加载全部数据</div>';
                            $page.find(".storeContent").unbind("scroll");
                        }else{           
                            for (var i = 0; i < storeData.length; i++) {
                                storeNode += '<div class="storeInfo" data-id="' + storeData[i].ID + '">' +
                                    '<img src="' + $$.config.serverAddr + 'Img/' + noImg(storeData[i].Img) + '">' +
                                    '<div class="detail">' +
                                    '<p>' + storeData[i].Name + '</p>' +
                                    '<p>共' + storeData[i].FollowCount + '人关注</p>' +
                                    '</div>' +
                                    '</div>';

                            }
                            sdata.N += 1;
                            isSotreBottom("#icenter_storefront .storeContent",sdata);
                        }
                    }
                    $page.find(".storeContent").append(storeNode);
                }
            }
        );
    }

    function isProdBottom(area,ldata) {
        $(area).scroll(function() {
            var scrollTop = $(area).scrollTop() + $(area).height();
            var scrollHeight = $(area)[0].scrollHeight;
            if (scrollHeight - scrollTop < 10 && loadComplete) {
                loadComplete = false;
                loadProduct(ldata);
            }
        });
    }

    function isSotreBottom(area,sdata) {
        $(area).scroll(function() {
            var scrollTop = $(area).scrollTop() + $(area).height();
            var scrollHeight = $(area)[0].scrollHeight;
            if (scrollHeight - scrollTop < 10 && loadStoreComplete) {
                loadStoreComplete = false;
                loadStore(sdata);
                console.log(1);
            }
        });
    }
});