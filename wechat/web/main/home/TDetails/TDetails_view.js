$(function(){
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page=$("#home_TDetails"),
        pageStr="home_TDetails",
        headerHeight=$page.find("div.header").height(),
        loadBox=$page.find("div.main>div.content>div.load");
    //点击返回按钮
    $$.setGoBack($page.find("div.header >a.goBack"));
    //定义div.main 的高度
    $page.find("div.main").height(bodyHeight-headerHeight);
    //获取数据列表的参数
    var pageNum = 1,
        pageSize = 12,
        allCount = 0,
        loadComplate = true;
    //获取交易记录列表
    function getTDetailsList(pn,ps){
        var TDetails=$page.find("div.main div.content>ul");
        $.ajax({
            type:"POST",
            url: $$.config.serverAddr+"CSL/Account/QueryAccountList",
            data: {
                WToken:"f752165e48182cf7d02f217c694c618f13",
                N:pn,
                Rows:ps
            },
            success:function(res){
                res=JSON.parse(res);
                console.log(res);
                if (res.Status != 0) {
                    console.log('获取商品信息失败');
                    return false;
                }
                if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
                    if (pn == 1) {
                        TDetails.empty();
                        allCount = parseInt(res.Data.Count);
                    }
                    var d = res.Data.Rows;
                    TDetails.append(template(pageStr+"_listTem", {
                        list: d,
                        length: d.length
                    }));
                    loadBox.removeClass('loading');
                    if (pageNum * pageSize >= allCount) {
                        loadBox.addClass('loaded');
                    } else {
                        loadBox.removeClass('loaded');
                    }
                    loadComplate = true;
                }
            }
        })
    }
    getTDetailsList(pageNum,pageSize);
    // 懒加载获取数据
    $page.find('>div.main').scrollTop(0).scroll(function() {
        var top=$(this).scrollTop(),
            mainHeight=$page.find("div.main").height(),
            contentHeight=$page.find("div.content").height();
        console.log(top,mainHeight,contentHeight);
        if (loadComplate) {
            if (pageNum * pageSize < allCount) {
                if(contentHeight-mainHeight-top<30){
                    loadBox.addClass("loading");
                    loadComplate = false;
                    getTDetailsList(++pageNum,pageSize);
                }
            }
        } else {
            return false;
        }
    });
    template.defaults.imports.TDetailsTitle = function(TDetailsData){
        var   typeID=JSON.parse(TDetailsData.Data);
        switch(TDetailsData.AccountType) {
            case "0": {
                return "订单交易( 红包交易编号 "+typeID.OrderID+")";
            } break;
            case "1": {
                return "红包交易( 红包交易编号 "+typeID.RedPocketID+")";
            } break;
            case "2": {
                return "充值交易";
            } break;
            case "3": {
                return "银行卡交易( 红包交易编号 "+typeID.OrderID+")";
            } break;
            case "4": {
                return "佣金交易( 红包交易编号 "+typeID.OrderID+")";
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
        }
    };
})
