$(function() {
    var $page = $('#home_myCars'),
    	pageStr = 'home_myCars';
        
    $page.find('div.confirm').hide();

    // 加载车辆信息
	getMyCars();
    // 加载车辆信息
    function getMyCars() {
        if (!$$.isLogin(true)) {
            return false;
        }
        var carsBox = $page.find('>div.main >div.cars');
        $$.post(
        	'CSL/UserInfo/QueryCarList?N=1&Rows=9999',
        	{},
        	function(res) {
        		if (res.Status != 0) {
	                return false;
	            }
	            if (res.Data && res.Data.Rows) {
	                carsBox.html(template(pageStr + '_list', {
                        list: res.Data.Rows,
                        serverAddr: $$.config.serverAddr,
                        defaultCar: $$.getUserInfo() ? $$.getUserInfo().UserCarID : ''
                    }));
	            }
        	}
        );
    }
});