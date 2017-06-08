$(function() {
    var $page = $('#myCars_myCars'),
    	pageStr = 'myCars_myCars';

    // 加载车辆信息
	getMyCars();

    // 加载车辆信息
    function getMyCars() {
        var carsBox = $page.find('>div.main >div.cars');
        $$.post(
        	'CSL/UserInfo/QueryCarList',
        	{
        		Token: $$.getToken()
        	},
        	function(res) {
        		if (res.Status != 0) {
	                console.log('获取车辆信息失败！');
	                return false;
	            }
	            if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
                    var html = template(pageStr + '_list', {
                        list: res.Data.Rows,
                        serverAddr: $$.serverAddr,
                        defaultCar: $$.getUserInfo().UserCarID,
                        tmpImg: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABQQEBkSGScXFycyJh8mMi4mJiYmLj41NTU1NT5EQUFBQUFBRERERERERERERERERERERERERERERERERERERET/2wBDARUZGSAcICYYGCY2JiAmNkQ2Kys2REREQjVCRERERERERERERERERERERERERERERERERERERERERERERERERET/wAARCABkAGQDAREAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAMFAgQGAf/EAEAQAAEDAgMCCQcJCQAAAAAAAAEAAgMEEQUSITFBEzJRYXFygbHRBhQiQlKRwRUkMzRDobLC8BYjJURTY6Lh8f/EABkBAQADAQEAAAAAAAAAAAAAAAABAgMEBf/EACkRAQACAQQABAYDAQAAAAAAAAABAhEDEiExMjNBUQQTIkJDYVJxgfD/2gAMAwEAAhEDEQA/AOzQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQeIPGva7Yb9CDJAQEBAQEBAQEBBHNMyBhkkNmjUkoOamxKpxI5aX93D/UI1PVHxKra0V5lMRM9MBRT0/p007i/e2Y3ae3a1ZV1qzx00nStHPa2w7GBUO83nHBzjax2/nB3hbslsgICAgICAgIIampjpYzLKbNbqSg5eYzYoHVMwtCwF0cR32Ghdy9H6MZ5x6px6osN8oYZQGVDeCcdjvUd4dyy1NLdzHa9b44WlXUwUjOEndlbu3k9A/QXPXRtM88Q2nViOuVKyuGLymIs4NrBmjd9oDca3+GxdfFK/qGHN7fuV7heKPz+Z1n0vqP3SDlHPyhX75hTriV4gICAgICDwm2qDjcSrxWZqp4zUkJGRo+0de2boG7l96CyZX09ZSSebnYx/o7xodqyikxbPa+eMK3BaOKsoGsmFxrbm9Jyal9uCtcs4MAgp35zd9uLm1ssra/H09tK6X8kcTf4rOB7DO5q2tE2piO5hSvF/1DyqrKaqkbSNdd97iRvqOAvcHf2ac6jTpNIxMp1LxaeIX+D4i6qaYp9J49Hjl5HDmP63LVktkBAQEBBQY9VufloYTZ0nHI3M3+CCvxmJsOGPYwWAyD/ILDTvvtaWt67YiEM+DRyU/nER4OQMvdul7Df0/9ur7/AKtim3jc1sExhtHC2KoYWxuvkl3bd/8Ar3Jem4rbC4rcWpqZgcXhxdxWs1J8FzxoT93TadXHhc6yOTEq2QzXiuGlzBtI0sO47OxdUztjPpDGI3Tj3bk9LHTVdM2JoaLP2dqilt1dybV222tyoc6mc2tj40ejx7Ue/wB20LLQvmNs9w216YndHUurgmbOwSN2FdDmSoCAgwkfkaXciDk6E+cyyVbtcxys6rfE6rn17Yrt922jXM59mWOn5hJ0s71T4f7l9b0bIPzRw/tu/Cp/N/3sr+NoYJG2Wia14u030PWKtq3mkxhGnSLROU1PhNPTOL2N159beHfzrK2vMx9PDWuj/Llqs0xSfqM/Kt7+XP8ATGnmR/bLEPrdIeumj4E63jb3SuGlttos7713VmqXydm4IyUTj9GfR6p1b93cvUeU6JAQEEU8fCsLNl0HMCmqsKHB5OFpxctANnNvyHYe3VUtSL9rVvNempilbDVUj4YyRLdp4N4yu06fgqaenszz2ve+/C0yltM64+zf+EqmJ+dnHC+Y+Vj1V+BG1Gzt/EVT4juq2h6rEuXK6sKtovik4HsM/KvRv5f+OCnmc+7LE25J6V7/AEQ3OXF2ltiaUTFMSnWmJvmEorWyaUjHTH2iMsfiegLOuhEeLle3xEzxXhaYVhs0UrqqpdeR9r20GgsAByD3rpcy7QEBAQeINOowynqRaRg9yCsd5Mxt+rvfH1XEeI+5BjHgdXA3JDU5W8hY13wCDL5JxA/zQ7IWqMR7JzPuw/ZyVzi99Q/MeMWnLf3D4qUNqDycpIjmLcx5Xa990FrHCyPiiyCRAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEH/9k='
                    });
	                carsBox.html(html);
	            } else {
	                // 如果没有车辆信息，跳到添加车辆信息页面
	                $$.redirect('carInfo/carInfo.html');
	            }
        	}
        );
    }
});