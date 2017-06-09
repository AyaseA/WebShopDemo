$(function() {
    var $page = $('#myCars_myCars'),
    	pageStr = 'myCars_myCars';

    $page.find('div.confirm').hide();
    // 加载车辆信息
	getMyCars();
    // 加载车辆信息
    function getMyCars() {
        var carsBox = $page.find('>div.main >div.cars');
        $$.post(
        	'CSL/UserInfo/QueryCarList',
        	{},
        	function(res) {
        		if (res.Status != 0) {
	                return false;
	            }
	            if (res.Data && res.Data.Rows) {
	                carsBox.html(template(pageStr + '_list', {
                        list: res.Data.Rows,
                        serverAddr: $$.serverAddr,
                        defaultCar: $$.getCookie('__DFTCAR__')
                    }));
	            }
        	}
        );
    }
    
});