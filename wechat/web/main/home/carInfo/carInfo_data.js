$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
    	$page = $('#home_carInfo'),
    	pageStr = 'home_carInfo',
    	carId = $$.getQueryString('cid'),
        $carDetail = $page.find('>div.main >div.carDetail');

    // 初始化弹框
    $page.find('>div.brandsModal').css({
        'top': bodyHeight
    }).hide().find('ul.letter').css({
        'top': bodyHeight + 44
    }).hide();
    $page.find('>div.brandsModal').css({
        'top': bodyHeight
    }).hide().find('ul.letter').css({
        'top': bodyHeight + 44
    }).hide();
    $page.find('>div.seriesModal').hide()
         .find('>h5, >div.seriesBox').css({
             'right': '-100%'
    });
    $page.find('>div.carsModal').css({
    	'top': bodyHeight
    }).hide();

    $page.find('div.carDetail >button').removeClass('disabled');
    $page.find('div.upload').attr('data-sid', '')
                            .attr('data-frm', '')
                            .removeClass('hasImg');

    //微信配置
    var WXsign = $$.getWeChatSign(1);
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: $$.config.wxAppID, // 必填，公众号的唯一标识
        timestamp: WXsign.timestamp, // 必填，生成签名的时间戳
        nonceStr: WXsign.noncestr, // 必填，生成签名的随机串
        signature: WXsign.sign, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });


    // 如果 参数carId不为空，获取车辆信息，此次操作为修改，否则清空表单
    getCarInfoByCid();
    function getCarInfoByCid() {
    	if (!carId) {
    		resetCarInfo();
    		return false;
    	}
    	$$.post(
    		'CSL/UserInfo/QueryCarDetail',
    		{
    			ID: carId
    		},
    		function(res) {
    			if (res.Status != 0) {
                    return false;
                }
                setCarInfo(res.Data);
    		}
    	);
    }
    // 设置车辆信息
    function setCarInfo(car) {
    	if (car.Data) {
	    	var carData = JSON.parse(car.Data);
	    	$carDetail.find('input[name="carBrand"]').attr('data-bid', carData.CarBrandId || '');
	    	$carDetail.find('input[name="carBrand"]').attr('data-bname', carData.CarBrandName || '');
	    	$carDetail.find('input[name="carBrand"]').attr('data-sid', carData.CarSeriesId || '');
            $carDetail.find('input[name="carBrand"]').attr('data-sname', carData.CarSeriesName || '');
	    	$carDetail.find('input[name="carBrand"]').attr('data-img', carData.CarBrandImg || '');
	    	$carDetail.find('input[name="carBrand"]').val((carData.CarBrandName || '') + (carData.CarSeriesName || ''));
	    	$carDetail.find('input[name="carType"]').val(carData.CarCarName || '');
    	}
    	$carDetail.find('input[name="carType"]').attr('data-cid', car.CarID || '');
    	$carDetail.find('input[name="timeBuy"]').val($$.timeToStr(car.BuyTime));
    	$carDetail.find('input[name="dirveRange"]').val(car.DrivingNum || '');
    	$carDetail.find('input[name="plateNumber"]').val(car.PlatePro + car.PlateCity + car.PlateNum);
    	$carDetail.find('input[name="frameNumber"]').val(car.VINNO || '');
        $carDetail.find('input[name="engineNumber"]').val(car.EngineNO || '');
        $carDetail.find('div.setDefault').addClass(function() {
            var dftCar = $$.getUserInfo() ? $$.getUserInfo().UserCarID : '';
            return car.ID == dftCar ? 'default' : '';
        });
        if (car.CerImg) {
            $page.find('div.upload').addClass('hasImg').find('img').attr('src', car.CerImg);
        }
    }
    // 重置车辆信息
    function resetCarInfo() {
    	$carDetail.find('input[name="carBrand"]').attr('data-bid', '');
    	$carDetail.find('input[name="carBrand"]').attr('data-bname', '');
    	$carDetail.find('input[name="carBrand"]').attr('data-sid', '');
        $carDetail.find('input[name="carBrand"]').attr('data-sname', '');
    	$carDetail.find('input[name="carBrand"]').attr('data-img', '');
    	$carDetail.find('input[name="carBrand"]').val('');
    	$carDetail.find('input[name="carType"]').val('');
    	$carDetail.find('input[name="carType"]').attr('data-cid', '');
    	$carDetail.find('input[name="timeBuy"]').val('');
    	$carDetail.find('input[name="dirveRange"]').val('');
    	$carDetail.find('input[name="plateNumber"]').val('');
    	$carDetail.find('input[name="frameNumber"]').val('');
        $carDetail.find('input[name="engineNumber"]').val('');
        $carDetail.find('div.setDefault').removeClass('default');
    }

});