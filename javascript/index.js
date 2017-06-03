!(function(win, $, undefined) {
	var $body = $('body'),
        $footer = $('body >footer'),
		bodyHeight = $body.height(),
		App = $.extend(win.App || {}, {
			// 存储各个标题
			constants: {
				"titlePay": '支付中心',
				"titleAct499": '499汽车全年机油养护',
				"titleInvite": '邀请有礼',
				"titleMyCars": '我的车辆',
				"titleCarInfo": '车辆信息',
                "titleOrderRecord": '订单记录',
                "titleModify": '奥迪 2016款 6.0L Coupe'
			},
			request: {
				serverAddr: 'http://192.168.1.102:8000/'
			},
		    index: {
				// 弹出城市列表
		    	showCitiesModal: function() {
			        $('#citySelectModal').show().animate({
			            'top': 0
			        }, 300);
			    }
			},
            // 获取Token
            token: function() {
                return getToken();
            }
		});
	// 获取城市列表
    getCitiesList();
    // 定位
    //getLocation();
	
    // 页面加载完毕
    $(function() {
        /*
            // 地区代码
            adcode: '370102',
            // 省
            province: '山东省',
            // 市
            city: '济南市',
            // 区
            district: '历下区',
            // 储存经纬度
            startLng: '117.109162',
            startLat: '36.682266'
        */
        App.location = JSON.parse(win.localStorage.getItem('location'));
        $footer.find('nav >li').click(function() {
            var $this = $(this);
            if ($this.hasClass('active')) {
                return false;
            }
            var dataTab = $this.attr('data-tab');
            $this.addClass('active');
            $this.siblings().removeClass("active");
            // tab页跳转
            if (dataTab != 'center') {
                location.hash = "#headerSearch/#" + dataTab + '/' + (dataTab.indexOf("center") != -1 ? 0 : 1) + '/1/';
            } else {
                location.hash = "#headerTitle/titleOrderRecord#orderRecord/1/0/";
                //window.open('../../center/center.html', '_self');
            }
        });
        // 解析token存到localStorage
        var uInfo = Base64.decode(getToken());
        uInfo = uInfo.substring(0, uInfo.length - 1);
        var uObj = JSON.parse(uInfo);
        localStorage.setItem('UserCarID', uObj.UserCarID);
    });

    /**** 城市选择弹框相关 start ****/
    var $cityModal = $('#citySelectModal');
    $cityModal.height(bodyHeight);
    $cityModal.find('div.citiesList').height(bodyHeight - $cityModal.find('>h5').height());
    $cityModal.css('top', bodyHeight + 10);
    $cityModal.find('>h5 >button').click(function() {
        hideModal($cityModal);
    });
    // 自动检索
    $cityModal.find('input[name=searchCity]').keyup(function() {
    	var keyWord = $.trim($(this).val());
		var p = $cityModal.find('p');
    	if (keyWord) {
        	p.hide().each(function() {
        		var $this = $(this);
        		if ($this.text().indexOf(keyWord) != -1) {
	        		$this.show();
	        		$this.parents().show();
	        		$this.parents().find('>p').show();
	        	}
        	});
    	} else {
    		p.attr('style', '');
    		$cityModal.find('div.province, div.city').removeClass('active');
    		$cityModal.find('div.province >div, div.city >div').attr('style', '');
    	}
    });
    // 省级点击事件
	$cityModal.on('click', 'div.province >p', function(e) {
		e.stopPropagation();
		citiesClickHandler($(this));
	});
    // 市级点击事件
    $cityModal.on('click', 'div.city >p', function(e) {
		e.stopPropagation();
		citiesClickHandler($(this));
	});
    // 区级点击事件
    $cityModal.on('click', 'div.district >p', function(e) {
		e.stopPropagation();
		citySelectHandler($(this).text(), $(this).parent().attr('data-id'));
	});
    // 隐藏选择框
    function hideModal(modal) {
    	modal.animate({
            'top': bodyHeight + 10
        }, 300).hide(300);
        modal.find('input[name=searchCity]').val('');
        modal.find('p').attr('style', '');
		modal.find('div.province, div.city').removeClass('active');
		modal.find('div.province >div, div.city >div').attr('style', '');
    }
    // 城市点击事件处理
    function citiesClickHandler($this) {
		var $parent = $this.parent();
    	if ($this.attr('style') == '') {
			if ($parent.has('>div').length > 0) {
				if ($parent.hasClass('active')) {
					$parent.removeClass('active');
				} else {
					$parent.addClass('active').siblings().removeClass('active');
				}
			} else {
				citySelectHandler($this.text(), $parent.attr('data-id'));
			}
		} else if ($this.next().is(':hidden')) {
			citySelectHandler($this.text(), $parent.attr('data-id'));
		}
    }
    // 城市选择处理
    function citySelectHandler(cityName, cityCode) {
		console.log(cityName + ':' + cityCode);
		hideModal($('#citySelectModal'));
		// 设置定位城市
    	App.headerSearch.setLocation(cityName);
    }
    // 获取城市列表
    function getCitiesList() {
    	var cityBox = $('#citySelectModal >div.citiesList').empty();
    	$.ajax({
    		url: App.request.serverAddr + 'Product/Info/TriLinkAll',
    		type: 'GET',
    		crossDomain: true,
    		dataType: 'json'
    	}).success(function(res) {
    		if (res.status == 0) {
    			console.log('请求城市失败！');
    		}
    		var d = res.Data,
    			cnt = '',
    			i = 0,
    			j = 0,
    			k = 0,
    			provTmp,
    			cityTmp,
    			distTmp;
    		if (d && d.length > 0) {
    			for (i = 0; i < d.length; i++) {
    				provTmp = d[i];
    				cnt += '<div class="province ' + (provTmp.children.length == 0 ? 'noOpen' : '') + '" data-id="' + provTmp.ID + '" data-level="' + provTmp.Level + '">';
    				cnt += '<p style="">' + provTmp.Name + '</p>';
    				if (provTmp.children && provTmp.children.length > 0) {
	    				cnt += '<div style="">';
	    				for (j = 0; j < provTmp.children.length; j++) {
	    					cityTmp = provTmp.children[j];
	    					cnt += '<div class="city ' + (cityTmp.children.length == 0 ? 'noOpen' : '') + '" data-id="' + cityTmp.ID + '" data-level="' + cityTmp.Level + '">';
	    					cnt += '<p style="">' + cityTmp.Name + '</p>';
	    					if (cityTmp.children && cityTmp.children.length > 0) {
		    					cnt += '<div style="">';
					    		for (k = 0; k < cityTmp.children.length; k++) {
					    			distTmp = cityTmp.children[k];
			    					if (distTmp.Name != '市辖区') {
			    						cnt += '<div class="district" data-id="' + distTmp.ID + '" data-level="' + distTmp.Level + '">';
			    						cnt += '<p style="">' + distTmp.Name + '</p>';
			    						cnt += '</div>';
			    					}
				    			}
				    			cnt += '</div>';
				    		}
			    			cnt += '</div>';
		    			}
		    			cnt += '</div>';
					}
	    			cnt += '</div>';
    			}
    			cityBox.append(cnt);
    		}
    	}).error(function(e) {

    	});
    }
    /**** 城市选择弹框相关 end ****/
    /**** 定位相关 start ****/
    function getLocation() {
        var map = new AMap.Map(''),
            geolocation;
        // 调用浏览器定位服务
        map.plugin('AMap.Geolocation', function() {
            geolocation = new AMap.Geolocation({
                // 是否使用高精度定位，默认:true
                enableHighAccuracy: true,
                // 超过10秒后停止定位，默认：无穷大
                timeout: 1
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', function(data) {
                // 解析定位结果
                    // 经度
                var longitude = data.position.getLng(),
                    // 纬度
                    latitude = data.position.getLat(),
                    posObj = data.addressComponent;

		    	console.log(posObj);

                if (!App.location) {
                    setLocationData(posObj, longitude, latitude);
                    win.localStorage.setItem("location", JSON.stringify(App.location));
                } else if (App.location.adcode != posObj.adcode) {
                    // 位置有变化，切换位置
                    App.common.confirm('', '是否切换到' + posObj.city + '-' + posObj.district, function() {
                        setLocationData(posObj, longitude, latitude);
                        win.localStorage.setItem("location", JSON.stringify(App.location));
                        App.headerSearch.setLocation(App.location.district);
                    });
                }
		    	// 设置定位城市
		    	App.headerSearch.setLocation(App.location.district);
            });
            AMap.event.addListener(geolocation, 'error', function() {
                // 返回定位出错信息
                alert('定位失败');
            });
        });
    }
    // 获取登录Token，没有提示登录
    function getToken() {
        var t = App.common.getCookie('Token');
        if (t) {
            return t;
        }
        alert("请登录");
    }
    // 设置位置信息
    function setLocationData(posObj, longitude, latitude) {
        App.location = {
            // 地区代码
            adcode: posObj.adcode,
            // 省
            province: posObj.province,
            // 市
            city: posObj.city,
            // 区
            district: posObj.district,
            // 储存经纬度
            startLng: longitude,
            startLat: latitude
        };
    }
    /**** 定位相关 end ****/
	win.App = App;
}(window, jQuery));