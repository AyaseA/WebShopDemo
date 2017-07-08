$(function() {
    var $page = $('#shopDetail_shopDetail'),
        pageStr = 'shopDetail_shopDetail';

    $page.on("click",".back",function(){
    	$$.redirect("shopList/shopList.html");
    });

    $page.on("click",".map",function(){
    	wx.openLocation({
		    latitude: 36.68165, // 纬度，浮点数，范围为90 ~ -90
		    longitude: 117.10856 , // 经度，浮点数，范围为180 ~ -180。
		    name: "卡诺嘉一站式汽车养护", // 位置名
		    address:"奥体西路158号" , // 地址详情说明
		    scale: 24, // 地图缩放级别,整形值,范围从1~28。默认为最大
		    infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
		});
    });
});
