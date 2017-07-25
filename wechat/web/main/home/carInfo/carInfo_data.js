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