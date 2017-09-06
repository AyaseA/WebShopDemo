$(function(){
	var $page=$("#icenter_appointmentList");

	$page.find(".nav ul li").click(function(){
		$page.find(".nav ul li").removeClass("active");
		$(this).addClass("active");
		$page.find(".content").children().hide();
		$page.find(".content ."+$(this).attr("data-pane")).show();
	});	
});