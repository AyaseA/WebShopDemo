!(function(win, $, undefined) {
    var myCars = $.extend(win.App.myCars || {}, {
        init: function(param) {
            var $myCars = $('#myCars');
            // 选择车辆
            $myCars.on('click', 'div.car >div', function() {
                
                location.hash = 'headerModify/#maintain/1/0/';
            });
            // 设为默认
            $myCars.on('click', 'div.car >i', function() {
                var $parent = $(this).parent();
                if ($parent.hasClass('default')) {
                    return false;
                }
                $parent.addClass('default');
                $parent.siblings().removeClass('default');
            });
            // 点击删除
            $myCars.on('click', 'a.delete', function() {
                var $this = $(this);
                App.common.confirm('', '确定要删除该车辆信息吗？', function() {
                    // 删除车辆信息
                    $this.parents('div.car').remove();
                    $myCars.find('>div.car:eq(0)').addClass('default');
                });
            });
        }
    });
    win.App.myCars = myCars;
}(window, jQuery));
