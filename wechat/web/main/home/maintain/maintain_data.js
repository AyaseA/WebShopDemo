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
		var $proBox = $page.find('div.products');
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
						QueryPackageList(d);
					}else{
						addHtml(d)
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
		var pcarArry=pcarData;
        $$.get(
			"Product/Info/QueryPackageList",
			function(res){
				if (res.Status != 0) {
					return false;
				}
				var  DataList=res.Data;
				if(res.Data){
					pcarData=pcarData.concat(DataList);
					console.log(pcarData.length);
					for (var i = 0; i < pcarData.length; i++) {
						for (var j =i+1; j <pcarData.length; ) {
							if (pcarData[i].ID == pcarData[j].ID ) {//通过id属性进行匹配；
								pcarData.splice(j, 1);//去除重复的对象；
							}else {
								j++;
							}
						}
					}
					for (var b = 0; b < pcarData.length; b++) {
						 var bPrice = parseInt(  pcarData[b].Price);
						for (var a = 0; a < pcarArry.length; a++) {
							var aPrice = parseInt(pcarArry[a].Price);
							if(aPrice < bPrice ){
								pcarArry.push(pcarData[b])
							}
						}
					}
					addHtml(pcarArry)
				}
			}
		);
	}
    function addHtml(addData){
		var $proBox = $page.find('div.products');
		addData.forEach(function(item) {
			var descri = '';
			if (item.Descri) {
				item.Descri = JSON.parse(item.Descri);
				descri = item.Descri.text ? Base64.decode(unescape(item.Descri.text)) : '';
			}
			item.desc = descri;
		});
		$proBox.html(template(pageStr + '_products', {
			maintainProList: addData,
			maintainProListLength:addData.length,
			serverAddr: $$.config.serverAddr
		}));

	}
});
