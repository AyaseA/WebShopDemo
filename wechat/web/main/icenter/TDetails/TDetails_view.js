$(function(){
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page=$("#icenter_TDetails"),
        pageStr="icenter_TDetails",
        headerHeight=$page.find("div.header").height(),
        loadBox=$page.find("div.main>div.content>div.load");
    //点击返回按钮
    $$.setGoBack($page.find("div.header >a.goBack"));
    //定义div.main 的高度
    $page.find("div.main").height(bodyHeight-headerHeight);
    template.defaults.imports.TDetailsTitle = function(TDetailsData){
        var   typeID=JSON.parse(TDetailsData.Data);
        switch(typeID.AccountTransType) {
            case "0": {
                return "订单交易( 订单交易编号 "+typeID.OrderID+")";
            } break;
            case "1": {
                return "红包交易( 红包交易编号 "+typeID.RedPocketID+")";
            } break;
            case "2": {
                return "充值交易";
            } break;
            case "3": {
                return "银行卡交易";
            } break;
            case "4": {
                return "佣金交易";
            } break;
            case "5": {
                return "服务收入";
            } break;
            case '6': {
                return "优惠券";
            } break;
            case '7': {
                return "评价";
            } break;
            default:
               return "订单交易";
        }
    };
})
