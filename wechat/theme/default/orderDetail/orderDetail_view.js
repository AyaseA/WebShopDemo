$(function () {
    var orderDetail = {
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
            $(document.body).append('<meta name="viewport"  id="rem_init_config" content="width=device-width, user-scalable=no, initial-scale=' + num + ', maximum-scale=' + num + ', minimum-scale=' + num + '" />');
            //3. 获取页面的十分之一宽度 设置为html的字号
            var fontSize = $(window).width() / 10;
            //4. 设置html的字号
            $('html').css('font-size', fontSize);
        }
    };
    //执行初始化
    orderDetail.init();

    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#orderDetail_orderDetail'),
        pageStr = 'orderDetail_orderDetail',
        headerHeight = $page.find('>div.header').height();
    $page.find('>div.main').height(bodyHeight - headerHeight);

    var url = "http://192.168.1.110:8000/";
    var Token = $$.getToken();
    var localtionurl = $$.getUrl();
    var oid = $$.getQueryString('oid', localtionurl);
    /*    $$.post(
     "http://192.168.1.110:8000/CSL/Order/QueryOrderDetail",
     {"ID":46},
     function(txt){
     console.log(txt);
     })   */

    $.ajax({
            type: "POST",
            url: "http://192.168.1.110:8000/CSL/Order/QueryOrderDetail",
            data: {"Token": Token, "ID": oid},
            success: function (txt) {
                var data = $$.eval(txt);
                var list = data.Data.Data;
                var list1 = data.Data;
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
                    //订单编号
                    $page.find(".orderNum").html(list1.ID);
                    //下单时间
                    var time = $$.timeToStr(list1.AddTime);
                    $page.find(".orderTime").html(time);
                    //价格
                    var money = productlist[0].Price * num;
                    $page.find(".money").html(money);
                    //优惠金额
                    var discount = $page.find(".discount").html();
                    //需付款
                    var needMoney = money - discount;
                    $page.find(".needMoney").html(needMoney);
                }
            }
        }
    );
    console.log(oid)
    //页面返回按钮
    $$.setGoBack($page.find('.goBack'));
    //去支付
    $page.on('click', 'div .goPay', function () {
        $$.redirect('payCenter/payCenter.html');
    });
    //取消订单
    $page.find('div.confirm').hide();
    $page.on('click', 'div .cancle ', function () {
        $page.find('div.confirm').show();
    });
    //确认取消
    $page.on('click', 'div .yes ', function () {
        $page.find('div.confirm').hide();
        $$.redirect("orderList/orderList.html?oid=" + oid);
    });
    //不要取消
    $page.on('click', 'div .no ', function () {
        $page.find('div.confirm').hide();
    });

});