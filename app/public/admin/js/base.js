$(function(){
	app.init();
})
var app = {
	init:function(){
		this.toggleAside();
		this.resizeIframe();
	},
	toggleAside:function(){
		$('.aside h4').click(function(){
			if($(this).find('span').hasClass('nav_close')){
				$(this).find('span').removeClass('nav_close').addClass('nav_open');
			}else{
				$(this).find('span').removeClass('nav_open').addClass('nav_close');
			}
			$(this).siblings('ul').slideToggle();
		})
	},
	changeStatus(el, model, attr, id) {
		$.get('/admin/changeStatus', {model,attr,id}, (data) => {
			if (data.success) {
				if (el.src.indexOf('yes') !== -1) {
					el.src = '/public/admin/images/no.gif';
				} else {
					el.src = '/public/admin/images/yes.gif';
				}
			}
		})
	},
	resizeIframe:function(){
		var heights = document.documentElement.clientHeight-100;
		document.getElementById('rightMain').height = heights
	},
	editNum(el, model, attr, id) {
		var val=$(el).text();
		console.log(val);
		var input=$("<input value='' />");
		//把input放在sapn里面
		$(el).html(input);
		console.log(val);
		//让input获取焦点  给input赋值
		$(input).trigger('focus').val(val);
		//点击input的时候阻止冒泡
		$(input).click(function(){
			return false;
		})
		//鼠标离开的时候给sapn赋值
		$(input).blur(function(){
			var num=$(this).val();
			$(el).html(num);
			$.get('/admin/editNum',{model:model,attr:attr,id:id,num:num},function(data) {
				console.log(data);
			})
		})
	}
}

$(window).resize(function(){
	app.resizeIframe();
})