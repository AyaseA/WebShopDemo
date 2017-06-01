!(function(win, $, undefined) {
	var car = $.extend(win.App.car || {}, {
			init: function(param) {
				TouchSlide({
				    slideCell: "#banner",
				    titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
				    mainCell: ".bd ul",
				    effect: "left",
				    autoPlay: false, //自动播放
				    autoPage: true, //自动分页
				    switchLoad: "_src", //切换加载，真实图片路径为"_src" 
				    interTime: 2000 // 切换间隔时间，毫秒
				});	
				//立Flag
				flag=true;
				
				//页面加载获取定位
				function getLocation(){
					if (navigator.geolocation){
				
						navigator.geolocation.getCurrentPosition(showPosition);
				
					}else{
						alert("定位失败");
					}
					
					function showPosition(position){
						startLat=position.coords.latitude;
						startLng=position.coords.longitude;
						sessionStorage.setItem("startLat",startLat);
						sessionStorage.setItem("startLng",startLng);
						loadShop();
					}
				}
				
				//判断会话储存是否存有经纬度，有就不用定位   
				if(sessionStorage.getItem("startLat")){
					startLat=sessionStorage.getItem("startLat");
					startLng=sessionStorage.getItem("startLng");
					loadShop();
					}else{
						getLocation();		
						}
					
				//根据经纬度计算距离		
				function getGreatCircleDistance(lat1,lng1,lat2,lng2){
					var EARTH_RADIUS = 6378137.0;    //单位M
					var PI = Math.PI;
					function getRad(d){
						return d*PI/180.0;
						}
					var radLat1 = getRad(lat1);
					var radLat2 = getRad(lat2);
					
					var a = radLat1 - radLat2;
					var b = getRad(lng1) - getRad(lng2);
					
					var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
					s = s*EARTH_RADIUS;
					s = Math.round(s*10000)/10000000;
					km=s.toFixed(2);	
					return(km+"km");
				}
				
				//加载店铺数据
				function loadShop(){
					 $.ajax({
						  type:"GET",
						  url:"http://192.168.43.45:8000/Store/StoreView/GetStoreList",
						  beforeSend: function(){
										  msg=document.createElement("div");
										  msg.className="msg";
										  msg.innerHTML="<img src='./images/car/loading.gif'>";
										  shopList.append(msg);
										  },
						  success: function(txt){
								var txt1=eval("("+txt+")");
								var show=txt1.Data.Rows;
								show1=[];
								for(var j=0;j<show.length;j++){
										show1.push(show[j]);
									}
								var shopList=document.getElementById("shopList"); 			
								for (var i=0;i<show1.length;i++){
										 msg.style.display="none";
										 var stoplat=show1[i].Latitude;
										 var stoplng=show1[i].Longitude;
										 var distence=getGreatCircleDistance(startLat,startLng,stoplat,stoplng);
										 var node=document.createElement("div");
										 node.className="oneShop";
										 node.innerHTML="<div class='container'><div class='shopImg'><img src='images/car/"+show1[i].Img+"'></div><div class='shopInfo'><a href='./#headerSearch/#shopdetail/0/0/?ID="+show1[i].ID+"'><ul><li class='msgLeft'><h3>"+show1[i].Name+"</h3></li><li class='msgLeft'><p>"+show1[i].Address+"</p></li><li class='msgRight'><p>"+distence+"</p></li></ul></a></div></div>";
										 shopList.appendChild(node);
									}
								isBottom();		  
							 }
					 })
					 			 
				}
				
				//判断滚动条是否到底部的方法,并加载剩余店铺
				
				function isBottom(){
					if(flag==true){
						var n=1;
						var shopList=document.getElementById("shopList");
						$("#shopList").scroll(function(){
						　　var scrollTop = $("#shopList").scrollTop()+$("#shopList").height();
						　　var scrollHeight = shopList.scrollHeight;
						   if(Math.abs((scrollHeight-scrollTop))<=1){
							   n+=1;
							   if(flag==true){
								   $.ajax({
									  type:"GET",
									  url:"http://192.168.43.45:8000/Store/StoreView/GetStoreList",
									  data:{N:n,Rows:10},
									  beforeSend: function(){
										  msg.innerHTML="<img src='./images/car/loading.gif'>";
										  shopList.append(msg);
										  },
									  success: function(txt){
											msg.style.display="none";
											var txt1=eval("("+txt+")");
											var reshow=txt1.Data.Rows;
											if(reshow.length==0){
												msg.style.display="block";
												msg.innerHTML="全部数据加载完成";
												shopList.append(msg);
												flag=false;
												}else{
												for (var i=0;i<reshow.length;i++){
												 var stoplat=reshow[i].Latitude;
												 var stoplng=reshow[i].Longitude;
												 var distence=getGreatCircleDistance(startLat,startLng,stoplat,stoplng);
												 var node=document.createElement("div");
												 node.className="oneShop";
												 node.innerHTML="<div class='container'><div class='shopImg'><img src='images/car/"+reshow[i].Img+"'></div><div class='shopInfo'><a href='/#headerSearch/#shopdetail/0/0/?"+reshow[i].ID+"'><ul><li class='msgLeft'><h3>"+reshow[i].Name+"</h3></li><li class='msgLeft'><p>"+reshow[i].Address+"</p></li><li class='msgRight'><p>"+distence+"</p></li></ul></a></div></div>";
												 shopList.appendChild(node);
													}			
											}
										  }
									  })
								   }
							   }
						});	
					}
				}
						
				//点击弹出模态窗口
				 //弹出滤镜层    
					function loadEvent(){
						function makeMirror(){
							bodyMirror = document.createElement("div");
							bodyMirror.style.position = "absolute";
							bodyMirror.style.top = "0px";
							bodyMirror.style.left = "0px";
							bodyMirror.style.background = "#000";
							bodyMirror.style.width="100%";
							bodyMirror.style.height="100%";
							bodyMirror.style.opacity = "0.50";
							bodyMirror.style.zIndex=9;
							document.body.appendChild(bodyMirror);
							}
							
						//删除滤镜层
						function removeMirror(){
							setTimeout(function(){
								document.body.removeChild(bodyMirror);
								},300)
							}
							
						
						//点击此单进入相应的选项
						function onNav(x,y){
							var navTitle=document.getElementById("navTitle");
							var selectList=navTitle.children;
							var selectContent=document.getElementById("selectContent");
							var contentList=selectContent.children;
							
							document.getElementById(""+y).className="tOn";
							for(var i=0;i<contentList.length;i++){
								  contentList[i].className="cOff";
								  selectList[i].className="tOff";
								}
							document.getElementById(""+x).className="cOn";
							document.getElementById(""+y).className="tOn";
						}
						
						
						//点击选项事件
						$("#mainPostion").click(function(){
							$("#selectModal").fadeIn(300);
							makeMirror();
							onNav("positionS","positionMsg");
							colse();
							})
							
						$("#mainService").click(function(){
							$("#selectModal").fadeIn(300);
							makeMirror();
							onNav("carT","serviceMsg");
							colse();
							})
							
						$("#mainOrder").click(function(){
							$("#selectModal").fadeIn(300);
							makeMirror();
							onNav("orderBy","orderMsg");
							colse();
							})
						
						//关闭模态窗口方法	
						function colse(){
								bodyMirror.onclick=function(){
									$("#selectModal").fadeOut(300);
									removeMirror();
								}
							}
					
					//一级tab
						var selectModal=document.getElementById("selectModal");
						var navTitle=document.getElementById("navTitle");
						var selectList=navTitle.children;
						var selectContent=document.getElementById("selectContent");
						var contentList=selectContent.children;
						for(var i=0;i<selectList.length;i++){
							selectList[i].index=i;
							selectList[i].onclick=function(){
								for(var j=0;j<contentList.length;j++){
										selectList[j].className="tOff";
										contentList[j].className="cOff";
									}
									selectList[this.index].className="tOn";
									contentList[this.index].className="cOn";
								}
							}
						
					//汽车服务二级tab
					//	var navTitle2=document.getElementById("navTitle2");
					//	var selectList2=navTitle2.children;
					//	var serviceList=document.getElementById("serviceList");
					//	var serviceListDiv=serviceList.children;
					//	for(var i=0;i<selectList2.length;i++){
					//		selectList2[i].index=i;
					//		selectList2[i].onclick=function(){
					//			for(var j=0;j<serviceListDiv.length;j++){
					//					selectList2[j].className="";
					//					serviceListDiv[j].className="ccOff";
					//				}
					//				selectList2[this.index].className="ctOn";
					//				serviceListDiv[this.index].className="ccOn";
					//			}	
					//		}
					
					//列表选项点击事件	
						$("#area li").click(function(){
							$("#area li").removeClass("positionOn");
							$(this).addClass("positionOn");
							var msg=$(this).html();
							$("#positionMsg").html(msg);
							$("#mainPMsg").html(msg);
							$("#selectModal").fadeOut(300);
							removeMirror();
							})
						
						$("#serviceList ul li").click(function(){
							$("#serviceList ul li").removeClass("cccOn");
							$(this).addClass("cccOn");
							var msg=$(this).html();
							var msg=msg.substring(0,6)+"..";
							$("#serviceMsg").html(msg);
							$("#mainSMsg").html(msg);
							$("#selectModal").fadeOut(300);
							removeMirror();
							})
							
						$("#orderBy ul li").click(function(){
							$("#orderBy ul li").removeClass("orderOn");
							$(this).addClass("orderOn");
							var msg=$(this).html();
							$("#orderMsg").html(msg);
							$("#mainOMsg").html(msg);
							$("#selectModal").fadeOut(300);
							removeMirror();
							})			
						}			
						loadEvent();
						listHeight=$("#main").height()-$("#banner").height()-$(".selectShop").height();
						$("#shopList").css("height",listHeight-1);
			}	
		});
	win.App.car = car;
}(window, jQuery));
