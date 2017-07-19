$(function() {
    var $page = $('#icenter_storefront'),
        pageStr = 'icenter_storefront';

    //设置返回    
    $$.setGoBack($page.find("header img"));

    
    //设置内容高度
    var contentHeight=window.innerHeight -$page.find("header").height();
    $page.find(".storefront_detail_active").css("height",contentHeight+"px");

    $page.on("click",".storefront_detail",function(){
    	$page.find(".storefront_detail_active").show();
    	$page.find(".storefront_detail").addClass("on");
    	$page.find(".storefront_face_active").hide();
    	$page.find(".storefront_face").removeClass("on");

    });

    $page.on("click",".storefront_face",function(){
    	$page.find(".storefront_face_active").show();
    	$page.find(".storefront_face").addClass("on");
    	$page.find(".storefront_detail_active").hide();
    	$page.find(".storefront_detail").removeClass("on");
    });

    var token=$$.getToken();
    var IDList=[];
    var url=$$.config.serverAddr;  

    $page.on("click",".footprint_contain_x",function(){
    	$$.redirect("home/product.html?pid=1");
    });

    $page.on("click",".footprint_contain",function(){
    	var pid=IDList[$(this)[0].attributes.Name.value];
    	 $$.redirect("home/product.html?pid="+pid);
    });

    $.ajax({
        type: "GET",
        url: url+"Product/Prod/QueryList",
        success: function(txt) {
            txt = $$.eval(txt);
            if(txt.Status != 0){
            	alert("借口错误");
            }else{
            	var list=txt.Data.Rows;
            	
            	for(var i=0; i<list.length;i++){
            		if(!list[i].Img){
            			list[i].Img="NoImg/" + Math.random() + ".jpg";
            		}

                    var descri = list[i].Descri,
                        content = '';
                    if (descri) {
                        descri = JSON.parse(descri);
                        content = Base64.decode(unescape(descri.text));
                    }
                    
            		onePiece="<div class='footprint_contain' name='"+i+"'><ul><li><img src='"+url+"/Img/"+list[i].Img+"' alt='' class='foot_li_x5_img'></li><li><div class='footprint_text'><span>"+list[i].Name+"</span><br /><span>"+content+"</span></div><div class='footprint_price'><span class='footprint_price_1'>￥<span>"+list[i].Price+"</span></span></div></li></ul></div>";
            		var thisID=list[i].ID;
            		IDList.push(thisID);
            		$page.find(".content").append(onePiece);
            	}
            }
        }
    });    

    }
);