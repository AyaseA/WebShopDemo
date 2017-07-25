$(function() {
    var $page = $('#shop_shopDetail'),
        pageStr = 'shop_shopDetail';

    var id = $$.getQueryString("ID");

    $page.find(".back").click(function() {
        $$.goBack();
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