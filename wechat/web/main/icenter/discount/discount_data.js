// JavaScript Document
$(function() {
    var $page = $('#icenter_discount'),
    pageStr = 'icenter_discount';
	/*
		选择器要加上 #文件夹名_文件名
		例：$('#文件夹名_文件名 button.button')

	*/
	$$.post("http://api.cheshili.com.cn/CSL/User/QueryValueVoucherJson",
		{},
		function(txt){
			if(txt.Status==0){
				$page.find(".canUse").empty();
				$page.find(".haveUsed").empty();
				$page.find(".haveDate").empty();
				var useList=txt.Data.Status0;
				var node="";
				var data="";

				var haveList=txt.Data.Status1;
				var useNode="";
				var useData="";

				var dateList=txt.Data.Status2;
				var dateNode="";
				var dateData="";
				
				for(var i=0;i<useList.length;i++){
					data=JSON.parse(useList[i].DataVoucherData);
					node+='<div class="oneDiscount first">'+
                '<img src="images/discount/50discount.png">'+
                '<p class="discountMoney">￥'+data.Discount+'</p>'+
                '<p class="discountAbove">满'+data.AboveNum+'元可用</p>'+
                '<p class="discountDiscri">'+data.Descri+'</p>'+
                '<p class="discountTime">'+$$.timeToStr(data.TimeStart)+'至'+$$.timeToStr(data.TimeEnd)+'</p>'+
                '</div>';
				}

				for(var i=0;i<haveList.length;i++){
					useData=JSON.parse(haveList[i].DataVoucherData);
					useNode+='<div class="oneDiscount first">'+
                '<img src="images/discount/haveUse.png">'+
                '<p class="discountMoney">￥'+useData.Discount+'</p>'+
                '<p class="discountAbove">满'+useData.AboveNum+'元可用</p>'+
                '<p class="discountDiscri">'+useData.Descri+'</p>'+
                '<p class="discountTime">'+$$.timeToStr(useData.TimeStart)+'至'+$$.timeToStr(useData.TimeEnd)+'</p>'+
                '</div>';
				}

				for(var i=0;i<dateList.length;i++){
					dateData=JSON.parse(dateList[i].DataVoucherData);
					dateNode+='<div class="oneDiscount first">'+
                '<img src="images/discount/haveDate.png">'+
                '<p class="discountMoney">￥'+dateData.Discount+'</p>'+
                '<p class="discountAbove">满'+dateData.AboveNum+'元可用</p>'+
                '<p class="discountDiscri">'+dateData.Descri+'</p>'+
                '<p class="discountTime">'+$$.timeToStr(dateData.TimeStart)+'至'+$$.timeToStr(dateData.TimeEnd)+'</p>'+
                '</div>';
				}


				$page.find(".canUse").append(node);
				$page.find(".haveUsed").append(useNode);
				$page.find(".haveDate").append(dateNode);
			}
	});
});