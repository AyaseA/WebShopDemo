$(function(){
    var $page=$("#activity_glassLogin"),
        $pagestr="activity_glassLogin";

    //计算div.main 的高度
    function confirmMainHeight(){
        var  headerHeight=$page.find("div.header").height(),
            bodyHeight = window.innerHeight || document.body.clientHeight;
        $page.find("div.main").height(bodyHeight-headerHeight);
    }
    confirmMainHeight();

    //发送验证码
    $page.off("click","div.inputInfo p.sendCode button").on("click","div.inputInfo p.sendCode button",function(){
        //禁用按钮
        $(this).attr("disabled",true);
        $(this).addClass("disable");
        var num=60;
        $(this).text(num+"s");
        function startTimer(val,_this_){
            var timer=setInterval(function(){
               val=val-1;
                $(_this_).text(val+"s");
                if(val<1){
                    clearInterval(timer);
                    $(_this_).attr("disabled",false);
                    $(_this_).removeClass("disable");
                    $(_this_).text("获取验证码");
                }
            },1000)
        }
        startTimer(num,this);
    })
})
