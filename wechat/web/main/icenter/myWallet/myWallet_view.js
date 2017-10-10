$(function() {
    var $page = $('#icenter_myWallet'),
        pageStr = 'icenter_myWallet';
    //返回    
	$$.setGoBack($page.find('header img'));

	//设置内容高度
	var contentHeight=window.innerHeight-$page.find("header").height()-$page.find(".order_content").height()-$page.find(".footprint_date").height()-$page.find(".transTitle").height()-$page.find(".transList").height();
	$page.find(".content").height(contentHeight);

	
    var url=$$.config.serverAddr;
    var token=$$.getToken();
    var IDList=[];

    $page.on("click",".footprint_contain",function(){
    	var pid=IDList[$(this)[0].attributes.Name.value];
        var tid=$(this).attr("data-tid");
        if (tid == 0) {
            $$.redirect("home/product.html?pid=" + pid);
        } else if (tid == 1) {
            $$.redirect("home/prodservice.html?pid=" + pid);
        } else if (tid == 5) {
            $$.redirect("home/prodmulti.html?pid=" + pid);
        }
    });

    $.ajax({
        type: "POST",
        data:{
            ProductType:5
        },
        url: url+"Product/Prod/QueryProdList",
        success: function(txt) {
            txt = $$.eval(txt);
            if(txt.Status != 0){
            	layer.msg("网络错误");
            }else{
            	var list=txt.Data.Rows;
            	
            	for(var i=0; i<list.length;i++){
            		if(!list[i].Img){
            			list[i].Img="NoImg/" + Math.random() + ".jpg";
            		}
                    var descri = list[i].Descri,
                        content = '';
                    if (descri.text) {
                        descri = JSON.parse(descri);
                        content = Base64.decode(unescape(descri.text));
                    }
            		onePiece="<div class='footprint_contain' data-tid='"+list[i].ProductType+"' name='"+i+"'><ul><li><img src='"+url+"Img/"+list[i].Img+"' alt='' class='foot_li_x5_img'></li><li><div class='footprint_text'><span>"+list[i].Name+"</span><br /><span>"+content+"</span></div><div class='footprint_price'><span class='footprint_price_1'>￥<span>"+list[i].Price+"</span></span></div></li></ul></div>";
            		var thisID=list[i].ID;
            		IDList.push(thisID);  
            		$page.find(".content").append(onePiece);
            	}
            }
        }
    });
    // 点击 交易记录 跳转
    $page.on("click",".transTitle",function(){
        $$.redirect('icenter/TDetails.html');
    })
    //获取交易记录
    getTransLists(1,5);
    function getTransLists(pn,ps) {
        var $transList = $page.find('div.transList ul');
        var allCount = 0;
        $.ajax({
            type: "POST",
            data:{
                WToken: token,
                N: pn,
                Rows: ps
            },
            url: url+"CSL/Account/QueryAccountList",
            success: function(res) {
                var txt = JSON.parse(res);
                if(txt.Status !=0){
                    console.log('获取交易记录失败');
                    return false;
                }
                if(txt.Data && txt.Data.Rows && txt.Data.Rows.length > 0){
                    $transList.empty();
                    allCount = parseInt(txt.Data.Count);
                    $transList.append(template(pageStr + '_transLists' ,{
                        list: txt.Data.Rows,
                        length: txt.Data.Rows.length
                    }))
                }
            }
        })
    }
    template.defaults.imports.titleFilter = function(list) {
        var  typeID=JSON.parse(list.Data);
        switch(typeID.AccountTransType) {
            case '0' : {
                return "订单交易( 订单交易编号 "+typeID.OrderID+")";
            } break;
            case "1": {
                return "红包交易( 红包交易编号 "+typeID.RedPocketID+")";
            } break;
            case "2": {
                return "充值交易";
            } break;
            case "3": {
                return "银行卡交易";
            } break;
            case "4": {
                return "佣金交易";
            } break;
            case "5": {
                return "服务收入";
            } break;
            case '6': {
                return "优惠券";
            } break;
            case '7': {
                return "评价";
            } break;
            default:
                return "订单交易";

        }
    };
});