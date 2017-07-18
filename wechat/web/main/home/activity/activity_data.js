$(function() {
    var $page = $('#home_activity'),
    	pageStr = 'home_activity',
        pageNum = 1,
        pageSize = 9,
        allCount = 0,
        loadComplate = true;

	// 懒加载
    $page.find('>div.main').scrollTop(0).scroll(function() {
    	if (loadComplate) {
	        if (pageNum * pageSize < allCount) {
	            var proBox = $(this).find('div.products').removeClass('loaded'),
	            	maxScroll = $(this).find('>div.warp').height() - $(this).height();
	            if ($(this).scrollTop() == maxScroll) {
	                proBox.addClass('loading');
	                getProductsList(++pageNum, pageSize);
	                $(this).scrollTop($(this).scrollTop() - 10);
	                loadComplate = false;
	            }
	        }
    	} else {
    		return false;
    	}
    });

	// 加载商品列表
	getProductsList(pageNum, pageSize);
	
	// 加载商品列表
	function getProductsList(pn, ps) {
		var $proBox = $page.find('div.products');
		$$.get(
			'Product/Prod/QueryList?N=' + pn + '&Rows=' + ps,
			function(res) {
				if (res.Status != 0) {
					console.log('获取商品信息失败');
					return false;
				}
				if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
					if (pn == 1) {
                        $proBox.empty();
                        allCount = parseInt(res.Data.Count);
                    }
					var d = res.Data.Rows;
					$proBox.append(template(pageStr + '_products', {
						list: d,
						serverAddr: $$.config.serverAddr
					}));
					$proBox.removeClass('loading');
					if (pageNum * pageSize >= allCount) {
                        $proBox.addClass('loaded');
                    } else {
                        $proBox.removeClass('loaded');
                    }
                    loadComplate = true;
				}
			}
		);
	}
});