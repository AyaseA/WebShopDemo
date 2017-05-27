!(function(win, $, undefined) {
    var bodyHeight = $('body').height(),
        bodyWidth = $('body').width(),
        maintain = $.extend(win.App.maintain || {}, {
        init: function(param) {
        	var $modal = $('#changeCar');

        	// 选择车辆
        	$modal.find('div.cars').on('click', 'div.car', function() {
                hideChangeCarModal($modal, bodyHeight);
        	});

        	initChangeCarModal($modal);
        },
        showChangeCarModal: function() {
            $('#changeCar').show().animate({
                'top': 0
            }, 300);
        }
    });
    function initChangeCarModal($modal) {
    	var titleHeight = 39;

        $modal.height(bodyHeight);
        $modal.find('>div.cars').css('max-height', bodyHeight - titleHeight);
        $modal.css('top', bodyHeight + 10);
        $modal.find('>h5 >button').click(function() {
            hideChangeCarModal($modal, bodyHeight);
        });
    }
    
    // 隐藏弹出框
    function hideChangeCarModal($modal, bodyHeight) {
        $modal.animate({
            'top': bodyHeight + 10
        }, 300).hide(300);
    }
    win.App.maintain = maintain;
}(window, jQuery));
