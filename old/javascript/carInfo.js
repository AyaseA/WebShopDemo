!(function(win, $, undefined) {
    var carInfo = $.extend(win.App.carInfo || {}, {
        init: function(param) {
            var $carDetail = $('#carInfo >div.carDetail'),
                modal = $('#selectModal');
            // 选择车辆品牌点击事件
            $carDetail.find("input[name=carBrand]").click(function() {
                // 弹出车辆品牌
                showSelectModal(modal, true);
            });
            // 选择车型点击事件
            $carDetail.find("input[name=carType]").click(function() {
                if (!$carDetail.find('input[name="carBrand"]').val()) {
                    win.App.common.tip("请先选择品牌车系！");
                    return false;
                }
                // 弹出车型
                showSelectModal(modal, false);
            });
            // 设置默认点击事件
            $carDetail.find('div.setDefault').click(function() {
                var $this = $(this);
                if ($this.hasClass('default')) {
                    $this.removeClass('default');
                } else {
                    $this.addClass('default');
                }
            });
            // 车牌号，发动机号，车架号失去焦点自动将内容转大写
            $carDetail.find('input[name$=Number]').blur(function() {
                var $this = $(this);
                $this.val($.trim($this.val()).toUpperCase());
            }).focus(function() {
                var scrollTop = $(this).parent().parent().offset().top;
                $('#main').scrollTop(scrollTop);
            });
            // 行驶里程去掉前面的0
            $carDetail.find('input[name="dirveRange"]').focus(function() {
                var scrollTop = $(this).parent().parent().offset().top;
                $('#main').scrollTop(scrollTop);
            });
            // 点击保存事件
            $carDetail.find('>button').click(function() {
                if (!validation()) {
                    return false;
                }
                // 保存车辆信息，跳到推荐保养
                saveCarInfo(function(cid) {
                    location.hash = '#headerModify/titleModify#maintain/1/0/' + cid;
                });                
            });
            // 选择日期
            (new datePicker()).init({
                /* 按钮选择器，用于触发弹出插件 */
                'trigger': '#carInfo >div.carDetail input[name=timeBuy]',
                /* 模式：date日期；datetime日期时间；time时间；ym年月；*/
                'type': 'date'
            });
            // 初始化选择弹框
            initSelectModal($carDetail, modal);
            // 如果存在汽车id，修改车辆信息
            if (param) {
                // 获取车辆信息
                getCarDetail(param);
            }
        }
    });
    // 获取车辆信息
    function getCarDetail(cid) {

    }
    // 保存汽车信息
    function saveCarInfo(callback) {
        var info = getCarInfo();
        $.ajax({
            url: win.App.request.serverAddr + 'CSL/UserInfo/AddCar',
            type: 'POST',
            data: info,
            dataType: 'json'
        }).success(function(res) {
            if (res.Status == 0 && res.Data && res.Data.ID) {
                console.log('保存成功！');
                win.App.constants.titleModify = info.CarBrand + ' ' + info.CarType;
                localStorage.setItem('titleModify', win.App.constants.titleModify);
                if (info.IsDefault == 1) {
                    win.localStorage.setItem('UserCarID', res.Data.ID);
                }
                if (callback) {
                    callback(res.Data.ID);
                }
            }
        });
    }
    // 获取车辆信息对象
    function getCarInfo() {
        var $carDetail = $('#carInfo >div.carDetail'),
            car = {},
            plate = $carDetail.find('input[name="plateNumber"]').val();
        // CarID为选择品牌车系后再选择的车型id
        car.Token = win.App.token();
        
        car.CarID = $carDetail.find('input[name="carType"]').attr('data-type');
        car.BuyTime = win.App.common.get10Time($carDetail.find('input[name="timeBuy"]').val());
        car.DrivingNum = parseFloat($carDetail.find('input[name="dirveRange"]').val());
        car.PlatePro = plate ? plate.substring(0, 1) : '';
        car.PlateCity = plate ? plate.substring(1, 2) : '';
        car.PlateNum = plate ? plate.substring(2, plate.length) : '';
        car.VINNO = $carDetail.find('input[name="frameNumber"]').val();
        car.EngineNO = $carDetail.find('input[name="engineNumber"]').val();
        car.IsDefault = $carDetail.find('div.setDefault').hasClass('default') ? 1 : 0;

        var Data = {
            CarBrandId: $carDetail.find('input[name="carBrand"]').attr('data-brand'),
            CarBrandName: $carDetail.find('input[name="carBrand"]').val(),
            CarTypeName: $carDetail.find('input[name="carType"]').val()
        };
        car.Data = JSON.stringify(Data);
        return car;
    }
    // 验证
    function validation() {
        var $carDetail = $('#carInfo >div.carDetail');
        if (!$carDetail.find('input[name="carBrand"]').val()) {
            win.App.common.tip("品牌车系不能为空！");
            return false;
        }
        if (!$carDetail.find('input[name="carType"]').val()) {
            win.App.common.tip("车型不能为空！");
            return false;
        }
        if (!$carDetail.find('input[name="timeBuy"]').val()) {
            win.App.common.tip("购买时间不能为空！");
            return false;
        }
        if (!$carDetail.find('input[name="dirveRange"]').val()) {
            win.App.common.tip("行驶里程不能为空！");
            return false;
        } else if (!/^[0-9]+.?[0-9]*$/.test($carDetail.find('input[name="dirveRange"]').val())) {
            win.App.common.tip("请输入有效的行驶里程！");
            $carDetail.find('input[name="dirveRange"]').focus();
            return false;
        }
        if ($carDetail.find('input[name="plateNumber"]').val() && 
            !/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test($carDetail.find('input[name="plateNumber"]').val())) {
            win.App.common.tip("车牌号格式错误！");
            $carDetail.find('input[name="plateNumber"]').focus();
            return false;
        }
        if ($carDetail.find('input[name="frameNumber"]').val() && 
            !/[a-zA-Z0-9]{17}/.test($carDetail.find('input[name="frameNumber"]').val())) {
            win.App.common.tip("车架号格式错误！");
            $carDetail.find('input[name="frameNumber"]').focus();
            return false;
        }
        if ($carDetail.find('input[name="engineNumber"]').val() && 
            !/[a-zA-Z0-9]+/.test($carDetail.find('input[name="engineNumber"]').val())) {
            win.App.common.tip("发动机号格式错误！");
            $carDetail.find('input[name="engineNumber"]').focus();
            return false;
        }
        return true;
    }
    // 显示并设置选择弹框标题
    function showSelectModal(modal, isBrand) {
        if (isBrand) {
            modal.find('h5 >span').text('品牌车系');
            modal.find('div.brand').show().siblings('div.type').hide();
        } else {
            modal.find('h5 >span').text('车型');
            modal.find('div.type').show().siblings('div.brand').hide();
        }
        modal.show().animate({
            'top': 0
        }, 300);
    }
    // 初始化选择弹框
    function initSelectModal($carDetail, modal) {
        var bodyHeight = $('body').height(),
            bodyWidth = $('body').width(),
            titleHeight = 39;
        modal.height(bodyHeight);
        modal.find('>div.brand, >div.type').css('max-height', bodyHeight - titleHeight);
        modal.css('top', bodyHeight + 10);
        modal.find('>h5 >button').click(function() {
            hideSelectModal(modal, bodyHeight);
        });

        // 点击锚点滚动
        modal.find('>div.brand').off('click', 'div.jump-tag li.jump-li').on('click', 'div.jump-tag li.jump-li', function() {
            var dataView = $(this).attr('data-view'),
                scrollTop = $('#' + dataView)[0].offsetTop;
            modal.find('>div.brand').animate({
                'scrollTop': scrollTop - titleHeight
            }, 200);
        });

        var $carModels = $('#carModels').css('right', -bodyWidth-10),
            $carModelMask = $('#carModelMask');
        // 选择汽车品牌
        $('#div_ListBrand').on('click', 'li', function() {
            /*
            // 弹出车系子类，再选择子类（暂未实现）
                品牌车系输入框中应显示  奥迪A6L 2015款
            */
            var typeId = $(this).attr('data_type');
            // 选中汽车品牌
            $carDetail.find('input[name=carBrand]')
                .val($(this).find('strong').text())
                .attr("data-brand", typeId);
            hideSelectModal(modal, bodyHeight);

            /*$.jsonp({
                url: 'http://car.m.autohome.com.cn/ashx/GetSeriesByBrandId.ashx?b=' + typeId,
                callbackParameter: "callback",
                success: function(res) {
                    //console.log(res);
                }
            });*/
        });

        // 点击选择车型
        modal.find('>div.type').off('click', 'div.item').on('click', 'div.item', function() {
            var typeId = $(this).attr('data-type');
            $carDetail.find('input[name=carType]')
                .val($(this).text())
                .attr("data-type", typeId);
            hideSelectModal(modal, bodyHeight);
        });

        // 车系子类蒙板点击隐藏车系子类
        $carModelMask.click(function(e) {
            $(this).fadeOut(200);
            $carModels.animate({
                'right': -bodyWidth-10
            }, 200).hide(200);
        });
    }
    // 隐藏弹出框
    function hideSelectModal(modal, bodyHeight) {
        modal.animate({
            'top': bodyHeight + 10
        }, 300).hide(300);
    }
    win.App.carInfo = carInfo;
}(window, jQuery));
