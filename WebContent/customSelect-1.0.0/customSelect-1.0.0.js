/************************************************************/
//*													  		*/
//*	Custom Select jQuery plugin v.1.00 by Yunsik Choung	  	*/
//*													  		*/
/************************************************************/
/**--------------------------------------------------------------
 * filename : customSelect.css
 * author : Choung Yunsik
 * Detail : Cross Browsing Custom Input Items
--------------------------------------------------------------*/
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define( ["jQuery"], factory );
	} else {
		// Browser globals
		factory( jQuery );
	}
}(function($) {
	$.fn.customSelect = function(){
		$(this).each(function(){
			// width : select에 있는 width Attribute를 확인후 최소 넓이를 입력받음 
			var width = $(this).attr('width') != null ? $(this).attr('width') : '120px';
			if (width.indexOf('px') < 0 && width.indexOf('%') < 0) width = width + 'px';
			if ($(this).parent().hasClass('cst-select')){
				var chkk = $(this).children('option:eq(0)').text();
				$(this).children('option').each(function(){
					if ($(this).prop('selected')) chkk = $(this).text();
				});
				$(this).next().text(chkk);
				if ($(this).hasClass('hidden')){
					$(this).parent().removeClass('visible')
					$(this).parent().addClass('hidden');
				} else if ($(this).hasClass('visible')){
					$(this).parent().removeClass('hidden');
					$(this).parent().addClass('visible');
				}
			} else {
				var block = _cst.create($(this), width);
				$(this).before(block);
				block.prepend($(this));
				if ($(this).children('option:selected') != null){
					block.children('.cst-label').text($(this).children('option:selected').text());
				} else {
					if ($(this).children('option').length > 0){
						block.children('.cst-label').text($(this).children('option:ep(0)').text());
					} else {
						block.children('.cst-label').text('선택');
					}
				}
				$(this).attr('onfocus', '_cst.focusClick(event, this);');
				$(this).attr('onkeyup', '_cst.keyControl(event, this);');
				$(this).attr('onfocusout', '_cst.focusOut(event, this);');
				if ($(this).hasClass('hidden')){
					block.removeClass('visible')
					block.addClass('hidden');
				} else if ($(this).hasClass('visible')){
					block.removeClass('hidden');
					block.addClass('visible');
				}
			}
		})
		$('body').on('click', function(event){if (!$(event.target).hasClass('cst-select') && !$(event.target).hasClass('cst-option') && !$(event.target).hasClass('cst-label')){_cst.exist();}});
	};
}));
var _cst = {
	create : function(select, width){
		var option = select.children('option');
		var cover = $(document.createElement('DIV'));
		    cover.addClass('cst-select');
		    cover.css({minWidth: width});
		    cover.append('<div class="cst-label"></div>');
		    cover.attr('onClick', '_cst.select(this)');
		return cover;
	},
	select : function(me){
		if ($(me).hasClass('on')){
			if ($(me).children('.cst-option').is(':visible')){
				$(me).addClass('on');
			} else {
				$(me).removeClass('on');
			}
		} else {
			_cst.exist();
			$(me).addClass('on');
			var option = $(document.createElement('DIV'));
			var body = '';
			$(me).children('select').children('option').each(function(){
				body += '<div class="cst-option-lst" onclick="_cst.option(this)">' + $(this).text() + '</div>';
			});
			var x = $(me).offset().top + $(me)[0].offsetHeight;
			var y = $(me).offset().left;
			option.attr('class', 'cst-option');
			option.append(body);
			var z = '999';
			var position = 'absolute';
			if ($('.layer').is(':visible')){
				z = '9999'; 
				position = 'fixed';
				x = $(me).offset().top + $(me)[0].offsetHeight - $('body')[0].scrollTop;
				x = $('body')[0].scrollTop == 0 ? x - $('html')[0].scrollTop : x;
				y = $(me).offset().left - $('body')[0].scrollLeft;
				y = $('body')[0].scrollLeft == 0 ? y - $('html')[0].scrollLeft : y;
			};
			option.css({
				position: position,
				width : $(me)[0].offsetWidth,
				top : x - 1,
				left : y,
				zIndex : z,
				fontFamily : $(me).css('font-family'),
				fontSize : $(me).css('font-size'),
			});
			$('body').append(option);
			option.slideDown(50);
		}
	},
	option : function(me){
		var txt = $(me).text();
		var parent = $('body').find('.cst-select.on');
		var select = parent.find('select');
		parent.children('.cst-label').text(txt);
		select.children('option').each(function(){
			if (txt == $(this).text()){
				$(this).prop('selected', true);
				$(this).attr('selected', "selected");
			} else {
				$(this).prop('selected', false);
				$(this).removeAttr('selected');
			}
		});
		select.trigger('change');
		select.trigger('blur');
		$(me).parent().slideUp(50);
		$(me).parent().remove('.cst-option');
	},
	exist : function(){
		$('body').find('.cst-select.on').removeClass('on')
		$('.cst-option').remove();
	},
	keyControl : function(event, me){
		var code = event.keyCode;
		switch (code) {
			case 38:
				_cst.focusControll($(me).parent(), $(me).children('option:selected').text());
				break;
			case 40:
				_cst.focusControll($(me).parent(), $(me).children('option:selected').text());
				break;
			case 13:
				_cst.focusControll($(me).parent(), $(me).children('option:selected').text());
				_cst.exist();
				break;
		}
	},
	focusClick : function(event, me){
		$(me).parent().trigger('click');
		_cst.focusControll($(me).parent(), $(me).children('option:selected').text());
		
	},
	focusOut : function (event, me){
		_cst.exist();
		var selected = $(me).children('option:selected').text();
		$(me).parent().children('.cst-label').text(selected);
		$(me).children('option').each(function(){
			if ($(this).text() == selected){
				$(this).prop('selected', true);
			}
		});
	},
	focusControll : function(parent, label){
		parent.children('.cst-label').text(label);
		$('.cst-option').find('.cst-option-lst').each(function(){
			if ($(this).text() == label){
				$('.cst-option').find('.cst-option-lst').removeClass('focus');
				$(this).addClass('focus');
				var top = $(this).scroll()[0].offsetTop;
				$(this).parent().scrollTop(top - 2 * $(this)[0].offsetHeight);
			}
		})
	}
}