$(function() {
    var $page = $('#icenter_myWallet'),
        pageStr = 'icenter_myWallet';
    //返回    
	$$.setGoBack($page.find('header img'));

	//设置内容高度
	var contentHeight=window.innerHeight-$page.find("header").height()-$page.find(".order_content").height()-$page.find(".footprint_date").height();
	$page.find(".content").height(contentHeight);

	//var token = "eyJVc2VySUQiOiI0MCIsIk5pY2tOYW1lIjpudWxsLCJHcm91dGhWYWx1ZSI6bnVsbCwiVXNlckFkZHJlc3NJRCI6bnVsbCwiQWRkVGltZSI6IjE0OTczMzkzODgiLCJVc2VyQ2FySUQiOm51bGwsIkltZyI6bnVsbCwiRW5hYmxlIjoiMSIsIkludml0ZUNvZGUiOiJNRFF3IiwiTW9iaWxlIjoiMTUwNjY2NzAzMjAiLCJTZXNzaW9uSUQiOiIxIiwiVHlwZSI6IlVzZXIiLCJVSUQiOiJmMjUxZjI0ZjU5OGVhZTFiZGNiNWVmMWIwNjNjZDAwMSJ9";
    var url=$$.config.serverAddr;
    var token=$$.getToken();
    var IDList=[];

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
            	alert("接口错误");
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
            		onePiece="<div class='footprint_contain' name='"+i+"'><ul><li><img src='"+url+"Img/"+list[i].Img+"' alt='' class='foot_li_x5_img'></li><li><div class='footprint_text'><span>"+list[i].Name+"</span><br /><span>"+content+"</span></div><div class='footprint_price'><span class='footprint_price_1'>￥<span>"+list[i].Price+"</span></span></div></li></ul></div>";
            		var thisID=list[i].ID;
            		IDList.push(thisID);  
            		$page.find(".content").append(onePiece);
            	}
            }
        }
    });    
});