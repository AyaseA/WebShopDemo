$(function() {
    var $page = $('#product_product'),
	    pageStr = 'product_product',
	    pid = $$.getQueryString('pid');

    // 页面重新显示的一些初始化
    $page.find('>div.header li[data-type=product]')
         .addClass('active').siblings()
         .removeClass('active');
    $page.find('div.evaluate li[data-type=all]')
         .addClass('active').siblings()
         .removeClass('active');
    $page.find('div.content').css({
        'margin-left': 0
    }).find('div.reviews >div.warp').css({
        'margin-left': 0
    });
    
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