//没网络界面返回界面
$(function(){
	$("#noNet").click(function(){
		wx.getNetworkType({
	        success: function(txt) {
	            if (txt.networkType == "notReachable") {
	                layer.msg("当前无网络环境");
	            } else {
	            	$("#noNet").css("display","none");
	            	$$.redirect($$.stack.pop() || "home/index.html");
	            }
			}
		});
	});
});