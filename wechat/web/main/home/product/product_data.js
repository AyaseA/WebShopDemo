$(function() {
    var $page = $('#home_product'),
	    pageStr = 'home_product',
	    pid = $$.getQueryString('pid'),
        pNum = 1;
    
    // 页面重新显示的一些初始化
    $page.find('>div.header li[data-type=product]') 
         .addClass('active').siblings()
         .removeClass('active');
    $page.find('div.evaluate li[data-type=all]')
         .addClass('active').siblings()
         .removeClass('active');
    $page.find('div.content').css({
        'margin-left': 0
    }).find('div.reviews >div.warp').css({
        'margin-left': 0
    });

    // 设置底部按钮的pid
    $page.find('>div.footer >a.collect').attr('data-id', pid).removeClass('collected');
    $page.off('click', '>div.footer >a.buyNow').on('click', '>div.footer >a.buyNow', function() {
        $$.redirect('home/fillOrder.html?pid=' + pid + '&num=' + pNum + '&type=0');
    });
    // 获取商品信息
    getProductInfo();
	// 修改立即购买按钮的商品id
    getWishList();
	// 根据商品id获取商品信息
	function getProductInfo() {
        $$.get(
            'Product/Prod/QueryProdDetail?ID=' + pid,
            function(res) {
                if (res.Status != 0) {
                    return false;
                }
                if (res.Data) {
                    var d = res.Data;
                    // 获取评论
                    getComments(d.Name);
                    var descriTxt = '',
                        descriTitle = '',
                        descriImgs = [];
                    if (d.Descri) {
                        d.Descri = JSON.parse(d.Descri);
                        descriTitle = d.Descri.title;
                        descriTxt = d.Descri.text ? Base64.decode(unescape(d.Descri.text)) : '';
                        descriImgs = d.Descri.imgs ? d.Descri.imgs.split(',') : '';
                    }
                    $page.find('>div.main div.product >div.detail').html(
                        template(pageStr + '_product_info', {
                            serverAddr: $$.config.serverAddr,
                            data: d,
                            descriTitle: descriTitle,
                            descriTxt: descriTxt
                    }));
                    $page.find('>div.main div.proDetail').html(
                        template(pageStr + '_product_detail', {
                            serverAddr: $$.config.serverAddr,
                            descriTitle: descriTitle,
                            descriTxt: descriTxt,
                            descriImgs: descriImgs
                    }));
                    if (d.ImgList) {
                        TouchSlide({
                            slideCell: "#home_product_banner",
                            titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                            mainCell: ".bd ul",
                            effect: "left",
                            autoPlay: true, //自动播放
                            autoPage: true, //自动分页
                            switchLoad: "_src", //切换加载，真实图片路径为"_src" 
                            interTime: 3000 // 切换间隔时间，毫秒
                        });
                    }
                    addHistoryFoot();
                }
            }
        );
	}
    // 根据商品id获取评论
    function getComments(productName) {
        $.ajax({
            url: $$.config.serverAddr + 'Product/Review/QueryProductReviewList?ProductID=' + pid,
            type: 'GET',
            dataType: 'json',
            success: function(res) {
                if (res.Status != 0) {
                    return false;
                }
                if (res.Data && res.Data.Rows) {
                    var d = res.Data.Rows,
                        i = 0,
                        tmp,
                        goodComments = [],
                        midComments = [],
                        badCommons = [],
                        haveImgComments = [];
                    for (i; i < d.length; i++) {
                        tmp = d[i].Rating;
                        if (tmp >= 0 && tmp <= 33) {
                            badCommons.push(d[i]);
                        } else if (tmp > 33 && tmp <= 66) {
                            midComments.push(d[i]);
                        } else if (tmp > 66 && tmp <= 100) {
                            goodComments.push(d[i]);
                        }
                        if (d[i].ImgList) {
                            haveImgComments.push(d[i]);
                        }
                    }
                    var commonTitle = $page.find('>div.main div.comments >p');
                    commonTitle.find('>i').text(d.length);
                    commonTitle.find('span').text(parseFloat(
                        (goodComments.length / d.length || 1) * 100
                    ).toFixed(0) + '%');

                    var allComments = template(pageStr + '_product_comment', {
                        serverAddr: $$.config.serverAddr,
                        commentList: d,
                        productName: productName
                    });
                    // tab1中下面的评论
                    $page.find('>div.main div.product div.commentList').html(allComments);
                    // 评论-全部
                    $page.find('>div.main div.evaluate div.all').html(allComments);
                    // 评论-好评
                    $page.find('>div.main div.evaluate div.good').html(
                        template(pageStr + '_product_comment', {
                            serverAddr: $$.config.serverAddr,
                            commentList: goodComments,
                            productName: productName
                    }));
                    // 评论-中评
                    $page.find('>div.main div.evaluate div.middle').html(
                        template(pageStr + '_product_comment', {
                            serverAddr: $$.config.serverAddr,
                            commentList: midComments,
                            productName: productName
                    }));
                    // 评论-差评
                    $page.find('>div.main div.evaluate div.bad').html(
                        template(pageStr + '_product_comment', {
                            serverAddr: $$.config.serverAddr,
                            commentList: badCommons,
                            productName: productName
                    }));
                    // 评论-有图
                    $page.find('>div.main div.evaluate div.haveImg').html(
                        template(pageStr + '_product_comment', {
                            serverAddr: $$.config.serverAddr,
                            commentList: haveImgComments,
                            productName: productName
                    }));
                }
            }
        });
    }
    // 获取收藏列表存入cookie
    function getWishList() {
        if ($$.isLogin()) {
            $$.post(
                'CSL/Wish/QueryWishList',
                {},
                function(res) {
                    if (res.Status != 0) {
                        return false;
                    }
                    if (res.Data && res.Data.Rows) {
                        var d = res.Data.Rows,
                            wishArr = [];
                        for (var i = 0; i < d.length; i++) {
                            wishArr.push(d[i].ID);
                        }
                        var isWish = $.inArray(pid, wishArr) != -1;
                        $page.find('>div.footer >a.collect').text(
                            isWish ? '已加入收藏' : '加入收藏'
                        ).addClass(
                            isWish ? 'collected' : ''
                        );
                        $$.setCookie('__WISHLIST__', wishArr.join(','));
                    }
                }
            );
        } else if ($$.getCookie('__WISHLIST__')) {
            var wishCookie = $$.getCookie('__WISHLIST__') || '',
                wishArr = wishCookie.split(','),
                isWish = $.inArray(pid, wishArr) != -1;
            $page.find('>div.footer >a.collect').text(
                isWish ? '已加入收藏' : '加入收藏'
            ).addClass(
                isWish ? 'collected' : ''
            );
        }
    }
    // 添加浏览足迹
    function addHistoryFoot() {
        $.ajax({
            type: 'POST',
            url: $$.config.serverAddr + 'Product/Prod/HandleProduct',
            data: {
                ID: pid,
                WToken: $$.getCookie('__TOKEN__')
            }
        });
    }
});