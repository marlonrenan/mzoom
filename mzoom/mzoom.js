var bigimgH,bigimgW,bigimgL,bigimgT = 0;
var smx,smy,miniV = 0;

function geraArrastar() {
	
		var arrastar=false;
		$('#mzoom_boximg').mousedown(function(e){
			smx = Math.round(e.pageX - bigimgL);
			smy = Math.round(e.pageY - bigimgT);
			
			if (smx>0 && smy>0 && smx<bigimgW && smy<bigimgH) {
				arrastar=true;
				$(this).css('cursor','move');
			}
			e.preventDefault();
		}).mouseover(function(e){
		}).mouseout(function(e){
			e.preventDefault();
			arrastar=false;
			$(this).css('cursor','default');
			//BUSCANDO POSICIONAMENTO DA IMAGEM
			if ( $.browser.msie ) {
				bg = $(this).css('background-position-x')+' '+$(this).css('background-position-y');
			} else {
				bg = $(this).css('background-position');
			}
			bg = bg.replace("px", "").replace("px", "").split(" ");
			bigimgL = parseInt(bg[0]);
			bigimgT = parseInt(bg[1]);
		}).mouseup(function(e){
			arrastar=false;
			salvaposImg($('#mzoom_boximg'));
			$(this).css('cursor','default');
			e.preventDefault();
		}).mousemove(function(e){
			if (arrastar==true) {
				//SALVANDO POSIÇÃO DO MOUSE
				var x = Math.round(e.pageX - smx);
				var y = Math.round(e.pageY - smy);
				//SALVANDO POSIÇÃO DA IMAGEM
				salvaposImg($('#mzoom_boximg'));
				npos = limiteposImg(x,y);
				x = npos['l'];
				y = npos['t'];
				$(this).css('background-position', x+ "px " + y + "px");
			}
		});
	
}
function salvaposImg($obj) {
	//BUSCANDO POSICIONAMENTO DA IMAGEM
	if ( $.browser.msie ) {
		bg = $obj.css('background-position-x')+' '+$obj.css('background-position-y');
	} else {
		bg = $obj.css('background-position');
	}
	bg = bg.replace("px", "").replace("px", "").split(" ");
	bigimgL = parseInt(bg[0]);
	bigimgT = parseInt(bg[1]);
}
function limiteposImg(l,t) {
	var maiorAltura = false;
	var maiorLargura = false;
	var malt=$('#mzoom_miniaturas').height(); malt=!isNaN(malt)?malt:0;	
	var janelaW = $(window).width();
	var janelaH = $(window).height()-malt;
	
	//VERIFICANDO SE A IMAGEM É MENOR OU MAIOR QUE A TELA
	if (bigimgW>janelaW) maiorLargura=true;
	if (bigimgH>janelaH) maiorAltura=true;

	//VERIFICANDO LARGURA
	if (maiorLargura) {	//PARA MAIOR QUE A TELA
		if (l>0) l=0;
		else if (l<(janelaW-bigimgW)) l = (janelaW-bigimgW);
	} else {			//PARA MENOR QUE A TELA
		if (l<0) l=0;
		else if ( (l+bigimgW) > janelaW) l = (janelaW-bigimgW);
	}
	
	//VERIFICANDO ALTURA
	if (maiorAltura) {	//PARA MAIOR QUE A TELA
		if (t>0) t=0;
		else if (t<(janelaH-bigimgH)) t = (janelaH-bigimgH);
	} else {			//PARA MENOR QUE A TELA
		if (t<0) t=0;
		else if ( (t+bigimgH) > janelaH) t = (janelaH-bigimgH);
	}
	
	return {'l':l,'t':t};
}
function posicionaBG(imgpath) {
	if (imgpath=='') return false;
	$boximg = $('#mzoom_boximg');
	$boximg.css('background-image','none');
	$('#mzoom_loading').fadeIn(function(){
		$boximg.hide();
		var img = new Image();
		$(img).load(function(){
			$('body').append('<img src="'+imgpath+'" id="mzoom_imgtemp" />');
			$imgtemp = $('#mzoom_imgtemp');

			bigimgW = $imgtemp.width();
			bigimgH = $imgtemp.height();
			
			var centroboxW = Math.round($boximg.width() / 2);
			var centroboxH = Math.round($boximg.height()/ 2);
			var centroimgW = Math.round(bigimgW/2);
			var centroimgH = Math.round(bigimgH/2);
			imgx = centroboxW - centroimgW;
			imgy = centroboxH - centroimgH;
			
			bigimgL=imgx;
			bigimgT=imgy;
			
			$boximg.css({
				'background-image':'url('+imgpath+')',
				'background-position':imgx+'px '+imgy+'px'
			});
			
			if (conf.drag==true) {
				geraArrastar();
			}
					
			$('#mzoom_loading').fadeOut('fast',function(){
				$boximg.show('slow');
				$imgtemp.remove();
			});

		}).attr('src',imgpath);

	});

}

function esticaBox() {
	var dlar=$(window).width();
	var dalt=$(window).height();
	var malt=$('#mzoom_miniaturas').height(); malt=!isNaN(malt)?malt:0;
	$('#mzoom_boxzoom').css({
		'width':dlar+'px',
		'height':dalt+'px'
	});
	var boxW = dlar;
	var boxH = ($('#mzoom_boxzoom').height()-malt);
	$('#mzoom_boximg').width(boxW);
	$('#mzoom_boximg').height(boxH);
	
	//coloca opacidade e largura no fundo maior
	$('#mzoom_boxzoomf').width($(document).width());
	$('#mzoom_boxzoomf').height($(document).height());
	$('#mzoom_boxzoomf').css({
		'opacity':conf.bgopacity
	});
	
}
function travaScroll() {
	$('html, body').animate({scrollTop:0,scrollLeft:0});
}
function posicionaCentro($obj) {
	var meioh = ($(window).width()/2)-($($obj).width()/2);
	var meiov = ($(window).height()/2)-($($obj).height()/2);
	$($obj).css({
		'top':+meiov,
		'left':+meioh
	});
}

function btoesnav(conf){
	
	//definindo o tamanho do div quadNav
	var totalQuad = $('.mzoom_quadgal').length * $('.mzoom_quadgal').width();
	$('#mzoom_quadNav').css('width', totalQuad);

	$navleft = $('.mzoom_boxnavleft');
	$navright = $('.mzoom_boxnavright');
	$navleft.click(function(){
		var maxScroll = $("#mzoom_miniaturas").attr("scrollWidth") - $("#mzoom_miniaturas").width();
		miniV = miniV - ( $('.mzoom_quadgal').width() * conf.step );
		if (miniV<0) {
			if (conf.loop) {
				miniV = maxScroll;
			} else {
				miniV = 0;
			}
		}
		$('#mzoom_miniaturas').animate({scrollLeft:miniV});
	});
	$navright.click(function(){
		var maxScroll = $("#mzoom_miniaturas").attr("scrollWidth") - $("#mzoom_miniaturas").width();
		if (miniV==maxScroll) {
			if (conf.loop) miniV = 0;
		} else {
			miniV = miniV + ( $('.mzoom_quadgal').width() * conf.step );
			if (miniV>maxScroll) {
				miniV = maxScroll;
			}
		}
		$('#mzoom_miniaturas').animate({scrollLeft:miniV});
	});
	
}

jQuery.fn.mzoom = function(options) { 

	conf = jQuery.extend({
		showall		: false,
		drag		: false,
		step		: 3,
		loop		: true,
		thumb		: false,
		bgopacity	: '0.9'
	}, options);
	
	if(conf.showall==false){
		$('.mzoom').each(function(i){
			$(this).children().each(function(i){
				if (i>0) {
					$(this).hide();
				}
			});
		});
	}

	// constructing the div
	var boxzoom = "";
	boxzoom+='<div id="mzoom_boxzoomf"></div>';
	boxzoom+='<div id="mzoom_boxzoom">';
	boxzoom+='<div id="mzoom_btaoClose"></div>';
	boxzoom+='<div id="mzoom_loading"></div>';
	boxzoom+='<div id="mzoom_boximg"></div>';
	if (conf.thumb==true) {
		boxzoom+='<div id="mzoom_QuadMiniaturas">';
		boxzoom+='<div class="mzoom_boxnavright"></div>';
		boxzoom+='<div class="mzoom_boxnavleft"></div>';
		boxzoom+='<div id="mzoom_miniaturas"><div id="mzoom_quadNav"></div></div>';
		boxzoom+='</div>';
	}
	boxzoom+='</div>';
	//
	//
	var $mzoom = null;
	$('.mzoom').click(function(){
		$mzoom = $(this);
	});
	//
	$('.mzoom a').click(function(ev){
		ev.preventDefault();
		//posiciona tela no canto superior esquerdo e retira as barras de rolagem
		$('html, body').animate({scrollTop:0,scrollLeft:0});
		$('html').css('overflow','hidden');
		//
		var imgpath = $(this).attr('href');
		//
		$(boxzoom).appendTo("body");
		//
		posicionaCentro('#mzoom_loading');
		esticaBox();
		posicionaBG(imgpath);
		//
		$(window).resize(function(){
			esticaBox();
		});		
		$(window).bind('scroll',travaScroll);
		
		if (conf.thumb==true) {
			$('.mzoom').find('a').each(function(i){
				$imgmin = $(this).find('img');
				$imgbig = $(this);
				$quadro = $('#mzoom_quadNav');
				$quadro.append('<div class="mzoom_quadgal"><a href="'+$imgbig.attr('href')+'"></a></div>');
				$link = $('#mzoom_quadNav a:last');
				//verificando qual a imagem selecionada inicialmente
				if (imgpath==$imgbig.attr('href')) {
					imgclass = 'mzoom_imgsel';
				} else {
					imgclass = '';
				}
				//incluindo copia da imagem na barra de miniaturas
				$link.append('<img src="'+$imgmin.attr('src')+'" alt="" class="'+imgclass+'"/>');
				//aplicando fade na imagem selecinada inicialmente
				$link.find('.mzoom_imgsel').fadeTo(500, 1);
				//adicionando ação de fade com o passar do mouse
				$('.mzoom_quadgal img').css({'opacity':'0.5'});
				$('.mzoom_quadgal img').hover(
					function(){
						 $(this).stop().fadeTo(500, 1);
					},
					function(){
						if ($(this).attr('class')!='mzoom_imgsel') {
							$(this).stop().fadeTo(500, 0.5);
						}
					}
				);
				//aplicando ação do mouse ao clicar sobre as miniaturas
				$link.click(function(ev){
					$boximg = $('#mzoom_boximg');
					$linkimg = $(this).attr('href');
					
					//removendo classe da imagem anteriormente selecionada
					$quadro.find('.mzoom_imgsel').fadeTo(500, 0.5);
					$quadro.find('.mzoom_imgsel').removeClass('mzoom_imgsel');

					//adicionando classe na imagem atualmente selecionada
					$(this).find('img').fadeTo(500, 1);
					$(this).find('img').addClass('mzoom_imgsel');
					posicionaBG($linkimg);
					
					ev.preventDefault();
					return false;
				});
			});
		
			//definindo o tamanho do div miniaturas de acordo com o tamanho dos botoes laterais
			var widthm = $(window).width()-($('.mzoom_boxnavleft').width()+$('.mzoom_boxnavright').width());
			$('#mzoom_miniaturas').css('width',widthm);
			//verificando se deve mostrar os botoes laterais
			if($('#mzoom_quadNav a').length * $('.mzoom_quadgal').width() > $(window).width()){
				btoesnav(conf);
			}else{
				$('.mzoom_boxnavleft, .mzoom_boxnavright').remove();
			}
			
		} //THUMB

		$('#mzoom_btaoClose').click(function(){
			$(this).parent().fadeOut('normal',function(){
				$('html').css('overflow','auto');
				$(this).remove();
				$(window).unbind('scroll');
				$('#mzoom_boxzoomf').fadeOut('slow',function(){
					$(this).remove();
				});
			});
		});
		
	});
	
};