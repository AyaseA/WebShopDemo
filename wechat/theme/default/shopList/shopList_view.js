// JavaScript Document
$(function() {
    var $page = $('#shopList_shopList'),
        pageStr = 'shopList_shopList';

    //设置内容高度    
    var contentHeight = window.innerHeight - $page.find(".header").height() - $page.find(".footer").height();
    console.log(contentHeight);
    $page.find(".content").height(contentHeight);
    $page.find(".content").css({ position: "absolute", top: $page.find(".header").height() + "px", left: 0, width: "100%" });

    //底部导航时间
    $page.on('click', 'div.footer li', function() {
        var type = $(this).attr('data-tab');
        switch (type) {
            case 'index':
                {
                    // 首页
                    $$.redirect('index/index.html');
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
                    $$.redirect('luckyDraw/luckyDraw.html');
                }
                break;
            case 'center':
                {
                    // 个人中心
                    $$.redirect('pageHome/pageHome.html');
                }
                break;
        }
    });


    $page.on("click", ".onepiece", function() {
        $$.redirect("shopDetail/shopDetail.html");
    });

    // 获取地理位置
    wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function(res) {
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            var speed = res.speed; // 速度，以米/每秒计
            var accuracy = res.accuracy; // 位置精度
            geocoder2Address([+longitude + 0.006, latitude]);
        }
    });
    // layer
    function loactionConfirm(name, callback) {
        layer.open({
            area: '80%',
            shade: 0.3,
            title: false, //不显示标题栏
            closeBtn: false,
            btn: [],
            id: 'shopList_shopList_confirm',
            content: template('shopList_shopList_confirm_cnt', {
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

        //关闭模态窗口方法  
        function colse() {
            bodyMirror.onclick = function() {
                $page.find("#shopList_selectModal").fadeOut(300);
                removeMirror();
            };
        }

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
            }
        }

        //汽车服务二级tab
        //  var navTitle2=document.getElementById("navTitle2");
        //  var selectList2=navTitle2.children;
        //  var serviceList=document.getElementById("serviceList");
        //  var serviceListDiv=serviceList.children;
        //  for(var i=0;i<selectList2.length;i++){
        //      selectList2[i].index=i;
        //      selectList2[i].onclick=function(){
        //          for(var j=0;j<serviceListDiv.length;j++){
        //                  selectList2[j].className="";
        //                  serviceListDiv[j].className="ccOff";
        //              }
        //              selectList2[this.index].className="ctOn";
        //              serviceListDiv[this.index].className="ccOn";
        //          }   
        //      }

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