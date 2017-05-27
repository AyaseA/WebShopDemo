!(function(win, $, undefined) {
    var shopdetail = $.extend(win.App.shopdetail || {}, {
        init: function(param) {
            var toMapId = document.getElementById("toMapId");
            toMapId.onclick = function() {
                location.hash = "#headerSearch/#shopMap/0/0/" + id;
            };
            getShopMsg();
        }
    });
    win.App.shopdetail = shopdetail;
}(window, jQuery));

//点击选择服务功能
/*function chooseService(){
	var navTitle2=document.getElementById("navTitle2");
	var selectList2=navTitle2.children;
	var serviceList=document.getElementById("serviceList");
	var serviceListDiv=serviceList.children;
	for(var i=0;i<selectList2.length;i++){
		selectList2[i].index=i;
		selectList2[i].onclick=function(){
			for(var j=0;j<serviceListDiv.length;j++){
					selectList2[j].className="";
					serviceListDiv[j].className="ccOff";
				}
				selectList2[this.index].className="ctOn";
				serviceListDiv[this.index].className="ccOn";
			}	
		}
		

	$("#serviceList ul li").click(function(){
		$("#serviceList ul li").removeClass("cccOn");
		$(this).addClass("cccOn");
		})
		
	}*/
function getShopMsg() {
    var url = window.location.hash;

    id = url.substring(34, url.length);
    console.log(id);
    $.ajax({
        type: "POST",
        url: "http://192.168.43.45:8000/Store/StoreView/GetStoreDetail",
        data: { ID: id },
        success: function(txt) {
            var txt1 = eval("(" + txt + ")");
            console.log(txt1.Data);

            $("#shopTitle1").html(txt1.Data.Name);
            $("#shopDescri").html(txt1.Data.Descri);
            $("#shopAddress").html(txt1.Data.Address);
        }
    })
}
