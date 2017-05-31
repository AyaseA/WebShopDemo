!(function(win, $, undefined) {
    var $header = $('body >header'),
        $footer = $('body >footer'),
        $main = $('#main'),
        bodyHeight = $('body').height(),
        headerHeight = 0,
        footerHeight = 0,
        $confirm = $("#confirm");

    /* 确认框初始化 start */
    $confirm.css({
        'top': $header.height()
    });
    $confirm.find('button.cancel').click(function() {
        $confirm.fadeOut(200);
    });
    /* 确认框初始化 end */
    
    /******** 路由相关 start ********/
    // hash地址变化监听
    win.onhashchange = function() {
        hashAnalyze(location.hash);
    };
    // 页面刷新重新解析hash地址
    $(win).unload(function() {
        hashAnalyze(location.hash);
    });
    // 页面加载完毕解析hash地址
    $(function() {
        hashAnalyze(location.hash);
    });
    // hash地址解析
    function hashAnalyze(hash) {
        if (hash) {
            hash = hash.substring(1, hash.length);
            var hashArray = hash.split("#"),
                
                headerHash = hashArray[0],
                headerHashArray = headerHash.split("/"),
                headerPage = headerHashArray[0],
                headerParam = headerHashArray[1],

                mainHash = hashArray[1],
                mainHashArray = mainHash.split("/"),
                mainPage = mainHashArray[0],
                isShowHeader = mainHashArray[1] == "1",
                isShowFooter = mainHashArray[2] == "1",
                mainParam = mainHashArray[3];

            $footer.find('li[data-tab=' + mainPage + ']')
                   .addClass('active')
                   .siblings()
                   .removeClass('active');
                   
            headerModule(headerPage, headerParam);
            mainModule(mainPage, isShowHeader, isShowFooter, mainParam);
        } else {
            // hash地址为空跳转到首页
            headerModule('headerSearch');
            mainModule('home', true, true);
        }
    }
    // 加载主模块
    function mainModule(module, isShowHeader, isShowFooter, mainParam) {
        // 控制header，footer显示隐藏
        if (isShowHeader) {
            $header.show();
            headerHeight = $header.height();
        } else {
            $header.hide();
            headerHeight = 0;
        }
        if (isShowFooter) {
            $footer.show();
            footerHeight = $footer.height();
        } else {
            $footer.hide();
            footerHeight = 0;
        }
        // 设置主窗口高度和位置
        $main.css({
            'height': bodyHeight - headerHeight - footerHeight + 'px',
            'margin-top': headerHeight + 'px'
        });
        // 加载对应的主窗口模块
        $.ajax({
            type: 'get',
            url: './tpls/' + module + '.html',
            /*async: false,*/
            dataType: "html"
        }).success(function(tpl) {
            if (tpl) {
                $main.html(tpl);
                // 执行模块初始化方法
                if (win.App[module] && win.App[module].init) {
                    win.App[module].init(mainParam);
                }
            } else {
                $main.empty();
            }
        }).error(function(e) {
            $main.empty();
        });
    }
    // 加载header模块
    function headerModule(module, headerParam) {
        // 加载对应的标题头模块
        $.ajax({
            type: 'get',
            url: './tpls/' + module + '.html',
            /*async: false,*/
            dataType: "html"
        }).success(function(tpl) {
            if (tpl) {
                $header.html(tpl);
                // 执行模块初始化方法
                if (win.App[module] && win.App[module].init) {
                    win.App[module].init(headerParam);
                }
            } else {
                $header.empty();
            }
        }).error(function(e) {
            $header.empty();
        });
    }
    /******** 路由相关 end ********/
    // 对外暴露对象
    var common = $.extend(win.App.common || {}, {
        confirm: function(title, content, calback) {
            $confirm.find('p').text(content || '');
            $confirm.find('h4').text(title || '提示');
            $confirm.fadeIn(200);
            $confirm.find('button.confirm').click(function() {
                if (calback) {
                    calback();
                }
                $confirm.fadeOut(200);
            });
        },
        setCookie: function(name, value, exp) {
            var now = new Date();
            exp = exp || now.setTime(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        },
        getCookie: function(name) {
            var arr,
                reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            } else {
                return null;
            }
        },
        delCookie: function(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if (cval != null) {
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
            }
        }
    });
    win.App.common = common;
}(window, jQuery));
