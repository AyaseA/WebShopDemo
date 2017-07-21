$(function() {
	var $page = $('#icenter_advice'),
    	pageStr = 'icenter_advice';
	$page.off('click', 'button.advice_button').on('click', 'button.advice_button', function() {
		if ($.trim($page.find('textarea').val()) != '') {
			addSuggestion();
		} else {
			layer.msg('请输入意见和建议~');
		}
	});
	function addSuggestion() {
		$$.post(
			'CSL/Suggestion/AddSuggestion',
			{
				Descri: $page.find('textarea').val()
			},
			function(res) {
				if (res.Status == 0) {
					layer.msg('感谢您的意见与建议，我们将努力改进~');
					$page.find('textarea').val('');
					getSuggestion();
				}
			}
		);
	}
	getSuggestion();
	function getSuggestion() {
		$$.post(
			'CSL/Suggestion/QuerySuggestionList',
			{
				IsViewed: -1
			},
			function(res) {
				if (res.Status == 0) {
					$page.find('div.advice_list').html(template(pageStr + '_content', {
						list: res.Data.Rows
					}));
				}
			}
		);
	}
});