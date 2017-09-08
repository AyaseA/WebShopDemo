$(function() {
    var $page = $("#shop_shopMap");
    var locationInfo = $$.getLocationInfo(),
        shopMarker = new Array();
    mySite = "" + (locationInfo ? locationInfo.longitude : 117.1330654621) + "," + (locationInfo ? locationInfo.latitude : 36.6875642852);

    $page.on("click", ".back img", function() {
        $$.goBack();
    });

    $page.on("click", ".content .checkShop .goDetail", function() {
        $$.redirect("shop/shopDetail.html?ID=" + $(this).attr("data-id"));
    });

    $page.on("click", ".shopInfo .title img", function() {
        closeInfowindow();
        $page.find(".searchContent").hide();
    });

    $page.find(".search input").focus(function() {
        $page.find(".searchContent").show();
    });

    $page.find("#container").click(function(){
        $page.find(".searchContent").hide();
    });

    $page.on("click",".searchContent .storeName",function(){
        $page.find(".searchInput").val(textOverflow($(this).html().split("、")[1],11));
        $page.find(".searchInput").attr("data-id",$(this).attr("data-id"));
        $page.find(".searchContent").hide();
    });

    $page.find(".search input").bind("input propertychange", function() {
        for (var i = 0; i < $page.find(".storeName").length; i++) {
            if (!$($page.find(".storeName")[i]).html().match($page.find(".search input").val())) {
                $($page.find(".storeName")[i]).hide();
            } else {
                $($page.find(".storeName")[i]).show();
            }
        }
    });

    $page.find(".search button").click(function(){
        if($page.find(".searchInput").val()){
            var data;
            if($page.find(".searchInput").attr("data-id")){
                data = {ID:$page.find(".searchInput").attr("data-id"),SortType:-1};
            }else{
                data = {Name : $page.find(".searchInput").val(),SortType:-1};
            }

            $$.post("Product/Store/QueryStoreList",data,function(txt){
                map.remove(shopPostion);
                var marker = new AMap.Marker({
                    map: map,
                    icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b1.png",
                    position: [txt.Data.Rows[0].Longitude, txt.Data.Rows[0].Latitude]
                });
                marker.content = "<div class='shopInfo'><div class='title'>" + txt.Data.Rows[0].Name + "<img src='images/common/close.png'></div><div class='content'><img src='" + $$.config.hostAddr + "Img/" + txt.Data.Rows[0].Img + "'><div class='shopAddress'><p><b>地址:</b>" + textOverflow(txt.Data.Rows[0].Address,17) + "</p><p class='checkShop'><span class='goDetail' data-id='" + txt.Data.Rows[0].ID + "'>查看详情</span><span class='goHere' data-lng='"+txt.Data.Rows[0].Longitude+"' data-lat='"+txt.Data.Rows[0].Latitude+"'>到这去</span></p><img src='images/shopDetail/arror.png'></div></div></div>";
                marker.on('click', markerClick);
                marker.emit('click', { target: marker });
                map.setZoomAndCenter(14, [txt.Data.Rows[0].Longitude,txt.Data.Rows[0].Latitude]);
                shopPostion.push(marker);
            });
        }else{
            layer.msg("请输入商家名称");
        }
    });

    $page.on("click",".goHere",function(){
        driving.search(new AMap.LngLat(locationInfo.longitude, locationInfo.latitude), new AMap.LngLat($(this).attr("data-lng"), $(this).attr("data-lat")));
    });

    var map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 14,
        center: [locationInfo.longitude, locationInfo.latitude]
    });

    var driving = new AMap.Driving({
        map: map,
        panel: "panel"
    }); 

    var infoWindow = new AMap.InfoWindow({
        isCustom: true,
        offset: new AMap.Pixel(0, -42),
    });

    new AMap.Marker({
        map: map,
        icon: "images/shopDetail/location_user.gif",
        position: [locationInfo.longitude, locationInfo.latitude],
    });

    $$.post("Product/Store/QueryStoreList", { LL: mySite }, function(txt) {
        shopPostion = [];
        for (var i = 0; i < txt.Data.Rows.length; i++) {
            var marker = new AMap.Marker({
                map: map,
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b" + (i + 1) + ".png",
                position: [txt.Data.Rows[i].Longitude, txt.Data.Rows[i].Latitude],
            });
            marker.content = "<div class='shopInfo'><div class='title'>" + txt.Data.Rows[i].Name + "<img src='images/common/close.png'></div><div class='content'><img src='" + $$.config.hostAddr + "Img/" + txt.Data.Rows[i].Img + "'><div class='shopAddress'><p><b>地址:</b>" + textOverflow(txt.Data.Rows[i].Address,17) + "</p><p class='checkShop'><span class='goDetail' data-id='" + txt.Data.Rows[i].ID + "'>查看详情</span><span class='goHere' data-lng='"+txt.Data.Rows[i].Longitude+"' data-lat='"+txt.Data.Rows[0].Latitude+"'>到这去</span></p><img src='images/shopDetail/arror.png'></div></div></div>";
            marker.on('click', markerClick);
            marker.emit('click', { target: marker });
            shopPostion.push(marker);
        }
        map.clearInfoWindow();
    });

    $$.get("Product/Store/QueryStoreNameJson", function(txt) {
        var storeInfo = txt.Data,
            storeNode = "";
        for (var i = 0; i < storeInfo.length; i++) {
            storeNode += "<p class='storeName' data-id='" + storeInfo[i].ID + "'>" + (i + 1) + "、" + storeInfo[i].Name + "</p>";
        }
        $page.find(".searchContent").append(storeNode);
    });


    function markerClick(e) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
    }


    function closeInfowindow() {
        map.clearInfoWindow();
    }

    function textOverflow(txt,num){
        if(txt.length > num){
            return txt.substring(0,num)+"..";
        }else{
            return txt;
        }
    }

});