// JavaScript Document
!(function(win, $, undefined) {
    //js 默认记载数值
    win.GLOBAL_includejs = Array();

    // 对外暴露对象
    var $$ = $.extend({}, {
        // 接口地址--各种请求地址
        serverAddr: 'http://192.168.1.110:8000/',
        // 相关配置
        config: {
            serverAddr: 'http://192.168.1.110:8000/',
            canRefresh: true,
            hideGlobalMenu: function() {
                showHideGlobalMenu(true);
            }
        },
        stack: [],
        // 时间转10位时间戳
        get10Time: function(time) {
            var date = time ? new Date(time) : new Date();
            return Math.round(date.getTime() / 1000);
        },
        // 10位时间戳转时间
        timeToStr: function(time, fmt) {
            return new Date(time * 1000).pattern(fmt || 'yyyy-MM-dd');
        },
        // 设置cookie，expiredays传 为30天
        setCookie: function(name, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + (expiredays || 30));
            document.cookie = name + "=" + escape(value) + ";expires=" + exdate.toGMTString();
        },
        // 获取cookie
        getCookie: function(name) {
            var arr,
                reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            } else {
                return null;
            }
        },
        // 删除cookie
        delCookie: function(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = $$.getCookie(name);
            if (cval != null) {
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
            }
        },
        // 页面跳转 核心方法
        redirect: function(url, option) {
            if (url) {
                // 设置可以刷新为true，加载代码时存在设置则置为false
                $$.config.canRefresh = true;
                // 设置全局菜单的按钮显示与隐藏
                setGlobalMenu();
                // 显示全局悬浮菜单
                showHideGlobalMenu(false);
                
                var trans, backUrl, fromGoBack = false;
                if (option) {
                    trans = option.trans;
                    backUrl = option.backUrl;
                    fromGoBack = option.fromGoBack;
                }

                var load = function(url, newid, trans) {
                    var url_arr = url.split('?');
                    var dir = url_arr[0].substring(0, url_arr[0].length - 5);
                    $.ajax({
                        url: url_arr[0] + '?v=' + Math.random(), // 这里是静态页的地址
                        type: "get", // 静态页用get方法，否则服务器会抛出405错误
                        cache: false,
                        dataType: 'text',
                        beforeSend: function(xmlHttp) {
                            xmlHttp.setRequestHeader("If-Modified-Since", "0");
                            xmlHttp.setRequestHeader("Cache-Control", "no-cache");
                        },
                        success: function(data) {
                            var result = $(data);
                            $("#div_list").children().css({
                                "display": "none"
                            });
                            $("#div_list").append($(result).attr({ id: newid }).hide());
                            var filedata = dir + '_data.js';
                            var fileview = dir + '_view.js';
                            loadCss(dir + ".css", dir.replace(/\//g, "_") + "_css");
                            loadJs(fileview, dir.replace(/\//g, "_") + "_view");
                            transition(trans, newid);
                            loadJs(filedata, dir.replace(/\//g, "_") + "_data");
                        }
                    });
                };
                // 页面已加载，加载数据
                var loadData = function() {
                    var url_arr = url.split('?');
                    var dir = url_arr[0].substring(0, url_arr[0].length - 5);
                    var filedata = dir + '_data.js';
                    loadJs(filedata, dir.replace(/\//g, "_") + "_data");
                };
                // 页面切换动画
                var transition = function(trans, newid) {
                    $$.setCookie("__NEWDIV__", newid);
                    if (typeof(trans) === "undefined") {
                        $("#div_list>#" + $$.getCookie("__OLDDIV__")).hide(0);
                        $("#div_list>#" + newid).fadeIn(500);
                    } else if (trans == "none") {
                        $("#div_list>#" + $$.getCookie("__OLDDIV__")).hide();
                        $("#div_list>#" + newid).show();
                    } else if (trans == "slideUp") {
                        $("#div_list>#" + $$.getCookie("__OLDDIV__")).slideUp(500);
                        $("#div_list>#" + newid).slideDown(500);
                    } else if (trans == "fadeIn") {
                        $("#div_list>#" + $$.getCookie("__OLDDIV__")).hide(0);
                        $("#div_list>#" + newid).fadeIn(500);
                    } else if (typeof(trans) === "function") {
                        trans($$.getCookie("__OLDDIV__"), newid);
                    } else {
                        $("#div_list>#" + $$.getCookie("__OLDDIV__")).hide();
                        $("#div_list>#" + newid).show();
                    }
                };

                // 将历史url存入栈
                if (url == 'index/index.html') {
                    $$.stack = [];
                } else if ($.inArray($$.getUrl(), $$.stack) == -1 &&
                               $.inArray(backUrl, $$.stack) == -1 &&
                               !fromGoBack) {
                    $$.stack.push(backUrl || $$.getUrl());
                }

                // 将当前页面存储到cookie
                $$.setCookie("__URL__", url);
                // 存储页面加载前显示的div id
                $$.setCookie("__OLDDIV__", $("div#div_list>div:visible").attr("id"));

                var url_arr = url.split('?'),
                    dir = url_arr[0].substring(0, url_arr[0].length - 5),
                    newid = dir.replace(/\//g, "_");

                // 判断要显示的页面是否存在
                if ($("div#div_list>div#" + newid).length == 0) {
                    // 不存在，加载页面，css, js 
                    load(url, newid, trans);
                } else {
                    // 显示
                    transition(trans, newid);
                    // 存在，直加载数据*_data.js
                    loadData();
                }
            }
        },
        // 获取当前显示的div id
        getNowDiv: function() {
            return $$.getCookie("__NEWDIV__");
        },
        // 删除div
        removeDiv: function(div) {
            if (div) {
                $('#' + div).remove();
                $('#' + div + '_css').remove();
                $('#' + div + '_view').remove();
                $('#' + div + '_data').remove();
            }
        },
        // 查询当前url中的参数的值
        getQueryString: function(name, url) {
            if (url === undefined) {
                url = $$.getUrl();
            }
            if (url.indexOf('?') == -1) {
                return undefined;
            }
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var q = url.split("?");
            var r = q[1].match(reg);
            if (r != null) return unescape(r[2]);
        },
        // 当前url
        getUrl: function() {
            return $$.getCookie("__URL__");
        },
        //eval JSON数据
        eval: function(s) {
            if (s.Status != undefined)
                return s;
            if ($.trim(s) == "") {
                s = {
                    Status: undefined
                };
            } else {
                try {
                    s = JSON.parse(s);
                } catch (e) {
                    s = {
                        Status: undefined
                    };
                }
            }
            return s;
        },
        // 加载js
        loadJavascript: function(url, done, fail) {
            $.getScript(url)
                .done(done)
                .fail(fail);
        },
        //重置表单隐藏input会被清空
        resetForm: function(formId) {
            //TODO
            if ($("#" + formId)[0]) {
                $("#" + formId)[0].reset();
            }
            //清空隐藏input值
            $("#" + formId + " input[type='hidden'][notNull!='notNull']").val("");
            $$.clearFormValid(formId);
        },
        // 清除表单的校验样式
        clearFormValid: function(formId) {
            //TODO
        },
        // ajax get
        get: function(url, succfunc, errfunc) {
            var urlToken = $$.getQueryString('Token', url),
                token = $$.getCookie('__TOKEN__');
            if (!urlToken && token) {
                if (url.indexOf('?') != -1) {
                    url += '&Token=' + token;
                } else {
                    url += '?Token=' + token;
                }
            }
            if (!url.startsWith($$.config.serverAddr)) {
                url = $$.config.serverAddr + url;
            }
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (succfunc) {
                        succfunc($$.eval(data));
                    }
                },
                error: function(error) {
                    if (errfunc) {
                        errfunc(error);
                    }
                }
            });
        },
        // ajax post
        post: function(url, data, succfunc, errfunc) {
            // 获取Token
            var token = $$.getToken();
            if (!url.startsWith($$.config.serverAddr)) {
                url = $$.config.serverAddr + url;
            }
            $.ajax({
                url: url,
                data: $.extend(data, {
                    Token: token
                }),
                type: 'POST',
                dataType: 'json',
                success: function(data) {
                    if (succfunc) {
                        succfunc($$.eval(data));
                    }
                },
                error: function(error) {
                    if (errfunc) {
                        errfunc(error);
                    }
                }
            });
        },
        // 设置Token到cookies
        setToken: function(token) {
            $$.setCookie('__TOKEN__', token);
            $$.setCookie('__DFTCAR__', analyzeToken(token).UserCarID);
        },
        // 获取token
        getToken: function() {
            // 判断cookies
            var token = $$.getCookie('__TOKEN__');
            if (!token) {
                //if (!$('#login_login').is(':visible')) {
                // 没有登录并且没有显示登录界面跳转到登录页面
                $$.redirect('login/login.html', {
                    trans: 'none'
                });
                //}
            } else {
                return token;
            }
        },
        // 获取用户信息（默认车辆、默认收货地址。。。。）
        getUserInfo: function() {
            var token = $$.getToken();
            if (!token) {
                return false;
            }
            return analyzeToken(token);
        },
        // 获取用户id
        getUserId: function() {
            return $$.getUserInfo().UserID;
        },
        // 获取用户手机号
        getUserMobile: function() {
            return $$.getUserInfo().Mobile;
        },
        // 后台请求是否登录
        isLogin: function() {
            // TODO
            //getToken();
        },
        // 在当前请求的url后拼接返回的参数
        // 例：$$.redirect('test/test.html?a=1&' + $$.goBackUrl());
        // 例：$$.redirect('test/test.html?' + $$.goBackUrl());
        goBackUrl: function(url) {
            if (!url) {
                url = $$.getUrl();
            }
            if (!url) {
                return false;
            }
            if (url.indexOf('__GOBACK__=') != -1) {
                var goBackStartIndex = url.indexOf('__GOBACK__='),
                    goBackEndIndex = url.indexOf('&', goBackStartIndex);
                if (goBackEndIndex != -1) {
                    url = url.substring(goBackStartIndex, goBackEndIndex);
                } else {
                    url = url.substring(0, url.indexOf('__GOBACK__=') - 1);
                }
            }
            return '__GOBACK__=' + escape(url);
        },
        // 调用返回上次页面
        goBack: function() {
            if ($$.stack.length > 0) {
                $$.redirect($$.stack.pop(), {
                    'fromGoBack': true
                });
            } else {
                $$.redirect('index/index.html', {
                    'fromGoBack': true
                });
            }
        },
        // 设置返回
        setGoBack: function(selector) {
            if (selector.prop('tagName') == 'A') {
                selector.attr('href', 'javascript:$$.goBack();');
            } else {
                selector.off('click').on('click', function() {
                    $$.goBack();
                });
            }
        },
        reloadData: function() {

        },
        imgFilter: function(img) {
            if (img) {
                return img;
            } else {
                return 'NoImg/' + Math.random() + '.jpg';
            }
        }
    });
    // 解析Token
    function analyzeToken(token) {
        var uInfo = Base64.decode(token);
        //uInfo = uInfo.substring(0, uInfo.length - 1);
        var uObj = JSON.parse(uInfo);
        return uObj;
    }
    // 加载js
    function loadJs(file, id) {
        $('#' + id).remove();
        $("<scri" + "pt>" + "</scr" + "ipt>").attr({ src: file + '?v=' + Math.random(), type: 'text/javascript', id: id }).appendTo('body');
    }
    // 加载css
    function loadCss(file, id) {
        $('#' + id).remove();
        $("<link />").attr({ href: file + '?v=' + Math.random(), type: 'text/css', rel: "stylesheet", id: id }).appendTo('head');
    }
    // 处理刷新后显示当前页面
    var rdtUrl = $$.getQueryString('__RDTURL__', location.search);
    if (rdtUrl && rdtUrl != $$.getCookie('__RDTURLCOOKIE__')) {
        $$.setCookie('__RDTURLCOOKIE__', unescape(rdtUrl), 10 / 60 / 60 / 24);
        // 跳到指定页面
        $$.redirect(rdtUrl);
    } else if ($$.getUrl()) {
        $$.redirect($$.getUrl());
    } else {
        // 默认加载首页
        $$.redirect('index/index.html');
    }
    // 使a标签默认的调转事件转为$$.redirect
    $('#div_list').on('click', 'a', function(e) {
        var url = $(this).attr('href');
        if (url.indexOf('.html') != -1) {
            e.preventDefault();
            $$.redirect(url, {
                'trans': $(this).attr('data-tran')
            });
        }
    });
    /* artTemplate 相关过滤器 start */
    // 图片为空替换默认
    template.defaults.imports.imgFilter = function(img) {
        if (img) {
            return img;
        } else {
            return 'NoImg/' + Math.random() + '.jpg';
        }
    };
    // 10位时间戳转时间yyyy-MM-dd hh:mm:ss
    template.defaults.imports.timeFilter = function(time) {
        return new Date(time * 1000).pattern('yyyy-MM-dd hh:mm:ss');
    };
    // 字符串截取为数组
    template.defaults.imports.splitFilter = function(str, sign) {
        if (str) {
            return str.split(sign || ',');
        } else {
            return [];
        }
    };
    // json parse
    template.defaults.imports.jsonParseFilter = function(str) {
        if (str) {
            return JSON.parse(str);
        }
    };
    /* artTemplate 相关过滤器 end */
    // ajax 全局设置，增加加载动画
    $(document).ajaxStart(function() {
        //layer.closeAll('loading');
        layer.load();
    }).ajaxStop(function() {
        layer.closeAll('loading');
    });
    // 配置微信
    !(function() {
        $$.get(
            'Product/WeChat/GetSign?url=' + escape(location.href),
            function(res) {
                if (wx) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: 'wx2c53034422e377cc', // 必填，公众号的唯一标识
                        timestamp: res.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.noncestr, // 必填，生成签名的随机串
                        signature: res.sign, // 必填，签名，见附录1
                        jsApiList: ['getLocation','onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone']
 // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                }
            }
        );
    }());
    /* 全局菜单相关 start */
    !(function(win, $, undefined) {
        var $menu = $('#global_menu'),
            _bodyH = window.innerHeight || document.body.clientHeight,
            _bodyW = window.innerWidth || document.body.clientWidth,
            _halfW = $menu.width() / 2,
            _halfH = $menu.height() / 2,
            isClick = true;
        // 拖拽相关
        $menu.on('touchstart', function(e) {
            isClick = true;
            if (!$menu.hasClass('active')) {
                setGlobalMenu();
            }
        }).on('touchmove', function(e) {
            e.preventDefault();
            var _touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
                _x = _touch.pageX,
                _y = _touch.pageY;
            isClick = false;
            if (!isClick) {
                setPosition(_x, _y);
            }
        }).on('touchend', function(e) {
            e.preventDefault();
            var _touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
                _x = _touch.pageX;

            if (isClick) {
                openCloseMenu(_x);
            }
        });
        // 菜单点击事件
        $menu.on('touchend', 'li', function(e) {
            isClick = false;
            var _touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
                _x = _touch.pageX,
                type = $(this).attr('data-type'),
                url = $$.getUrl();
            openCloseMenu(_x);
            
            switch(type) {
                case 'refresh': {
                    var url_arr = url.split('?'),
                        dir = url_arr[0].substring(0, url_arr[0].length - 5),
                        filedata = dir + '_data.js';
                    loadJs(filedata, dir.replace(/\//g, "_") + "_data");
                } break;
                case 'index': {
                    if (url.indexOf('index/index.html') == -1) {
                        $$.redirect('index/index.html');
                    }
                } break;
                case 'icenter': {
                    if (url.indexOf('pageHome/pageHome.html') == -1) {
                        $$.redirect('pageHome/pageHome.html', {
                            fromGoBack: true
                        });
                    }
                } break;
            }
        });
        // 展开收起菜单
        function openCloseMenu(_x) {
            var lis = $menu.find('li').not('.hide'),
                i = 0;
            if ($menu.hasClass('active')) {
                for (i = 0; i < lis.length; i++) {
                    $(lis[i]).animate({
                        'right': 0
                    }, 200);
                }
                $menu.removeClass('active').find('>span').text('菜单');
                $menu.find('>ul').fadeOut(200);
            } else {
                $menu.find('>ul').show();
                for (i = 0; i < lis.length; i++) {
                    $(lis[i]).animate({
                        'right': (i + 1) * _halfW * 2 * (_x < _bodyW / 2 ? -1 : 1)
                    }, 200);
                }
                $menu.addClass('active').find('>span').text('收起');
            }
        }
        // 设置菜单位置
        function setPosition(_x, _y) {
            if (_x >= _bodyW - _halfW) {
                _x = _bodyW - _halfW;
            } else if (_x - _halfW <= 0) {
                _x = _halfW;
            }
            if (_y >= _bodyH - _halfH) {
                _y = _bodyH - _halfH;
            } else if (_y - _halfH <=0) {
                _y = _halfH;
            }
            $menu.css({
                'top': _y - _halfH,
                'left': _x - _halfW
            });
        }
    }(win, $, undefined));
    // 设置全局菜单的按钮显示与隐藏
    function setGlobalMenu() {
        var $menu = $('#global_menu'),
            lis = $menu.find('li').removeClass('hide'),
            url = $$.getUrl();
        if (!url) {
            return false;
        }
        if (!$$.config.canRefresh) {
            $menu.find('li[data-type=refresh]').addClass('hide');
        }
        if (url.indexOf('pageHome/pageHome.html') != -1) {
            $menu.find('li[data-type=icenter]').addClass('hide');
        }
        if (url.indexOf('index/index.html') != -1) {
            $menu.find('li[data-type=index]').addClass('hide');
        }
        lis.css({
            'right': 0
        });
        $menu.removeClass('active').find('>span').text('菜单');
        $menu.find('>ul').hide();
    }
    // 是否隐藏全局悬浮菜单
    function showHideGlobalMenu(isHide) {
        if (isHide) {
            $('#global_menu').hide();
        } else {
            $('#global_menu').show();
        }
    }
    /* 全局菜单相关 end */
    win.$$ = $$;
}(window, jQuery));
/** ************************************************常用工具**************************************** */
//日期
Date.prototype.pattern = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份           
        "d+": this.getDate(), //日           
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
        "H+": this.getHours(), //小时           
        "m+": this.getMinutes(), //分           
        "s+": this.getSeconds(), //秒           
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度           
        "S": this.getMilliseconds() //毫秒           
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};