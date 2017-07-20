$(function() {
    var $page = $('#icenter_myWallet'),
        pageStr = 'icenter_myWallet';

    if ($$.isLogin(true)) {

        var url = $$.config.serverAddr;
        var token = $$.getToken();
        
        $.ajax({
            type: "POST",
            url: url + "CSL/Account/QueryAccountCount",
            data: { "WToken": token },
            success: function(txt) {
                txt = $$.eval(txt);
                if (txt.Status != 0) {
                    alert("接口错误");
                } else {
                    var data = txt.Data;
                    $page.find(".myMoney").html(data);
                }
            }
        });

        $.ajax({
            type: "POST",
            url: url + "CSL/Reward/QueryRewardCount",
            data: { "WToken": token },
            success: function(txt) {
                txt = $$.eval(txt);
                if (txt.Status != 0) {
                    alert("接口错误");
                } else {
                    var data = txt.Data;
                    $page.find(".myReward").html(data);
                }
            }
        });
    }

});
