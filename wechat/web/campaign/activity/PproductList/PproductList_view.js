$(function(){
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#activity_PproductList'),
        pageStr = 'activity_PproductList',
        headerHeight = $page.find('>div.header').height(),
        w = $page.width();

// ���ý���߶�
    $page.find('>div.main').height(
        bodyHeight - headerHeight - 1
    );

// ���ذ�ť
    $$.setGoBack($page.find('>div.header >a.goBack'));
    $page.find('map').html(template(pageStr + '_map_area', {
        btn1Coords: w * 0.72 + ',' + w * 0.82 + ',' + w * 0.933 + ',' + w * 0.904,
        btn2Coords: w * 0.72 + ',' + w * 1.248 + ',' + w * 0.933 + ',' + w * 1.33,
        btn3Coords: w * 0.72 + ',' + w * 1.6733 + ',' + w * 0.933 + ',' + w * 1.7573
    }));
 //���ƴ����ת�ķ���
})
