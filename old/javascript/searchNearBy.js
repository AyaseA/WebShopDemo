// JavaScript Document
!(function(win, $, undefined) {
	var searchNearBy = $.extend(win.App.searchNearBy || {}, {
		init: function(Param) {
			//记载地图
			map = new AMap.Map("map", {
						resizeEnable: true,
						center: [117.1093580000,36.6819290000],
						zoom: 14 //地图显示的缩放级别
					});
			
			//记载地图插件
			map.plugin(["AMap.ToolBar"], function() {
						map.addControl(new AMap.ToolBar());
						});
						
						
			function getPostion(){
							startLng=parseFloat(sessionStorage.getItem("startLng"));
							startLat=parseFloat(sessionStorage.getItem("startLat"));
							startInt=startLng+","+startLat;	 
					}
					
			getPostion();
			
			$.ajax({
				type:"GET",
				url:"http://192.168.43.45:8000/Store/StoreView/GetStoreList",
				success: function(txt){
					var txt1=eval("("+txt+")");
					console.log(txt1);
					stopLnt=[];
					shopName=[];
					shopPosition=[];
					for(var i=0;i<txt1.Data.Rows.length;i++){
							stopLnt.push([txt1.Data.Rows[i].Longitude,txt1.Data.Rows[i].Latitude]);
							shopName.push(txt1.Data.Rows[i].Name);
							shopPosition.push(txt1.Data.Rows[i].Address);
						}
					callback();
					}
			})
			
			getPostion();
		}
	});
	win.App.searchNearBy = searchNearBy;
}(window, jQuery));


function callback(){
	myMarker=new AMap.Marker({
			map: map,
			position:[117.1093580000,36.6819290000],
			icon: new AMap.Icon({            
			size: new AMap.Size(20,20),  //图标大小
			image: "./images/shopMap/myposition.png"
			}),
			zIndex:101,
	})				
	
	mySiteInfo=new AMap.InfoWindow({
		offset: new AMap.Pixel(0,-30),
		content:"我的位置",
		})
	

	mySiteInfo.open(map, myMarker.getPosition())

	var marker=[]; 
	infoWindow = new AMap.InfoWindow({
		offset: new AMap.Pixel(0,-40),
		isCustom: true,  //使用自定义窗体
		});
	for(var i=0;i<stopLnt.length;i++){
		marker[i]=new AMap.Marker({
			map: map,
			position:stopLnt[i],
			icon: new AMap.Icon({            
			size: new AMap.Size(19, 31),  //图标大小
			image: "./images/shopMap/marker.png"
				})
				//鼠标点击marker弹出自定义的信息窗体       
		});
	   var info = document.createElement("div");
       info.className = "info";	
	   var top = document.createElement("div");
       var titleD = document.createElement("div");
	   var leadX=document.createElement("img");
	   leadX.src="./images/shopMap/lead.png",
	   leadX.className="lead";
       top.className = "info-top";
       titleD.innerHTML = "<h4>"+shopName[i]+"</h4><p>"+shopPosition[i]+"</p>";
       top.appendChild(titleD);
       info.appendChild(top);
	   info.appendChild(leadX);
	   leadX.onclick=function(){
			textInfo="导航至"+shopName[i];
			window.location="http://m.amap.com/navi/?start="+startInt+"&dest="+stopLnt[i]+"&destName="+textInfo+"&key=0619e172ca2d460eeb8a62979dbef03f";
			}
	   marker[i].content=info;
	   marker[i].on('click', markerClick);
	}
}

function markerClick(e){
    infoWindow.setContent(e.target.content);
    infoWindow.open(map, e.target.getPosition());
}

