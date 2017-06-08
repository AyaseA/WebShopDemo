$(function() {
    var $page = $('#afterService_afterService'),
        pageStr = 'afterService_afterService';

    var afterService = {
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
    afterService.init();
    getList($page.find('input').val());
    getPostList($page.find('input').val());
    function getPostList(pid) {
        $$.post(
            $$.serverAddr + 'CSL/Order/QueryOrderList',
            {
                id: pid
            },
            function(res) {
                if (res.Status != 0) {
                    alert(11);
                    return false;
                }
                if (res.Data && res.Data.Rows) {
                    var ordersHtml = template(pageStr + '_order_list', {
                        list: res.Data.Rows,
                        serverAddr: $$.serverAddr
                    });
                    $page.find('div.orders').html(ordersHtml);
                }
            }
        );
    }
   function getList(pid) {
       $$.get(
           $$.serverAddr + 'CSL/Order/aa?productId=' + pid,
           function(res) {
               if (res.Status != 0) {
                   alert(11);
                   return false;
               }
               if (res.Data && res.Data.Rows) {
                   var ordersHtml = template(pageStr + '_order_list', {
                       list: res.Data.Rows,
                       serverAddr: $$.serverAddr
                   });
                   $page.find('div.orders').html(ordersHtml);
               }
           }
       );
   }



});