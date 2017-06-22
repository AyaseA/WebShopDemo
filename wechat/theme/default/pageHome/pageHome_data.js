!(function(){
	if ($$.isLogin(true)) {
		var token = $$.getToken();
		var centerData = window.centerData || {
			hostUrl: $$.config.serverAddr,
			token: $$.getToken(),
			phoneNum: $$.getUserMobile(),//手机号
			rewardNum: $('').val(),
			getAccound: function(num) {
				$('.user_name').html(num);
			},
			reward: function(url,token) {
				$$.post(url+'/CSL/Reward/QueryRewardCount', {}, function(data) {
					console.log(data.Data);
					data.Data == 'Not login!' ? 0 : data.Data; 
					$('#reward').html(data.Data);
				});
			},
			accound: function(url,token) {
				$$.post(url+'/CSL/Account/QueryAccountCount', {}, function(data) {
					data.Data == 'Not login!' ? 0 : data.Data; 
					$('#accound').html(data.Data);
				});
			},
			account: function(url,token) {
				$$.post(url+'', {}, function() {
					
				});
			},
			payment: function(url,token) {
				$$.post(url+'/CSL/Order/QueryStatusCount', {Token: token,StatusID: 1}, function(data) {
					data.Data == 'Not login!' ? 0 : data.Data;
					$('#payment').html(data.Data);
				});
			},
			deliverGoods: function(url,token) {
				$$.post(url+'/CSL/Order/QueryStatusCount', {Token: token,StatusID: 2}, function(data) {
					data.Data == 'Not login!' ? 0 : data.Data;
					$('#deliverGoods').html(data.Data);
				});
			},
			goodsReceipt: function(url,token) {
				$$.post(url+'/CSL/Order/QueryStatusCount', {Token: token,StatusID: 4}, function(data) {
					data.Data == 'Not login!' ? 0 : data.Data;
					$('#goodsReceipt').html(data.Data);
				});
			},
			assessment: function(url,token) {
				$$.post(url+'/CSL/Order/QueryStatusCount', {Token: token,StatusID: 6}, function(data) {
					data.Data == 'Not login!' ? 0 : data.Data;
					$('#assessment').html(data.Data);
				});
			}
		};
		//获取头像
		var resImg = $$.getUserInfo();
		resImg.Img === null ? "./images/center/address_book.png" : resImg.Img;
		if(resImg.Img) {
			alert(resImg.Img);
		}	
		$('#pageHome_pageHome .img_icon').attr('src', resImg.Img);
		//获取用户登录账号
	 	centerData.getAccound(centerData.phoneNum);
		//用户积分
		centerData.reward(centerData.hostUrl, token);
		//我的余额/势力币
		centerData.accound(centerData.hostUrl, token);
		//待发货
		centerData.payment(centerData.hostUrl, token);
		//待付款
		centerData.deliverGoods(centerData.hostUrl, token);
		//待收货
		centerData.goodsReceipt(centerData.hostUrl, token);
		//待评价
		centerData.assessment(centerData.hostUrl, token);
		//我的收藏
		//关注的店面
		//我的足迹
	}
}());


