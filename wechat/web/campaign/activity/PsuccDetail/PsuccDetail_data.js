$(function(){
    var $page=$("#activity_PsuccDetail"),
        $pagestr="activity_PsuccDetail";

//计算div.main 的高度
    function confirmMainHeight(){
        var  headerHeight=$page.find("div.header").height(),
            footerHeight=$page.find("div.footer").height(),
            bodyHeight = window.innerHeight || document.body.clientHeight;
        $page.find("div.main").height(bodyHeight-footerHeight-headerHeight);
    }
    confirmMainHeight();




})
