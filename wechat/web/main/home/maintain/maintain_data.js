$(function() {
    var $page = $('#home_maintain'),
	    pageStr = 'home_maintain',
	    carId = $$.getQueryString('cid'),
	    carName = $$.getQueryString('cname'),
        pageNum = 1,
        pageSize = 9,
        allCount = 0,
        loadComplate = true;
	$page.find('>div.header >span.edit').text(carName);

    // 懒加载
/*    $page.find('>div.main >div.warp').scrollTop(0).scroll(function() {
    	if (loadComplate) {
	        if (pageNum * pageSize < allCount) {
	            var proBox = $(this).find('>div.products'),
	            	maxScroll = $(this).find('>div.products').height() - $(this).height() + 20;
	            if ($(this).scrollTop() == maxScroll) {
	                proBox.addClass('loading');
	                getProductsList(++pageNum, pageSize);
	                $(this).scrollTop($(this).scrollTop() - 10);
	                loadComplate = false;
	            }
	        }
    	} else {
    		return false;
    	}
    });*/

	// 加载商品列表
	getProductsList(pageNum, pageSize);

	// 加载商品列表
	function getProductsList(pn, ps) {
		var $proBox = $page.find('div.warp>div.products');
		$$.post(
			'CSL/UserInfo/QueryProductsByCar',
            {
                ID: carId
            },
			function(res) {
				if (res.Status != 0) {
					return false;
				}
				if (res.Data/* && res.Data.Rows && res.Data.Rows.length > 0*/) {
					/*if (pn == 1) {
                        $proBox.empty();
                        allCount = parseInt(res.Data.Count);
                    }*/
					var d = res.Data/*.Rows*/;
                    //修改
					if(d.length < 4){
						addHtml(d,$proBox);
						QueryPackageList(d);
					}else{
						addHtml(d,$proBox);
						$page.find('div.pro_more').hide();
					}

                    //修改end
                    //
                    //d.forEach(function(item) {
						//var descri = '';
	                 //   if (item.Descri) {
	                 //       item.Descri = JSON.parse(item.Descri);
	                 //       descri = item.Descri.text ? Base64.decode(unescape(item.Descri.text)) : '';
	                 //   }
						//item.desc = descri;
                    //});
                    //$proBox.html(template(pageStr + '_products', {
						//maintainProList: d,
            			//maintainProListLength:d.length,
						//serverAddr: $$.config.serverAddr
                    //}));


					/*$proBox.removeClass('loading');
					if (pageNum * pageSize >= allCount) {
                        $proBox.addClass('loaded');
                    } else {
                        $proBox.removeClass('loaded');
                    }
                    loadComplate = true;*/
				}
			}
		);
	}
	//修改
	function QueryPackageList(pcarData){
		$page.find('div.pro_more').show();
		var proMore = $page.find('div.pro_more>div.proMoreContainer'),
		    newArry=[],
			maxPrice= 0;
        $$.get(
			"Product/Info/QueryPackageList",
			function(res){
				if (res.Status != 0) {
					return false;
				}
				var  DataList=res.Data;
				if(res.Data){
					//取配的最大价格
                   for(var i = 0;i < pcarData.length;i ++){
					   var pI = parseInt( pcarData[i].Price);
					   if(pI > maxPrice){
						   maxPrice=pI;
					   }
				   }
					//取所有套餐中价格大于最大价格的
					for(var j = 0;j < DataList.length;j ++){
						var dJ = parseInt(DataList[j].Price) ;
						if(dJ > maxPrice){
							newArry.push(DataList[j]);
						}
					}
					//取所有中价格最低的
					if(newArry.length == 1){
						$page.find("div.pro_more>h4 ").show();
						addHtml(newArry,proMore);
					}else if(newArry.length == 0){
						$page.find("div.pro_more>h4 ").hide();
						addHtml(newArry,proMore);
					} else{
						$page.find("div.pro_more>h4 ").show();
						var tjArry;
						var tuijian=parseInt(newArry[0].Price);
						for(var k = 1; k < newArry.length; k++){
							if( parseInt(newArry[k].Price) < parseInt(newArry[0].Price) ){
								tuijian=newArry[k].Price;
								tjArry=newArry[k]
							}
						}
						addHtml([tjArry],proMore);
					}

				}
			}
		);
	}

    function addHtml(addData,addDOM){
		addData.forEach(function(item) {
			var descri = '';
			if (item.Descri) {
				item.Descri = JSON.parse(item.Descri);
				descri = item.Descri.text ? Base64.decode(unescape(item.Descri.text)) : '';
			}
			item.desc = descri;
		});
		addDOM.html(template(pageStr + '_products', {
			maintainProList: addData,
			maintainProListLength:addData.length,
			serverAddr: $$.config.serverAddr
		}));

	}
});
