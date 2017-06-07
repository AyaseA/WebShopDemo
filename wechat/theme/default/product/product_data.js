$(function() {
    var $page = $('#product_product'),
	    pageStr = 'product_product',
	    pid = $$.getQueryString('pid');


	TouchSlide({
        slideCell: "#product_product_banner",
        titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
        mainCell: ".bd ul",
        effect: "left",
        autoPlay: true, //自动播放
        autoPage: true, //自动分页
        switchLoad: "_src", //切换加载，真实图片路径为"_src" 
        interTime: 3000 // 切换间隔时间，毫秒
    });
	// 根据商品id获取商品信息
	function getProductInfo(pid) {

	}
});