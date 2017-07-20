$(function() {
    var $page = $('#icenter_storefront'),
        pageStr = 'icenter_storefront';

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

    $$.post("http://api.cheshili.com.cn/CSL/Wish/QueryWishList", {},
        function(txt) {
            if (txt.Status == 0) {
                $page.find(".productContent").empty();
                var node = "";
                var data = txt.Data.Rows;
                if (data.length == 0) {
                    node = "<div class='noData'>您还没有关注商品</div>";
                    $page.find(".productContent").append(node);
                } else {
                    for (var i = 0; i < data.length; i++) {
                        node += '<div class="productInfo">' +
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
                }
            }
        });

    $$.post("http://api.cheshili.com.cn/CSL/StoreFollow/QueryFollowList", {},
        function(txt) {
            if (txt.Status == 0) {
                $page.find(".storeContent").empty();
                var storeNode = "";
                var storeData = txt.Data.Rows;
                if (storeData.length == 0) {
                    storeNode = "<div class='noData'>您还没有关注店铺</div>";
                    $page.find(".storeContent").append(storeNode);
                } else {
                    for (var i = 0; i < storeData.length; i++) {
                        storeNode += '<div class="storeInfo">' +
                            '<img src="http://api.cheshili.com.cn/Img/' + storeData[i].Img + '">' +
                            '<div class="detail">' +
                            '<p>' + storeData[i].Name + '</p>' +
                            '<p>共' + storeData[i].FollowCount + '人关注</p>' +
                            '</div>' +
                            '</div>';
                    }
                    $page.find(".storeContent").append(storeNode);
                }
            }
        }
    );
});