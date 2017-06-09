$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
    	$page = $('#carInfo_carInfo'),
    	pageStr = 'carInfo_carInfo';

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

});