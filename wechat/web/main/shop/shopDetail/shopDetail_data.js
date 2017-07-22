// JavaScript Document
$(function() {
    var $page = $('#shop_shopDetail'),
        pageStr = 'shop_shopDetail';

    
    var id=$$.getQueryString("ID");
	
    $('#shop_shopDetail_banner .bd ul').empty();

    $.ajax({
    	type:"POST",
    	url:"http://api.cheshili.com.cn/Product/Store/QueryStoreDetail",
    	data:{
    		ID:id
    	},
    	dataType:"json",
    	success:function(txt){
    		if(txt.Status==0){
    			$page.find(".storeName").html(txt.Data.Name);
    			$page.find(".storeNum").html(txt.Data.WDeviceNum||0);
    			$page.find(".storeAddr").html(txt.Data.Address);
    			$page.find(".call").attr("href","tel:"+(txt.Data.Tel||10086));
    			$page.find(".storePhone").html(txt.Data.Tel||10086);
                if(txt.Data.ImgList){
                    var imgList=txt.Data.ImgList.split(",");
                    for(var i=0;i<imgList.length;i++){
                       $('#shop_shopDetail_banner .bd ul').append("<li><img src='http://api.cheshili.com.cn/Img/"+imgList[i]+"'></li>");
                    }
                    bannerSlide();
                }
    		}
    	}
    });


    function bannerSlide(){
        TouchSlide({
            slideCell: "#shop_shopDetail_banner",
            titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell: ".bd ul",
            effect: "left",
            autoPlay: true, //自动播放
            autoPage: true, //自动分页
            switchLoad: "_src", //切换加载，真实图片路径为"_src" 
            interTime: 3000 // 切换间隔时间，毫秒
        });
    }


    $$.post("http://api.cheshili.com.cn/CSL/StoreFollow/QueryFollowDetail",
        {StoreID:id},
        function(txt){
            if(txt.Status==0){
                $page.find(".btn").attr("data-watch", "1");
                $page.find(".btn img").attr("src", "images/common/like_fill.png");
            }else{
                $page.find(".btn").attr("data-watch", "0");
                $page.find(".btn img").attr("src", "images/common/like.png");
            }
        }
    );


    $page.off("click",".btn").on("click", ".btn", function() {
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
