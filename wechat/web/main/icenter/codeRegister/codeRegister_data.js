$(function() {
    $page = $("#icenter_codeRegister");

    $$.config.hideGlobalMenu();

    var registerCont = $$.getQueryString("RegisterCont");

    $page.off("click",".content button").on("click",".content button",function(){
    	$$.redirect('home/wechatLogin.html?RegisterFrom=1&RegisterCont=' + registerCont);
    });

    var shareLink = $$.config.hostAddr+ "wechat/www/web/main/index.html?R=" +
        escape('home/wechatLogin.html?RegisterFrom=1&RegisterCont=' + registerCont);

    $page.find(".code").empty();
    new QRCode($page.find(".code")[0], {
        width: 150,
        height: 150
    }).makeCode(shareLink);
});