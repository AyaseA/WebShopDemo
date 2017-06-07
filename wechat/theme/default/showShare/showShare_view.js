$(function() {
 var REFormObj = document.getElementById('REForm');
    var submitREObj = document.getElementById('submitRE');

    submitREObj.onclick = function() {
        var mobile = document.getElementById('mobile').value;
        mobile = mobile.replace(/^\s+/, '').replace(/\s+$/, '');

        var mobileReg = /^1\d{10}$/;
        if (!mobileReg.test(mobile)) {
            alert('手机格式不正确');
            return false;
        }

        REFormObj.submit();
    }
});