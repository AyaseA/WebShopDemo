$(function() {
    var $page = $('#home_search'),
        pageStr = 'home_search',
        isReset = $$.getQueryString('reset') == '1' ? true : false,
        pageNum = 1,
        pageSize = 10,
        allCount = 0,
        loadComplate = true,
        searchParams = {
            Keys: '',
            ProductType: -1,
            OrderBy: -1
        };

    // 懒加载
    $page.find('div.result-cnt').scrollTop(0).scroll(function() {
        if (loadComplate) {
            if (pageNum * pageSize < allCount) {
                var proBox = $(this).find('div.products').removeClass('loaded'),
                    maxScroll = $(this).find('div.products')[0].offsetHeight - $(this).height();
                if ($(this).scrollTop() == maxScroll) {
                    proBox.addClass('loading');
                    searchProducts(++pageNum, pageSize);
                    $(this).scrollTop($(this).scrollTop() - 10);
                    loadComplate = false;
                }
            }
        } else {
            return false;
        }
    });

    if (isReset) {
        resSearch();
    }

    $page.find('div.searchInput >input').focus();
    $page.off('submit', 'form').on('submit', 'form', function(e) {
        e.preventDefault();
        var keyWord = $.trim($(this).find('input').val());
        searchParams.Keys = keyWord;
        searchProducts(pageNum, pageSize);
    });
    $page.off('click dbclick', 'div.search-title span')
         .on('click dbclick', 'div.search-title span', function() {
            var keyWord = $(this).text();
            $page.find('div.searchInput >input').val(keyWord);
            searchParams.Keys = keyWord;
            searchProducts(pageNum, pageSize);
         });
    $page.off('input propertychange', 'div.searchInput >input')
         .on('input propertychange', 'div.searchInput >input', function() {
        var val = $(this).val();
        if (val && val != '') {
            $(this).siblings('i.clearCnt').css('display', 'block');
        } else {
            resSearch();
        }
    });
    $page.off('click dbclick', 'i.clearCnt')
         .on('click dbclick', 'i.clearCnt', function() {
        resSearch();
    });
    /*$page.off('click dbclick', '>div.header a.cancel')
         .on('click dbclick', '>div.header a.cancel', function(){
        resSearch();
    });*/

    function searchProducts(pn, ps) {
        var $proBox = $page.find('>div.main div.products');
        $.ajax({
            url: $$.config.serverAddr + 'Product/Prod/QueryProdList',
            type: 'GET',
            data: {
                Keys: searchParams.Keys,
                N: pn,
                Rows: ps,
                ProductType: searchParams.ProductType
            },
            dataType: 'json',
            success: function(res) {
                if (res.Status != 0) {
                    console.log('获取商品信息失败');
                    return false;
                }
                $page.find('>div.header').removeClass('search').addClass('result');
                $page.find('div.search-cnt').removeClass('on');
                $page.find('div.result-cnt').addClass('on');
                if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
                    if (pn == 1) {
                        $proBox.empty();
                        allCount = parseInt(res.Data.Count);
                    }
                    var d = res.Data.Rows;
                    d.forEach(function(item) {
                        var descri = '';
                        if (item.Descri) {
                            item.Descri = JSON.parse(item.Descri);
                            descri = item.Descri.text ? Base64.decode(unescape(item.Descri.text)) : '';
                        }
                        item.desc = descri;
                    });
                    $proBox.append(template(pageStr + '_products', {
                        list: d,
                        length: d.length,
                        serverAddr: $$.config.serverAddr
                    }));
                    $proBox.removeClass('loading');
                    if (pageNum * pageSize >= allCount) {
                        $proBox.addClass('loaded');
                    } else {
                        $proBox.removeClass('loaded');
                    }
                    loadComplate = true;
                } else {
                    $proBox.append(template(pageStr + '_no_products', {}));

                }
            }
        });
    }
    function resSearch() {
        pageNum = 1;
        allCount = 0;
        searchParams = {
            Keys: '',
            ProductType: -1
        }
        $page.find('>div.header').addClass('search').removeClass('result');
        $page.find('div.search-cnt').addClass('on');
        $page.find('div.result-cnt').removeClass('on');

        $page.find('i.clearCnt').hide();
        $page.find('div.searchInput >input').val('');
    }
});