//copy的登陆页面需要删减整理
var hostUrl = $$.config.serverAddr;
//验证手机号和密码 》登陆 
var login = {
	loginphone: $('#login_input_1')[0],
	loginpassword: $('#login_input_2')[0],
	loginbtn: $('#loginin_out')[0],
	init: function(e){
	},
	//检验手机号
	checkPhone: function (phonenum) { 
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(phonenum))){ 
        	$('.login_check_pn').css('display', 'block');
            return false; 
        } else {
        	var flag1 = true;
        	$('.login_check_pn').css('display', 'none');
        	window.phonenum = phonenum;
        	window.flag1 = flag1;
        };
    }
};
//获取验证码 >延时器
$('#login_timeout').on('click', function(e){
	e.preventDefault();
	$('#cleaning_car_button').removeAttr('disabled');
	$(this).css('display','none');
	$('#login_timeclick').css({
		'display': 'block',
		'background-color': '#A6A5A7'
	});
    //延时器读秒
	var t = $('#login_timeclick span').html();
	var timer;
	function timeControl(){
		if(t <= 0){
			$('#login_timeout').css('display', 'block');
			$('#login_timeclick').css('display', 'none');
			clearInterval(timer);
		} else {
			//document.getElementById('num_delete').innerHTML = t;
			$('#num_delete').html(t);
			t--;
		}
	}
	timeControl();
	clearInterval(timer);
	timer = setInterval(timeControl, 1000); 
	//发送验证码
	var data = {
		Mobile: phonenum,
		Type: 0
	}
	$.ajax({
    	type: "post",
    	url: hostUrl + '/Product/Info/SendVerifiedCode',
    	data: data,
    	dataType: "json",
    	success: function(data) {
    		console.log('发送验证码成功');
        }
    });
})
//检验手机号是否参加过抽奖
function checkPhonenum(num) {

	var data = {
		Token: $$.getToken(),
		CampaignID: 29,
		Mobile: num
	}
	$.ajax({
	    	type: "post",
	    	url: hostUrl + '/CSL/Campaign/QueryMyDetail',
	    	data: data,
	    	dataType: "json",
	    	success: function(data) {
	    		if(data.Status === 0){
					var flag6 = false;
	    			$('.login_check_pxx').css('display', 'block');
					window.flag6 = flag6;		    			
	    		} else {
	    			var flag6 = true;
	    			window.flag6 = flag6;
	    			window.status = data.Status;
	    			$('.login_check_pxx').css('display', 'none');
	    		}	    		
	        }
	});
};
//监听手机号
login.loginphone.addEventListener('blur', function(e) {
    e.preventDefault();
    this.phone = $('#login_input_1').val();
    login.checkPhone(this.phone);
});


//监听验证码
$('#login_input_4').on('blur', function(e) {
	e.preventDefault();
	var vc = $('#login_input_4').val();
	if(/^\d{6}$/.test(vc)) {
		$('.login_check_pc').css('display', 'none')
		var flag3 = true;
		window.flag3 = flag3;		
		window.vc = vc;
	} else {
		$('.login_check_pc').css('display', 'block')
	}
});

//button支付的监听提交
$('#cleaning_car_button').on('click', function(e){
	e.preventDefault();
	checkPhonenum($$.getUserMobile());
	if(flag1 & flag3 $ flag6) {
		console.log('老用户参加');
		var data = {
			CampaignID: 29,
			TheMobile: phonenum
		}
		$.ajax({
    		type: "post",
    		url: hostUrl + '/CSL/Campaign/AddCampaignReward',
    		data: data,
    		dataType: "json",
    		success: function(data) {

			    console.log('发送成功');	
    	    },
    	    err: function(xhr){
    	    	console.log('后端返回异常');
    	    }
		});
	};
	//储存车牌号
	var carNo = $('#login_input_6').val();
	console.log(carNo);
	sessionStorage.setItem('carNo', carNo);
	$('#login_input_1').val(''); 
    $('#login_input_4').val('');
    $('#login_input_6').val('');
});
