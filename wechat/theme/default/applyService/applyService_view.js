$(function () {
    var $page = $('#applyService_applyService'),

    bodyHeight = window.innerHeight || document.body.clientHeight,
    headerHeight = $page.find('>div.header').height();
    $page.find('>div.main').height(bodyHeight - headerHeight);

    //$$.setGoBack($page.find('>div.header >a.goBack'));

   $$.setGoBack($page.find(".header a"));

    


});