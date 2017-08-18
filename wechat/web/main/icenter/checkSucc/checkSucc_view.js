$(function(){
	$page=$("#icenter_checkSucc");

	$page.find(".header a").click(function(){
		$$.goBack();
	});

	$page.find(".content .goIndex").click(function(){
		$$.redirect("home/index.html");
	});

	$page.find(".content .goService").click(function(){
		$$.redirect("icenter/appointmentList.html?type=complete");
	});
});