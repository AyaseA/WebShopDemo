$(function(){
	var $page=$("#icenter_appointServer");

	$page.find(".header a").click(function() {
        $$.goBack();
    });

	$page.find(".chooseDetail img").click(function(){
		if($(this).attr("data-check")!=1){
			$(this).attr("src","images/common/checked.png");
			$(this).attr("data-check","1");
			$page.find(".serverDetail").animate({height:"240px"},300);
		}else{
			$(this).attr("src","images/common/uncheck.png");
			$(this).attr("data-check","0");
			$page.find(".serverDetail").animate({height:"0px"},300);
		}
	});

});