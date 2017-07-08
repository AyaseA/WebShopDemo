// JavaScript Document
$(function() {
    var $page = $('#shop_shopDetaill'),
        pageStr = 'shop_shopDetaill';

	var id=$$.getQueryString("ID");
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
    		}
    	}
    });
});
