$(function() {
    var $page = $('#myCars_myCars'),
    	pageStr = 'myCars_myCars';

    // 加载车辆信息
	getMyCars();

    // 加载车辆信息
    function getMyCars() {
        var carsBox = $page.find('>div.main');
        $$.post(
        	$$.serverAddr + 'CSL/UserInfo/QueryCarList',
        	{
        		Token: $$.getToken()
        	},
        	function(res) {
        		if (res.Status != 0) {
	                console.log('获取车辆信息失败！');
	                return false;
	            }
	            if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
	            	debugger
                    var html = template(pageStr + '_list', {
                        list: res.Data.Rows,
                        serverAddr: $$.serverAddr,
                        defaultCar: $$.getUserInfo().UserCarID
                    });
	                carsBox.html(html);
	            } else {
	                // 如果没有车辆信息，跳到添加车辆信息页面
	                $$.redirect('carInfo/carInfo.html');
	            }
        	}
        );
    }
});