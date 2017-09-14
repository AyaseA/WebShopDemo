$(function(){
	var $page=$("#icenter_delivery");
	$page.find(".header a").click(function(){
		$$.goBack();
	});

	$page.on("click",".moreAddress",function(){
		$$.redirect("home/address.html");
	});

	$page.on("click",".moreCar",function(){
		$$.redirect("home/myCars.html");
	});
});