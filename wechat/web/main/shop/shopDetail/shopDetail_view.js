$(function() {
    var $page = $('#shop_shopDetail'),
        pageStr = 'shop_shopDetail';

    var id = $$.getQueryString("ID");

    $page.find(".back").click(function() {
        $$.redirect("shop/shopList.html");
    });

    $page.on("click", ".map", function() {
        wx.openLocation({
            latitude: 36.68165, // 纬度，浮点数，范围为90 ~ -90
            longitude: 117.10856, // 经度，浮点数，范围为180 ~ -180。
            name: "卡诺嘉一站式汽车养护", // 位置名
            address: "奥体西路158号", // 地址详情说明
            scale: 24, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
    });

    $page.on("click", ".btn", function() {
        if ($(this).attr("data-watch") == 0) {
            $$.post("http://api.cheshili.com.cn/CSL/StoreFollow/AddUpdateFollow", { StoreID: id },
                function(txt) {
                    if (txt.Status == 0) {
                        $page.find(".btn").attr("data-watch", "1");
                        $page.find(".btn img").attr("src", "images/common/like_fill.png");
                        layer.msg("关注成功");
                    }
                }
            );
        } else {
            layer.confirm("是否要取消关注", function(index) {
                $$.post("http://api.cheshili.com.cn/CSL/StoreFollow/DeleteFollow", { StoreID: id },
                    function(txt) {
                        if (txt.Status == 0) {
                            $page.find(".btn").attr("data-watch", "0");
                            $page.find(".btn img").attr("src", "images/common/like.png");
                            layer.msg("取消关注成功");
                        }
                    }
                );
            });
        }
    });
});