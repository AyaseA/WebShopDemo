$(function() {
    var $page = $('#icenter_discount'),
        pageStr = 'icenter_discount';

    var contentHeight=window.innerHeight-$page.find(".header").height()-$page.find(".nav").height();
    $page.find(".navContent").height(contentHeight);

    $page.find('div.header >a').click(function(){
    	$$.goBack();
    });



    function loadDiscount() {
        //获取内容
        var contentIndex = $("#icenter_discount .navContent").children();

        //获取nav标签
        var li = $("#icenter_discount  .nav ul li");

        //给每个li赋值index指向li的顺序数，通过顺序数改变内容的显示
        for (var i = 0; i < li.length; i++) {
            li[i].index = i;
            li[i].onclick = function() {
                for (var j = 0; j < li.length; j++) {
                    li[j].className = "off";
                    contentIndex[j].style.display = "none";
                }
                li[this.index].className = "on";
                contentIndex[this.index].style.display = "block";
            };
        }
    }

    loadDiscount();
});