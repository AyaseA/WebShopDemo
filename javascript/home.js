!(function(win, $, undefined) {
	var home = $.extend(win.App.home || {}, {
		init: function(param) {
			// 获取主页模块
			var $home = $('#home');
			// 主页模块快捷入口按钮点击事件（洗车、做保养、邀请有礼）
			$home.find('div.entrance >div').on('click', function() {
				//pageSkip();
				var type = $(this).attr('data-type');
				switch(type) {
					case 'carWash': {

					} break;
					case 'maintain': {
						// 已有车辆信息
						location.hash = "#headerAdd/titleMyCars#myCars/1/0/";
						
						// 暂无车辆信息，直接跳转到添加车辆信息页面
						//location.hash = "#headerTitle/titleCarInfo#carInfo/1/0/";
					} break;
					case 'friendAdd': {
						location.hash = "#headerTitle/titleInvite#invite/1/0/";
					} break;
				}
			});
			// 活动点击事件
			$home.find('div.activity').on('click', function() {
				location.hash = "#headerTitle/titleAct499#" + $(this).attr('class') + '/1/0/';
			});
			// 加载商品列表
			getProductsList();
			// 获取banner相关
			getBanners(function() {
				// 初始化Banner
				TouchSlide({
				    slideCell: "#banner",
				    titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
				    mainCell: ".bd ul",
				    effect: "left",
				    autoPlay: false, //自动播放
				    autoPage: true, //自动分页
				    switchLoad: "_src", //切换加载，真实图片路径为"_src" 
				    interTime: 3000 // 切换间隔时间，毫秒
				});
			});
		}
	});
	// 加载商品列表
	function getProductsList(pageNo, pageSize, startTime, endTime) {
		var $proBox = $('#home >div.products').empty();
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
					cnt = '<div class="row">';
				for (i = 0; i < d.length; i++) {
					if (d[i].Price > 1) {
						cnt += '<div>';
							cnt += '<div class="item" data-id="' + d[i].ID + '">';
								cnt += '<img src="./images/products/product_' + d[i].Price.split('.')[0] + '.png">';
								cnt += '<p>' + d[i].Name + '</p>';
								cnt += '<a href="#headerTitle/titlePay#payCenter/1/0/' + d[i].ID + '">立即购买</a>';
							cnt += '</div>';
						cnt += '</div>';
						if ((i != d.length - 1) && ((i + 1) % 3 == 0)) {
							cnt += '</div>';
							cnt += '<div class="row">';
						}
					}
				}
				cnt += '</div>';
				$proBox.append(cnt);
			}
		}).error(function(e) {

		});
	}
	// 获取banner相关
	function getBanners(calback) {
		var $banner = $('#banner >div.bd >ul');
		$.ajax({
			url: App.request.serverAddr + 'Product/Banner/QueryBannerList?BannerID=1',
			type: 'GET',
			dataType: 'json'
		}).success(function(res) {
			if (res.Status == 0 && res.Data && res.Data.Rows) {
				var d = res.Data.Rows,
					i = 0,
					cnt = '';
				for (i; i < d.length; i++) {
					cnt += '<li>' +
								'<a href="' + d[i].Link + '">' +
									'<img _src="' + App.request.serverAddr + 'Img/' + d[i].Img + '" src="images/common/blank.png" />' +
								'</a>' +
							'</li>';
				}
				$banner.empty().html(cnt);
				if (calback) {
					calback();
				}
			}
		});
	}
	win.App.home = home;
}(window, jQuery));
