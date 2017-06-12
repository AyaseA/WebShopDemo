$(function(){
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#index_index').height(bodyHeight),
        pageStr = 'index_index',
        headerHeight = $page.find('>div.header').height(),
        footerHeight = $page.find('>div.footer').height();

    // 设置主窗口高度和位置
    resetWindowSize();
    // 窗口尺寸变化重新计算窗口高度和位置
    window.onresize = function() {
        bodyHeight = window.innerHeight || document.body.clientHeight;
        headerHeight = $page.find('>div.header').height();
        footerHeight = $page.find('>div.footer').height();
        resetWindowSize();
    };
    // 主页模块快捷入口按钮点击事件（洗车、做保养、邀请有礼）
    $page.on('click', 'div.entrance >div', function() {
        var type = $(this).attr('data-type');
        switch(type) {
            case 'carWash': {
                // 一元洗车
                $$.redirect();
            } break;
            case 'maintain': {
                // 车辆信息
                $$.redirect('myCars/myCars.html');
            } break;
            case 'friendAdd': {
                // 邀请有礼
                $$.redirect('invite/invite.html');
            } break;
        }
    });
    // 活动点击事件
    $page.on('click', 'div.activity', function() {
        $$.redirect('activity/activity.html');
    });
    // 点击商品查看详情
    $page.on('click', 'div.products img', function() {
        var pid = $(this).parent().attr('data-id');
        $$.redirect('product/product.html?pid=' + pid);
    });
    // footer 事件
    $page.on('click', 'div.footer li', function() {
        var type = $(this).attr('data-tab');
        switch(type) {
            case 'index': {
                // 首页
                $$.redirect('index/index.html');
            } break;
            case 'luckyDraw': {
                // 幸运抽奖
                $$.redirect('luckyDraw/luckyDraw.html');
            } break;
            case 'center': {
                // 个人中心
                $$.redirect('pageHome/pageHome.html');
            } break;
        }
    });

    // 重设窗口高度
    function resetWindowSize() {
        $page.find('>div.main').css({
            'height': bodyHeight - headerHeight - footerHeight + 'px',
            'margin-top': headerHeight + 'px'
        });
    }
    // 获取城市列表
    getCitiesList();
    function getCitiesList() {
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
                            var cityList = getSortCities(res.Data).sort(function(a, b) {
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
                            });
                            console.log(cityList);
                        }
                    );
                }
            }
        );
    }
    function getSortCities(arr) {
        var cityList = [],
            provTmp,
            cityTmp,
            distTmp,
            provChd,
            cityChd,
            pyTmp,
            distArr;
        for (var i = 0; i < arr.length; i++) {
            provTmp = arr[i];
            provChd = provTmp.children;
            if (provTmp.Name.endsWith('市') || /[71|81|82]0000/.test(provTmp.ID)) {
                pyTmp = Pinyin.getFullChars(provTmp.Name).toLowerCase();
                cityList.push({
                    name: provTmp.Name,
                    id: provTmp.ID,
                    pyName: pyTmp,
                    alpha: pyTmp.substring(0,1),
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
                            pyTmp = Pinyin.getFullChars(distTmp.Name).toLowerCase();
                            distArr.push({
                                name: distTmp.Name,
                                id: distTmp.ID,
                                pyName: pyTmp,
                                alpha: pyTmp.substring(0,1)
                            });
                        }
                    }
                    pyTmp = Pinyin.getFullChars(cityTmp.Name).toLowerCase();
                    cityList.push({
                        name: cityTmp.Name,
                        id: cityTmp.ID,
                        children: distArr,
                        pyName: pyTmp,
                        alpha: pyTmp.substring(0,1)
                    });
                }
            }
        }
        return cityList;
    }
});