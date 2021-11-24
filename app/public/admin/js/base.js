$(function(){
	app.init();
})
var app = {
	init:function(){
		this.toggleAside();

	},
	toggleAside:function(){

			$('.aside h4').click(function(){
	
				$(this).siblings('ul').slideToggle();
			})
	},
	changeStatus(el, model, attr, id) {
		$.get('/admin/changestatus', {model,attr,id}, (data) => {
			if (data.success) {
				if (el.src.indexOf('yes') !== -1) {
					el.src = '/public/admin/images/no.gif';
				} else {
					el.src = '/public/admin/images/yes.gif';
				}
			}
		})
	}
}