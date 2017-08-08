$(function () {
    var $page = $('#icenter_contact'),
        pageStr = 'icenter_contact',
        code = $$.getQueryString('Code');

    $$.config.hideGlobalMenu();
    
    $page.find('div.warp').html(template(pageStr + '_content', {
        type: 'msg',
        code: code
    }));
});