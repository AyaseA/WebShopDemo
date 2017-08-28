$(function(){
	var $page=$("#icenter_commitList");
	
	$page.find(".header a").click(function(){
        $$.redirect("icenter/pageHome.html");
    });

	$page.on("click",".nav ul li",function(){
		$page.find(".nav ul li").removeClass("active");
		$(this).addClass("active");
		$page.find(".content").children().removeClass("active");
		var thisContent=$(this).attr("data-content");
		$page.find("."+thisContent).addClass("active");
	});
});