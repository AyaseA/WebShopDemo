$(function() {
    var $page = $("#icenter_appointServer"),
    getUrl;

    var contentHeight = window.innerHeight - $page.find(".header").height();
    $page.find(".content").height(contentHeight);

    $page.find(".selectStore .selectDetail").html('<img src="images/common/right.png"><span>请选择服务门店</span>');
    $page.find(".selectDate .selectDetail").html('<img src="images/common/right.png"><span>请选择服务时间</span>');
    $page.find(".storeInfo").css("top","0vw");
    $page.find(".dateInfo").css("top","-122vw");

    var sid = $$.getQueryString("sid"),
        pid = $$.getQueryString("pid"),
        storeid = $$.getQueryString("storeid"),
        stype = $$.getQueryString("stype"),
        atype = $$.getQueryString("atype"),
        acont = $$.getQueryString("acont");

    var locationInfo = $$.getLocationInfo();
    //购买服务选择店面
    if (storeid != 0) {
        $page.find(".selectStore").hide();
    } else {
        $page.find(".selectStore").show();
    }

    //可以上传照片数量
    window.photoNum = 3;
    //配置微信签名
    var WXsign = $$.getWeChatSign(1);
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: $$.config.wxAppID, // 必填，公众号的唯一标识
        timestamp: WXsign.timestamp, // 必填，生成签名的时间戳
        nonceStr: WXsign.noncestr, // 必填，生成签名的随机串
        signature: WXsign.sign, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });


    //通过ready接口处理成功验证
    wx.ready(function() {});

    wx.error(function(res) {});

    //店面出现事件
    $page.off("click", ".selectStore .selectDetail").on("click", ".selectStore .selectDetail", function() {
        $page.find(".storeInfo").animate({ top: "-124vw" }, 500);
        $page.find(".dateInfo").css( "top", "-122vw" );
    });

    //点击店面隐藏事件
    $page.off("click", ".selectTitle img").on("click", ".selectTitle img", function() {
        $page.find(".storeInfo").animate({ top: "0vw" }, 500);
    });

    //时间出现事件
    $page.off("click", ".selectDate .selectDetail").on("click", ".selectDate .selectDetail", function() {
        $page.find(".dateInfo").animate({ top: "-226vw" }, 500);
        $page.find(".storeInfo").css( "top", "0vw");
    });

    //点击时间隐藏事件
    $page.off("click", ".dateTitle img").on("click", ".dateTitle img", function() {
        $page.find(".dateInfo").animate({ top: "-122vw" }, 500);
    });

    // 选择店面
    $page.off('click', '.storeContent .item').on('click', '.storeContent .item', function() {
        if (!$(this).hasClass('checked')) {
            $(this).addClass('checked').siblings().removeClass('checked');
        }

        $page.find(".storeConfirm").css("background-color", "#f60");
    });

    //选择时间
    $page.off('click', '.dateContent span.am, .dateContent span.pm').on('click', '.dateContent span.am, .dateContent span.pm', function() {
        $page.find('.dateContent span.am, .dateContent span.pm').removeClass('selected');
        $(this).addClass('selected');
    });

    //选择确认服务商店
    $page.off("click", ".storeConfirm").on("click", ".storeConfirm", function() {
        if ($page.find(".storeContent .checked").length != 0) {
            var selectName = $($page.find(".storeContent .checked")[0]).attr("data-name");
            var selectSid = $($page.find(".storeContent .checked")[0]).attr("data-store-id");
            $page.find(".selectStore .selectDetail span").text(selectName);
            $page.find(".selectStore .selectDetail span").attr("data-store-id", selectSid);
            $page.find(".storeInfo").animate({ top: "0vw" }, 500);
        }
    });

    //选择确认服务时间
    $page.off("click", ".dateConfirm").on("click", ".dateConfirm", function() {
        var selectDate = $($page.find(".dateContent .item .selected")[0]).attr("data-date");
        var selectTime = $($page.find(".dateContent .item .selected")[0]).attr("data-time");
        $page.find(".selectDate .selectDetail span").text(selectDate + "  " + selectTime);
        //修改
        var APtime=((selectTime.split(":")[0]-8)*60*60)+$$.get10Time(selectDate);
        $page.find(".selectDate .selectDetail span").attr("data-time",APtime);
        //修改end
        $page.find(".selectDate .selectDetail span").attr("data-date", selectDate);
        $page.find(".dateInfo").animate({ top: "-122vw" }, 500);
    });

    //选择照片/拍照
    $page.off("click", ".photo").on("click", ".photo", function(e) {
        if (window.photoNum != 0) {
            wx.chooseImage({
                count: window.photoNum, // 默认9
                sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                    $page.imgList = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片;
                    for (var i = 0; i < $page.imgList.length; i++) {
                        var oneItem = "<div class='photolist'><img src='" + $page.imgList[i] + "' data-index='" + i + "' class='reserve'><div class='close'><img src='images/common/round_close.png' data-index='" + i + "'></div></div>";
                        $page.find(".camera").append(oneItem);
                    }
                    window.photoNum -= $page.imgList.length;
                    //删除照片
                }
            });
        } else {
            layer.msg("最多上传3张图片");
        }

    });

    //查看删除照片
    $page.off("click", ".close img").on("click", ".close img", function() {
        var _this = $(this);
        layer.confirm("确定要删除此照片吗", function(index) {
            _this.parent().parent().remove();
            window.photoNum += 1;
            layer.close(index);
        });
    });

    //提交预约信息
    $page.off("click", ".sumbit").on("click", ".sumbit", function() {
        if (needChooseStore()) {
            layer.msg("请选择预约门店");
        } else if (!$page.find(".selectDate .selectDetail span").attr("data-date")) {
            layer.msg("请选择预约时间");
        } else {
            var appointSid;
            if (storeid != 0) {
                appointSid = storeid;
            } else {
                appointSid = $page.find(".selectStore .selectDetail span").attr("data-store-id");
            }

            $$.post("CSL/Appointment/AddAppoint", {
                    ServiceID: sid,
                    Platform: 10,
                    Descri: $page.find(".serverDetail textarea").val(),
                    AppointDate: $$.get10Time($page.find(".selectDate .selectDetail span").attr("data-date")),
                    StoreID: appointSid,
                    AppointTimeS:$page.find(".selectDate .selectDetail span").attr("data-time")
                },
                function() {
                    layer.msg("服务预约成功");
                    $$.redirect("icenter/appointmentList.html");
                }
            );
        }
    });
    function amOrPm(){

    }
    //获取有此服务的店面
    if(stype == 1){
        $$.post("Product/StoreService/QueryMapByProductServiceID", {
            N: 1,
            Rows: 9999,
            ProductServiceID: pid,
            LL:""+(locationInfo ? locationInfo.longitude : 117.1330654621) +","+ (locationInfo ? locationInfo.latitude : 36.6875642852)
        }, function(txt) {
            if (txt.Status == 0) {
                var d = txt.Data.Rows;
                $page.find('.storeContent').html(template('icenter_appointServer_store_items', {
                    stores: d,
                    isService:1
                }));
            }
        });
    }else{
        $$.post("Product/Store/QueryStoreList",{
            LL:""+(locationInfo ? locationInfo.longitude : 117.1330654621) +","+ (locationInfo ? locationInfo.latitude : 36.6875642852),
            Rows:100,
            Type:-1,
        },function(txt){
            if (txt.Status == 0) {
                var d = txt.Data.Rows;
                $page.find('.storeContent').html(template('icenter_appointServer_store_items', {
                    stores: d,
                    isService:0
                }));
            }
        });
    }
    if(atype != 6){
        geturl = "Product/Info/QueryCalendarList?type=" + atype;
    } else {
        geturl = "Product/Info/QueryCalendarList?type=" + atype + "&date=" + acont;
    }

    $$.get(geturl,function(txt){
        var timeArr = new Array();
        $.each(txt.Data,function(i,data){
            timeArr.push(
              {
                  date:data.date,
                  weekdate:data.date.split("-")[1] + "-" + data.date.split("-")[2] +"(周" + data.week + ")"
              });
        });
        $page.find('.dateContent').html(template('icenter_appointServer_time_list', {
            list: timeArr
        }));
    });

    //获取时间信息
    // getAppointTime(function(timeArr) {
    //     $page.find('.dateContent').html(template('icenter_appointServer_time_list', {
    //         list: timeArr
    //     }));
    // });

    // 计算预约时间
    // function getAppointTime(callback) {
    //     var timeArr = [];
    //     for (var i = 1; i <= 30; i++) {
    //         timeArr.push(
    //             getDateFromCurrentDate(i)
    //         );
    //     }
    //     callback(timeArr);
    // }
    //
    // function getDateFromCurrentDate(dayInterval) {
    //     var curDate = new Date();
    //     curDate.setDate(curDate.getDate() + dayInterval);
    //     var year = curDate.getFullYear();
    //     var month = (curDate.getMonth() + 1) < 10 ? "0" + (curDate.getMonth() + 1) : (curDate.getMonth() + 1);
    //     var day = curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate();
    //     return year + "-" + month + "-" + day;
    // }

    function needChooseStore() {
        if (storeid != 0) {
            return false;
        } else {
            if($page.find(".selectStore .selectDetail span").attr("data-store-id")){
                return false;
            }else{
                return true;
            }
        }
    }

});
