!(function(window, $, undefined) {
	$(function() {
		$('a#aa').click(function(e) {
			redirect('activity?name=aaa&id=21&aa=20', function(oldPage, newPage) {
				if (oldPage) {
					oldPage.fadeOut(1000);
				}
				if (newPage) {
					newPage.fadeIn(1000);
				}
			});
		});
		$('a#bb').click(function(e) {
			redirect('example?name=aaa&id=21&aa=20', function(oldPage, newPage) {
				if (oldPage) {
					oldPage.fadeOut(1000);
				}
				if (newPage) {
					newPage.fadeIn(1000);
				}
			});
		});
	});
	window.redirect = function(url, transition) {
		// 页面跳转
		redirectPage(url, transition);
	};
	// 页面跳转
	function redirectPage(url, transition) {
		var urlObj = analysisUrl(url),
			$app = $('#app'),
			oldPage,
			newPage,
			visiblePages = $app.find('>div:visible');
		if (visiblePages.length == 1) {
			oldPage = $(visiblePages[0]);
		}
		if ($app.find('>div#' + urlObj.theme + '-' + urlObj.page).length > 0) {
			// 该模块已存在
			// 控制显示隐藏，后期改造加切换效果
			newPage = $app.find('>div#' + urlObj.theme + '-' + urlObj.page);
			if (transition) {
				transition(oldPage, newPage);
			} else {
				newPage.show().siblings().hide();
			}
		} else {
			// 该模块未加载
			$.ajax({
				url: './tpls/' + urlObj.theme + '/' + urlObj.page + '/' + urlObj.page + '.html',
				type: 'GET',
				dataType: "html"
			}).success(function(tpl) {
				var tmp = $(tpl),
					i = tmp.length - 1;
				for (i; i >= 0; i--) {
					if (tmp[i].id == (urlObj.theme + '-' + urlObj.page)) {
						$app.append(tmp[i]);
						$(tmp[i]).hide();
						if (transition) {
							transition(oldPage, $(tmp[i]));
						} else {
							newPage.show().siblings().hide();
						}
						// 渲染
						
						// 加载数据
						
						return;
					}
				}
			});
		}
	}
	// 解析url
	function analysisUrl(url) {
		var link = '',
			paramObj;
		// url存在'?'，带参数
		if (url.indexOf('?') != -1) {
			var urlArr = url.split('?'),
				paramStr = urlArr[1],
				paramArr = paramStr.split('&'),
				i = 0,
				key = '',
				value = '',
				tmpArr;
			link = urlArr[0];
			paramObj = {};
			// 将参数组装到paramObj
			for (i; i < paramArr.length; i++) {
				tmpArr = paramArr[i].split('=');
				key = tmpArr[0];
				value = tmpArr[1];
				paramObj[key] = value;
			}
		} else {
			// 不带参数
			link = url;
		}
		var theme = window.theme.replace('Theme', '');
		// 返回解析的参数
		return {
			theme: theme,
			page: link,
			param: paramObj
		};
	}
}(window, jQuery));