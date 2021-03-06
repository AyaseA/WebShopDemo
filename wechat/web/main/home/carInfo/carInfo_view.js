$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_carInfo'),
    	pageStr = 'home_carInfo';

    if ($$.config.isCompatibleIOSTop && navigator.userAgent.indexOf('csl-ios') != -1) {
        $page.find('>div.header').height(64);
    }

    var headerHeight = $page.find('div.header').height();

    // 设置高度
    $page.find('>div.main, >div.brandsModal >div.brands, >div.seriesModal, >div.carsModal >div.carsBox').css({
        'height': bodyHeight - headerHeight,
        'top': headerHeight
    }).find('>div.carDetail').height(
        bodyHeight - headerHeight - 35
    );
    $page.find('>div.brandsModal >div.title, >div.carsModal >div.title').css({
        'height': headerHeight
    });

    // 汽车对象子类数组转ids字符串
    template.defaults.imports.idsParseFilter = function(arr) {
        var idArr = [],
            ids = '';
        arr.forEach(function(item) {
            idArr.push(item.ID);
        });
        ids = idArr.join(',');
        return ids;
    };
    // 设置返回
    $$.setGoBack($page.find('>div.header >a.goBack'));
    
    // 选择日期
    (new datePicker()).init({
        /* 按钮选择器，用于触发弹出插件 */
        'trigger': '#home_carInfo div.carDetail input[name=timeBuy]',
        /* 模式：date日期；datetime日期时间；time时间；ym年月；*/
        'type': 'date',
        'maxDate': new Date().pattern('yyyy-MM-dd') /*最大日期*/
    });
    // 设置默认车辆点击事件
    $page.on('click dbclick', 'div.carDetail div.setDefault', function() {
        var $this = $(this);
        if ($this.hasClass('default')) {
            $this.removeClass('default');
        } else {
            $this.addClass('default');
        }
    });
    // 点击品牌事件
    $page.on('click dbclick', '>div.brandsModal div.brand', function() {
        var bid = $(this).attr('data-id'),
            bName = $(this).attr('data-name'),
            bids = $(this).attr('data-ids'),
            img = $(this).attr('data-img');
        getSeries(bid, bids, bName, img);
        openSeries();
    });
    // 点击series事件
    $page.on('click dbclick', '>div.seriesModal div.series', function() {
        var sid = $(this).attr('data-id'),
            sName = $(this).attr('data-name'),
            pid = $(this).attr('data-pid'),
            pName = $(this).attr('data-pname'),
            img = $(this).attr('data-img');
        $page.find('div.carDetail input[name="carBrand"]')
            .val(pName + ' ' + sName)
            .attr('data-bid', pid)
            .attr('data-sid', sid)
            .attr('data-sname', sName)
            .attr('data-bname', pName)
            .attr('data-img', img);

        $page.find('div.carDetail input[name="carType"]')
             .val('')
             .attr('data-cid', '');
        closeBrands();
    });
    // 点击保存
    $page.on('click dbclick', 'div.carDetail >button', function() {
        if ($(this).hasClass('disabled')) {
            return false;
        }
        if (!validation()) {
            return false;
        }
        $(this).addClass('disabled');
        saveCar(function(cid, cname, isdft, carid) {
            if (isdft == 1) {
                $$.setUserInfo('UserCarID', cid);
            }
            $$.redirect('home/maintain.html?cid=' + carid + '&cname=' + cname, {
                backUrl: 'home/myCars.html'
            });
        });
    });
    // 点击Car事件
    $page.on('click dbclick', '>div.carsModal >div.carsBox >p.car', function() {
        var cid = $(this).attr('data-id'),
            cName = $(this).text();
        $page.find('div.carDetail input[name="carType"]')
             .val(cName)
             .attr('data-cid', cid);
        closeCars();
    });
    // 点击字母锚点事件
    $page.on('click dbclick', '>div.brandsModal ul.letter >li', function() {
        var letter = $(this).attr('data-letter'),
            $title = $page.find('>div.brandsModal div.brands')
                          .find('>h5[data-letter=' + letter + ']'),
            scrollTop = $title[0].offsetTop;
        $page.find('>div.brandsModal div.brands').animate({
            'scrollTop': scrollTop + 1
        }, 200);
    });
    // 打开弹出层brands
    $page.on('click dbclick', 'div.carDetail input[name="carBrand"]', function() {
        $(this).blur();
        openBrands();
    });
    // 打开弹出层Cars
    $page.on('click dbclick', 'div.carDetail input[name="carType"]', function() {
        $(this).blur();
        var sid = $page.find('div.carDetail input[name="carBrand"]').attr('data-sid');
        if (!sid) {
            tip('请先选择品牌车系！');
            return false;
        }
        getCars(sid);
        openCars();
    });
    // 阻止事件冒泡
    $page.on('click dbclick', '>div.seriesModal >h5, >div.seriesModal >div.seriesBox', function(e) {
        e.stopPropagation();
    });
    // 关闭弹出框brands
    $page.on('click dbclick', '>div.brandsModal a.closeModal', function() {
        closeBrands();
    });
    // 关闭弹出层Series
    $page.on('click dbclick', '>div.seriesModal', function() {
        closeSeries();
    });
    // 关闭弹出框Cars
    $page.on('click dbclick', '>div.carsModal a.closeModal', function() {
        closeCars();
    });
    // 车牌号，发动机号，车架号失去焦点自动将内容转大写
    $page.on('blur', 'div.carDetail input[name$=Number]', function() {
        var $this = $(this);
        $this.val($.trim($this.val()).toUpperCase());
    }).on('focus', 'div.carDetail input[name$=Number]', function() {
        var scrollTop = $(this).parent().parent().offset().top;
        $page.find('div.carDetail').scrollTop(scrollTop);
    });
    // 行驶里程去掉前面的0
    $page.on('focus', 'div.carDetail input[name="dirveRange"]', function() {
        var scrollTop = $(this).parent().parent().offset().top;
        $page.find('div.carDetail').scrollTop(scrollTop);
    });

    // validite
    $page.on('input propertychange', 'div.carDetail input[name="dirveRange"]', function() {
        var inputNum = $(this).val();
        if (!/^[0-9]+.?[0-9]*$/.test(inputNum)) {
            inputNum = inputNum.substring(0, inputNum.length - 1);
        }
        $(this).val(inputNum);
    });


    $page.on('click', 'div.upload', function() {
        if ((navigator.userAgent.indexOf('csl-ios') != -1)||(navigator.userAgent.indexOf('csl-android') != -1)) {
            upLoadImg('camera');
        }else{
            $page.find('div.mask').fadeIn(200).find('>div').animate({
                'height': 160
            }, 200);
            $page.find('a.option1').text('拍照').attr('data-id', '1').attr('data-type', 'icon');
            $page.find('a.option2').text('相册').attr('data-id', '0').attr('data-type', 'icon');
        }
    });
    $page.off('click', 'div.mask').on('click', 'div.mask', function() {
        maskFadeOut();
    }).off('click', 'div.btn-group').on('click', 'div.btn-group', function(e) {
        var option = $(e.target);
        if (option.attr('data-type') == 'sex') {
            $page.find('div.sex span').text(option.text());
        } else if (option.attr('data-type') == 'icon') {
            if (option.attr('data-id') == 0) {
                upLoadImg('album');
            } else if (option.attr('data-id') == 1) {
                upLoadImg('camera');
            }
        }
        maskFadeOut();
        e.stopPropagation();
        e.preventDefault();
    });

    function maskFadeOut(item) {
        $page.find('div.mask').fadeOut(200).find('>div').animate({
            'height': '0'
        }, 200);
    }
    function upLoadImg(type) {
        var sourceType = [],
            from = 0;
        if (navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)) {
            from = 1;
        } else if (navigator.userAgent.indexOf('csl-ios') != -1) {
            from = 2;
        } else if (navigator.userAgent.indexOf('csl-android') != -1) {
            from = 3;
        }
        if (type == 'camera') {
            sourceType.push('camera');
        } else {
            sourceType.push('album');
        }
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: sourceType,
            success: function (res) {
                var localIds = res.localIds;
                wx.getLocalImgData({
                    localId: localIds[0],
                    success: function (res) {
                        var localData = res.localData;
                        $page.find('div.upload').addClass('hasImg').find('img').attr('src', localData);
                    }
                });
                wx.uploadImage({
                    localId: localIds[0],
                    isShowProgressTips: 1,
                    success: function (res) {
                        $page.find('div.upload').attr('data-sid', res.serverId)
                                                .attr('data-frm', from);
                    }
                });
            }
        });
    }

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
                            if (a.Alpha == null) {
                                return 1;
                            }
                            return a.Alpha.localeCompare(b.Alpha);
                        });
                    $.each(letters, function(key, val) {
                        letterArr.push(key);
                    });
                    $page.find('>div.brandsModal >div.brands').html(
                        template(pageStr + '_brands_list', {
                            brands: brands,
                            serverAddr: $$.config.serverAddr,
                            letterArr: letterArr.sort()
                    }));
                }
            }
        );
    }
    // 获取Series
    function getSeries(bid, bids, bName, img) {
        $page.find('>div.seriesModal >h5').text(bName);
        $$.get(
            'Product/Car/GetSeriesJsonByBrand?BrandIDs=' + bids + '&Rows=9999',
            function(res) {
                if (res.Status != 0) {
                    console.log('获取Series失败');
                    return false;
                }
                if (res.Data) {
                    $page.find('>div.seriesModal >div.seriesBox').html(
                        template(pageStr + '_series_list', {
                            series: res.Data,
                            serverAddr: $$.config.serverAddr,
                            brandImg: img
                    }));
                }
            }
        );
    }
    // 获取Cars
    function getCars(sid) {
        $$.get(
            'Product/Car/GetCarBySeries?SeriesID=' + sid + '&Rows=9999',
            function(res) {
                if (res.Status != 0) {
                    console.log('获取Cars失败');
                    return false;
                }
                if (res.Data && res.Data.Rows) {
                    $page.find('>div.carsModal >div.carsBox').html(
                        template(pageStr + '_cars_list', {
                            cars: res.Data.Rows
                    }));
                }
            }
        );
    }
    // 保存车辆信息
    function saveCar(calback) {
        var url = 'CSL/UserInfo/AddCar',
            carId = $$.getQueryString('cid'),
            carInfo = getCarInfo(),
            imgServiceId = '',
            imgFrom = '';
        if (carId) {
            url = 'CSL/UserInfo/UpdateCar';
            carInfo.ID = carId;
        }
        imgServiceId = $page.find('div.upload').attr('data-sid');
        imgFrom = $page.find('div.upload').attr('data-frm');
        if (imgServiceId && imgFrom) {
            carInfo.CerImg = imgServiceId;
            carInfo.CerImgFrom = imgFrom;
        }
        $$.post(
            url,
            carInfo,
            function(res) {
                if (res.Status != 0 && res.Data) {
                    tip('保存车辆信息失败！');
                    return false;
                }
                if (calback) {
                    calback(
                        carId || res.Data.ID,
                        carInfo.CarBrandName + ' ' + carInfo.CarSeriesName + ' ' + carInfo.CarCarName,
                        carInfo.IsDefault,
                        carInfo.CarID
                    );
                }
                $page.find('div.carDetail >button').removeClass('disabled');
            },
            function(e) {
                $page.find('div.carDetail >button').removeClass('disabled');
            }
        );
    }
    // tip
    function tip(cnt, time) {
        var $tip = $('#home_carInfo_tip');
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
            'top': headerHeight
        }, 300).show(100);
    }
    function closeBrands() {
        $page.find('>div.brandsModal').animate({
            'top': bodyHeight
        }, 300).fadeOut(400).find('ul.letter').animate({
            'top': bodyHeight + headerHeight
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
    // 获取车辆信息对象
    function getCarInfo() {
        var $carDetail = $page.find('>div.main >div.carDetail'),
            car = {},
            plate = $carDetail.find('input[name="plateNumber"]').val();
        
        car.CarID = $carDetail.find('input[name="carType"]').attr('data-cid');
        car.BuyTime = $$.get10Time($carDetail.find('input[name="timeBuy"]').val());
        car.DrivingNum = parseFloat($carDetail.find('input[name="dirveRange"]').val());
        car.PlatePro = plate ? plate.substring(0, 1) : '';
        car.PlateCity = plate ? plate.substring(1, 2) : '';
        car.PlateNum = plate ? plate.substring(2, plate.length) : '';
        car.VINNO = $carDetail.find('input[name="frameNumber"]').val();
        car.EngineNO = $carDetail.find('input[name="engineNumber"]').val();
        car.IsDefault = $carDetail.find('div.setDefault').hasClass('default') ? 1 : 0;

        car.CarBrandId = $carDetail.find('input[name="carBrand"]').attr('data-bid');
        car.CarBrandName = $carDetail.find('input[name="carBrand"]').attr('data-bname');
        car.CarBrandImg = $carDetail.find('input[name="carBrand"]').attr('data-img');
        car.CarSeriesId = $carDetail.find('input[name="carBrand"]').attr('data-sid');
        car.CarSeriesName = $carDetail.find('input[name="carBrand"]').attr('data-sname');
        car.CarCarName = $carDetail.find('input[name="carType"]').val();

        var Data = {
            CarBrandId: car.CarBrandId,
            CarBrandName: car.CarBrandName,
            CarBrandImg: car.CarBrandImg,
            CarSeriesId: car.CarSeriesId,
            CarSeriesName: car.CarSeriesName,
            CarCarName: car.CarCarName
        };
        car.Data = JSON.stringify(Data);
        return car;
    }
    // 验证
    function validation() {
        var $carDetail = $page.find('>div.main >div.carDetail');
        if (!$carDetail.find('input[name="carType"]').val()) {
            layer.msg("车型不能为空！");
            return false;
        }
        if (!$carDetail.find('input[name="timeBuy"]').val()) {
            layer.msg("购买时间不能为空！");
            return false;
        }
        if (!$carDetail.find('input[name="dirveRange"]').val()) {
            layer.msg("行驶里程不能为空！");
            return false;
        } else if (!/^[0-9]+.?[0-9]*$/.test($carDetail.find('input[name="dirveRange"]').val())) {
            layer.msg("请输入有效的行驶里程！");
            $carDetail.find('input[name="dirveRange"]').focus();
            return false;
        }
        if ($carDetail.find('input[name="plateNumber"]').val() && 
            !/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test($carDetail.find('input[name="plateNumber"]').val())) {
            layer.msg("车牌号格式错误！");
            $carDetail.find('input[name="plateNumber"]').focus();
            return false;
        }
        if ($carDetail.find('input[name="frameNumber"]').val() && 
            !/[a-zA-Z0-9]{17}/.test($carDetail.find('input[name="frameNumber"]').val())) {
            layer.msg("车架号格式错误！");
            $carDetail.find('input[name="frameNumber"]').focus();
            return false;
        }
        if ($carDetail.find('input[name="engineNumber"]').val() && 
            !/[a-zA-Z0-9]+/.test($carDetail.find('input[name="engineNumber"]').val())) {
            layer.msg("发动机号格式错误！");
            $carDetail.find('input[name="engineNumber"]').focus();
            return false;
        }
        return true;
    }
});