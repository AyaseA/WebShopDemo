// JavaScript Document
!(function(win, $, undefined) {
    //js 默认记载数值
    win.GLOBAL_includejs = Array();
    
    // 对外暴露对象
    var $$ = $.extend({}, {
        // 接口地址--各种请求地址
        serverAddr: 'http://192.168.1.110:8000/',

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
            var cval = getCookie(name);
            if (cval != null) {
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
            }
        },
        // 页面跳转 核心方法
        redirect: function(url, trans) {
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
                        loadJs(filedata, dir.replace(/\//g, "_") + "_data");
                        transition(trans, newid);
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
                    $("div#div_list>div#" + $$.getCookie("__OLDDIV__")).hide();
                    $("div#div_list>div#" + newid).show();
                }
                if (trans == "slideUp") {
                    $("div#div_list>div#" + $$.getCookie("__OLDDIV__")).slideUp(500);
                    $("div#div_list>div#" + newid).slideDown(500);
                }
                if (trans == "fadeIn") {
                    $("div#div_list>div#" + $$.getCookie("__OLDDIV__")).hide(0);
                    $("div#div_list>div#" + newid).fadeIn(500);
                }
                if (typeof(trans) === "function") {
                    trans($$.getCookie("__OLDDIV__"), newid);
                }
            };
            // 将当前页面存储到cookie
            $$.setCookie("__URL__", url);
            // 存储页面加载前显示的div id
            $$.setCookie("__OLDDIV__", $("div#div_list>div:visible").attr("id"));
            var url_arr = url.split('?');
            var dir = url_arr[0].substring(0, url_arr[0].length - 5);
            var newid = dir.replace(/\//g, "_");
            // 判断要显示的页面是否存在
            if ($("div#div_list>div#" + newid).length == 0) {
                // 不存在，加载页面，css, js 
                load(url, newid, trans);
            } else{
                // 存在，直加载数据*_data.js
                loadData();
                // 显示
                transition(trans, newid);
            }
        },
        // 获取当前显示的div id
        getNowDiv: function() {
            return $$.getCookie("__NEWDIV__");
        },
        // 查询当前url中的参数的值
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var q = $$.getUrl().split("?");
            var r = q[1].match(reg);
            if (r != null) return unescape(r[2]);
        },
        getUrlQueryStr: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = location.search.substr(1).match(reg);
            if (r != null) 
                return unescape(decodeURI(r[2]));
            return null;
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
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (succfunc) {
                        succfunc(data);
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
            $.ajax({
                url: url,
                data: $.extend(data, {
                    Token: token
                }),
                type: 'POST',
                dataType: 'json',
                success: function(data) {
                    if (succfunc) {
                        succfunc(data);
                    }
                },
                error: function(error) {
                    if (errfunc) {
                        errfunc(error);
                    }
                }
            });
        },
        // 获取token
        getToken: function() {
            // 判断cookies
            var token = $$.getCookie('__TOKEN__');
            if (!token) {
                // 没有登录跳转到登录页面
                // TODO
                //return false;
            }
            return token;
        },
        // 获取用户信息（默认车辆、默认收货地址。。。。）
        getUserInfo: function() {
            var token = $$.getToken();
            if (!token) {
                return false;
            }
            var uInfo = Base64.decode(token);
            uInfo = uInfo.substring(0, uInfo.length - 1);
            var uObj = JSON.parse(uInfo);
            return uObj;
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
            if (url.indexOf('__GOBACK__=') != -1) {
                url = url.substring(0, url.indexOf('__GOBACK__=') - 1);
            }
            return '__GOBACK__=' + escape(url);
        },
        // 设置返回
        setGoBack: function(selector) {
            var url = $$.getQueryString('__GOBACK__');
            if (url) {
                selector.attr('href', url);
            }
        },
        // 设置Token到cookies
        addToken: function(token) {
            $$.setCookie('__TOKEN__', token);
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
    if ($$.getUrlQueryStr('__RDTURL__')) {
        // 跳到指定页面
        $$.redirect(unescape($$.getUrlQueryStr('__RDTURL__')));
        history.pushState({}, '', location.href.split('?')[0]);
    } else if ($$.getUrl()) {
        $$.redirect($$.getUrl());
    } else {
        // 默认加载首页
        $$.redirect('index/index.html');
    }
    // 使a标签默认的调转事件转为$$.redirect
    $('#div_list').on('click', 'a', function(e) {
        e.preventDefault();
        var url = $(this).attr('href');
        if (url.indexOf('.html') != -1) {
            $$.redirect(url + (
                url.indexOf('?') != -1 ?
                    ('&' + $$.goBackUrl()) :
                    ('?' + $$.goBackUrl())
            ), $(this).attr('data-tran'));
        }
    });
    template.defaults.imports.imgFilter = function(img){
        if (img) {
            return img;
        } else {
            return 'NoImg/' + Math.random() + '.jpg';
        }
    };
    template.defaults.imports.timeFilter = function(time){
        return new Date(time*1000).pattern('yyyy-MM-dd hh:mm:ss');
    };
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
