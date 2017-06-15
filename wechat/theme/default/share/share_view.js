$(function() {

    // $$.loadJavascript('http://res.wx.qq.com/open/js/jweixin-1.2.0.js');

    var $page = $('#share_share');
    pageStr = 'share_share';
    $$.setGoBack($page.find('a.goBack'));

    // var shareLink = location.href +  "?__RDTURL__=showShare/showShare.html"; // 分享链接http://127.0.0.1:8080/theme/default/?__RDTURL__=showShare/showShare.html
    var shareLink = 'https://www.cheshili.cn/WeChat/theme/lc/wechat/theme/default/index.html?__RDTURL__=share/share.html';
    var shareTitle = "测试"; // 分享标题
    var shareImage = " "; // 分享图标
    var shareDesc = "测试测试测试测试测试测试测试测试测试测试测试测试测试测试"; // 分享描述
    // var tip = '1.点击分享按钮，分享给好友，即可获得车势力专属优惠。2.此活动最终解释权归车势力所有。';
    // $page.find('.sharetip').html(tip);
    // alert(window.location);
    // alert(location.href + 'location');
    // alert( $page.find('.sharetip'));
    /*
        选择器要加上 #文件夹名_文件名
        例：$('#文件夹名_文件名 button.button')

        所有事件绑定到 $('#文件夹名_文件名')下
        例子如下
    */


    $page.on('click', 'div.sharebtn', function() {

        
        alert('点右上角好不好');
        // window.wx && wx.hideMenuItems({
        //     menuList: shareList
        // });
        //iframe窗
        // var index = layer.open({
        //     type: 1,
        //     title: '',
        //     closeBtn: 0, //不显示关闭按钮
        //     shade: [0],
        //     skin: 'share-alert',
        //     area: ['90%', '240px'],
        //     offset: (window.screen.availHeight - 250) + 'px',
        //     // offset: 'auto', //右下角弹出
        //     // time: 2000, //2秒后自动关闭
        //     shadeClose: true,
        //     // shift: 2,
        //     anim: 2,
        //     isOutAnim: 0,
        //     success: function(layero) {

        //         $(".share-cancle").on('click', function() {
        //             layer.close(index);
        //         });
        //         $(".share-btn").on('click', function() {



        //             inviteEntry($(this).attr('data-type'));
        //         });


        //     },

        //     content: template(pageStr + '_alert', {}), //iframe的url，no代表不显示滚动条


        // });

    });
   


});
