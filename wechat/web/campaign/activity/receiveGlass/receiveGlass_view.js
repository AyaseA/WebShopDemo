$(function(){
    var $page=$("#activity_receiveGlass"),
        $pagestr="activity_receiveGlass";

    //判断手机号的正则
    $page.off("click","div.main div.inputInfo button.receiveBtn ").on("click","div.main div.inputInfo button.receiveBtn", function(){
        var Mobile=$page.find('div.inputInfo input').val();
        if(Mobile){
            if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(Mobile))){
                layer.msg("请输入正取手机号");
                return false;
            }
        }else{
            layer.msg("请输入手机号");
        }
    })

})
