$(function () {
    //rem
    var afterService = {
        init: function () {
            var self = this;
            self.fit();
            return this;
        },
        //初始化适配
        fit: function () {
            if ($(document.body).find('#rem_init_config').length > 0) {
                return false;
            }
            //1.获取像素比值
            var num = 1 / window.devicePixelRatio;
            //2. 动态生成视口标签
            $(document.body).append('<meta name="viewport" id="rem_init_config" content="width=device-width, user-scalable=no, initial-scale=' + num + ', maximum-scale=' + num + ', minimum-scale=' + num + '" />');
            //3. 获取页面的十分之一宽度 设置为html的字号
            var fontSize = $(window).width() / 10;
            //4. 设置html的字号
            $('html').css('font-size', fontSize);
            //console.log('uifhdjfewjkjkjkjkdsakljdx')
        }
    }
    //执行初始化
    afterService.init();

    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#afterService_afterService'),
        pageStr = 'afterService_afterService',
        $apply = $page.find('div.main div.apply'),
        $record = $page.find('div.main div.record'),
        boxWidth = $page.find('>div.header').width(),
        headerHeight = $page.find('>div.header').height();
    $page.find('>div.main').height(bodyHeight - headerHeight - 1)
        .find('>div.content').width(boxWidth * 2)
        .find('>div').width(boxWidth).height(bodyHeight - headerHeight - 1);

    $page.on('click', 'div.header li', function () {
        if ($(this).hasClass('active')) {
            return false;
        }
        changeTab($(this));
    });


    // tab页切换 添加移除类名
    function changeTab(item) {
        $(item).addClass('active').siblings().removeClass('active');
        $page.find('div.content').animate({
            'margin-left': -boxWidth * $(item).attr('data-index')
        }, 300);
    }

    $page.on('click', 'div.order .applyser a', function () {
        $$.redirect('applyService/applyService.html');
    });


    /*    getList($page.find('input').val());
     getPostList($page.find('input').val());
     function getPostList(pid) {
     $$.post(
     $$.serverAddr + 'CSL/Order/QueryOrderList',
     {

     },
     function(res) {
     if (res.Status != 0) {
     //alert(11);
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
     //alert(11);
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
     }*/

    var url = "http://192.168.1.110:8000/";
    var token = "eyJVc2VySUQiOiIxMCIsIk5pY2tOYW1lIjpudWxsLCJHcm91dGhWYWx1ZSI6bnVsbCwiVXNlckFkZHJlc3NJRCI6bnVsbCwiQWRkVGltZSI6IjE0OTYyODA2NDUiLCJVc2VyQ2FySUQiOm51bGwsIkltZyI6bnVsbCwiRW5hYmxlIjoiMSIsIk1vYmlsZSI6IjE1MDY2NjcwMzIwIiwiU2Vzc2lvbklEIjoiMSIsIlR5cGUiOiJVc2VyIiwiVUlEIjoiNGFlOTZhNDc4ZGQyMjBlMTZmNjgyNzU3ZjZlYzY5MjQifQ%3D%3D"
    /*    $$.post(
     "http://192.168.1.110:8000/CSL/Order/QueryOrderDetail",
     {"ID":46},
     function(txt){
     console.log(txt);
     })   */

    $.ajax({
        type: "POST",
        url: "http://192.168.1.110:8000/CSL/Order/QueryOrderDetail",
        data: {"Token": token, "ID": 46},
        success: function (txt) {
            var data = $$.eval(txt);
            var list = data.Data.Data;
            var list1 = data.Data;
            console.log(data.Data);
            if (data.Status == undefined) {
                alert('服务器错误');
            } else if (data.Status == -100) {
                alert('对不起，该用户已冻结！');
            } else if (data.Status == -11) {
                alert('对不起，验证码不可用！');
            } else if (data.Status == -100) {
                alert('对不起，该用户已冻结！');
            } else if (data.Status == -10) {
                alert('枚举类型错误！');
            } else if (data.Status == -9) {
                alert('图片文件尺寸错误！');
            } else if (data.Status == -8) {
                alert('文件上传失败！');
            } else if (data.Status == -7) {
                alert('文件大小错过限制！');
            } else if (data.Status == -6) {
                alert('文件扩展类型错误！');
            } else if (data.Status == -5) {
                alert('文件类型错误！');
            } else if (data.Status == -4) {
                alert('数据验证错误！');
            } else if (data.Status == -3) {
                alert('验证码错误！');
            }
            else if (data.Status == -2) {
                alert('应用没有权限！');
            }
            else if (data.Status == -1) {
                alert('请先登录！');
            }
            else if (data.Status == 1) {
                alert('自定义错误！');
            }
            else if (data.Status == 20) {
                alert('用户未授权此应用！');
            }
            else if (data.Status == 99) {
                alert('未知错误！');
            }
            else if (data.Status == 100) {
                alert('测试接口成功！');
            }
            else if (data.Status == 0) {
                //订单编号
                $page.find(".orderNum").html(list1.ID);
                //下单时间
                var time = $$.timeToStr(list1.AddTime);
                $page.find(".orderTime").html(time);
                var productlist = $$.eval(list);
                //产品图片
                $page.find(".productImg").attr("src", "" + url + "Img/" + productlist[0].Img);
                //产品名称
                $page.find(".productName").html(productlist[0].Name);
                //产品价格
                $page.find(".productPrice").html(productlist[0].Price.split('.')[0]);
                //产品数量
                var num = productlist[0].ProductCount;
                $page.find(".count").html(num);
            }
        }
    })





});