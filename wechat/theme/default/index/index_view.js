$(function(){
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#index_index').height(bodyHeight),
        pageStr = 'index_index',
        headerHeight = $page.find('>div.header').height(),
        footerHeight = $page.find('>div.footer').height();

    // 设置主窗口高度和位置
    $page.find('>div.main').css({
        'height': bodyHeight - headerHeight - footerHeight + 'px',
        'top': headerHeight + 'px'
    });
    // banner
    getBanners(function() {
        TouchSlide({
            slideCell: "#index_index_banner",
            titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell: ".bd ul",
            effect: "left",
            autoPlay: true, //自动播放
            autoPage: true, //自动分页
            switchLoad: "_src", //切换加载，真实图片路径为"_src" 
            interTime: 3000 // 切换间隔时间，毫秒
        });
    });
    // 获取商品
    getProductsList();

    // 主页模块快捷入口按钮点击事件（洗车、做保养、邀请有礼）
    $page.find('div.entrance >div').on('click', function() {
        var type = $(this).attr('data-type');
        switch(type) {
            case 'carWash': {
                window.location.href = '../center/html/cleaningCar.html';
            } break;
            case 'maintain': {
                // 已有车辆信息
                location.hash = "#headerAdd/titleMyCars#myCars/1/0/";
                
                // 暂无车辆信息，直接跳转到添加车辆信息页面
                //location.hash = "#headerTitle/titleCarInfo#carInfo/1/0/";
            } break;
            case 'friendAdd': {
                location.hash = "#headerTitle/titleInvite#invite/1/0/";
            } break;
        }
    });
    // 活动点击事件
    $page.find('div.activity').on('click', function() {
        
    });

    // 获取banner相关
    function getBanners(calback) {
        var $banner = $('#index_index_banner >div.bd >ul');
        $$.get(
            $$.serverAddr + 'Product/Banner/QueryBannerList?BannerID=1',
            function(res) {
                if (res.Status == 0 && res.Data && res.Data.Rows) {
                    var d = res.Data.Rows;
                    console.log(d);
                    $banner.html(template(pageStr + '_banner_list', {
                        list: d,
                        serverAddr: $$.serverAddr
                    }));

                    if (calback) {
                        calback();
                    }
                }
            }
        );
    }
    // 加载商品列表
    function getProductsList() {
        var $proBox = $page.find('>div.main >div.products').empty();
        $$.get(
            $$.serverAddr + 'Product/Prod/QueryList',
            function(res) {
                if (res.Status != 0) {
                    console.log('获取商品信息失败');
                    return false;
                }
                if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
                    var d = res.Data.Rows;
                    $proBox.html(template(pageStr + '_products', {
                        list: d,
                        length: d.length,
                        serverAddr: $$.serverAddr
                    }));
                }
            }
        );
    }


    /*
        选择器要加上 #文件夹名_文件名
        例：$('#index_index button.button')

        所有事件绑定到 $('#文件夹名_文件名')下
        例子如下
        $('#test_test').on('click', 'button.button', function() {
            
        });
    */
    
    /*var data = {
        title: '标签',
        list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
    };
    // 模版id 文件夹名_文件名_自定义名
    var html = template(pageStr + '_list', data);
    $page.find('.list').html(html);*/
});