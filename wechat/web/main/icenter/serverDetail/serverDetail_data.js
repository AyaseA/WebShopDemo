$(function(){
    var $page = $("#icenter_serverDetail");

    var contentHeight = window.innerHeight - $page.find(".header").height() -$page.find(".orderStatus").height();
    $page.find(".content").height(contentHeight);

    var oid = $$.getQueryString("oid");

    $$.post("CSL/Service/QueryUserServiceDetail",{ ID:oid },function (txt){
        if(txt.Status == 0){
            $page.find(".content").html(
                template("icenter_serverDetail_content",{
                    data: txt.Data,
                    serverAddr : $$.serverAddr,
                    orderID : oid,
                })
            );

            $page.find(".foot").html(
                template("icenter_serverDetail_content",{
                    data:txt.Data,
                })
            );
        }
    });
});
