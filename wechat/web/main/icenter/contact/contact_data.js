$(function () {
    var $page = $('#icenter_contact'),
        pageStr = 'icenter_contact',
        callCode = $$.getQueryString('CallCode');
        
    $$.config.hideGlobalMenu();
    
    $page.find('div.warp').html(template(pageStr + '_content', {
        type: 'msg',
        callCode: callCode
    }));
});