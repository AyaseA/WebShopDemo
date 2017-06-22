$(function() {
    var $page = $('#location_location'),
    	pageStr = 'location_location';
	
    // 获取位置
    $page.find('>div.main >div.there >p').text(
        $$.getLocationInfo().name
    );

	// 重置城市列表
	resetCityList();

    // 重置城市列表
    function resetCityList() {
        $page.find('>div.header >div >i').hide();
        $page.find('>div.header input.search').val('');
        $page.find('>div.main >div.there').show();
        $page.find('div.cities >h5').show();
        $page.find('div.cities >ul.cityLtr').show();
        $page.find('div.cities >div.city').show().removeClass('active');
        $page.find('div.dist >span').css({
            'display': 'inline-block'
        });
    }
});