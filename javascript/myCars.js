!(function(win, $, undefined) {
    var myCars = $.extend(win.App.myCars || {}, {
        init: function(param) {
            var $myCars = $('#myCars');
            // 选择车辆
            $myCars.on('click', 'div.car >div', function() {
                win.App.constants.titleModify = $(this).find('>p').text();
                localStorage.setItem('titleModify', win.App.constants.titleModify);
                location.hash = 'headerModify/titleModify#maintain/1/0/' + $(this).attr('data-id');
            });
            // 设为默认
            $myCars.on('click', 'div.car >i', function() {
                var $parent = $(this).parent();
                // 设置默认车辆
                setDefaultCar($parent.find('>div').attr('data-id'), $parent);
            });
            // 点击删除
            $myCars.on('click', 'a.delete', function() {
                var $this = $(this);
                App.common.confirm('', '确定要删除该车辆信息吗？', function() {
                    // 删除车辆信息
                    deleteCar($this.attr('data-id'));

                    $this.parents('div.car').remove();
                    $myCars.find('>div.car:eq(0)').addClass('default');
                });
            });
            // 加载车辆信息
            getMyCars();
        }
    });
    // 删除车辆信息
    function deleteCar(cid) {
        $.ajax({
            url: win.App.request.serverAddr + 'CSL/UserInfo/DelCar',
            type: 'POST',
            data: {
                Token: win.App.token(),
                ID: cid
            },
            dataType: 'json'
        }).success(function(res) {
            if (res.Status != 0 && res.Data == 'Succ') {
                return false;

            }
        });
    }
    // 设置默认车辆
    function setDefaultCar(cid, $item) {
        $.ajax({
            url: win.App.request.serverAddr + 'CSL/UserInfo/UpdateCarDefault',
            type: 'POST',
            data: {
                Token: win.App.token(),
                ID: cid
            },
            dataType: 'json'
        }).success(function(res) {
            if (res.Status != 0) {
                return false;
            }
            win.localStorage.setItem('UserCarID', cid);
            $item.addClass('default');
            $item.siblings().removeClass('default');
        });
    }
    // 加载车辆信息
    function getMyCars() {
        var carsBox = $('#myCars');
        $.ajax({
            url: win.App.request.serverAddr + 'CSL/UserInfo/QueryCarList',
            type: 'POST',
            data: {
                Token: win.App.token()
            },
            dataType: 'json'
        }).success(function(res) {
            if (res.Status != 0) {
                console.log('获取车辆信息失败！');
                return false;
            }
            if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
                var defaultCar = win.localStorage.getItem('UserCarID'),
                    d = res.Data.Rows,
                    i = 0,
                    cnt = '',
                    tmpData;
                for (i; i < d.length; i++) {
                    tmpData = d[i].Data ? JSON.parse(d[i].Data) : null;
                    cnt += '<div class="car ' + (defaultCar == d[i].ID ? 'default' : '') + '">';
                        cnt += '<div data-id="' + d[i].ID + '">';
                            cnt += '<img src="./images/' + (tmpData ? 'carBrands/' + tmpData.CarBrandId + '.jpg' : 'common/none.svg') + '" unselectable="true">';
                            cnt += '<h4>' + d[i].PlatePro + d[i].PlateCity + d[i].PlateNum + '</h4>';
                            cnt += '<p>' + (tmpData ? tmpData.CarBrandName + ' ' + tmpData.CarTypeName : '') + '</p>';
                        cnt += '</div>';
                        cnt += '<i>设为默认</i>';
                        cnt += '<span>';
                            cnt += '<a href="#headerTitle/titleCarInfo#carInfo/1/0/' + d[i].ID + '" class="modify">修改</a>';
                            cnt += '<a href="javascript:void(0)" class="delete" data-id="' + d[i].ID + '">删除</a>';
                        cnt += '</span>';
                    cnt += '</div>';
                }
                carsBox.empty().html(cnt);
            } else {
                // 如果没有车辆信息，跳到添加车辆信息页面
                location.hash = '#headerTitle/titleCarInfo#carInfo/1/0/';
            }
        });
    }
    win.App.myCars = myCars;
}(window, jQuery));
