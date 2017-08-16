$(function() {
    var $page = $("#icenter_appointmentList");
    var contentHeight = window.innerHeight - $page.find(".header").height() - $page.find(".nav").height();
    $page.find(".content").height(contentHeight);



    $$.post("CSL/Service/QueryMyService", {}, function(txt) {
        if (txt.Data.Count != 0) {
            $page.find(".notAppoint").html(
                template('icenter_appointmentList_notAppoint', {
                    notAppointData: txt.Data.Rows,
                    serverAddr: $$.serverAddr
                })
            );

            $page.off("click", ".appointFoot button").on("click", ".appointFoot button", function() {
                var pid=$(this).attr("data-id");
                $$.redirect("icenter/appointServer.html?pid="+pid);
            });
        }
    });
});