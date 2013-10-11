/* jQuery.ggDiary 

 * Mitsuki Suzuki
 * MIT license
 */	
 
(function($j){

$j.fn.ggDiary = function(){

	return this.each(function(){
		
		$j(this).width($(window).width())
		.find('img').imagesLoaded(function(){
		
			//resize window
			$j(window).on('resize',function(){
				$j('li').css({visibility:'hidden'});
				instance.imgResizeStart();
			});
			
			//move on click
			$j(document).on('click','.img_a',function(){
				instance.info_window_show($j(this));
				return false;
			});
			
			setTimeout(function(){
				instance.imgResizeStart();
			},1000);
		
		});
	
	});	
};
/*!
 * EventEmitter v4.2.0 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */		
$j.fn.imagesLoaded = function(callback){

  var elems = this.filter('img'),
      len   = elems.length,
      parcentage = 100 / len,
      blank = " ";
            
  elems.on('load.imgloaded',function(){
      if (--len <= 0 && this.src !== blank){ 
        elems.unbind('load.imgloaded');
        callback.call(elems,this);
        $j('#loading').fadeOut(1000,function(){
			$(this).remove();
		});
      }
  }).each(function(l){
	 var src = this.src;
        this.src = blank;
        this.src = src;
     $j(this).on('load',function(){
       	  	$j('#loading').find('.bar').append(' ')
       	  	.end().find('.precount').html($('.bar').text().length * parcentage +'%'); 
        });
  });
  return this;
  
};

var instance ={

	posisionMarkPos : function(elm){
				
		var selectElmWidth = elm.width(),
			selectElmPos = elm.offset(),
			margin = $('#google_imgSrc').css('marginLeft');
				
		var markerPosM = selectElmPos.left + (selectElmWidth/2);
		$j('.posMarker').css({left:markerPosM - parseInt(margin)});
		
	},
	bottomIndex : function(thisPos,defindex){
				
			var nowindex = defindex;
			var maxlength = $j('.img_a').length;
			
				while( 1 ){
					if( nowindex == maxlength ){ nowindex = 1; break };
					var herePos = $j('.img_a').find('img').eq(nowindex).offset();
					
					nowindex++;
					
					if(thisPos.top < herePos.top ){ break };
				};			
		
		return nowindex;
	},		
	imgResizeStart : function(){
			
		$j('.img_a').width('').height('').find('img').width('').height(200);
		
		var subimgWrap = new Array(),
			imageWrap = $j('.img_a').find('img'),
			maxlength = imageWrap.length;
						
		var firstPos = imageWrap.eq(1).offset();
			lengthIndex = instance.bottomIndex(firstPos,0);
				
			for(var i = 0,max = 0; i < maxlength; i = max ){
				
				max = i + lengthIndex;
				
				if( max >= maxlength ){
				
					max = maxlength;
					
				};
								
				subimgWrap = imageWrap.slice( i, max );
				
				instance.imgResize( subimgWrap );
			
			};
			$j('#google_imgSrc').width($(window).width());
	},
	imgResize : function(targetElm){	
			
			var imgwidth = [],
				imgheight = targetElm.eq(0).height();
				
				targetElmLength = targetElm.length;
			
			targetElm.height(imgheight);
			
			//個々のimgの幅を格納		
			for( var i = 0; i < targetElmLength; i++ ){
			
				var width = $(targetElm).eq(i).width();
				imgwidth.push(width);
				
			};
			
			//配列img要素の合計幅
			for( var i = 0,allimgwidth = 0; i < targetElmLength; i++ ){
			
				allimgwidth = allimgwidth + imgwidth[i];
				
			};
						
			var bodyWidth = $j(window).width();
			
			//個々要素にサイズを指定
			for( var i = 0; i < targetElmLength; i++ ){
			
				var width = targetElm.eq(i).width();
				var widthReito = width/allimgwidth;
				
				targetElm.eq(i).height('').width((bodyWidth*widthReito)-10|0);
				targetElm.eq(i).parent().parent().height('')
				.width((bodyWidth*widthReito)-30|0).css({visibility:'visible'});
				
			};
			
			var imgheight = targetElm.eq(0).height();
				targetElm.height(imgheight).width('');
			
	},
	info_window_show : function(that){
	
		if($j(that).hasClass('view')){
			
			$j('.view').removeClass('view');
			$j('.infoWindow').stop().slideUp(500,function(){
				$(this).remove();
			});
	
			return false;
		
		}else{
		
			//MAIN
			var thisImg = that.find('img'),
				thisPos = thisImg.offset(),
				viewPos = thisImg.offset(),
				defindex = that.index('.img_a'),
				img_src = that.find('a').attr('href'),
				img_title = that.find('.title').text(),
				img_caption = that.find('.caption').html(),
				img_url = that.find('.url').html();
			
			//要素のクラスにviewがあるか
			if($j('.img_a').hasClass('view')){
			
				viewPos = $j('.view').offset();
				$j('.view').removeClass('view');
			
			};
			
			that.addClass('view');
			
			if( viewPos.top !== thisPos.top || $('.infoWindow').size() == 0 ){
				
				var element_infoWindow = '<div class="infoWindow" style="display:none">\
											<span class="posMarker">▲</span>\
											<a class="close" href="#">close window</a>\
											<div class="imgWrap">\
												<img class="display" src="'+img_src+'" />\
											</div><div class="img_info">\
												<h3>'+img_title+'</h3>\
												<div>'+img_caption+'</div>\
											</div>\
											<div class="imgurl">'+img_url+'</div></div>';
				
				$j('.infoWindow').slideUp(500,function(){
					$(this).remove();
				});
				
				$j('.img_a').eq(instance.bottomIndex(thisPos,defindex)-2)
				.after(element_infoWindow).each(function(){
				
					$('.infoWindow').slideDown(500,function(){
					
						var infoWindowPos = $('.infoWindow').offset();
						$j('body').animate({ scrollTop: infoWindowPos.top-300});
						
					});
					
					instance.posisionMarkPos(that);
					
				});
				
			}else{
	
				$j('.display').attr('src',img_src);
				$j('.img_info h3').empty().append(img_title);
				$j('.img_info div').empty().append($(img_caption));
				$j('.img_info .imgurl').empty().append($(img_url));
				
				instance.posisionMarkPos(that);
	
			};
			
			//resize window
			$j(window).on('resize',function(){
				
				var thisPos = $j('.view').find('img').offset();
					
				$j('.infoWindow').hide().insertAfter($j('.img_a')
				.eq(instance.bottomIndex(thisPos,defindex)-2)).show();
				
				instance.posisionMarkPos(that);
				
			});
			
			//close window
			$j(document).on('click','.close',function(){
			
				$j('.view').removeClass('view');
				$j('.infoWindow').stop().slideUp(500,function(){
					$j(this).remove();
				});
				
				return false;
				
			});
		};
	}
	
};

var tumblr_get_images=[];

$j.ajax({
	cache: false,
	type: "get",
	dataType: "jsonp",
	url: 'http://api.tumblr.com/v2/blog/mitsuki0524.tumblr.com/'+
				'posts?api_key=zf5B2hRR0zy7PizccYfkoI0z08SlhkiMLHvBgrzfY8qICOvMTW&limit=40&offset=',
	timeout: 10000,
		success: function(Data){
			$.each(Data.response.posts,function(i,v){
				m=this.photos[0].alt_sizes[0].url,
				o=this.photos[0].original_size.url,
				n=this["post_url"],
				p=this["date"];
				c=this["caption"];
				
				var li = '<li class="img_a effect2 tumblr"><a href="'+o+'"><img class="imgItem" src="'+m+
						'" alt="TumblrItems"/></a><span class="title">'+p+
						'</span><span class="caption">'+c+'</span><span class="url"><a href='+n+
						' target="_blank">'+n+'</a></span></li>';
						
				tumblr_get_images.push(li);
				
				$j('#google_imgSrc').empty().append(tumblr_get_images).ggDiary();
			
			});
		},			
		error:function(){
			var error = '<div class="error"><h2>FAILED TO LOAD.</h2>'+
						'<p>Sorry,can&#039t get a JSON items.</p>'+
						'<p>Tumblr is temporarily unavailable. Some time pass and access this topic.</p></div>';
			$j(error).appendTo('#google_imgSrc');
		}
});


})(jQuery)