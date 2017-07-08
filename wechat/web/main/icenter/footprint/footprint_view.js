$(function() {
    var $page = $('#icenter_footprint'),
        pageStr = 'icenter_footprint';

    var contentHeight = window.innerHeight - $page.find("header").height();
    $page.find(".content").css("height", contentHeight + "px");

    $$.setGoBack($page.find("header img"));

     var token = $$.getToken();
    //var token = "eyJVc2VySUQiOiI0MCIsIk5pY2tOYW1lIjpudWxsLCJHcm91dGhWYWx1ZSI6bnVsbCwiVXNlckFkZHJlc3NJRCI6bnVsbCwiQWRkVGltZSI6IjE0OTczMzkzODgiLCJVc2VyQ2FySUQiOm51bGwsIkltZyI6bnVsbCwiRW5hYmxlIjoiMSIsIkludml0ZUNvZGUiOiJNRFF3IiwiTW9iaWxlIjoiMTUwNjY2NzAzMjAiLCJTZXNzaW9uSUQiOiIxIiwiVHlwZSI6IlVzZXIiLCJVSUQiOiI3MzNlY2VmZGU4MzcwNzU5ZmU5NmQ2OTNmNTE1OGFiYiJ9";
    var url = $$.config.serverAddr;

    $page.on("click", ".contentContain button", function() {
        pid = $(this)[0].attributes[0].value;
        $$.redirect("home/product.html?pid=" + pid);
    });

    
});
