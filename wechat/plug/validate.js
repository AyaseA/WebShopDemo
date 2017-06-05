/**
 * 基于jquery的表单验证
 * @author Wang Zenggui
 * @since 20161022
 **/
(function ($) {
    //扩展jquery变量
    $.extend({
        _triggerCallBack: true,
        _userTriggerCallBack: true,//用户自定义是否单个激活事件
        _PushValiArray: function (item, msg) {
            if (typeof $._validateArray === "undefined")
                $._validateArray = Array(Array(item, msg));
            else
                $._validateArray.push(Array(item, msg));
        }
    });
    /**
      *  摘要验证时 激活验证失败方法 缺省该方法时 立即执行
    */
    fireCallbackLate = function () {
        $._triggerCallBack = false;
        $._userTriggerCallBack = false;
    }
    /**
*  表单项验证非空
* @param obj||jqueryobj||express
* @param msg 提示信息 
* @param callback function 失败时处理的函数
* @return max 成功时返回true 失败时执行callback
*/
    validateRequired = function (obj, msg, callback) {
        msg = typeof msg !== "string" ? "" : msg;
        var obj = $(obj);
        if ($.trim(obj.val()) != "") {
            return true;
        }
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(obj, msg);
            }
            if ($._triggerCallBack) {
                callback(obj, msg);
            }
        }
    };
    /**
*  表单项验证 富文本(ueditor)编辑框 
* @param ue  富文本对象
* @param function verify function() 对富文本编辑框进行验证 返回true or false
* @param msg 提示信息 
* @param callback function 失败时处理的函数
* @return max 成功时返回true 失败时执行callback
*/
    validateEditor = function (ue, verify, msg, callback) {
        msg = typeof msg !== "string" ? "" : msg;
        if (verify()) {
            return true;
        }
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(ue, msg);
            }
            if ($._triggerCallBack) {
                callback(ue, msg);
            }
        }
    };
    /**
*  html标签（需要在html标签上标记属性为：data-validatemark="1"） 通过function进行验证
* @param obj||jqueryobj||express
* @param verify 验证方法（此方法返回true or false）
* @param msg 提示信息 
* @param callback function 失败时处理的函数
* @return max 成功时返回true 失败时执行callback
*/
    validateTag = function (obj, verify, msg, callback) {
        msg = typeof msg !== "string" ? "" : msg;
        var obj = $(obj);
        if (verify(obj)) {
            return true;
        }
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(obj, msg);
            }
            if ($._triggerCallBack) {
                callback(obj, msg);
            }
        }
    };
    /**
*  表单项 通过function进行验证
* @param obj||jqueryobj||express
* @param verify 验证方法（此方法返回true or false）
* @param msg 提示信息 
* @param callback function 失败时处理的函数
* @return max 成功时返回true 失败时执行callback
*/
    validateFunction = function (obj, verify, msg, callback) {
        msg = typeof msg !== "string" ? "" : msg;
        var obj = $(obj);
        if ($.trim(obj.val()) == "" || verify(obj)) {
            return true;
        }
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(obj, msg);
            }
            if ($._triggerCallBack) {
                callback(obj, msg);
            }
        }
    };
    /**
*  表单项 通过正则进行验证
* @param obj||jqueryobj||express
* @param regular 正则表达式
* @param msg 提示信息 
* @param callback function 失败时处理的函数
* @return max 成功时返回true 失败时执行callback
*/
    validateRegular = function (obj, regular, msg, callback) {
        msg = typeof msg !== "string" ? "" : msg;
        var obj = $(obj);
        if ($.trim(obj.val()) == "" || regular.test($.trim(obj.val()))) {
            return true;
        }
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(obj, msg);
            }
            if ($._triggerCallBack) {
                callback(obj, msg);
            }
        }
    };
    /**
*  表单项验证手机号
* @param obj||jqueryobj||express
* @param msg 提示信息 
* @param callback function 失败时处理的函数
* @return max 成功时返回true 失败时执行callback
*/
    validatePhone = function (obj, msg, callback) {
        msg = typeof msg !== "string" ? "" : msg;
        var obj = $(obj);
        if ($.trim(obj.val()) == "" || /^1[3|4|5|7|8]\d{9}$/.test($.trim(obj.val()))) {
            return true;
        }
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(obj, msg);
            }
            if ($._triggerCallBack) {
                callback(obj, msg);
            }
        }
    };
    /**
*  表单项验证电话号码(特指座机)
* @param obj||jqueryobj||express
* @param msg 提示信息 
* @param callback function 失败时处理的函数
* @return max 成功时返回true 失败时执行callback
*/
    validateTel = function (obj, msg, callback) {
        msg = typeof msg !== "string" ? "" : msg;
        var obj = $(obj);
        if ($.trim(obj.val()) == "" || /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test($.trim(obj.val()))) {
            return true;
        }
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(obj, msg);
            }
            if ($._triggerCallBack) {
                callback(obj, msg);
            }
        }
    };
    /**
*  表单项验证 联系方式 包括手机或座机
* @param obj||jqueryobj||express
* @param msg 提示信息 
* @param callback function 失败时处理的函数
* @return max 成功时返回true 失败时执行callback
   */
    validateContact = function (obj, msg, callback) {
        msg = typeof msg !== "string" ? "" : msg;
        var obj = $(obj);
        if ($.trim(obj.val()) == "" || /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test($.trim(obj.val())) || /^1[3|4|5|7|8]\d{9}$/.test($.trim(obj.val()))) {
            return true;
        }
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(obj, msg);
            }
            if ($._triggerCallBack) {
                callback(obj, msg);
            }
        }
    };
    /**
*  表单项验证URL
* @param obj||jqueryobj||express
* @param msg 提示信息 
* @param callback function 失败时处理的函数
* @return max 成功时返回true 失败时执行callback
*/
    validateURL = function (obj, msg, callback) {
        msg = typeof msg !== "string" ? "" : msg;
        var obj = $(obj);
        var urlFilter = /^(https|http|ftp|rtsp|mms):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|\[|\]|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        if ($.trim(obj.val()) == "" || urlFilter.test($.trim(obj.val()))) {
            return true;
        }
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(obj, msg);
            }
            if ($._triggerCallBack) {
                callback(obj, msg);
            }
        }
    };
    /**
*  表单项验证是否为Number
* @param obj||jqueryobj||express
* @param msg 提示信息 
* @param callback function 失败时处理的函数
* @return max 成功时返回true 失败时执行callback
*/
    validateNumber = function (obj, msg, callback) {
        msg = typeof msg !== "string" ? "" : msg;
        var obj = $(obj);
        if ($.trim(obj.val()) == "" || $.isNumeric($.trim(obj.val()))) {
            return true;
        }
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(obj, msg);
            }
            if ($._triggerCallBack) {
                callback(obj, msg);
            }
        }
    };
    /**
*  表单项验证是否为邮箱
* @param obj||jqueryobj||express
* @param msg 提示信息 
* @param callback function 失败时处理的函数
* @return max 成功时返回true 失败时执行callback
*/
    validateEmail = function (obj, msg, callback) {
        var emailFilter = /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        msg = typeof msg !== "string" ? "" : msg;
        var obj = $(obj);
        if ($.trim(obj.val()) == "" || emailFilter.test($.trim(obj.val()))) {
            return true;
        }
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(obj, msg);
            }
            if ($._triggerCallBack) {
                callback(obj, msg);
            }
        }
    };
    /**
 * 验证时间大小，开始时间不能大于结束时间
 * 
 * @author Wang Zenggui
 * @since 20161022
 * @param first obj||jqueryobj||express
 * @param second obj||jqueryobj||express
 * @param string tip message
 * @param callback function 失败时处理的函数
 * @return max 成功时返回true 失败时执行callback
 */
    validateTimeBigSamll = function (first, second, msg, callback) {
        var first = $(first);
        var second = $(second);
        msg = typeof msg !== "string" ? "" : msg;
        if (!($.trim(first.val()) != "" && $.trim(second.val()) != "" && $.getUnixTime($.trim(first.val())) > $.getUnixTime($.trim(second.val()))))
            return true;
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(second, msg);
            }
            if ($._triggerCallBack) {
                callback(second, msg);
            }

        }
    };
    /**
 * 验证两次输入框是否一致（一般用于密码验证）
 * 
 * @author Wang Zenggui
 * @since 20161022
 * @param first obj||jqueryobj||express
 * @param second obj||jqueryobj||express
 * @param string tip message
 * @param callback function 失败时处理的函数
 * @return max 成功时返回true 失败时执行callback
 */
    validateEqual = function (first, second, msg, callback) {
        var first = $(first);
        var second = $(second);
        if (!($.trim(first.val()) != "" && $.trim(second.val()) != "" && $.trim(first.val()) == $.trim(second.val())))
            return true;
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(second, msg);
            }
            if ($._triggerCallBack) {
                callback(second, msg);
            }

        }
    };
    /**
* 验证身份证号
* 
* @author Wang Zenggui
* @since 20161022
* @param obj obj||jqueryobj||express
* @param string tip message
* @param callback function 失败时处理的函数
* @return max 成功时返回true 失败时执行callback
*/
    validateEqual = function (obj, msg, callback) {
        msg = typeof msg !== "string" ? "" : msg;
        var obj = $(obj);
        var bl = true;
        if ($.trim(obj.val()) == "")
            bl = true;
        var len = $.trim(obj.val()).length, re;
        if (len == 15) {
            re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/);
            if (isNaN(num)) {
                bl = false;
            }
        } else if (len == 18) {
            re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\d)$/);
            var lastword = num.substr(17, 1);
            if (!(lastword == "x" || lastword == "X"))
                if (isNaN(num)) {
                    bl = false;
                }
        } else {
            bl = false;
        }
        var a = num.match(re);
        if (a != null) {
            if (len == 15) {
                var D = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);
                var B = D.getYear() == a[3] && (D.getMonth() + 1) == a[4]
                        && D.getDate() == a[5];
            } else {
                var D = new Date(a[3] + "/" + a[4] + "/" + a[5]);
                var B = D.getFullYear() == a[3] && (D.getMonth() + 1) == a[4]
                        && D.getDate() == a[5];
            }
            if (!B) {
                bl = false;
            }
        }
        if (bl)
            return bl;
        else {
            if ($._insertValidateArray) {
                $._PushValiArray(obj, msg);
            }
            if ($._triggerCallBack) {
                callback(obj, msg);
            }
        }
    }
    /**
    * 验证摘要 
    * @param obj||jqueryobj||express 其dom内的表单的onblur onchange 事件(以valiate开头的事件方法)都会触发
    * @param boolean 是否执行验证的失败的方法，默认 false;
    * @param string 百度的ueditorid，可选 缺省默认值为 editor
    **/
    validateSummary = function (obj, exeCallback, ueditorid) {
        $._insertValidateArray = true;
        $._validateArray = undefined;
        $._triggerCallBack = typeof exeCallback === "undefined" ? false : exeCallback;
        ueditorid = typeof (uedtorid) === "undefined" ? "editor" : ueditorid;
        $(obj)
                .find('input,textarea,select,*[data-validatemark="1"]')
                .filter(':not([type="submit"],[type="button"],[type="radio"],[type="checkbox"])')
                .each(
                        function () {
                            var element = $(this);
                            $(element).trigger("blur");
                            $(element).trigger("change"); 
                        });
        //handle baidu ueditor
        if ($("#" + ueditorid).length == 1)
            UE.getEditor('editor').fireEvent("blur");
        $._insertValidateArray = false;
        $._triggerCallBack = $._userTriggerCallBack;
    };
    //获取验证摘要是第一组出错信息
    getValidateFirst = function () {
        if (typeof $._validateArray === "undefined")
            return null;
        else
            return $._validateArray[0];
    }
    //获取验证摘要是全部出错信息
    getValidateAll = function () {
        if (typeof $._validateArray === "undefined")
            return null;
        else
            return $._validateArray;
    }
})(jQuery);