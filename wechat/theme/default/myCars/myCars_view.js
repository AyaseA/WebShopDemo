$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#myCars_myCars'),
    	pageStr = 'myCars_myCars',
    	headerHeight = $page.find('div.header').height();

    $page.find('div.main').css({
    	'height': bodyHeight - headerHeight,
    	'margin-top': headerHeight
    });

    $$.setGoBack($page.find('>div.header >a.goBack'));
    
    $page.find('a.addNew').attr('href', 'carInfo/carInfo.html');

    // 设置默认车辆
    $page.on('click', '>div.main div.car >i', function() {
        var $this = $(this);
        setDefaultCar($this.attr('data-id'), function() {
            $this.parent().addClass('default').siblings().removeClass('default');
        });
    });
    // 点击车辆进入推荐保养
    $page.on('click', '>div.main div.car >div', function() {
        var cid = $(this).attr('data-id'),
            cname = $(this).attr('data-name');
        $$.redirect('maintain/maintain.html?cid=' + cid + '&cname=' + cname);
    });
    // 删除车辆
    $page.on('click', '>div.main div.car a.delete', function() {
        if ($page.find('div.confirm').is(':visible')) {
            return false;
        }
        $page.find('div.confirm').show();
        $page.find('div.confirm').find('p').text('确认删除该车辆信息？');
        
        $page.find('div.confirm button.confirm').attr('data-id', $(this).attr('data-id'));
    });
    // 删除前确认相关
    $page.on('click', 'div.confirm button.confirm', function() {
        deleteCar($(this).attr('data-id'), function() {
            $page.find('div.confirm').hide();
            getMyCars();
        });
    });
    // 删除前确认相关
    $page.on('click', 'div.confirm, div.confirm button.cancel', function() {
        $page.find('div.confirm').hide();
    });
    // 删除前确认相关
    $page.on('click', 'div.confirm >div', function(e) {
        e.stopPropagation();
    });
    // 设置默认车辆
    function setDefaultCar(cid, calback) {
        $$.post(
            'CSL/UserInfo/UpdateCarDefault',
            {
                'ID': cid
            },
            function(res) {
                if (res.Status != 0 && res.Data == 'Succ') {
                    return false;
                }
                $$.setCookie('__DFTCAR__', cid);
                if (calback) {
                    calback();
                }
            }
        );
    }
    // 删除车辆
    function deleteCar(cid, calback) {
        $$.post(
            'CSL/UserInfo/DelCar',
            {
                'ID': cid
            },
            function(res) {
                if (res.Status != 0 && res.Data == 'Succ') {
                    return false;
                }
                if (calback) {
                    calback();
                }
            }
        );
    }
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