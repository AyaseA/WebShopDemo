$(function(){
	$page=$("#icenter_checkCommit");

	$page.find(".header a").click(function(){
        $$.redirect("icenter/commitList.html");
    });
});