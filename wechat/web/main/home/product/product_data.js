$(function() {
    var $page = $('#home_product'),
	    pageStr = 'home_product',
	    pid = $$.getQueryString('pid'),
        productName = '',
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
                    productName = d.Name;
                    // 获取评论
                    getComments(laszyParam.product);
                    getComments(laszyParam.all);
                    getComments(laszyParam.good);
                    getComments(laszyParam.middle);
                    getComments(laszyParam.bad);
                    getComments(laszyParam.haveImg);
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

    // 懒加载
    var laszyParam = {
        product: {
            loadComplate: true,
            N: 1,
            allCount: 0,
            Rows: 10,
            HasImg: -1,
            SRating: 0,
            ERating: 100,
            target: $page.find('>div.main div.commentList')
        },
        all: {
            loadComplate: true,
            N: 1,
            allCount: 0,
            Rows: 10,
            HasImg: -1,
            SRating: 0,
            ERating: 100,
            target: $page.find('>div.main div.evaluate div.all'),
            isFirst: true
        },
        good: {
            loadComplate: true,
            N: 1,
            allCount: 0,
            Rows: 10,
            HasImg: -1,
            SRating: 67,
            ERating: 100,
            target: $page.find('>div.main div.evaluate div.good'),
            isFirst: true
        },
        middle: {
            loadComplate: true,
            N: 1,
            allCount: 0,
            Rows: 10,
            HasImg: -1,
            SRating: 34,
            ERating: 66,
            target: $page.find('>div.main div.evaluate div.middle'),
            isFirst: true
        },
        bad: {
            loadComplate: true,
            N: 1,
            allCount: 0,
            Rows: 10,
            HasImg: -1,
            SRating: 0,
            ERating: 33,
            target: $page.find('>div.main div.evaluate div.bad'),
            isFirst: true
        },
        haveImg: {
            loadComplate: true,
            N: 1,
            allCount: 0,
            Rows: 10,
            HasImg: 1,
            SRating: 0,
            ERating: 100,
            target: $page.find('>div.main div.evaluate div.haveImg'),
            isFirst: true
        }
    };
    $page.find('>div.main div.product, >div.main div.reviews div.warp >div').scrollTop(0).scroll(function(e) {
        var $target = $(e.target),
            target = 'product';
        if ($target.hasClass('all')) {
            target = 'all';
        } else if ($target.hasClass('good')) {
            target = 'good';
        } else if ($target.hasClass('middle')) {
            target = 'middle';
        } else if ($target.hasClass('bad')) {
            target = 'bad';
        } else if ($target.hasClass('haveImg')) {
            target = 'haveImg';
        }
        if (laszyParam[target].loadComplate) {
            if (laszyParam[target].N * laszyParam[target].Rows < laszyParam[target].allCount) {
                var proBox,
                    maxScroll = $target[0].scrollHeight - $target.height();
                if ($target.hasClass('product')) {
                    proBox = $target.find('div.commentList').removeClass('loaded');
                    /*maxScroll = */
                } else {
                    proBox = $target.removeClass('loaded');
                }
                if ($target.scrollTop() == maxScroll) {
                    proBox.addClass('loading');
                    laszyParam[target].N++;
                    getComments(laszyParam[target]);
                    $target.scrollTop($target.scrollTop() - 10);
                    laszyParam[target].loadComplate = false;
                }
            }
        } else {
            return false;
        }
    });
    // 根据商品id获取评论
    function getComments(data) {
        var $proBox = $(data.target);
        $.ajax({
            url: $$.config.serverAddr + 'Product/Review/QueryProductReviewList',
            data: {
                ProductID: pid,
                HasImg: data.HasImg || -1,
                SRating: data.SRating || 0,
                ERating: data.ERating || 100,
                N: data.N || 1,
                Rows: data.Rows || 10
            },
            type: 'GET',
            dataType: 'json',
            success: function(res) {
                if (res.Status != 0) {
                    return false;
                }
                if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
                    if (data.N == 1) {
                       $proBox.empty();
                        data.allCount = parseInt(res.Data.Count);
                    }
                    var d = res.Data.Rows;
                    // 
                    $proBox.append(
                        template(pageStr + '_product_comment', {
                            serverAddr: $$.config.serverAddr,
                            commentList: d,
                            productName: productName
                    }));
                    $proBox.removeClass('loading');
                    if (data.N * data.Rows >= data.allCount) {
                        $proBox.addClass('loaded');
                    } else {
                        $proBox.removeClass('loaded');
                    }
                    data.loadComplate = true;
                } else {
                    $proBox.html(template(pageStr + '_product_no_comment', {}));
                }
                var commonTitle = $page.find('>div.main div.comments >p');
                commonTitle.find('>i').text(laszyParam.good.allCount);
                commonTitle.find('span').text(parseFloat(
                    (laszyParam.good.allCount / laszyParam.all.allCount || 1) * 100
                ).toFixed(0) + '%');
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