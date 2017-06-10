!(function(){
	if (!$$.getToken()) {
		return false;
	}
	var centerData = window.centerData || {
		hostUrl: 'http://192.168.1.110:8000',
		token: $$.getToken(),
		phoneNum: $$.getUserMobile(),//手机号
		rewardNum: $('').val(),
		getAccound: function(num) {
			$('.user_name').html(num);
		},
		reward: function(url,token) {
			$$.post(url+'/CSL/Reward/QueryRewardCount', {}, function(data) {
				data.Data = null ? data.Data : 0; 
				$('#reward').html(data.Data);
			});
		},
		accound: function(url,token) {
			$$.post(url+'/CSL/Account/QueryAccountCount', {}, function(data) {
				data.Data = null ? data.Data : 0; 
				$('#accound').html(data.Data);
			});
		},
		account: function(url,token) {
			$$.post(url+'', {}, function() {
				
			});
		},
		payment: function(url,token) {
			$$.post(url+'/CSL/Order/QueryOrderList', {}, function(data) {
				
			});
		},
		deliverGoods: function(url,token) {
			$$.post(url+'/CSL/Account/QueryAccountCount', {}, function(data) {
				
			});
		},
		goodsReceipt: function(url,token) {
			$$.post(url+'/CSL/Account/QueryAccountCount', {}, function(data) {
				
			});
		},
		assessment: function(url,token) {
			$$.post(url+'/CSL/Account/QueryAccountCount', {}, function(data) {
				
			});
		}
	};

	//获取用户登录账号
 	centerData.getAccound(centerData.phoneNum);
	//用户积分
	centerData.reward(centerData.hostUrl, centerData.token);
	//我的余额/势力币
	centerData.accound(centerData.hostUrl, centerData.token);
	
}());


