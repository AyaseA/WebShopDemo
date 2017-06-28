// JavaScript Document
!(function(win, $, undefined) {
    //js 默认记载数值
    win.GLOBAL_includejs = Array();

    // 微信签名
    var weChatSign = {};
    // 对外暴露对象
    var $$ = $.extend({}, {
        // 接口地址--各种请求地址
        serverAddr: 'http://api.cheshili.com.cn/',
        // 相关配置
        config: {
            // 接口地址--各种请求地址
            serverAddr: 'http://api.cheshili.com.cn/',
            // 悬浮菜单刷新是否可用
            canRefresh: true,
            // 隐藏悬浮菜单
            hideGlobalMenu: function() {
                showHideGlobalMenu(true);
            }
        },
        // 存放浏览记录
        stack: (function() {
            function get() {
                var stackStr = sessionStorage.getItem('__STACK__');
                if (stackStr) {
                    return JSON.parse(stackStr);
                } else {
                    return [];
                }
            }
            function set(stackArr) {
                if (stackArr instanceof Array) {
                    sessionStorage.setItem('__STACK__', JSON.stringify(stackArr));
                }
            }
            var clear = function() {
                sessionStorage.removeItem('__STACK__');
            };
            var getLast = function() {
                var stackArr = get();
                if (stackArr,length > 0) {
                    return stackArr[stackArr.length - 1];
                } else {
                    return '';
                }
            };
            var pop = function() {
                var stackArr = get();
                if (stackArr.length > 0) {
                    var url = stackArr.pop();
                    set(stackArr);
                    return url;
                } else {
                    return '';
                }
            };
            var push = function(url, backUrl, fromGoBack) {
                if (url.indexOf('?') != -1) {
                    var urlArr = url.split('?');
                    urlArr[1] = urlArr[1].replace(/(^|&)code=([^&]*)/i, '');
                    urlArr[1] = urlArr[1].replace(/(^|&)str=([^&]*)/i, '');
                    urlArr[1] = urlArr[1].replace(/(^&*)|(&*$)/g,'');
                    url = urlArr[0] + (urlArr[1] ? '?' + urlArr[1] : '');
                }
                
                var stackArr = get();
                if ($.inArray(url, stackArr) == -1 &&
                    $.inArray(backUrl, stackArr) == -1 &&
                    !fromGoBack) {
                    stackArr.push(backUrl || url);
                    set(stackArr);
                }
            };
            var isEmpty = function() {
                var stackStr = get();
                if (stackStr.length > 0) {
                    return false;
                } else {
                    return true;
                }
            };
            return {
                clear: clear,
                pop: pop,
                push: push,
                getLast: getLast,
                isEmpty: isEmpty
            };
        }()),
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
        // 获取随即字符串
        getRandomCode: function(length) {
            var str = '0123456789abcdefghijklmnopqrstuvwxyzBCDEFGHIJKLMNOPQRSTUVWXYZ',
                strLength = str.length,
                strArr = str.split(''),
                randomCode = '';
            length = length || 32;
            for (var i = 0; i < length; i++) {
                randomCode += strArr[Math.floor(Math.random() * strLength)];
            }
            return randomCode;
        },
        // 图片为空替换默认
        imgFilter: function(img) {
            if (img) {
                return img;
            } else {
                return 'NoImg/' + Math.random() + '.jpg';
            }
        },
        // 返回微信签名，参数为true，强制重新获取
        getWeChatSign: function(reGet) {
            if ($.isEmptyObject(weChatSign) || (reGet || false)) {
                $.ajax({
                    url: $$.config.serverAddr +
                         'Product/WeChat/GetSign?url=' +
                         escape(location.href),
                    type: 'GET',
                    async: false, // 同步
                    dataType: 'json',
                    success: function(res) {
                        if (res) {
                            weChatSign = res;
                        }
                    }
                });
            }
            return weChatSign;
        },
        // 获取地理信息
        getLocationInfo: function() {
            var ltInfo = $$.getCookie('__LOCATION__');
            if (ltInfo) {
                ltInfo = JSON.parse(ltInfo);
            } else {
                ltInfo = {
                    // 地区
                    name: '历下区',
                    // 经度
                    longitude: 117.10956,
                    // 纬度
                    latitude: 36.68165,
                    // 地区id
                    id: 370102
                };
                $$.setCookie('__LOCATION__', JSON.stringify(ltInfo));
            }
            return ltInfo;
        },
        // 设置地理信息
        //{name: '历下区',longitude: 117.10956,latitude: 36.68165,id: 370102}
        setLocationInfo: function(ltInfo) {
            if (ltInfo instanceof Object && !$.isEmptyObject(ltInfo)) {
                $$.setCookie('__LOCATION__', JSON.stringify(ltInfo));
            }
        },
        // 加载js
        loadJavascript: function(url, done, fail) {
            $.getScript(url)
                .done(done)
                .fail(fail);
        },
        // 后台溜一圈
        refresh: function(url, status) {
            if (url) {
                url = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
                      'appid=wx2c53034422e377cc&redirect_uri=' +
                      'http%3A%2F%2Fapi.cheshili.com.cn%2FCSL%2FLogin%2FHandleWUri%3Furl%3D' +
                      escape(escape(url)) +
                      '&response_type=code&scope=snsapi_base&state=' + status +
                      '#wechat_redirect';
                location.href = url;
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
                if (url.indexOf('index/index.html') != -1) {
                    $$.stack.clear();
                } else{
                    $$.stack.push($$.getUrl(), backUrl, fromGoBack);
                }

                // 将当前页面存储到cookie
                $$.setCookie("__URL__", url);
                
                // 存储页面加载前显示的div id
                $$.setCookie("__OLDDIV__", $("div#div_list>div:visible").attr("id"));

                var url_arr = url.split('?'),
                    dir = url_arr[0].substring(0, url_arr[0].length - 5),
                    newid = dir.replace(/\//g, "_");

                    //setTimeout(function() {
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
                    //}, 5000);
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
        // ajax get
        get: function(url, succfunc, errfunc, isSync) {
            var urlToken = $$.getQueryString('WToken', url),
                token = $$.getCookie('__TOKEN__');
            if (!urlToken && token) {
                if (url.indexOf('?') != -1) {
                    url += '&WToken=' + token;
                } else {
                    url += '?WToken=' + token;
                }
            }
            if (!url.startsWith($$.config.serverAddr)) {
                url = $$.config.serverAddr + url;
            }
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                async: isSync ? false : true,
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
        post: function(url, data, succfunc, errfunc, isSync) {
            // 获取Token
            var token = $$.getToken();
            if (token) {
                if (!url.startsWith($$.config.serverAddr)) {
                    url = $$.config.serverAddr + url;
                }
                if (!data.Token) {
                    $.extend(data, {
                        WToken: token
                    });
                }
                $.ajax({
                    url: url,
                    data: data,
                    type: 'POST',
                    dataType: 'json',
                    async: isSync ? false : true,
                    success: function(data) {
                        data = $$.eval(data);
                        if (data.Status == -1) {
                            $$.refreshConfirm();
                        } else if (succfunc) {
                            succfunc(data);
                        }
                    },
                    error: function(error) {
                        if (errfunc) {
                            errfunc(error);
                        }
                    }
                });
            }
        },
        // 设置Token到cookies
        setToken: function(token) {
            $$.setCookie('__TOKEN__', token);
            // 获取个人信息
            $.ajax({
                url: $$.config.serverAddr + 'CSL/User/GetInfoByToken',
                type: 'POST',
                data: {
                    WToken: token
                },
                dataType: 'json',
                success: function(res) {
                    if (res.Status == 0 && res.Data.Info) {
                        $$.setCookie('__UINFO__', res.Data.Info);
                    }
                }
            });
        },
        // 获取token
        // showConfirm不传，不弹是否授权框，callback也不传值
        // showConfirm传，callback不传，返回之前页面
        // showConfirm传，callback为function，执行function
        // showConfirm传，callback为null，隐藏弹框
        getToken: function(showConfirm, callback) {
            // 判断cookies 
            var token = $$.getCookie('__TOKEN__');
            if (token) {
                return token;
            } else if (showConfirm) {
                authConfirm(function() {
                    if (typeof callback === 'undefined') {
                        $$.goBack();
                    } else if (typeof callback === 'function') {
                        callback();
                    }
                });
            }
            return false;
        },
        // 用户是否登录
        // showConfirm不传，不弹是否授权框，callback也不传值
        // showConfirm传，callback不传，返回之前页面
        // showConfirm传，callback为function，执行function
        // showConfirm传，callback为null，隐藏弹框
        isLogin: function(showConfirm, callback) {
            var token = $$.getCookie('__TOKEN__');
            if (token) {
                return true;
            } else if (showConfirm) {
                authConfirm(function() {
                    if (typeof callback === 'undefined') {
                        $$.goBack();
                    } else if (typeof callback === 'function') {
                        callback();
                    }
                });
            }
            return false;
        },
        // 获取用户信息（默认车辆、默认收货地址。。。。）
        getUserInfo: function() {
            var uInfoStr = $$.getCookie('__UINFO__');
            if (!uInfoStr) {
                return false;
            }
            return analyzeToken(uInfoStr);
        },
        // 设置个人信息
        setUserInfo: function(name, value) {
            var uInfo = $$.getUserInfo();
            if (uInfo) {
                uInfo[name] = value;
                $$.setCookie('__UINFO__', escape(Base64.encode(JSON.stringify(uInfo))));
            }
        },
        // 获取用户id
        getUserId: function() {
            if ($$.getUserInfo()) {
                return $$.getUserInfo().UserID;
            }
        },
        // 获取用户手机号
        getUserMobile: function() {
            if ($$.getUserInfo()) {
                return $$.getUserInfo().Mobile;
            }
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
            if (!$$.stack.isEmpty()) {
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
        // 提示用户刷新
        refreshConfirm: function() {
            layer.open({
                area: '80%',
                shade: 0.3,
                title: false, //不显示标题栏
                closeBtn: false,
                btn: [],
                id: 'refreshConfirm_refreshConfirm',
                content: template('refreshConfirm_refreshConfirm_cnt', {}),
                success: function(modal) {
                    modal.css({
                        'border-radius': '8px'
                    });
                    modal.find('.layui-layer-btn').remove();
                    modal.find('button.cancel').off('click').on('click', function() {
                        layer.closeAll();
                    });
                    modal.find('button.refresh').off('click').on('click', function() {
                        $$.refresh($$.getUrl(), 0);
                        layer.closeAll();
                    });
                }
            });
        }
    });

    // 处理刷新后显示当前页面
    var rdtUrl = $$.getQueryString('R', location.search);
    if (rdtUrl) {
        // 跳到指定页面
        $$.redirect(unescape(rdtUrl));
    } else {
        // 默认加载首页
        $$.redirect('index/index.html');
    }
    // 是否授权
    !(function() {
        /*********** 相关方法定义 ************/
        // 解析url参数
        var paramHandle = function(url) {
            // 获取当前url
            var currentUrl = url;
            if (url.indexOf('?R=') != -1) {
                url = unescape(url.split('?')[1]);
            }
            var code = $$.getQueryString('code', url),
                str = $$.getQueryString('str', url);

            // url替换处理
            urlHandle(currentUrl);
            if (code == '0') {
                // 保存token
                if (str.length == 32) {
                    $$.setToken(str);
                }
            } else if (code == '1') {
                // 未授权
            } else {
                // 其他状态都视为网络的锅
            }
        };
        // url替换处理
        var urlHandle = function(url) {
            if (url.indexOf('?') != -1) {
                var urlArr = url.split('?');
                urlArr[1] = urlArr[1].replace(/(^|&)code=([^&]*)/i, '');
                urlArr[1] = urlArr[1].replace(/(^|&)str=([^&]*)/i, '');
                urlArr[1] = urlArr[1].replace(/(^&*)|(&*$)/g,'');
                url = urlArr[0] + (urlArr[1] ? '?' + urlArr[1] : '');
            }
            if (wechatInfo[1] < '6.2') {
                // 微信6.2以下版本相应处理
                location.href = url;

            } else {
                // 微信6.2及以上版本相应处理
                history.pushState({}, '', url);
            }
        };

        /********* 开始处理 *********/
        // 请求后台获取webtoken
        var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
        if (wechatInfo) {
            // 解析url参数
            paramHandle(location.href);
        } else {
            $$.delCookie('__TOKEN__');
            $$.delCookie('__UINFO__');
        }
    }());
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
    // ajax 全局设置，增加加载动画
    $(document).ajaxStart(function() {
        //layer.closeAll('loading');
        layer.load();
    }).ajaxStop(function() {
        layer.closeAll('loading');
    });
    /* 全局菜单相关 start */
    !(function(win, $, undefined) {
        var $menu = $('#global_menu'),
            _bodyH = window.innerHeight || document.body.clientHeight,
            _bodyW = window.innerWidth || document.body.clientWidth,
            _halfW = $menu.width() / 2,
            _halfH = $menu.height() / 2,
            isClick = true;
        // 拖拽相关
        $menu.on('touchstart, mousedown', function(e) {
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
                if ($menu.hasClass('active')) {
                    openCloseMenu(_x);
                }
            }
        }).on('touchend, mouseup', function(e) {
            e.preventDefault();
            var _touch;
            if (e.type == 'touchend') {
                _touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            } else {
                _touch = e.originalEvent;
            }
            var _x = _touch.pageX;

            if (isClick) {
                openCloseMenu(_x);
            }
        });
        // 菜单点击事件
        $menu.on('touchend, mouseup', 'li', function(e) {
            isClick = false;
            var _touch;
            if (e.type == 'touchend') {
                _touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            } else {
                _touch = e.originalEvent;
            }
            var _x = _touch.pageX,
                type = $(this).attr('data-type'),
                url = $$.getUrl();
            openCloseMenu(_x);
            var aa = sessionStorage.getItem('a') || 1;
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
                // 测试用
                case 'test': {
                    $$.redirect($(this).attr('data-url'));
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
                        'right': ((i + 1) * (_halfW + 0.5) * 2) * (_x < _bodyW / 2 ? -1 : 1)
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
    /* 全局菜单相关 end */

    /** 定义相关方法 start **/
    // 获取授权提示
    function authConfirm(refuseCalbck, allowCalBck) {
        layer.open({
            area: '80%',
            shade: 0.3,
            title: false, //不显示标题栏
            closeBtn: false,
            btn: [],
            id: 'authConfirm_authConfirm',
            content: template('authConfirm_authConfirm_cnt', {}),
            success: function(modal) {
                modal.css({
                    'border-radius': '8px'
                });
                modal.find('.layui-layer-btn').remove();
                modal.find('button.refuse').off('click').on('click', function() {
                    if (refuseCalbck) {
                        refuseCalbck();
                    }
                    layer.closeAll();
                });
                modal.find('button.allow').off('click').on('click', function() {
                    if (allowCalBck) {
                        allowCalBck();
                    } else {
                        $$.redirect('wechatLogin/wechatLogin.html');
                    }
                    layer.closeAll();
                });
            }
        });
    }
    // 解析Token
    function analyzeToken(token) {
        var uInfo = Base64.decode(unescape(token)),
            uObj = JSON.parse(uInfo);
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
    /** 定义相关方法 end **/
    /* artTemplate 相关过滤器 end */
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
    // string to int
    template.defaults.imports.intFilter = function(str) {
        if (str) {
            return parseInt(str) || 0;
        }
    };
    // string to float
    template.defaults.imports.floatFilter = function(str) {
        if (str) {
            return (parseFloat(str) || 0).toFixed(2);
        }
    };
    /* artTemplate 相关过滤器 start */
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