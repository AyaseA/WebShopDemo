!(function(win, $, undefined) {
    var bodyHeight = $('body').height(),
        bodyWidth = $('body').width(),
        maintain = $.extend(win.App.maintain || {}, {
        init: function(param) {
        	var $modal = $('#changeCar');

        	// 选择车辆
        	$modal.find('div.cars').on('click', 'div.car', function() {
                hideChangeCarModal($modal, bodyHeight);
        	});
            // 选择车辆弹框
        	initChangeCarModal($modal);
            // 加载商品列表
            getProductsList();
        },
        showChangeCarModal: function() {
            $('#changeCar').show().animate({
                'top': 0
            }, 300);
        }
    });
    // 加载商品列表
    function getProductsList(pageNo, pageSize, startTime, endTime) {
        var $proBox = $('#maintain div.products').empty();
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
    // 选择车辆弹框
    function initChangeCarModal($modal) {
    	var titleHeight = 39;

        $modal.height(bodyHeight);
        $modal.find('>div.cars').css('max-height', bodyHeight - titleHeight);
        $modal.css('top', bodyHeight + 10);
        $modal.find('>h5 >button').click(function() {
            hideChangeCarModal($modal, bodyHeight);
        });
    }
    // 隐藏弹出框
    function hideChangeCarModal($modal, bodyHeight) {
        $modal.animate({
            'top': bodyHeight + 10
        }, 300).hide(300);
    }
    win.App.maintain = maintain;
}(window, jQuery));
