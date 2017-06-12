$(function() {
    var $page = $('#luckyDraw_luckyDraw');
    pageStr = 'luckyDraw_luckyDraw';


    function makeWard() {
        var flag = 0;
        $page.wardFlag = 0;


        //点击返回按钮
        $page.on("click", "a .back", function() {
                $$.redirect("index/index.html", {
                    'trans': "fadeIn"
                });
                $$.removeDiv(pageStr);
                $page.off('click', '*');
            })
            //点击开始抽奖
        $page.on("click", ".wardImg", function() {
            if (flag == 0) {
                node = "<div class='mirror'></div>";
                $page.find(".content").append(node);
                $page.find(".form").animate({ height: "90vw" }, 1000);
            }
        })


        //点击提交按钮触发事件		
        $page.on("click", ".submitBtn", function() {
            var phoneValue = $(".phone").val();
            if (!phoneValue) {
                $page.find(".formMsg").html("手机号不能为空");
            } else if (!isPhoneNum(phoneValue)) {
                $page.find(".formMsg").html("请输入正确的手机号");
            } else {
                flag = 1;
                $page.find(".form").animate({ height: "0vw" }, 1000);
                startWard();
            }
        })

        function startWard() {
            //开始图片替换gif
            setTimeout(
                function() {
                    $page.find(".mirror").css("display", "none");
                    $page.find(".wardImg").removeAttr("src");
                    $page.find(".wardImg").attr("src", "images/lcukyDraw/wardgif.gif");
                }, 1000);

            //奖品图片替换Gif
            setTimeout(
                function() {
                    $page.find(".content").append("<div class='wardborder'><img src='images/lcukyDraw/border.png'></div>")
                    for (var i = 0; i < 9; i++) {
                        $page.find(".content").append("<div class='cjImg" + i + " pcjImg'><div>");
                        if (i == 4) {
                            $page.find(".cjImg" + i).append("<img src='images/lcukyDraw/cqImg.png'>")
                        } else {
                            $page.find(".cjImg" + i).append("<img src='images/lcukyDraw/cjImg.png'>")
                        }
                    }
                }, 2600);

            setTimeout(
                //点击抽奖图片触发事件
                function() {
                    $page.find(".wardImg").removeAttr("src");
                    $page.on("click", ".pcjImg", function() {
                        console.dir(this);
                        console.log($page.wardFlag);
                        if ($(this).children("img").attr("src") != "images/lcukyDraw/cqImg.png") {
                            if ($page.wardFlag == 0) {
                                $(this).children("img").removeAttr("src");
                                $(this).children("img").attr("src", "images/lcukyDraw/wardThank.png");
                                $(this).css("border", "red 0.5vw solid");
                                $(this).css("border-radius", "2.5vw");
                                var imgIndex = $(this)[0].className[5];
                                console.log(imgIndex);
                                console.log($(".pcjImg").length);
                                $page.wardFlag = 1;
                                setTimeout(function() {
                                    var imgList = ["images/lcukyDraw/one.png", "images/lcukyDraw/two.png", "images/lcukyDraw/three.png", "images/lcukyDraw/four.png", "images/lcukyDraw/five.png", "images/lcukyDraw/six.png", "images/lcukyDraw/wardThank.png"];
                                    var imgList = randArray(imgList)
                                    var j = 0;
                                    for (var i = 0; i < $(".pcjImg").length; i++) {
                                        if (i != 4 && i != imgIndex) {
                                            $(".pcjImg")[i].children[1].setAttribute("src", imgList[j]);
                                            j += 1;
                                        }
                                    }
                                }, 2000)

                                //弹出中奖信息
                                setTimeout(function() {
                                    $(".mirror").css("display", "block");
                                    $(".mirror").css("z-index", "140");
                                    $(".noWard").animate({ height: "82vw" }, 500);
                                    $page.on("click", ".backImg img", function() {
                                        $$.redirect("index/index.html", {
                                            'trans': "fadeIn"
                                        });
                                        $$.removeDiv(pageStr);
                                        //$page.off('click', '*');
                                    });
                                }, 3000);
                            }
                        }
                    })
                }, 3000);
        }


    }

    makeWard();
    //打乱数组顺序方法
    function randArray(data) {
        var arrlen = data.length;
        var try1 = new Array();
        for (var i = 0; i < arrlen; i++) {
            try1[i] = i;
        }
        var try2 = new Array();
        for (var i = 0; i < arrlen; i++) {
            try2[i] = try1.splice(Math.floor(Math.random() * try1.length), 1);
        }
        var try3 = new Array();
        for (var i = 0; i < arrlen; i++) {
            try3[i] = data[try2[i]];
        }
        return try3;
    }

    function isPhoneNum(num) {
        return /^1[34578]\d{9}$/.test(num)
    }

});
