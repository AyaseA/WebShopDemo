$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#home_fillOrder'),
    	pageStr = 'home_fillOrder',
	    boxWidth = $page.find('>div.header').width(),
	    footerHeight = $page.find('>div.footer').height();

	if ($$.config.isCompatibleIOSTop && navigator.userAgent.indexOf('csl-ios') != -1) {
        $page.find('>div.main').css({
        	'top': '64px'
        }).end().find('>div.header').height(64);
        $page.find('>div.couponModal').find('div.title').height(64)
            .end().find('>ul').css({
                'top': '65px'
            })
            .end().find('>div.content').css({
                'top': '110px',
                'height': bodyHeight - 110
            });
    }

    var headerHeight = $page.find('>div.header').height();

    $page.find('>div.couponModal').css({
        'top': bodyHeight
    }).find('>div.content').css({
        'height': bodyHeight - headerHeight - 44 - 1,
        'width': boxWidth
    }).find('>div.warp').css({
        'height': bodyHeight - headerHeight - 44 - 1,
        'width': boxWidth * 2
    }).find('>div').css({
        'height': bodyHeight - headerHeight - 44 - 1,
        'width': boxWidth
    });

	// 设置各种高度
	$page.find('>div.main').css({
		'height': bodyHeight - headerHeight - footerHeight,
	});

    $page.find('>div.deliveryModal div.addressData').css({
        'height': bodyHeight * 0.8 - 40 - 46
    });

	$page.find('>div.appointmentModal div.timeList').css({
		'height': bodyHeight * 0.8 - 40 - 46
	});

	// 设置返回页面
	$$.setGoBack($page.find('>div.header >a.goBack'));

    // 关闭modal
    $page.on('click dbclick', '>div.deliveryModal, >div.deliveryModal a.closeModal', function() {
        $page.find('>div.deliveryModal').find('div.warp').animate({
            'top': bodyHeight
        }, 200).end().fadeOut(200);
    }).on('click dbclick', 'div.warp', function(e) {
        e.stopPropagation();
    });
    // 打开
    $page.on('click dbclick', 'div.delivery', function() {
        $page.find('>div.deliveryModal div.warp').animate({
            'top': bodyHeight * 0.2
        }, 200).parent().fadeIn(200);
    });
    // 选择地址
    $page.on('click dbclick', 'div.deliveryModal div.item', function() {
        var id = $(this).attr('data-id'),
            addr = $(this).attr('data-addr');

        $page.find('div.delivery').html(template(pageStr + '_delivery', {
            needDelivery: true,
            id: id,
            addr: addr
        })).find('>div').width(
            boxWidth - 30 - 8 - 10
        );
        
        $page.find('>div.deliveryModal').find('div.warp').animate({
            'top': bodyHeight
        }, 200).end().fadeOut(200);
    });

	// 关闭modal
    $page.on('click dbclick', '>div.appointmentModal, >div.appointmentModal a.closeModal', function() {
    	$page.find('>div.appointmentModal').find('div.warp').animate({
    		'top': bodyHeight
    	}, 200).end().fadeOut(200);
    }).on('click dbclick', 'div.warp', function(e) {
    	e.stopPropagation();
    });
    // 打开
    $page.on('click dbclick', 'div.appointment', function() {
    	$page.find('>div.appointmentModal div.warp').animate({
    		'top': bodyHeight * 0.2
    	}, 200).parent().fadeIn(200);
    });
    // 选择日期
    $page.on('click dbclick', '>div.appointmentModal span.am, >div.appointmentModal span.pm', function() {
        var isSelected = $(this).hasClass('selected');
        $page.find('>div.appointmentModal span.am, >div.appointmentModal span.pm').removeClass('selected');
        if (!isSelected) {
            $(this).addClass('selected');
        }
    });
	
	// 点击优惠券按钮弹出优惠券框
	$page.on('click dbclick', 'div.coupon button', function() {
		$page.find('>div.couponModal').show().animate({
			'top': 0
		}, 300);
	});
	// 关闭弹框
	$page.on('click dbclick', '>div.couponModal a.closeModal', function() {
		$page.find('>div.couponModal').animate({
			'top': bodyHeight
		}, 300).fadeOut(400);
	});
	// tab切换
	$page.on('click dbclick', '>div.couponModal li', function() {
		if ($(this).hasClass('active')) {
			return false;
		}
		changeTab($(this));
	});
	// 选择优惠券事件
	$page.on('click dbclick', '>div.couponModal div.usable div.ticket', function() {
		if ($(this).hasClass('checked')) {
			$(this).removeClass('checked');
		} else {
			$(this).addClass('checked').siblings().removeClass('checked');
		}
		$page.find('>div.couponModal button.selectTicket').css({
			'display': (
				$page.find('>div.couponModal div.usable div.ticket.checked').length > 0
				? 'block' : 'none')
		});
	});
	// 优惠券tab切换
	function changeTab(item) {
		$(item).addClass('active').siblings().removeClass('active');
		$page.find('>div.couponModal button.selectTicket').css({
			'display': (
				$(item).attr('data-type') == 'usable' &&
				$page.find('>div.couponModal div.usable div.ticket.checked').length > 0
				? 'block' : 'none')
		});
		$page.find('>div.couponModal div.warp').animate({
			'margin-left': - boxWidth * $(item).attr('data-index')
		}, 300);
	}
});