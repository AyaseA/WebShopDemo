$(function() {
    var $page=$("#icenter_afterService");

    var contentHeight=window.innerHeight || document.body.clientHeight-$page.find(".header").height()-$page.find(".nav").height();
    $page.find(".content").css("height",contentHeight+"px");
    $page.find(".apply").css("height",contentHeight+"px");
    $page.find(".record").css("height",contentHeight+"px");

    $$.setGoBack($page.find(".header a"));

    $page.on("click",".recordNav",function(){
        $page.find(".nav ul li").removeClass("on");
        $(this).addClass("on");
        $page.find(".apply").animate({left:"-100vw"},300);
        $page.find(".record").animate({left:"0vw"},300);
    });

    $page.on("click",".applyNav",function(){
        $page.find(".nav ul li").removeClass("on");
        $(this).addClass("on");
        $page.find(".apply").animate({left:"0vw"},300);
        $page.find(".record").animate({left:"100vw"},300);
    });

    $page.on("click",".apply button",function(){
        $$.redirect("applyService/applyService.html");
    });
});