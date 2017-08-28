$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#home_prodservice'),
	    pageStr = 'home_prodservice',
	    $product = $page.find('div.main div.product'),
	    $detail = $page.find('div.main div.detail'),
	    $evaluate = $page.find('div.main div.evaluate'),
	    boxWidth = $page.find('>div.header').width(),
	    headerHeight = $page.find('>div.header').height(),
	    footerHeight = $page.find('>div.footer').height();

    if ($$.config.isCompatibleIOSTop && navigator.userAgent.indexOf('csl-ios') != -1) {
        $page.find('>div.header').height(64);
    }

	// 设置各个div的宽高
	$page.find('>div.main').css({
			'height': bodyHeight - headerHeight - footerHeight - 1,
			'top': headerHeight
		})
		 .find('>div.content').width(boxWidth * 3)
		 .find('>div').width(boxWidth).height(bodyHeight - headerHeight - footerHeight - 1);
	$page.find('div.reviews >div.warp').width(boxWidth * 5)
		 .find('>div').width(boxWidth).height(bodyHeight - headerHeight * 2 - footerHeight - 2);
	
	$page.find('>div.storeModal div.stores').css({
		'height': bodyHeight * 0.8 - 40 - 46
	});

    // 返回按钮
    /*$$.setGoBack($page.find('>div.header >a.goBack'));*/
    
    // 关闭modal
    $page.on('click dbclick', '>div.storeModal, >div.storeModal a.closeModal', function() {
    	$page.find('>div.storeModal').find('div.warp').animate({
    		'top': bodyHeight
    	}, 200).end().fadeOut(200);
    }).on('click dbclick', 'div.warp', function(e) {
    	e.stopPropagation();
    });
    // 打开
    $page.on('click dbclick', 'div.appointment', function() {
    	$page.find('>div.storeModal div.warp').animate({
    		'top': bodyHeight * 0.2
    	}, 200).parent().fadeIn(200);
    });
    // 详情
    $page.on('click dbclick', '>div.storeModal div.item >a', function(e) {
    	e.stopPropagation();
    	e.preventDefault();
    	$$.redirect($(this).attr('href'));
    });

	// tab页点击
	$page.on('click dbclick', 'div.header li', function() {
		if ($(this).hasClass('active')) {
			return false;
		}
		changeTab($(this));
	});
	// 评价点击进入评价tab
	$page.on('click dbclick', 'div.product >div.comments >p >a', function() {
		changeTab($page.find('div.header li[data-type="evaluate"]'));
	});
	// 评价tab页
	$page.on('click dbclick', 'div.evaluate li', function() {
		if ($(this).hasClass('active')) {
			return false;
		}
		changeCommentsTab($(this));
	});
	// 点击图片放大
	$page.on('click dbclick', 'div.comment >img', function() {
		var url = $(this).attr('src');
		var img = new Image();
		img.src = url;
		img.onload = function() {
			var w = img.width;
            var h = img.height;
            var divID = $$.getRandomCode(6);
            if (w > boxWidth * 0.9) {
	        	h = boxWidth * 0.9 / w * h;
	        	w = boxWidth * 0.9;
	        }
	        if (h > bodyHeight *0.9) {
	        	w = bodyHeight *0.9 / h * w;
	        	h = bodyHeight *0.9
	        }
            layer.open({
	            type: 1,
	            title: false, //不显示标题栏
	            closeBtn: true,
	            shade: 0.5,
	            moveType: 0, //拖拽模式，0或者1
	            content: '<div id="' + divID + '" style="width:' + w + 'px;height:' + h + 'px"></div>'
	        });
	        $(img).width(w).height(h).css(
        	    'margin-bottom', '-4px'
	        );
	        $('#' + divID).html(img);
		}
	});
	// 收藏
	$page.on('click dbclick', '>div.footer >a.collect', function() {
		var $this = $(this),
			pid = $this.attr('data-id');
		if ($$.isLogin(true, null)) {
		    if ($this.hasClass('collected')) {
		    	layer.confirm('确认取消收藏？', { icon: 3, title: '提示' }, function(index) {
			        cancelWish(pid, $this);
		            layer.close(index);
		        });
		    } else {
		        addWish(pid, $this);
		    }
		}
	});
	/************** 左右滑动相关 start **************/
	/*var moveBannerObj = {
		x: 0,
		y: 0,
		xDis: 0,
		yDis: 0
	};
	$page.on('touchstart', '#home_prodservice_banner', function(e) {
		var _touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
            _x = _touch.pageX,
            _y = _touch.pageY;
        moveBannerObj.x = _x;
        moveBannerObj.y = _y;
	}).on('touchmove', '#home_prodservice_banner', function(e) {
		var _touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
            _x = _touch.pageX,
            _y = _touch.pageY,
            cls = $(this).attr('class'),
            index = parseInt($(this).attr('data-index')),
            marginLeft = 0;
        moveBannerObj.xDis = _x - moveBannerObj.x;
        moveBannerObj.yDis = _y - moveBannerObj.y;
        if (Math.abs(moveBannerObj.xDis) > Math.abs(moveBannerObj.yDis)) {
			e.preventDefault();
			e.stopPropagation();
        }
	});
	// 左右滑动
	var moveObj = {
		x: 0,
		y: 0,
		xDis: 0,
		yDis: 0,
		targetIndex: 0,
		isSub: false
	};
	$page.on('touchstart', 'div.content >div', function(e) {
		if (!moveObj.isSub) {
			var _touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
	            _x = _touch.pageX,
	            _y = _touch.pageY;
	        moveObj.x = _x;
	        moveObj.y = _y;
		}
	}).on('touchmove', 'div.content >div', function(e) {
		if (!moveObj.isSub) {
			var _touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
	            _x = _touch.pageX,
	            _y = _touch.pageY,
	            cls = $(this).attr('class'),
	            index = parseInt($(this).attr('data-index')),
	            marginLeft = 0;
	        moveObj.xDis = _x - moveObj.x;
	        moveObj.yDis = _y - moveObj.y;
	        if (Math.abs(moveObj.xDis) > Math.abs(moveObj.yDis)) {
		        moveObj.isSub = false;
		        if (moveObj.xDis > 0) {
		        	// 往右滑动
		        	moveObj.targetIndex = index - 1;
		        	if (cls == 'product') {
			        	moveObj.xDis = 0;
			        	moveObj.targetIndex = 0;
			        }
			        marginLeft = (- index * boxWidth) + moveObj.xDis;
		        } else if (moveObj.xDis < 0) {
		        	// 往左滑动
		        	moveObj.targetIndex = index + 1;
			        if (cls == 'evaluate') {
			        	moveObj.xDis = 0;
			        	moveObj.targetIndex = 2;
			        	moveObj.isSub = true;
			        }
			        marginLeft = moveObj.xDis - index * boxWidth;
		        }
		        if (Math.abs(moveObj.xDis) > boxWidth * 0.2) {
		        	$page.find('div.content').css({
						'margin-left': marginLeft
					});
		        }
		    }
	    }
	}).on('touchend', 'div.content >div', function(e) {
		if (!moveObj.isSub) {
			var index = parseInt($(this).attr('data-index')),
				marginLeft = 0,
				targetTitleIndex = 0;
			if (Math.abs(moveObj.xDis) > boxWidth * 0.4) {
				// 滑动距离大于40%，跳到下一个
				marginLeft = - boxWidth * moveObj.targetIndex;
				targetTitleIndex = moveObj.targetIndex;
			} else {
				marginLeft = - boxWidth * index;
				targetTitleIndex = index;
			}
			$page.find('div.content').animate({
				'margin-left': marginLeft
			}, 300);
			$page.find('>div.header li[data-index=' + targetTitleIndex + ']').addClass('active').siblings().removeClass('active');
			moveObj = {
				x: 0,
				y: 0,
				xDis: 0,
				yDis: 0,
				targetIndex: moveObj.targetIndex,
				isSub: false
			};
		}
	});
	var moveReviewObj = {
		x: 0,
		y: 0,
		xDis: 0,
		yDis: 0,
		targetIndex: 0
	};
	$page.on('touchstart', 'div.content >div div.warp >div', function(e) {
		if (moveObj.isSub) {
			var _touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
	            _x = _touch.pageX,
	            _y = _touch.pageY;
	        moveReviewObj.x = _x;
	        moveReviewObj.y = _y;
		}
	}).on('touchmove', 'div.content >div div.warp >div', function(e) {
		if (moveObj.isSub) {
			var _touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
	            _x = _touch.pageX,
	            _y = _touch.pageY,
	            cls = $(this).attr('class'),
	            index = parseInt($(this).attr('data-index')),
	            marginLeft = 0;
	        moveReviewObj.xDis = _x - moveReviewObj.x;
	        moveReviewObj.yDis = _y - moveReviewObj.y;
	        if (Math.abs(moveReviewObj.xDis) > Math.abs(moveReviewObj.yDis)) {
		        moveObj.isSub = true;
		        if (moveReviewObj.xDis > 0) {
		        	// 往右滑动
		        	moveReviewObj.targetIndex = index - 1;
		        	if (cls == 'all') {
			        	moveReviewObj.xDis = 0;
			        	moveReviewObj.targetIndex = 0;
			        	moveObj.isSub = false;
			        }
			        marginLeft = (- index * boxWidth) + moveReviewObj.xDis;
		        } else if (moveReviewObj.xDis < 0) {
		        	// 往左滑动
		        	moveReviewObj.targetIndex = index + 1;
			        if (cls == 'haveImg') {
			        	moveReviewObj.xDis = 0;
			        	moveReviewObj.targetIndex = 4;
			        }
			        marginLeft = moveReviewObj.xDis - index * boxWidth;
		        }
		        if (Math.abs(moveReviewObj.xDis) > boxWidth * 0.2) {
		        	$page.find('div.reviews >div.warp').css({
						'margin-left': marginLeft
					});
		        }
	        }
		}
	}).on('touchend', 'div.content >div div.warp >div', function(e) {
		if (moveObj.isSub) {
			var index = parseInt($(this).attr('data-index')),
				marginLeft = 0,
				targetTitleIndex = 0;
			if (Math.abs(moveReviewObj.xDis) > boxWidth * 0.4) {
				// 滑动距离大于40%，跳到下一个
				marginLeft = - boxWidth * moveReviewObj.targetIndex;
				targetTitleIndex = moveReviewObj.targetIndex;
			} else {
				marginLeft = - boxWidth * index;
				targetTitleIndex = index;
			}
			$page.find('div.reviews >div.warp').animate({
				'margin-left': marginLeft
			}, 300);
			$page.find('div.evaluate >ul li[data-index=' + targetTitleIndex + ']').addClass('active').siblings().removeClass('active');
			moveReviewObj = {
				x: 0,
				y: 0,
				xDis: 0,
				yDis: 0,
				targetIndex: moveReviewObj.targetIndex
			};
		}
	});*/
	/************** 左右滑动相关 end **************/
	// tab页切换
	function changeTab(item) {
		var index = parseInt($(item).attr('data-index'));
		$(item).addClass('active').siblings().removeClass('active');
		$page.find('div.content').animate({
			'margin-left': - boxWidth * index
		}, 300);
		/*moveObj.targetIndex = index;
		moveObj.isSub = (index == 2);*/
	}
	// 评价tab页切换
	function changeCommentsTab(item, type) {
		var index = parseInt($(item).attr('data-index'));
		$(item).addClass('active').siblings().removeClass('active');
		$page.find('div.reviews >div.warp').animate({
			'margin-left': - boxWidth * index
		}, 300);
		/*moveReviewObj.targetIndex = index;*/
	}
	// 添加收藏
	function addWish(pid, item) {
		$$.isLogin(true, null);
		$$.post(
			'CSL/Wish/AddWishList',
			{
				ProductID: pid
			},
			function(res) {
				if (res.Status == 0 && res.Data == 'Succ') {
					var wishCookie = $$.getCookie('__WISHLIST__') || '',
						wishArr = wishCookie.split(',');
					$$.setCookie('__WISHLIST__', wishArr.join(','), 30 / 60 / 24);
					item.addClass('collected').text('已加入收藏');
					layer.msg('收藏成功！');
				}
			}
		);
	}
	// 取消收藏
	function cancelWish(pid, item) {
		$$.isLogin(true, null);
		$$.post(
			'CSL/Wish/DelWishList',
			{
				ProductID: pid
			},
			function(res) {
				if (res.Status == 0 && res.Data == 'Succ') {
					var wishCookie = $$.getCookie('__WISHLIST__') || '',
						wishArr = wishCookie.split(',');
					wishArr.splice($.inArray(pid, wishArr), 1);
					$$.setCookie('__WISHLIST__', wishArr.join(','), 30 / 60 / 24);
					item.removeClass('collected').text('加入收藏');
				}
			}
		);
	}
});