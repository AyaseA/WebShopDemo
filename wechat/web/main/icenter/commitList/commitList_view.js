$(function(){
	var $page=$("#icenter_commitList");
	
	$page.find(".header a").click(function(){
        $$.redirect("icenter/pageHome.html");
		sessionStorage.setItem("pageTab","");
    });

	$page.on("click",".nav ul li",function(){
		$page.find(".nav ul li").removeClass("active");
		$(this).addClass("active");
		$page.find(".content").children().removeClass("active");
		var thisContent=$(this).attr("data-content");
		$page.find("."+thisContent).addClass("active");
		setActiveTab(this);
	});
	//ÐÞ¸Ä
	function setActiveTab(thisD){
		var _thisTag=$(thisD).attr("data-content");
		sessionStorage.setItem("pageTab",_thisTag );
	}
});