!(function(win, $, undefined) {
	var activity = $.extend(win.App.activity || {}, {
		init: function(param) {
			var $activity = $('#activity');
			// 添加汽车信息
			$activity.on('click', '>div.info', function() {
				location.hash = "#headerTitle/titleCarInfo#carInfo/1/0";
			});
			// 加载商品列表
			getProductsList();
		}
	});
	// 加载商品列表
	function getProductsList(pageNo, pageSize, startTime, endTime) {
		var $proBox = $('#activity div.products').empty();
		$.ajax({
			url: App.request.serverAddr + 'Product/Prod/QueryList',
			type: 'GET',
			dataType: 'json'
		}).success(function(res) {
			if (res.Status != 0) {
				console.log('获取商品信息失败');
				return false;
			}
			if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
				var d = res.Data.Rows,
					i = 0,
					cnt = '';
				for (i = 0; i < d.length; i++) {
					if (d[i].Price > 1) {
						cnt += '<div class="item" data-id="' + d[i].ID + '">';
							cnt += '<img src="./images/products/product_' + d[i].Price.split('.')[0] + '.png">';
			                cnt += '<div>';
			                    cnt += '<h3>壳牌正品黄壳喜力</h3>';
			                    cnt += '<h6>HX5 矿物汽车润滑机油</h6>';
			                    cnt += '<ul>';
			                        cnt += '<li>动力清洁 抑制有害油泥</li>';
			                        cnt += '<li>更好低温保护 启动更顺畅</li>';
			                    cnt += '</ul>';
			                    cnt += '<p>抢购价：<span>￥' + d[i].Price + '</span></p>';
			                    cnt += '<a href="#headerTitle/titlePay#payCenter/1/0/' + d[i].ID + '">立即购买</a>';
			                cnt += '</div>';
						cnt += '</div>';
					}
				}
				$proBox.append(cnt);
			}
		}).error(function(e) {

		});
	}
	win.App.activity = activity;
}(window, jQuery));