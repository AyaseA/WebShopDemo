$(function () {
    var $page = $('#icenter_applyService'),

    bodyHeight = window.innerHeight || document.body.clientHeight,
    headerHeight = $page.find('>div.header').height();
    $page.find('>div.main').height(bodyHeight - headerHeight);

    //$$.setGoBack($page.find('>div.header >a.goBack'));

    $$.setGoBack($page.find(".header a"));

    var WXsign=$$.getWeChatSign();


    wx.config({
	    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: $$.config.wxAppID, // 必填，公众号的唯一标识
	    timestamp:WXsign.timestamp , // 必填，生成签名的时间戳
	    nonceStr: WXsign.noncestr, // 必填，生成签名的随机串
	    signature: WXsign.sign,// 必填，签名，见附录1
	    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone','startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice','chooseImage','previewImage','uploadImage','downloadImage','translateVoice','getNetworkType','openLocation','getLocation','hideOptionMenu','showOptionMenu','hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem','closeWindow','scanQRCode','chooseWXPay','openProductSpecificView','addCard','chooseCard','openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});


	//通过ready接口处理成功验证
	wx.ready(function(){
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		console.log("接口处理成功");
	});

	wx.error(function(res){
		console.log("接口处理失败");
		console.log(res);
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
	});
	

	$("#icenter_applyService .camera").click(function(){
		wx.chooseImage({
		    count: 3, // 默认9
		    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
		    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		    success: function (res) {

		        var imgList = res.localIds;
		        // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片;
		       	for(var i=0;i<imgList.length;i++){
		       		var oneItem="<li><img src='"+imgList[i]+"' data-index='"+i+"'></li>";
		       		$page.find(".imgCont ul").append(oneItem);
	
		       		
		       	}

		    }
		});
	});




});