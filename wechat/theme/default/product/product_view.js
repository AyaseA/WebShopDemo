$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#product_product'),
	    pageStr = 'product_product',
	    $product = $page.find('div.main div.product'),
	    $detail = $page.find('div.main div.detail'),
	    $evaluate = $page.find('div.main div.evaluate'),
	    boxWidth = $page.find('>div.header').width(),
	    headerHeight = $page.find('>div.header').height(),
	    footerHeight = $page.find('>div.footer').height();
	// 设置各个div的宽高
	$page.find('>div.main').height(bodyHeight - headerHeight - footerHeight - 1)
		 .find('>div.content').width(boxWidth * 3)
		 .find('>div').width(boxWidth).height(bodyHeight - headerHeight - footerHeight - 1);
	$page.find('div.reviews >div.warp').width(boxWidth * 5)
		 .find('>div').width(boxWidth).height(bodyHeight - headerHeight * 2 - footerHeight - 2);
	// tab页点击
	$page.on('click', 'div.header li', function() {
		if ($(this).hasClass('active')) {
			return false;
		}
		changeTab($(this));
	});
	// 评价点击进入评价tab
	$page.on('click', 'div.product >div.comments >p >a', function() {
		changeTab($page.find('div.header li[data-type="evaluate"]'));
	});
	// 评价tab页
	$page.on('click', 'div.evaluate li', function() {
		if ($(this).hasClass('active')) {
			return false;
		}
		changeCommentsTab($(this));
	});
	// 返回按钮
	$$.setGoBack($page.find('>div.header >a.goBack'));
	// 收藏
	$page.on('click', '>div.footer >a.collect', function() {
		if ($(this).hasClass('collected')) {
			$(this).removeClass('collected').text('加入收藏');
		} else {
			$(this).addClass('collected').text('已加入收藏');
		}
	});
	// tab页切换
	function changeTab(item) {
		$(item).addClass('active').siblings().removeClass('active');
		$page.find('div.evaluate >ul').css({
			//'position': ($(item).attr('data-type') == 'evaluate' ? 'fixed' : 'absolute')
		});
		$page.find('div.content').animate({
			'margin-left': - boxWidth * $(item).attr('data-index')
		}, 300);
	}
	// 评价tab页切换
	function changeCommentsTab(item, type) {
		$(item).addClass('active').siblings().removeClass('active');
		$page.find('div.reviews >div.warp').animate({
			'margin-left': - boxWidth * $(item).attr('data-index')
		}, 300);
	}
});