$(function(){
    var $page=$("#activity_PsuccDetail"),
        $pagestr="activity_PsuccDetail";

//点击返回按钮
    $page.off("click dblclick" , "div.header a.goBack").on("click", "div.header a.goBack" , function(){
        $$.goBack();
    })
    //模态框的弹出
    $page.on("click","div.footer button",function(){
        $page.find("div.Pmodel").fadeIn(1000);
        startTime();
    });
    function startTime(){
        var timer=setTimeout(function(){
            $page.find("div.Pmodel").fadeOut(1000);
            clearTimeout(timer);
        },5000)
    }
})
