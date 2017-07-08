$(function() {
	var $page = $('#icenter_discount'),
    pageStr = 'icenter_discount';
	/*
		选择器要加上 #文件夹名_文件名
		例：$('#文件夹名_文件名 button.button')

		所有事件绑定到 $('#文件夹名_文件名')下
		例子如下
	*/
	$$.setGoBack($page.find('div.header >a'));
	
	function loadDiscount(){
			//获取内容
			var contentIndex=$("#icenter_discount .navContent").children();
			
			//获取nav标签
			var li=$("#icenter_discount  .nav ul li");
			
			//给每个li赋值index指向li的顺序数，通过顺序数改变内容的显示
			for(var i=0;i<li.length;i++){
				li[i].index=i;
				li[i].onclick=function(){
					for(var j=0;j<li.length;j++){
						li[j].className="off";
						contentIndex[j].style.display="none";
						}
					li[this.index].className="on";
					contentIndex[this.index].style.display="block";
					}
				}	
		}

	loadDiscount();
});

	

