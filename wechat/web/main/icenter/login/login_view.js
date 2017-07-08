$(function() {
    $('.quick_login').on('click', function(e) {
        e.preventDefault();
        $('.quick_login').css('display', 'none');
        $('.miss_password').css('display', 'none');
        $('#input_control_4').css('display', 'block');
        $('#input_control_5').css('display', 'block');
        $('#loginin_out').css('display', 'block');
        $('#login_redit').css('display', 'none');
        $('#login_pass').css('display', 'none');
        $('.login_check_pn').css('display', 'none');
        $('.login_check_pc').css('display', 'none');
        $('.login_check_pw').css('display', 'none');
        $('.login_check_in').css('display', 'none');
    });
    //忘记密码
    $('.miss_password').on('click', function(e) {
        e.preventDefault();
        $('.quick_login').css('display', 'none');
        $('.miss_password').css('display', 'none');
        $('#input_control_2').css('display', 'none');
        $('#input_control_3').css('display', 'block');
        $('#input_control_4').css('display', 'block');
        $('#loginin_out').css('display', 'none');
        $('#login_redit').css('display', 'block');
        $('#login_pass').css('display', 'none');
        $('.login_check_pn').css('display', 'none');
        $('.login_check_pc').css('display', 'none');
        $('.login_check_pw').css('display', 'none');
        $('.login_check_in').css('display', 'none');
    });
    //左上角返回
	$('.return_button').on('click', function(e) {
        e.preventDefault();
        $('.quick_login').css('display', 'block');
        $('.miss_password').css('display', 'block');
        $('#input_control_1').css('display', 'block');
        $('#input_control_2').css('display', 'block');
        $('#input_control_3').css('display', 'none');
        $('#input_control_4').css('display', 'none');
        $('#input_control_5').css('display', 'none');
        $('#login_pass').css('display', 'block');
        $('.login_check_pn').css('display', 'none');
        $('.login_check_pc').css('display', 'none');
        $('.login_check_pw').css('display', 'none');
        $('.login_check_in').css('display', 'none');

        $$.redirect('home/index.html');
    });

    //监听清除的display
    $('#login_input_1').on('click', function() {
        $('#round_clear_1').css('display', 'block');
    });
    $('#login_input_2').on('click', function() {
        $('#round_clear_2').css('display', 'block');
    });
    $('#login_input_3').on('click', function() {
        $('#round_clear_3').css('display', 'block');
    });
    $('#login_input_5').on('click', function() {
        $('#round_clear_5').css('display', 'block');
    });
    //监听数据清除
    $('#round_clear_1').on('click', function() {
        $('#login_input_1').val('');
        $('#round_clear_1').toggle();
    });
    $('#round_clear_2').on('click', function() {
        $('#login_input_2').val('');
        $('#round_clear_2').toggle();
    });
    $('#round_clear_3').on('click', function() {
        $('#login_input_3').val('');
        $('#round_clear_3').toggle();
    });
    $('#round_clear_5').on('click', function() {
        $('#login_input_5').val('');
        $('#round_clear_5').toggle();
    });

});
