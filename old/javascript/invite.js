!(function(win, $, undefined) {
	var invite = $.extend(win.App.invite || {}, {
		init: function(param) {
            var $invite = $('#invite');
            $invite.on('click', 'div.row >div', function() {
            	inviteEntry($(this).attr('data-type'));
            });
			$('#qrCodeModal, #qrCodeModal i.close').on('click', function() {
				hideModal($('#qrCodeModal'));
			});
			$('#qrCodeModal, #qrCodeModal div.content').click(function(e) {
				e.stopPropagation();
			});
			// 创建二维码
			createQRCode('http://192.168.1.176:8080/#headerTitle/titleInvite#invite/1/0/');
		}
	});
	function showModal($item) {
		$item.fadeIn();
	}
	function hideModal($item) {
		$item.fadeOut();
	}
	function inviteEntry(type) {
		switch(type) {
			case 'wechat': {
				
			} break;
			case 'friendscircle': {
				
			} break;
			case 'qrcode': {
				showModal($('#qrCodeModal'));
			} break;
			case 'qq': {
				
			} break;
			case 'qqzone': {

			} break;
    	}
	}
	// 根据url创建二维码
	function createQRCode(url) {
		url = $.trim(url);
		if (url) {
			new QRCode($('#qrCodeModal').find('div.content')[0], {
				width : 190,
				height : 190
			}).makeCode(url);
		}
	}
	win.App.invite = invite;
}(window, jQuery));