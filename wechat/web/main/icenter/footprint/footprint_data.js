$(function() {
    var $page = $('#icenter_footprint'),
        pageStr = 'icenter_footprint';

    if ($$.isLogin(true)) {

        var token = $$.getToken();
        var url = $$.config.serverAddr;

        $.ajax({
            type: "POST",
            url: url + "CSL/ProdFoot/QueryFootList",
            data: { WToken: token ,Rows:30},
            dataType: "json",
            success: function(txt) {
                $page.find(".content").empty();
                if (txt.Status != 0) {
                    alert("接口错误");
                } else {
                    var list = txt.Data.Rows;
                    if (list.length == 0) {
                        var msg = "<div class='msg'><p>您还没有浏览过商品</p></div>";
                        $page.find(".content").append(msg);
                    } else {
                        var fisrtDate = list[0].Date;
                        var haveAppendTitle = 0;
                        var dateTitle = "<div class='dataDiv'><span class='dateinfo'>" + fisrtDate + "<span></div>";
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].Date == fisrtDate) {
                                if (haveAppendTitle == 0) {
                                    $page.find(".content").append(dateTitle);
                                    haveAppendTitle = 1;
                                }

                                var descri = JSON.parse(list[i].Descri),
                                    content = '';
                                if (descri.text) {
                                    content = Base64.decode(unescape(descri.text));
                                }
                                list[i].Img=list[i].Img||"1.png";
                                var onePiece = "<div class='oneProduct'><div class='imgContain'><img src='" + url + "Img/" + list[i].Img + "'></div><div class='contentContain'><div class='productInfo'><p>" + list[i].Name + "</p><p class='descri'>" + content + "</p><p><span class='price'>￥" + list[i].Price + "<span><button data-tid='"+list[i].ProductType+"' data-id='" + list[i].ID + "'>点击购买</button><p></div></div></div>";
                                $page.find(".content").append(onePiece);
                            } else {
                                fisrtDate = list[i].Date;
                                dateTitle = "<div class='dataDiv'><span class='dateinfo'>" + fisrtDate + "<span></div>";
                                $page.find(".content").append(dateTitle);

                                var descri = JSON.parse(list[i].Descri),
                                    content = '';
                                if (descri.text) {
                                    content = Base64.decode(unescape(descri.text));
                                }
                                list[i].Img=list[i].Img||"1.png";
                                var onePiece = "<div class='oneProduct'><div class='imgContain'><img src='" + url + "Img/" + list[i].Img + "'></div><div class='contentContain'><div class='productInfo'><p>" + list[i].Name + "</p><p class='descri'>" + content + "</p><p><span class='price'>￥" + list[i].Price + "<span><button data-tid='"+list[i].ProductType+"' data-id='" + list[i].ID + "'>点击购买</button><p></div></div></div>";
                                $page.find(".content").append(onePiece);
                                
                            }
                        }
                    }
                }
            }
        });
    }
});