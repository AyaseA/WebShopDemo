$(function () {
   /* var $page = $('#applyService_applyService'),
        pageStr = 'applyService_applyService';*/

    var applyService = {
        init: function () {
            var self = this;
            self.fit();
            return this;
        },
        //初始化适配
        fit: function () {
            //1.获取像素比值
            var num = 1 / window.devicePixelRatio;
            //2. 动态生成视口标签
            $(document.body).append('<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=' + num + ', maximum-scale=' + num + ', minimum-scale=' + num + '" />');
            //3. 获取页面的十分之一宽度 设置为html的字号
            var fontSize = $(window).width() / 10;
            //4. 设置html的字号
            $('html').css('font-size', fontSize);
            //console.log('uifhdjfewjkjkjkjkdsakljdx')
        }
    }
    //执行初始化
    applyService.init();

    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#applyService_applyService').height(bodyHeight),
        pageStr = 'applyService_applyService',
        headerHeight = $page.find('>div.header').height(),
        footerHeight = $page.find('>div.footer').height();

    // 设置主窗口高度和位置
    resetWindowSize();
    // 窗口尺寸变化重新计算窗口高度和位置
    window.onresize = function() {
        bodyHeight = window.innerHeight || document.body.clientHeight;
        headerHeight = $page.find('>div.header').height();
        footerHeight = $page.find('>div.footer').height();
        resetWindowSize();
    };
    // 重设窗口高度
    function resetWindowSize() {
        $page.find('>div.main').css({
            'height': bodyHeight - headerHeight - footerHeight + 'px',
            'margin-top': headerHeight + 'px'
        });
    }


















});