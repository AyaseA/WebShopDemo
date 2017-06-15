$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#location_location'),
    	pageStr = 'location_location',
    	headerHeight = $page.find('>div.header').height();
    // 设置高度
    $page.find('>div.main').height(bodyHeight - headerHeight - 1);
    // 设置返回按钮可用
    $$.setGoBack($page.find('>div.header >a.goBack'));
    // 点击字母事件
    $page.on('click', '>div.main >div.cities >ul.cityLtr >li', function() {
        var letter = $(this).attr('data-letter'),
            scrollTop = $page.find('>div.main h5[data-letter=' + letter + ']').prop('offsetTop');
        $page.find('>div.main').animate({
            'scrollTop': scrollTop
        }, 300);
    });
    // 点击城市展开
    $page.on('click', '>div.main >div.cities >div.city >p', function() {
        var $parent = $(this).parent();
        if ($parent.hasClass('active')) {
            $parent.removeClass('active');
        } else {
            $parent.addClass('active');
        }
    });
    // 自动检索事件
    $page.on('keyup', '>div.header input.search', function() {
        var val = $.trim($(this).val());
        $(this).val(val);
        if (val) {
            $page.find('>div.header >div >i').show();
            autoFilterCity(val);
        } else {
            $page.find('>div.header >div >i').hide();
            resetCityList();
        }
    });
    // 选择城市事件
    $page.on('click', 'div.dist >span', function() {
        var id = $(this).attr('data-id'),
            name = $(this).attr('data-name');
        $page.find('>div.main >div.there >p').text(name);
        $$.setCookie('__LOCATION__', name);
        $$.goBack();
    });
    // 情况搜索框
    $page.on('click', '>div.header >div >i', function() {
        $(this).hide().prev().val('');
        resetCityList();
    });
    // 获取城市列表
    getCitiesList(function(obj) {
    	printCitiesList(obj);
    });
    // 重置城市列表
    function resetCityList() {
        $page.find('>div.header >div >i').hide();
        $page.find('>div.header input.search').val('');
        $page.find('>div.main >div.there').show();
        $page.find('div.cities >h5').show();
        $page.find('div.cities >ul.cityLtr').show();
        $page.find('div.cities >div.city').show().removeClass('active');
        $page.find('div.dist >span').css({
            'display': 'inline-block'
        });
    }
    // 自动检索方法
    function autoFilterCity(keyWord) {
        $page.find('>div.main >div.there').hide();
        $page.find('div.cities >div.city').hide();
        $page.find('div.cities >ul.cityLtr').hide();
        $page.find('div.cities >h5').hide();
        $page.find('div.dist >span').hide();
        if (/^[\u4e00-\u9fa5]+$/.test(keyWord)) {
            $page.find('div.dist >span[data-name*=' + keyWord + ']').css({
                'display': 'inline-block'
            }).parents('div.city').show().addClass(function() {
                if ($(this).hasClass('active')) {
                    return '';
                } else {
                    return 'active';
                }
            });
        } else {
            keyWord = keyWord.toUpperCase();
            $page.find('div.dist >span[data-py*=' + keyWord + ']').css({
                'display': 'inline-block'
            }).parents('div.city').show().addClass(function() {
                if ($(this).hasClass('active')) {
                    return '';
                } else {
                    return 'active';
                }
            });
        }
    }
    // 打印城市列表
    function printCitiesList(obj) {
        var ltrArr = [];
        $.each(obj.letters, function(key, val) {
            ltrArr.push(key);
        });
    	$page.find('>div.main >div.cities').html(template(pageStr + '_city_list', {
    		cityLetters: ltrArr.sort(),
    		cityList: obj.cityList.sort(function(a, b) {
                val1 = a.pyName;
                val2 = b.pyName;
                // 获取较长的拼音的长度
                var length =  val1.length > val2.length ? val1.length : val2.length;
                // 依次比较字母的unicode码，相等时返回0，小于时返回-1，大于时返回1
                for(var i = 0; i < length; i++ ) {
                    var differ = val1.charCodeAt(i) - val2.charCodeAt(i);
                    if(differ == 0) {
                        continue;
                    }else {
                        if(val1.charAt(i) == '_' ) {
                            return -1;
                        }
                        return differ;
                    }
                }    
                if(i == length) {
                    return val1.length - val2.length;
                }
            })
    	}));
    }
    // 获取城市列表
    function getCitiesList(calback) {
        $$.get(
            'Product/Info/TriLinkAll',
            function(res) {
                if (res.Status) {
                    return false;
                }
                if (res.Data) {
                    $$.loadJavascript(
                        '../../plug/Pinyin.min.js',
                        function() {
                            if (calback) {
                            	calback(analyzeCities(res.Data));
                            }
                        }
                    );
                }
            }
        );
    }
    // 解析城市列表
    function analyzeCities(arr) {
        var cityList = [],
            provTmp,
            cityTmp,
            distTmp,
            provChd,
            cityChd,
            pyTmp,
            distArr,
            alphaTmp,
            letters = {};
        for (var i = 0; i < arr.length; i++) {
            provTmp = arr[i];
            provChd = provTmp.children;
            if (provTmp.Name.endsWith('市') || /((71)|(81)|(82))(0000)/.test(provTmp.ID)) {
                pyTmp = Pinyin.getFullChars(provTmp.Name).toUpperCase();
                alphaTmp = pyTmp.substring(0,1);
                letters[alphaTmp] = 1;
                cityList.push({
                    name: provTmp.Name,
                    id: provTmp.ID,
                    pyName: pyTmp,
                    alpha: alphaTmp,
                    children: []
                });
            } else {
                for (var j = 0; j < provChd.length; j++) {
                    cityTmp = provChd[j];
                    cityChd = cityTmp.children;
                    distArr = [];
                    for (var n = 0; n < cityChd.length; n++) {
                        distTmp = cityChd[n];
                        if (distTmp.Name != '市辖区') {
                            pyTmp = Pinyin.getFullChars(distTmp.Name).toUpperCase();
                            alphaTmp = pyTmp.substring(0,1);
			                letters[alphaTmp] = 1;
                            distArr.push({
                                name: distTmp.Name,
                                id: distTmp.ID,
                                pyName: pyTmp,
                                alpha: alphaTmp
                            });
                        }
                    }
                    pyTmp = Pinyin.getFullChars(cityTmp.Name).toUpperCase();
                    alphaTmp = pyTmp.substring(0,1);
	                letters[alphaTmp] = 1;
                    cityList.push({
                        name: cityTmp.Name,
                        id: cityTmp.ID,
                        children: distArr,
                        pyName: pyTmp,
                        alpha: alphaTmp
                    });
                }
            }
        }
        return {
        	cityList: cityList,
        	letters: letters
        };
    }
});