// JavaScript Document

!(function(win, $, undefined) {
	var shopMap = $.extend(win.App.shopMap || {}, {
		init: function(param) {
			getMapMsg(); 
			getPostion();
			getMapMsg(param)
			$("#back").click(function(){
					window.history.go(-1);
				}) 
		}
	});
	win.App.shopMap = shopMap;
}(window, jQuery));

function getMapMsg(id){
	var url=window.location.hash;
    Sid=url.substring(27,url.length);
	id=parseInt(Sid);	
	$.ajax({
	  type:"POST",
	  url:"http://192.168.43.45:8000/Store/StoreView/GetStoreDetail",
	  data:{"ID":id},
	  success: function(txt){
		   var txt1=eval("("+txt+")");
		   console.log(txt1.Data);
		   stopIat=txt1.Data.Latitude;
		   stopIng=txt1.Data.Longitude;
		   stopInt=stopIng+","+stopIat;
		   name=txt1.Data.Name;
		   position=txt1.Data.Address;
		   showMap();
		  }
	 })
	
};
	

	
function showMap(){
	var map = new AMap.Map("map", {
			resizeEnable: true,
			center: [stopIng,stopIat],//地图中心点
			zoom: 15 //地图显示的缩放级别
		});
	
    //添加点标记，并使用自己的icon
	marker=new AMap.Marker({
		map: map,
		position: [stopIng,stopIat],
		icon: new AMap.Icon({            
		size: new AMap.Size(19, 31),  //图标大小
		image:"http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"
			})
			//鼠标点击marker弹出自定义的信息窗体       
		});
	


    //实例化信息窗体
	var title = name
	content = [];
	content.push(position);
	infoWindow = new AMap.InfoWindow({
		isCustom: true,  //使用自定义窗体
		content: createInfoWindow(title, content.join("<br/>")),
		offset: new AMap.Pixel(10, -55)
	});

    //构建自定义信息窗体
    function createInfoWindow(title, content) {
        var info = document.createElement("div");
        info.className = "info";

        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        var top = document.createElement("div");
        var titleD = document.createElement("div");
        var closeX = document.createElement("img");
		var leadX=document.createElement("img");
		leadX.src="./images/shopMap/lead.png",
		leadX.className="lead";
        top.className = "info-top";
        titleD.innerHTML = title;
        top.appendChild(titleD);
        info.appendChild(top);
		info.appendChild(leadX);
		leadX.onclick=function(){
			textInfo="点击开始导航";
			window.location="http://m.amap.com/navi/?start="+startInt+"&dest="+stopInt+"&destName="+textInfo+"&key=0619e172ca2d460eeb8a62979dbef03f";
			}

        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        info.appendChild(middle);

        // 定义底部内容
        var bottom = document.createElement("div");
        bottom.className = "info-bottom";
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.margin = '0 auto';
        var sharp = document.createElement("img");
        sharp.src = "./images/shopMap/arror.png";
        bottom.appendChild(sharp);
        info.appendChild(bottom);
        return info;
    }

    infoWindow.open(map, marker.getPosition());
	
    //关闭信息窗体
    function closeInfoWindow() {
        map.clearInfoWindow();
    }
}	

function getPostion(){
		var startLng=sessionStorage.getItem("startLng");
		var startLat=sessionStorage.getItem("startLat");
		startInt=startLng+","+startLat;	
	}

	