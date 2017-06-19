$(function() {
	var $page = $('#test_test'),
    pageStr = 'test_test';
	/*
		选择器要加上 #文件夹名_文件名
		例：$('#文件夹名_文件名 button.button')

		所有事件绑定到 $('#文件夹名_文件名')下
		例子如下
	*/
	var WXsign=$$.getWeChatSign();
	console.log(WXsign);
	var token="ac3a80126ca557bd2a74afe5d31a1996";
	
	//通过config接口注入权限验证配置
	wx.config({
	    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: 'wx2c53034422e377cc', // 必填，公众号的唯一标识
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
	

	$("#test_test .photoBtn").click(function(){
		alert(1);
		wx.chooseImage({
		    count: 3, // 默认9
		    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
		    sourceType: [ 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		    success: function (res) {
		        var imgList = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片;
		       	var imgSrc=imgList[0];
		       	$("#test_test .img").attr("src",imgSrc);
		       	postImg();
		    }
		});
	});

	//上传图片
	function postImg(){
		$("#test_test .post").click(function(){
					
		});		
	}


	$("#test_test .locationBtn").click(function(){
		wx.getLocation({
		    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
		    success: function (res) {
		        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
		        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
		        var speed = res.speed; // 速度，以米/每秒计
		        var accuracy = res.accuracy; // 位置精度
		        wx.openLocation({
				    latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
				    longitude: longitude , // 经度，浮点数，范围为180 ~ -180。
				    name: '我的位置', // 位置名
				    address: '我的微信定位，位置精度'+accuracy, // 地址详情说明
				    scale: 24, // 地图缩放级别,整形值,范围从1~28。默认为最大
				    infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
				});
		    }
		});
	});


	
});