$(function() {
    var $page = $('#orderList_orderList'),
        pageStr = 'orderList_orderList';
		
	$page.on("click",".nav ul li",function(){
		$page.find(".nav ul li").removeClass("on");
		$(this).addClass("on");
		})
		
	var contentHeight=$page.height()-$page.find(".nav").height()-$page.find(".header").height();
	$page.find(".content").css("height",contentHeight+"px");
	
	var Token = "eyJVc2VySUQiOiIxMCIsIk5pY2tOYW1lIjpudWxsLCJHcm91dGhWYWx1ZSI6bnVsbCwiVXNlckFkZHJlc3NJRCI6bnVsbCwiQWRkVGltZSI6IjE0OTYyODA2NDUiLCJVc2VyQ2FySUQiOm51bGwsIkltZyI6bnVsbCwiRW5hYmxlIjoiMSIsIk1vYmlsZSI6IjE1MDY2NjcwMzIwIiwiU2Vzc2lvbklEIjoiMSIsIlR5cGUiOiJVc2VyIiwiVUlEIjoiYmZiMjQxODY1YjM1NjNiODFmNWU5NzhjOWEwNjQ4MmMifQ%3D%3D";
	

	//$$.post("http://192.168.1.110:8000/CSL/Order/QueryOrderList",{},)
//	
	$.ajax({
		type:"POST",
		url:"http://192.168.1.110:8000/CSL/Order/QueryOrderList",
		data:{"Token":Token},
		success:function(data){
			var list = eval("("+data+")").Data.Rows;
			console.log(list);
			for(var i=0;i<list.length;i++){
				//用creatElement方法增加列表
//				var onePiece=document.createElement("div");
//				onePiece.className="onePiece";
//				var pieceHeader=document.createElement("div");
//				pieceHeader.className="pieceHeader";
//				var pieceHeaderNode='<p class="pieceStatus">状态</p>';
//				pieceHeader.innerHTML=""+pieceHeaderNode;
//				var pieceContent=document.createElement("div");
//				pieceContent.className="pieceContent";
//				var piecePay=document.createElement("div");
//				piecePay.className="piecePay";
//				$(".onePiece").append(pieceHeader);
//				$(".onePiece").append(pieceContent);
//				$(".onePiece").append(piecePay);
				listData=eval("("+list[i].Data+")");
				console.log(listData);
				onePiece="<div class='onePiece'><div class='pieceHeader'><span class='orderID'>"+list[i].ID+"</span><p class='pieceStatus'>"+showStatus(list[i].StatusID)+"</p></div><div class='pieceContent'><div></div><p>实付金额:<span>"+list[i].OutPocket+"</span></p></div><div class='piecePay'><button class='PayBtn'>支付</button></div></div>"
				$page.find(".all").append(onePiece);
				}
			$page.on("click",".PayBtn",function(){
				var orderId=$(this).parent().parent().children(".pieceHeader").children(".orderID").html();
				$$.redirect("payCenter/payCenter.html?oid="+orderId+"&"+$$.goBackUrl())
				})
			}
			
		})
	
	
		
	function showStatus(data){
			if(data==1){
				return data="等待买家付款";
			}
			else if(data==2){
				return data="等待发货";
			}
			else if(data==3){
				return data="买家已付款";
			}
			else if(data==4){
				return data="卖家已发货";
			}
			else if(data==5){
				return data="交易关闭";
			}
			else if(data==6){
				return data="交易成功";
			}
			else if(data==7){
				return data="退款中的订单";
			}
			else if(data==8){
				return data="定金已付";
			}
			else if(data==9){
				return data="异常订单";
			}
			else if(data==10){
				return data="付款确认中";
			}
		}
});

	