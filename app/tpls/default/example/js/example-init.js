!(function(window, $, undefined){
	// exampleInit --> 文件夹名+Init
	window[window.theme].exampleInit = {
		// 页面数据初始化方法，init 名称固定，不能重名
		init: function(param) {
			// example：渲染一波页面,绑定一波事件
			bindSomeEvent();
		}
	};
	// example：渲染一波页面,绑定一波事件
	function bindSomeEvent() {

	}
}(window, jQuery));