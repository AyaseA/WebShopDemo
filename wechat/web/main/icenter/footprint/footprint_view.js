$(function() {
    var $page = $('#icenter_footprint'),
        pageStr = 'icenter_footprint';

    var contentHeight = window.innerHeight - $page.find("header").height();
    $page.find(".content").css("height", contentHeight + "px");

    $$.setGoBack($page.find("header img"));

    var token = $$.getToken();

    var url = $$.config.serverAddr;

    $page.on("click", ".contentContain button", function() {
        pid = $(this).attr("data-id");
        tid = $(this).attr("data-tid");
        if (tid == 0) {
            $$.redirect("home/product.html?pid=" + pid);
        } else if (tid == 1) {
            $$.redirect("home/prodservice.html?pid=" + pid);
        } else if (tid == 5) {
            $$.redirect("home/prodmulti.html?pid=" + pid);
        }
    });


});