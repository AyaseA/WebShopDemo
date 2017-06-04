!(function(window, $, undefined){
	// activityData --> 文件夹名+Data
	window[window.theme].activityData = {
		// 页面数据初始化方法，init 名称固定，不能重名
		init: function(param) {
			// example：加载一波数据
			getSomeData();
		}
	};
	// example：加载一波数据
	function getSomeData() {

	}
}(window, jQuery));