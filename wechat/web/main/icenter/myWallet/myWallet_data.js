$(function() {
    var $page = $('#icenter_myWallet'),
        pageStr = 'icenter_myWallet';

    if ($$.isLogin(true)) {

        var url = $$.config.serverAddr;
        var token = $$.getToken();
        
        $$.post("CSL/User/QueryICenterInfo",
            {},
            function(txt){
                if(txt.Status==0){
                    var info=txt.Data;
                    $page.find(".myReward").html(info.RewardBalance||0);
                    $page.find(".myVoucher").html(info.VoucherCount||0);
                    $page.find(".myMoney").html(info.Balance||0);
                }
            }
        );
    }

});
