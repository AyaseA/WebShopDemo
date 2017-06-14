
	$$.config.hideGlobalMenu();
	var hostUrl = 'http://192.168.1.110:8000';
	//登陆页面
	
	//获取验证码 >延时器
	$('#login_timeout').off('click').on('click', function(e){
		e.preventDefault();
		$('#loginin_out').css('background-color', '#EA5513');
		$('#loginin_out').removeAttr('disabled');
		$('#login_redit').css('background-color', '#EA5513');
		$('#login_redit').removeAttr('disabled');
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
	    	url: hostUrl+'/Product/Info/SendVerifiedCode',
	    	data: data,
	    	dataType: "json",
	    	success: function(data) {
	    		console.log('发送验证码成功');
	        }
	    });
	})
	//增加用户URL: http://192.168.1.110:8000/swagger-ui/index.html?Area=CSL
	//验证手机号和密码 》登陆 
	var login = {
		/*phone: $('#login_input_1').val(),
		password: $('#login_input_2').val(),*/
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
	        	$('#login_pass').css('background-color', '#EA5513');
	        	$('#login_pass').removeAttr('disabled');
	        	$('.login_check_pn').css('display', 'none');
	        	window.phonenum = phonenum;
	        	window.flag1 = flag1;
	        };
	
	    },
	    //检验密码
	    checkPassword: function(checkPassword) {
	    	var passwordReg = /^[A-Za-z0-9]{6,20}$/;
	    	if (!passwordReg.test(checkPassword)) { 
	    		$('.login_check_pw').css('display', 'block');
	    	    return false; 
	    	} else {
	    		var flag2 = true;
	    		$('.login_check_pw').css('display', 'none');
	    		window.checkPassword = checkPassword;
	    		window.flag2 = flag2;
	    	};
	    },
	    //异步提交所有数据
		loginLand: function() {
			var SessionID = sessionStorage.getItem("key");
			var data = {
				Mobile: phonenum,
				Password: checkPassword,
				SessionID: SessionID,
				VC: vc
			}
			console.log(vc)
			if (flag1 & flag2) {
				$.ajax({
	                type: "post",
	                url: hostUrl+"/CSL/Login/RegisterUser",
	                data: data,
	                dataType: "json",
	                success: function(data){
	                	if(data.Data.Token) {
	            			$$.setToken(data.Data.Token);
	                	}
	    	    		$$.goBack();
	                    console.log('发送成功');        
	                }
	            });
			} else {
				console.log('这个bug找YangCunYa')
			}
		}
	
	};
	//SessionID的生成
	!(function(n){
		var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		var res = '';
		for (var i = n; i > 0; i--) {
			var id = Math.ceil(Math.random() * 35);
	        res += chars[id];
		};
		sessionStorage.setItem("key", res);
	}(100));	
	//监听手机号
	login.loginphone.addEventListener('blur', function(e) {
	    e.preventDefault();
	    this.phone = $('#login_input_1').val();
	    login.checkPhone(this.phone);
	});
	//监听密码
	login.loginpassword.addEventListener('blur', function(e) {  
	    e.preventDefault();
	    this.password = $('#login_input_2').val();
	    login.checkPassword(this.password);
	});
	//监听密码重置
	$('#login_input_3').off('click').on('blur', function(e){
		e.preventDefault();
		var reset = $('#login_input_3').val();
		var passwordReg = /^[A-Za-z0-9]{6,20}$/;
		if(passwordReg.test(reset)) {
			$('.login_check_pw').css('display', 'none')
			var flag4 = true;
			window.flag4 = flag4;		
			window.reset = reset;
		} else {
			$('.login_check_pw').css('display', 'block')
		}
	})
	//监听验证码
	$('#login_input_4').off('click').on('blur', function(e) {
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
	//注册并登陆的监听提交
	login.loginbtn.addEventListener('click', function(e){  
	    e.preventDefault();
	    login.loginLand();
		console.log("注册并登陆成功")
		
	});
	//登陆的监听提交
	$('#login_pass').off('click').on('click', function(e) {
		e.preventDefault();
		if($('#login_input_2').val() === '') {
			$('.login_check_pw').css('display', 'block');
		} else {
			$('.login_check_pw').css('display', 'none');
		};
		var SessionID = sessionStorage.getItem("key");
		var data = {
			Mobile: phonenum,
			Password: checkPassword,
			SessionID: SessionID
		};
		if (flag1 & flag2) {
			$.ajax({
	            type: "post",
	            url: hostUrl+"/CSL/Login/LG",//Todo
	            data: data,
	            dataType: "json",
	            success: function(data) {
	    	    	if(data.Data.Token){
	    				$$.setToken(data.Data.Token);
	    	    	}
	    	    	$$.goBack();
	                console.log('登陆信息发送成功');        
	            }
	        });
		} else {
			console.log('这个bug找YangCunYa')
		}		
	});
	//修改并登陆的监听提交
	$('#login_redit').off('click').on('click', function(e) {
		e.preventDefault();
		var data = {
			Mobile: phonenum,
			NewPwd: reset,
			VC: vc,
		};
		if (flag1 & flag3 & flag4) {
			$.ajax({
	            type: "post",
	            url: hostUrl+"/CSL/Login/ResetPwdByPhone",//Todo
	            data: data,
	            dataType: "json",
	            success: function(data){
	    	    	if(data.Data.Token){
	    				$$.setToken(data.Data.Token);
	    	    	};
	    	    	$$.goBack();
	    	    	console.log('修改密码并登陆成功');        
	            }
	        });
		} else {
			console.log('这个bug找YangCunYa');
		}		
	});

