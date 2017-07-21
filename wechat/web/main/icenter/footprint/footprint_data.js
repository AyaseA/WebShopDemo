$(function() {
    var $page = $('#icenter_footprint'),
        pageStr = 'icenter_footprint';

    //var token = "eyJVc2VySUQiOiI0MCIsIk5pY2tOYW1lIjpudWxsLCJHcm91dGhWYWx1ZSI6bnVsbCwiVXNlckFkZHJlc3NJRCI6bnVsbCwiQWRkVGltZSI6IjE0OTczMzkzODgiLCJVc2VyQ2FySUQiOm51bGwsIkltZyI6bnVsbCwiRW5hYmxlIjoiMSIsIkludml0ZUNvZGUiOiJNRFF3IiwiTW9iaWxlIjoiMTUwNjY2NzAzMjAiLCJTZXNzaW9uSUQiOiIxIiwiVHlwZSI6IlVzZXIiLCJVSUQiOiI3MzNlY2VmZGU4MzcwNzU5ZmU5NmQ2OTNmNTE1OGFiYiJ9";
    if ($$.isLogin(true)) {

        var token = $$.getToken();
        var url = $$.config.serverAddr;

        $.ajax({
            type: "POST",
            url: url + "CSL/ProdFoot/QueryFootList",
            data: { WToken: token },
            success: function(txt) {
                $page.find(".content").empty();
                txt = $$.eval(txt);
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
                                $.ajax({
                                    type: "POST",
                                    url: url + "Product/Prod/QueryDetail",
                                    data: { "ID": list[i].ID },
                                    async: false,
                                    success: function(txt) {

                                        productInfo = $$.eval(txt).Data;
                                        if (productInfo.Img == "") {
                                            productInfo.Img = "NoImg/" + Math.random() + ".jpg";
                                        }

                                        var descri = productInfo.Descri,
                                            content = '';
                                        if (descri) {
                                            descri = JSON.parse(descri);
                                            content = Base64.decode(unescape(descri.text));
                                        }

                                        var onePiece = "<div class='oneProduct'><div class='imgContain'><img src='" + url + "Img/" + productInfo.Img + "'></div><div class='contentContain'><div class='productInfo'><p>" + productInfo.Name + "</p><p class='descri'>" + content + "</p><p><span class='price'>￥" + productInfo.Price + "<span><button data-id='" + productInfo.ID + "'>点击购买</button><p></div></div></div>";
                                        $page.find(".content").append(onePiece);
                                    }
                                });
                            } else {
                                fisrtDate = list[i].Date;
                                dateTitle = "<div class='dataDiv'><span class='dateinfo'>" + fisrtDate + "<span></div>";
                                $page.find(".content").append(dateTitle);
                                $.ajax({
                                    type: "POST",
                                    url: url + "Product/Prod/QueryDetail",
                                    async: false,
                                    data: { "ID": list[i].ID },
                                    success: function(txt) {

                                        productInfo = $$.eval(txt).Data;

                                        var descri = productInfo.Descri,
                                            content = '';
                                        if (descri) {
                                            descri = JSON.parse(descri);
                                            content = Base64.decode(unescape(descri.text));
                                        }

                                        var onePiece = "<div class='oneProduct'><div class='imgContain'><img src='" + url + "Img/" + productInfo.Img + "'></div><div class='contentContain'><div class='productInfo'><p>" + content + "</p><p class='descri'>" + content + "</p><p><span class='price'>￥" + productInfo.Price + "<span><button data-id='" + productInfo.ID + "'>点击购买</button><p></div></div></div>";
                                        $page.find(".content").append(onePiece);
                                    }
                                });
                            }
                        }
                    }
                }
            }
        });
    }

});