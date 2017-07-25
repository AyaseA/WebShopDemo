// JavaScript Document
$(function() {
    var bodyH = window.innerHeight || document.body.clientHeight,
        $page = $('#shop_shopList'),
        pageStr = 'shop_shopList',
        headerH = $page.find(">div.header").height(),
        selectorH = 47, //$page.find('>div.selectShop').height(),
        footerH = $page.find(">div.footer").height();

    //设置内容高度    
    $page.find(">div.shopList").css({
        'height': bodyH - headerH - selectorH - footerH - 1,
    });

    var locationInfo=$$.getLocationInfo();

    //底部导航时间
    $page.on('click', 'div.footer li', function() {
        var type = $(this).attr('data-tab');
        switch (type) {
            case 'index':
                {
                    // 首页
                    $$.redirect('home/index.html');
                }
                break;
            case 'carCrv':
                {
                    // 服务网点

                }
                break;
            case 'activity':
                {
                    // 活动
                    $$.redirect('home/product.html?pid=7');
                }
                break;
            case 'center':
                {
                    // 个人中心
                    $$.redirect('icenter/pageHome.html');
                }
                break;
        }
    });


    $page.on("click", ".onepiece", function() {
        $$.redirect("shop/shopDetail.html?ID=" + $(this).attr("data-ID"));
    });

    // layer
    function loactionConfirm(name, callback) {
        layer.open({
            area: '80%',
            shade: 0.3,
            title: false, //不显示标题栏
            closeBtn: false,
            btn: [],
            id: 'shop_shopList_confirm',
            content: template('shop_shopList_confirm_cnt', {
                dist: name
            }),
            success: function(modal) {
                modal.css({
                    'border-radius': '8px'
                });
                modal.find('.layui-layer-btn').remove();
                modal.find('button.cancel').off('click').on('click', function() {
                    layer.closeAll();
                });
                modal.find('button.change').off('click').on('click', function() {
                    if (callback) {
                        callback();
                    }
                    layer.closeAll();
                });
            }
        });
    }

    function overText(node, num) {
        if (node.length > num) {
            return node.substring(0, num) + "..";
        } else {
            return node;
        }
    }

    // 经纬度-->地址
    function geocoder2Address(geocodeArr) {
        var geocoder = new AMap.Geocoder();
        geocoder.getAddress(geocodeArr, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                var info = result.regeocode.addressComponent,
                    ltInfo = $$.getLocationInfo();
                //alert(ltInfo && ltInfo.id != info.adcode);
                if (ltInfo && ltInfo.id != info.adcode) {
                    loactionConfirm(info.district, function() {
                        $$.setLocationInfo({
                            name: info.district,
                            longitude: geocodeArr[0],
                            latitude: geocodeArr[1],
                            id: info.adcode
                        });
                        $page.find('>div.header >a.location >span').text(
                            info.district
                        );
                    });
                }
            }
        });
    }

    function getGreatCircleDistance(lat1, lng1, lat2, lng2) {
        var EARTH_RADIUS = 6378137.0; //单位M
        var PI = Math.PI;

        function getRad(d) {
            return d * PI / 180.0;
        }
        var radLat1 = getRad(lat1);
        var radLat2 = getRad(lat2);

        var a = radLat1 - radLat2;
        var b = getRad(lng1) - getRad(lng2);

        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000000;
        km = s.toFixed(2);
        return (km + "km");
    }

    window.n = 1;

    function reSetAttr() {
        $page.find(".shopList").empty();
        n = 1;
    }
    //加载商户信息
    function loadStore(Data, scrollArea) {
        var _this = this;
        _this.Data = Data;
        _this.loadfoot = false;
        $.ajax({
            type: "POST",
            url: "http://api.cheshili.com.cn/Product/Store/QueryStoreList",
            data: _this.Data,
            dataType: "json",
            success: function(txt) {
                if (txt.Status == 0 && parseInt(txt.Data.Count) > $(".onepiece").length) {

                    var data = txt.Data.Rows;
                    var shoplist = "";
                    for (var i = 0; i < data.length; i++) {
                        var distance = getGreatCircleDistance(locationInfo?locationInfo.latitude:36.6875642852, locationInfo?locationInfo.longitude:117.1330654621, data[i].Latitude, data[i].Longitude);
                        shoplist = '<div class="onepiece" data-ID="' + data[i].ID + '"><img src="http://api.cheshili.com.cn/Img/' + (data[i].Img || "0.png") + '"><div class="shopInfo"><h2>' + data[i].Name + '</h2><p>' + overText(data[i].Address, 10) + '<span class="fr">' + distance + '</span></p><p>服务数量:<span class="red">' + (data[i].WDeviceNum || 0) + '</span><span class="fr">' + (data[i].Mobile || "无") + '</span></p></div></div>';
                        $(scrollArea).append(shoplist);
                    }

                    if (parseInt(txt.Data.Count) < 10) {
                        $(scrollArea).append("<div class='notice'>没有更多数据了</div>");
                        _this.loadfoot = true;
                    } else {
                        _this.Data.N += 1;
                        loadComplete = true;

                        $(scrollArea).scroll(function() {
                            var scrollTop = $(scrollArea).scrollTop() + $(scrollArea).height();
                            var scrollHeight = $(scrollArea)[0].scrollHeight;
                            if (scrollHeight - scrollTop < 10 && loadComplete) {
                                loadComplete = false;
                                loadStore(_this.Data, scrollArea);
                            }
                        });
                    }

                } else {
                    if (!_this.loadfoot) {
                        $(scrollArea).append("<div class='notice'>没有更多数据了</div>");
                    }
                }
            }
        });
    }

    loadStore({N:1}, "#shop_shopList .shopList");
    //3级联动筛选
    //点击区域
    $("#shopList_positionS").on("click", "li", function() {
        if ($(this).attr("data-type") == 0) {
            if ($("#shopList_orderBy .orderOn").attr("data-type") == 31) {
                reSetAttr();
                loadStore({ Type: $("#shopList_carT ul .cccOn").attr("data-type"), N: n, LL: "117.1330654621,36.6875642852" }, "#shop_shopList .shopList");
            } else {
                reSetAttr();
                loadStore({ Type: $("#shopList_carT ul .cccOn").attr("data-type"), N: n }, "#shop_shopList .shopList");
            }
        } else {
            if ($("#shopList_orderBy .orderOn").attr("data-type") == 31) {
                reSetAttr();
                loadStore({ Type: $("#shopList_carT ul .cccOn").attr("data-type"), N: n, CountyID: $(this).attr("data-type"), LL: "117.1330654621,36.6875642852" }, "#shop_shopList .shopList");
            } else {
                reSetAttr();
                loadStore({ Type: $("#shopList_carT ul .cccOn").attr("data-type"), N: n, CountyID: $(this).attr("data-type") }, "#shop_shopList .shopList");
            }
        }
    });


    //点击属性排序
    $("#shopList_carT").on("click", "li", function() {
        if ($("#shopList_area ul .positionOn").attr("data-type") == 0) {
            if ($("#shopList_orderBy .orderOn").attr("data-type") == 31) {
                reSetAttr();
                loadStore({ Type: $(this).attr("data-type"), N: n, LL: "117.1330654621,36.6875642852" }, "#shop_shopList .shopList");
            } else {
                reSetAttr();
                loadStore({ Type: $(this).attr("data-type"), N: n }, "#shop_shopList .shopList");
            }
        } else {
            if ($("#shopList_orderBy .orderOn").attr("data-type") == 31) {
                reSetAttr();
                loadStore({ Type: $(this).attr("data-type"), N: n, CountyID: $("#shopList_positionS ul .positionOn").attr("data-type"), LL: "117.1330654621,36.6875642852" }, "#shop_shopList .shopList");
            } else {
                reSetAttr();
                loadStore({ Type: $(this).attr("data-type"), N: n, CountyID: $("#shopList_positionS ul .positionOn").attr("data-type") }, "#shop_shopList .shopList");
            }
        }
    });

    //点击距离排序
    $("#shopList_orderBy").on("click", "li", function() {
        if ($(this).attr("data-type") == 31) {
            if ($("#shopList_area ul .positionOn").attr("data-type") == 0) {
                reSetAttr();
                loadStore({ Type: $("#shopList_carT ul .cccOn").attr("data-type"), N: n, LL: "117.1330654621,36.6875642852" }, "#shop_shopList .shopList");
            } else {
                reSetAttr();
                loadStore({ Type: $("#shopList_carT ul .cccOn").attr("data-type"), N: n, LL: "117.1330654621,36.6875642852", CountyID: $("#shopList_positionS ul .positionOn").attr("data-type") }, "#shop_shopList .shopList");
            }
        } else if ($(this).attr("data-type") == 30) {
            if ($("#shopList_area ul .positionOn").attr("data-type") == 0) {
                reSetAttr();
                loadStore({ Type: $("#shopList_carT ul .cccOn").attr("data-type"), N: n }, "#shop_shopList .shopList");
            } else {
                reSetAttr();
                loadStore({ Type: $("#shopList_carT ul .cccOn").attr("data-type"), N: n, CountyID: $("#shopList_positionS ul .positionOn").attr("data-type") }, "#shop_shopList .shopList");
            }
        }
    });

    //点击弹出模态窗口
    //弹出滤镜层    
    function loadEvent() {
        function makeMirror() {
            bodyMirror = document.createElement("div");
            bodyMirror.style.position = "absolute";
            bodyMirror.style.top = "0px";
            bodyMirror.style.left = "0px";
            bodyMirror.style.background = "#000";
            bodyMirror.style.width = "100%";
            bodyMirror.style.height = "100%";
            bodyMirror.style.opacity = "0.50";
            bodyMirror.style.zIndex = 9;
            document.body.appendChild(bodyMirror);
        }

        //删除滤镜层
        function removeMirror() {
            setTimeout(function() {
                document.body.removeChild(bodyMirror);
            }, 300);
        }


        //点击此单进入相应的选项
        function onNav(x, y) {
            var navTitle = document.getElementById("shopList_navTitle");
            var selectList = navTitle.children;
            var selectContent = document.getElementById("shopList_selectContent");
            var contentList = selectContent.children;

            document.getElementById("" + y).className = "tOn";
            for (var i = 0; i < contentList.length; i++) {
                contentList[i].className = "cOff";
                selectList[i].className = "tOff";
            }
            document.getElementById("" + x).className = "cOn";
            document.getElementById("" + y).className = "tOn";
        }


        //关闭模态窗口方法  
        function colse() {
            bodyMirror.onclick = function() {
                $page.find("#shopList_selectModal").fadeOut(300);
                removeMirror();
            };
        }


        //点击选项事件
        $page.find("#shopList_mainPostion").click(function() {
            $page.find("#shopList_selectModal").fadeIn(300);
            makeMirror();
            onNav("shopList_positionS", "shopList_positionMsg");
            colse();
        });

        $page.find("#shopList_mainService").click(function() {
            $page.find("#shopList_selectModal").fadeIn(300);
            makeMirror();
            onNav("shopList_carT", "shopList_serviceMsg");
            colse();
        });

        $page.find("#shopList_mainOrder").click(function() {
            $page.find("#shopList_selectModal").fadeIn(300);
            makeMirror();
            onNav("shopList_orderBy", "shopList_orderMsg");
            colse();
        });



        //一级tab
        var selectModal = document.getElementById("shopList_selectModal");
        var navTitle = document.getElementById("shopList_navTitle");
        var selectList = navTitle.children;
        var selectContent = document.getElementById("shopList_selectContent");
        var contentList = selectContent.children;
        for (var i = 0; i < selectList.length; i++) {
            selectList[i].index = i;
            selectList[i].onclick = function() {
                for (var j = 0; j < contentList.length; j++) {
                    selectList[j].className = "tOff";
                    contentList[j].className = "cOff";
                }
                selectList[this.index].className = "tOn";
                contentList[this.index].className = "cOn";
            };
        }

        //列表选项点击事件  
        $page.find("#shopList_area li").click(function() {
            $page.find("#shopList_area li").removeClass("positionOn");
            $(this).addClass("positionOn");
            var msg = $(this).html();
            $page.find("#shopList_positionMsg").html(msg);
            $page.find("#shopList_mainPMsg").html(msg);
            $page.find("#shopList_selectModal").fadeOut(300);
            removeMirror();
        });

        $page.find("#shopList_carT li").click(function() {
            $page.find("#shopList_carT li").removeClass("cccOn");
            $(this).addClass("cccOn");
            var msg = $(this).html();
            var msg = msg;
            $page.find("#shopList_serviceMsg").html(msg);
            $page.find("#shopList_mainSMsg").html(msg);
            $page.find("#shopList_selectModal").fadeOut(300);
            removeMirror();
        });

        $page.find("#shopList_orderBy ul li").click(function() {
            $page.find("#shopList_orderBy ul li").removeClass("orderOn");
            $(this).addClass("orderOn");
            var msg = $(this).html();
            $page.find("#shopList_orderMsg").html(msg);
            $page.find("#shopList_mainOMsg").html(msg);
            $page.find("#shopList_selectModal").fadeOut(300);
            removeMirror();
        });
    }
    loadEvent();

});