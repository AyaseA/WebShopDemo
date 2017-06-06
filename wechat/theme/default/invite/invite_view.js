$(function() {
	var $page = $('#invite_invite'),
    pageStr = 'invite_invite';
	
	$page.find('div.main').css({
		'top': $page.find('div.header').height()
	});

	$page.on('click', 'div.entry', function() {
    	inviteEntry($(this).attr('data-type'));
    });
	// 分享入口
	function inviteEntry(type) {
		switch(type) {
			case 'wechat': {
				
			} break;
			case 'friendscircle': {
				
			} break;
			case 'qrcode': {
				showModal();
				createQRCode('http://192.168.1.176:8080/#headerTitle/titleInvite#invite/1/0/');
			} break;
			case 'qq': {
				
			} break;
			case 'qqzone': {

			} break;
    	}
	}
	function showModal() {
		layer.open({
	        type: 1,
	        title: false, //不显示标题栏
	        closeBtn: true,
	        area: ['210px', '210px'],
	        shade: 0.5,
	        moveType: 1, //拖拽模式，0或者1
	        content: '<div id="invite_invite_qrcode" style="padding: 10px 0 0 10px;"></div>'
	    });
	}
	// 根据url创建二维码
	function createQRCode(url) {
		url = $.trim(url);
		if (url) {
			new QRCode($('#invite_invite_qrcode')[0], {
				width : 190,
				height : 190
			}).makeCode(url);
		}
	}
});