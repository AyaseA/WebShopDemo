$(function() {
    var $page = $('#myWallet_myWallet'),
        pageStr = 'myWallet_myWallet';

    var url=$$.config.serverAddr;    
    var token = $$.getToken();
    //var token = "eyJVc2VySUQiOiI0MCIsIk5pY2tOYW1lIjpudWxsLCJHcm91dGhWYWx1ZSI6bnVsbCwiVXNlckFkZHJlc3NJRCI6bnVsbCwiQWRkVGltZSI6IjE0OTczMzkzODgiLCJVc2VyQ2FySUQiOm51bGwsIkltZyI6bnVsbCwiRW5hYmxlIjoiMSIsIkludml0ZUNvZGUiOiJNRFF3IiwiTW9iaWxlIjoiMTUwNjY2NzAzMjAiLCJTZXNzaW9uSUQiOiIxIiwiVHlwZSI6IlVzZXIiLCJVSUQiOiJmMjUxZjI0ZjU5OGVhZTFiZGNiNWVmMWIwNjNjZDAwMSJ9";

    

    $.ajax({
        type: "POST",
        url: url+"CSL/Account/QueryAccountCount",
        data: { "Token": token },
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
        url: url+"CSL/Reward/QueryRewardCount",
        data: { "Token": token },
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

});
