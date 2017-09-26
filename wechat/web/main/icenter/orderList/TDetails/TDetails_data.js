$(function(){
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page=$("#home_TDetails"),
        pageStr="home_TDetails",
        loadBox=$page.find("div.main>div.content>div.load");
    //获取数据列表的参数
    var pageNum = 1,
        pageSize = 12,
        allCount = 0,
        loadComplate = true;
    //获取交易记录列表
    function getTDetailsList(pn,ps){
        var TDetails=$page.find("div.main div.content>ul");
        $.ajax({
            type:"POST",
            url: $$.config.serverAddr+"CSL/Account/QueryAccountList",
            data: {
                WToken:"f752165e48182cf7d02f217c694c618f13",
                N:pn,
                Rows:ps
            },
            success:function(res){
                res=JSON.parse(res);
                if (res.Status != 0) {
                    console.log('获取商品信息失败');
                    return false;
                }
                if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
                    if (pn == 1) {
                        TDetails.empty();
                        allCount = parseInt(res.Data.Count);
                    }
                    var d = res.Data.Rows;
                    TDetails.append(template(pageStr+"_listTem", {
                        list: d,
                        length: d.length
                    }));
                    loadBox.removeClass('loading');
                    if (pageNum * pageSize >= allCount) {
                        loadBox.addClass('loaded');
                    } else {
                        loadBox.removeClass('loaded');
                        loadComplate = true;
                    }

                }
            }
        })
    }
    getTDetailsList(pageNum,pageSize);
    // 懒加载获取数据
    $page.find('>div.main').scrollTop(0).scroll(function() {
        var top=$(this).scrollTop(),
            mainHeight=$page.find("div.main").height(),
            contentHeight=$page.find("div.content").height();
        if (loadComplate) {
            if (pageNum * pageSize < allCount) {
                if(contentHeight-mainHeight-top<30){
                    loadBox.addClass("loading");
                    loadComplate = false;
                    getTDetailsList(++pageNum,pageSize);
                }
            }
        } else {
            return false;
        }
    });
})
