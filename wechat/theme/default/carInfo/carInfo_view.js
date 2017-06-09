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
    $page.find('>div.seriesModal').height(
        bodyHeight - 44
    ).find('>div.seriesBox').height(
        bodyHeight - 75
    );
    $page.find('>div.carsModal >div.carsBox').height(
        bodyHeight - 45
    );
    // 设置返回
    $$.setGoBack($page.find('>div.header >a.goBack'));
    // 选择日期
    (new datePicker()).init({
        /* 按钮选择器，用于触发弹出插件 */
        'trigger': '#carInfo_carInfo div.carDetail input[name=timeBuy]',
        /* 模式：date日期；datetime日期时间；time时间；ym年月；*/
        'type': 'date'
    });
    // 设置默认车辆点击事件
    $page.on('click', 'div.carDetail div.setDefault', function() {
        var $this = $(this);
        if ($this.hasClass('default')) {
            $this.removeClass('default');
        } else {
            $this.addClass('default');
        }
    });
    // 点击品牌事件
    $page.on('click', '>div.brandsModal div.brand', function() {
        var bid = $(this).attr('data-id'),
            bName = $(this).attr('data-name');
        getSeries(bid, bName);
        openSeries();
    });
    // 点击series事件
    $page.on('click', '>div.seriesModal div.series', function() {
        var sid = $(this).attr('data-id'),
            sName = $(this).attr('data-name'),
            pid = $(this).attr('data-pid'),
            pName = $page.find('>div.seriesModal >h5').text();
        $page.find('div.carDetail input[name="carBrand"]')
            .val(pName + ' ' + sName)
            .attr('data-pid', pid)
            .attr('data-sid', sid)
            .attr('data-sname', sName)
            .attr('data-pname', pName);

        $page.find('div.carDetail input[name="carType"]')
             .val('')
             .attr('data-cid', '');
        closeBrands();
    });
    // 点击Car事件
    $page.on('click', '>div.carsModal >div.carsBox >p.car', function() {
        var cid = $(this).attr('data-id'),
            cName = $(this).text();
        $page.find('div.carDetail input[name="carType"]')
             .val(cName)
             .attr('data-cid', cid);
        closeCars();
    });
    // 点击字母锚点事件
    $page.on('click', '>div.brandsModal ul.letter >li', function() {
        var letter = $(this).attr('data-letter'),
            $title = $page.find('>div.brandsModal div.brands')
                          .find('>h5[data-letter=' + letter + ']'),
            scrollTop = $title[0].offsetTop;
        $page.find('>div.brandsModal div.brands').animate({
            'scrollTop': scrollTop + 1
        }, 200);
    });
    // 打开弹出层brands
    $page.on('click', 'div.carDetail input[name="carBrand"]', function() {
        openBrands();
    });
    // 打开弹出层Cars
    $page.on('click', 'div.carDetail input[name="carType"]', function() {
        var sid = $page.find('div.carDetail input[name="carBrand"]').attr('data-sid');
        if (!sid) {
            tip('请先选择品牌车系！');
            return false;
        }
        getCars(sid);
        openCars();
    });
    // 阻止事件冒泡
    $page.on('click', '>div.seriesModal >h5, >div.seriesModal >div.seriesBox', function(e) {
        e.stopPropagation();
    });
    // 关闭弹出框brands
    $page.on('click', '>div.brandsModal a.closeModal', function() {
        closeBrands();
    });
    // 关闭弹出层Series
    $page.on('click', '>div.seriesModal', function() {
        closeSeries();
    });
    // 关闭弹出框Cars
    $page.on('click', '>div.carsModal a.closeModal', function() {
        closeCars();
    });

    getBrands();
    // 获取品牌信息
    function getBrands() {
        $$.get(
            'Product/Car/GetBrand',
            function(res) {
                if (res.Status != 0) {
                    console.log('获取brands失败');
                    return false;
                }
                if (res.Data) {
                    var letters = {},
                        letterArr = [],
                        brands = res.Data.sort(function(a, b) {
                            letters[a.Alpha] = 1;
                            return a.Alpha.localeCompare(b.Alpha);
                        });
                    $.each(letters, function(key, val) {
                        letterArr.push(key);
                    });
                    $page.find('>div.brandsModal >div.brands').html(
                        template(pageStr + '_brands_list', {
                            brands: brands,
                            serverAddr: $$.serverAddr,
                            letterArr: letterArr.sort()
                    }));
                }
            }
        );
    }
    // 获取Series
    function getSeries(bid, bName) {
        $page.find('>div.seriesModal >h5').text(bName);
        $$.get(
            'Product/Car/GetSeriesByBrand?BrandID=' + bid,
            function(res) {
                if (res.Status != 0) {
                    console.log('获取Series失败');
                    return false;
                }
                if (res.Data && res.Data.Rows) {
                    $page.find('>div.seriesModal >div.seriesBox').html(
                        template(pageStr + '_series_list', {
                            series: res.Data.Rows,
                            serverAddr: $$.serverAddr
                    }));
                }
            }
        );
    }
    // 获取Cars
    function getCars(sid) {
        $$.get(
            'Product/Car/GetCarBySeries?SeriesID=' + sid,
            function(res) {
                if (res.Status != 0) {
                    console.log('获取Cars失败');
                    return false;
                }
                if (res.Data && res.Data.Rows) {
                    console.log(res.Data.Rows);
                    $page.find('>div.carsModal >div.carsBox').html(
                        template(pageStr + '_cars_list', {
                            cars: res.Data.Rows
                    }));
                }
            }
        );
    }
    // tip
    function tip(cnt, time) {
        var $tip = $('#carInfo_carInfo_tip');
        $tip.find('>span').text(cnt);
        $tip.fadeIn(300);
        setTimeout(function() {
            $tip.fadeOut(500);
        }, time || 2000);
    }
    // 打开关闭弹框相关
    function openBrands() {
        $page.find('>div.brandsModal').animate({
            'top': 0
        }, 300).show().find('ul.letter').animate({
            'top': 44
        }, 300).show(100);
    }
    function closeBrands() {
        $page.find('>div.brandsModal').animate({
            'top': bodyHeight
        }, 300).fadeOut(400).find('ul.letter').animate({
            'top': bodyHeight + 44
        }, 300).fadeOut(400);
        closeSeries();
    }
    function openSeries() {
        $page.find('>div.seriesModal').fadeIn(200)
             .find('>h5, >div.seriesBox').animate({
                 'right': 0
        }, 300);
    }
    function closeSeries() {
        $page.find('>div.seriesModal').fadeOut(400)
             .find('>h5, >div.seriesBox').animate({
                 'right': '-100%'
        }, 300);
    }
    function openCars() {
        $page.find('>div.carsModal').animate({
            'top': 0
        }, 300).show();
    }
    function closeCars() {
        $page.find('>div.carsModal').animate({
            'top': bodyHeight
        }, 300).fadeOut(400);
    }
});