$(function() {
    var $page = $("#icenter_logistics"),
        postID = $$.getQueryString("postID"),
        oID = $$.getQueryString("oid"),
        dType = $$.getQueryString("dType");

    var contentHeight = $page.innerHeight() - $page.find(".header").height();
    $page.find(".content").height(contentHeight);

    $$.get("Product/Express/QueryInfo?Company=" + dType + "&NO=" + postID + "&OrderID=" + oID, function(txt) {
    	var data = txt.Data.DeliveryInfo.Traces,
    	area = JSON.parse(txt.Data.Address.DataField),
    	address = area.province + area.city + area.county + txt.Data.Address.AddressDetail,
    	productInfo = JSON.parse(txt.Data.Order.Data);

    	console.log(changeStatus(productInfo));
    	$page.find(".content").html(
    		template("icenter_logistics_status",{
    			address:address,
    			tracesData:data,
    			product:productInfo[0],
    			postNo:postID,
    			postType:showCompany(dType),
    			postStatus:changeStatus(txt.Data.DeliveryInfo.State),
    			serverAddr:$$.config.hostAddr
    		})
    	);
    });


    function changeStatus(num){
    	switch (num){
    		case "0":
    			return "暂无信息";
    			break;
    		case "2":
    			return "运输中";
    			break;
    		case "3":
    			return "已签收";
    			break;
    		case "4":
    			return "问题件";
    			break;
    	}
    }

    function showCompany(type) {
        switch (type) {
            case "EMS":
                return "EMS";
                break;
            case "SF":
                return "顺丰速运";
                break;
            case "FAST":
                return "快捷快递";
                break;
            case "ZTKY":
                return "中铁快运";
                break;
            case "YZPY":
                return "邮政快递包裹";
                break;
            case "ZJS":
                return "宅急送";
                break;
            case "YTO":
                return "圆通速递";
                break;
            case "HTKY":
                return "百世快递";
                break;
            case "ZTO":
                return "中通快递";
                break;
            case "YD":
                return "韵达速递";
                break;
            case "STO":
                return "申通快递";
                break;
            case "DBL":
                return "德邦";
                break;
            case "JD":
                return "京东";
                break;
            case "XFEX":
                return "信丰物流";
                break;
            case "QFKD":
                return "全峰快递";
                break;
            case "KYSY":
                return "跨越速运";
                break;
            case "ANE":
                return "安能";
                break;
            case "HHTT":
                return "天天快递";
                break;
            case "GTO":
                return "国通快递";
                break;
            case "UC":
                return "优速快递";
                break;
        }
    }
});