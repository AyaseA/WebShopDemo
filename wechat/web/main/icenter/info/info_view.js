$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#icenter_info'),
    	pageStr = 'icenter_info',
    	headerHeight = $page.find('>div.header').height();
    // 设置高度
    $page.find('>div.main').height(bodyHeight - headerHeight);
    // 设置返回按钮可用
    $$.setGoBack($page.find('>div.header >a.goBack'));

    
    $page.find(".name").click(function(){
        $page.find(".name span").html("<input class='nameform' max-length='7'>");
        $page.find(".nameform").focus();
    });

    $page.on("blur",".nameform",function(){
        if(!$page.find(".nameform").val()){
            layer.msg("名称不能为空");
            $page.find(".nameform").focus();
        }else if($page.find(".nameform").val().length > 6){
            layer.msg("输入名称过长");
            $page.find(".nameform").focus();
        }else{
            $$.post("CSL/User/UpdateNickName",{
                RealName:$page.find(".nameform").val()
            },function(txt){
                layer.msg("名称修改成功");
                $page.find(".name span").html($page.find(".nameform").val());
            });
        }
    });
    
    $page.on('click', 'div.sex', function() {
        $page.find('div.mask').fadeIn(200).find('>div').animate({
            'height': 160
        }, 200);
        $page.find('a.option1').text('男').attr('data-id', '1').attr('data-type', 'sex');
        $page.find('a.option2').text('女').attr('data-id', '0').attr('data-type', 'sex');
    });

    $page.on('click', 'div.address', function() {
        $$.redirect('home/address.html');
    });

});