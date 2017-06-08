$(function() {
    var $page = $('#orderRecord_orderRecord'),
        pageStr = 'orderRecord_orderRecord';

    var orderRecord = {
        init:function(){
            var self = this;
            self.fit();
            return this;
        },
        //初始化适配
        fit:function(){
            //1.获取像素比值
            var num = 1/window.devicePixelRatio;
            //2. 动态生成视口标签
            $(document.body).append('<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale='+num+', maximum-scale='+num+', minimum-scale='+num+'" />');
            //3. 获取页面的十分之一宽度 设置为html的字号
            var fontSize = $(window).width()/10;
            //4. 设置html的字号
            $('html').css('font-size',fontSize);
            //console.log('uifhdjfewjkjkjkjkdsakljdx')
        }
    }
    //执行初始化
    orderRecord.init();





    //$page.find('div.main').css({
    //    'top': $page.find('div.header').height()
    //});
    //
    //$page.on('click', 'div.entry', function() {
    //    inviteEntry($(this).attr('data-type'));
    //});
    //// 分享入口
    //function inviteEntry(type) {
    //    switch(type) {
    //        case 'wechat': {
    //
    //        } break;
    //        case 'friendscircle': {
    //
    //        } break;
    //        case 'qrcode': {
    //            showModal();
    //            createQRCode('http://192.168.1.176:8080/#headerTitle/titleInvite#invite/1/0/');
    //        } break;
    //        case 'qq': {
    //
    //        } break;
    //        case 'qqzone': {
    //
    //        } break;
    //    }
    //}
    //function showModal() {
    //    layer.open({
    //        type: 1,
    //        title: false, //不显示标题栏
    //        closeBtn: true,
    //        area: ['210px', '210px'],
    //        shade: 0.5,
    //        moveType: 1, //拖拽模式，0或者1
    //        content: '<div id="orderRecord_orderRecord_qrcode" style="padding: 10px 0 0 10px;"></div>'
    //    });
    //}
    //// 根据url创建二维码
    //function createQRCode(url) {
    //    url = $.trim(url);
    //    if (url) {
    //        new QRCode($('#orderRecord_orderRecord_qrcode')[0], {
    //            width : 190,
    //            height : 190
    //        }).makeCode(url);
    //    }
    //}
});