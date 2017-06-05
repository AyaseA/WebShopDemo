// JavaScript Document
!(function(win, $, undefined) {
    //js 默认记载数值
    win.GLOBAL_includejs = Array();

    // 对外暴露对象
    var $$ = $.extend({}, {
        get10Time: function(time) {
            var date = time ? new Date(time) : new Date();
            return Math.round(date.getTime() / 1000);
        },
        timeToStr: function(time, fmt) {
            return new Date(time * 1000).pattern(fmt || 'yyyy-MM-dd');
        },
        setCookie: function(name, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + (expiredays || 30));
            document.cookie = name + "=" + escape(value) + ";expires=" + exdate.toGMTString();
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
        },
        loadJs: function(file, id) {
            $('#' + id).remove();
            $("<scri" + "pt>" + "</scr" + "ipt>").attr({ src: file, type: 'text/javascript', id: id }).appendTo('body');
        },
        loadCss: function(file, id) {
            $('#' + id).remove();
            $("<link />").attr({ href: file, type: 'text/css', rel: "stylesheet", id: id }).appendTo('head');
        },
        redirect: function(url, trans) {
            var load = function(url, newid, trans) {
                var url_arr = url.split('?');
                var dir = url_arr[0].substring(0, url_arr[0].length - 5);
                $.ajax({
                    url: url_arr[0], // 这里是静态页的地址
                    type: "get", // 静态页用get方法，否则服务器会抛出405错误
                    cache: false,
                    dataType: 'text',
                    beforeSend: function(xmlHttp) {
                        xmlHttp.setRequestHeader("If-Modified-Since", "0");
                        xmlHttp.setRequestHeader("Cache-Control", "no-cache");
                    },
                    success: function(data) {
                        var result = $(data);
                        console.log(result);
                        $("#div_list").children().css({
                            "display": "none"
                        });
                        $("#div_list").append($(result).attr({ id: newid }));
                        var filedata = dir + '_data.js';
                        var fileview = dir + '_view.js';
                        $$.loadCss(dir + ".css", dir.replace(/\//g, "_") + "_css");
                        $$.loadJs(fileview, dir.replace(/\//g, "_") + "_view");
                        $$.loadJs(filedata, dir.replace(/\//g, "_") + "_data");
                        transition(trans, newid);
                    }
                });
            };
            var loadData = function() {
                var url_arr = url.split('?');
                var dir = url_arr[0].substring(0, url_arr[0].length - 5);
                var filedata = dir + '_data.js';
                $$.loadJs(filedata, dir.replace(/\//g, "_") + "_data");
            };
            var transition = function(trans, newid) {
                $$.setCookie("__NEWDIV__", newid);
                if (typeof(trans) === "undefined") {
                    $("div#div_list>div#" + $$.getCookie("__OLDDIV__")).hide(0);
                    $("div#div_list>div#" + newid).show(0);
                }
                if (trans == "slideup") {
                    //TODO
                }
                if (trans == "fadeIn") {
                    $("div#div_list>div#" + $$.getCookie("__OLDDIV__")).fadeOut(1000);
                    $("div#div_list>div#" + newid).fadeIn(1000);
                }
                if (typeof(trans) === "function") {
                    trans($$.getCookie("__OLDDIV__"), newid);
                }
            };
            $$.setCookie("__URL__", url);
            $$.setCookie("__OLDDIV__", $("div#div_list>div:visible").attr("id"));
            var url_arr = url.split('?');
            var dir = url_arr[0].substring(0, url_arr[0].length - 5);
            var newid = dir.replace(/\//g, "_");
            if ($("div#div_list>div#" + newid).length == 0) {
                load(url, newid, trans);
            } else {
                loadData();
                transition(trans, newid);
            }
        },
        getNowDiv: function() {
            return $$.getCookie("__NEWDIV__");
        },
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var q = $$.getUrl().split("?");
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
        /* 清除表单的校验样式 */
        clearFormValid: function(formId) {
            //TODO
        },
        get: function(url, succfunc, errfunc) {
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: succfunc,
                error: errfunc
            });
        },
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
                success: succfunc,
                error: errfunc
            });
        },
        // 获取token
        getToken: function() {
            // 判断cookies
            var token = $$.getCookie('__TOKEN__');
            if (!token) {
                // 没有登录跳转到登录页面
                // TODO
                return false;
            }
            return token;
        },
        // 获取用户信息（默认车辆、默认收货地址。。。。）
        getUserInfo: function() {
            // TODO
        },
        // 获取用户id
        getUserId: function() {
            return $$.getUserInfo().ID;
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
        // 例：$$.redirect('test/test.html?a=1' + $$.goBackUrl());
        goBackUrl: function(url) {
            if (!url) {
                url = $$.getUrl();
            }
            return escape('&goBack=' + url);
        },
        // 设置Token到cookies
        addToken: function(token) {
            $$.setCookie('__TOKEN__', token);
        },
        reloadData: function() {

        }
    });
    // 处理刷新后显示当前页面
    if ($$.getUrl()) {
        $$.redirect($$.getUrl());
    }
    win.$$ = $$;
}(window, jQuery));
/** ************************************************常用工具**************************************** */
// 获取数组最大值
Array.prototype.max = function() {
    var max = parseInt(this[0]);
    var len = this.length;
    for (var i = 1; i < len; i++) {
        if (parseInt(this[i]) > max) {
            max = parseInt(this[i]);
        }
    }
    return max;
};
//获取数组最小值
Array.prototype.min = function() {
    var max = parseInt(this[0]);
    var len = this.length;
    for (var i = 1; i < len; i++) {
        if (parseInt(this[i]) < max) {
            max = parseInt(this[i]);
        }
    }
    return max;
};
//数组求和
Array.prototype.sum = function() {
    var result = 0;
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (this[i]) {
            result += parseInt(this[i]);
        }
    }
    return result;
};
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
