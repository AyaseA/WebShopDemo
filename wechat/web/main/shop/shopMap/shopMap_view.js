$(function() {
    var $page = $("#shop_shopMap");
    var locationInfo = $$.getLocationInfo(),
        shopMarker = new Array();
        mySite = ""+(locationInfo ? locationInfo.longitude : 117.1330654621) +","+ (locationInfo ? locationInfo.latitude : 36.6875642852) ;

    $page.on("click", ".header img", function() {
        $$.goBack();
    });

    $page.on("click",".content .checkShop",function(){
    	$$.redirect("shop/shopDetail.html?ID="+$(this).attr("data-id"));
    });

    $page.on("click",".shopInfo .title img",function(){
    	closeInfowindow();
    });

    var map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 14,
        center: [locationInfo.longitude, locationInfo.latitude]
    });

    var infoWindow = new AMap.InfoWindow({
    	isCustom:true,
    	offset: new AMap.Pixel(0, -42),
    });

    new AMap.Marker({
        map: map,
        icon: "images/shopDetail/location_user.gif",
        position: [locationInfo.longitude, locationInfo.latitude],
    });

    $$.post("Product/Store/QueryStoreList", {LL:mySite}, function(txt) {
        var shopPostion = {};
        for (var i = 0; i < txt.Data.Rows.length; i++) {
            var marker = new AMap.Marker({
		        map: map,
		        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b"+(i+1)+".png",
		        position: [txt.Data.Rows[i].Longitude, txt.Data.Rows[i].Latitude],
		    });
		    marker.content = "<div class='shopInfo'><div class='title'>"+txt.Data.Rows[i].Name+"<img src='images/common/close.png'></div><div class='content'><img src='"+$$.config.hostAddr+"Img/"+txt.Data.Rows[i].Img+"'><div class='shopAddress'><p><b>地址:</b>"+txt.Data.Rows[i].Address+"</p><p class='checkShop' data-id='"+txt.Data.Rows[i].ID+"'>查看详情</p><img src='images/shopDetail/arror.png'></div></div></div>";
		    marker.on('click', markerClick);
        	marker.emit('click', {target: marker});
            map.clearInfoWindow();
        }
    });


    function markerClick(e) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
    }


    function closeInfowindow(){
    	map.clearInfoWindow();
    }
});