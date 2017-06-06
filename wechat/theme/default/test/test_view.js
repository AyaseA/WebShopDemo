$(function() {
	var $page = $('#test_test'),
    pageStr = 'test_test';
	/*
		选择器要加上 #文件夹名_文件名
		例：$('#文件夹名_文件名 button.button')

		所有事件绑定到 $('#文件夹名_文件名')下
		例子如下
	*/
	$page.on('click', 'button.button', function() {
		layer.open({
		    type: 1, //Page层类型
		    area: ['80%', '300px'],
		    title: '你好，layer。',
		    shade: 0.6, //遮罩透明度
		    maxmin: true, //允许全屏最小化
		    anim: 1, //0-6的动画形式，-1不开启
		    content: '<div style="padding:50px;">这是一个非常普通的页面层，传入了自定义的html</div>'
		});
	});
});