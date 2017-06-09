$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#carInfo_carInfo'),
    	pageStr = 'carInfo_carInfo';

    // 设置高度
    $page.find('>div.main').css({
    	'margin-top': $page.find('div.header').height()
    });
    $page.find('>div.brandsModal >div.brands').height(
        bodyHeight - 44
    );
    $$.setGoBack($page.find('>div.header >a.goBack'));
    // 选择日期
    (new datePicker()).init({
        /* 按钮选择器，用于触发弹出插件 */
        'trigger': '#carInfo_carInfo div.carDetail input[name=timeBuy]',
        /* 模式：date日期；datetime日期时间；time时间；ym年月；*/
        'type': 'date'
    });
    // 设置默认点击事件
    $page.on('click', 'div.carDetail div.setDefault', function() {
        var $this = $(this);
        if ($this.hasClass('default')) {
            $this.removeClass('default');
        } else {
            $this.addClass('default');
        }
    });
    // 关闭弹出框
    $page.on('click', '>div.brandsModal a.closeModal', function() {
        $page.find('>div.brandsModal').animate({
            'top': bodyHeight
        }, 300).fadeOut(400);
    });
    // 打开弹出层
    $page.on('click', 'div.carDetail input[name="carBrand"]', function() {
        $page.find('>div.brandsModal').animate({
            'top': 0
        }, 300).show();
    });

    getBrands();
    function getBrands() {
        $$.get(
            'Product/Car/GetBrand',
            function(res) {
                if (res.Status != 0) {
                    console.log('获取brands失败');
                    return false;
                }
                if (res.Data) {
                    var brands = res.Data.sort(function(a, b) {
                        return a.Alpha.localeCompare(b.Alpha);
                    });
                    var html = template(pageStr + '_brands_list', {
                        brands: brands,
                        serverAddr: $$.serverAddr
                    });
                    $page.find('>div.brandsModal >div.brands').html(html);
                }
            }
        );
    }
});