$(function(){
    var $page = $("#icenter_serverDetail");

    var contentHeight = window.innerHeight - $page.find(".header").height() -$page.find(".orderStatus").height();
    $page.find(".content").height(contentHeight);

    var oid = $$.getQueryString("oid"),
        pane = $$.getQueryString("pane");
    if(pane == "hadAppoint"){
        $('span.headStatus').html('预约成功');
    }else if(pane == "notVerify"){
        $('span.headStatus').html('预约完成');
    }
    $$.post("CSL/Service/QueryUserServiceDetail",{ ID:oid },function (txt){
        if(txt.Status == 0){
            $page.find(".content").html(
                template("icenter_serverDetail_content",{
                    data: txt.Data,
                    pane: pane,
                    serverAddr : $$.serverAddr,
                    orderID : oid
                })
            );

            $page.find(".foot").html(
                template("icenter_serverDetail_content",{
                    data:txt.Data
                })
            );
        }
    });
    template.defaults.imports.ProductDescriFilter=function(val){
        if(typeof(val)==="string" ){
            var ProDescri=$$.eval(val);
            if(typeof(ProDescri)==="string" ){
                return $$.eval(ProDescri).title;
            }else{
                return "";
            }
        }else{
            return "";
        }
    }
});
