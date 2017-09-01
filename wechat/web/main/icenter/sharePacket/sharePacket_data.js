$(function() {
    $page = $("#icenter_sharePacket");

    $$.config.hideGlobalMenu();

    var packageId = $$.getQueryString("pid");

    $page.off("click", ".packetInfo button").on("click", ".packetInfo button", function() {
        $$.redirect("home/index.html");
    });

    $page.off("click", ".redPacket img").on("click", ".redPacket img", function() {
        var _this = $(this);
        if (!$$.getCookie('__TOKEN__')) {
        	$$.authConfirm(function(){},
        		function(){
        			$$.redirect("home/wechatLogin.html?redirecturl="+escape("icenter/sharePacket.html?pid="+packageId));
        		});
        } else {
            var token = $$.getToken();
            $.ajax({
                type:"POST",
                url:$$.serverAddr+"CSL/User/TestToken",
                data:{WToken: token},
                dataType:"json",
                success:function(txt){
                    if(txt.Status == 100){
                        showPacket(_this);
                    }else if(txt.Status == -1){
                        $$.refresh();
                        showPacket(_this);
                    }
                }
            });   
        }
    });

    function showPacket(index){
        $$.post("CSL/RedPocket/AddRedPocketRec", {
                    RedPocketID: packageId
                },
                function(txt) {
                    if (txt.Data[0] == 0) {
                        $page.find(".money span").html(txt.Data[1]);
                        index.attr("src", "images/sharePacket/hongbao_open.png");
                        setTimeout(function() {
                            index.hide();
                            $page.find(".packetInfo").fadeIn(800);
                        }, 1000);
                        setTimeout(function() {
                            $page.find(".money span").animate({ "font-size": "11vw" }, 800);
                        }, 1800);
                    } else if (txt.Data[0] == 1) {
                        layer.msg("sorry~~,红包已抢完啦");
                    } else if (txt.Data[0] == 2) {
                        layer.msg("sorry~~,红包已失效");
                    } else if (txt.Data[0] == 3) {
                        layer.msg("亲~~,这不是发给您的红包");
                    } else if (txt.Data[0] == 4) {
                        layer.msg("亲~~,您已经抢过此红包！");
                    }
                }
            );
    }
});