var jQuery = require ('jquery');
;(function ($) {
  $.fn.audio = function (options) {
	var defaules = {
	  audio: '.audio',//点击父元素
	  guide: '.audio-guide',//点击事件元素
	  btnplay: '.btn-play',//添加类子成员
	  nameClass: 'active'//添加的类名
	}
	var sets = $.extend ({}, defaules, options || {});
	var audio = sets.audio;
	var guide = sets.guide;
	var btnplay = sets.btnplay;
	var nameClass = sets.nameClass;
	var audios = $ ('<audio src="#" id="audio" controls="controls"></audio>');

	$ ('body').on ('click',''+audio+" "+guide+'', function () {
	  var audioWarp = $ (this).closest (sets.audio);
	  var src = audioWarp.data ('url');
	  audios.attr ('src', src).appendTo ($ (this));
	  var player = $ (this).find ('#audio').get (0);
	  if (!$ (this).find (btnplay).hasClass (nameClass)) {
		$(audio).find (btnplay).removeClass (nameClass);
		$ (this).find (btnplay).addClass (nameClass);
		player.currentTime = 0;
		player.play ();
	  } else {
		$ (this).find (btnplay).removeClass (nameClass);
		player.pause ();
		player.currentTime = 0;
		player.remove ();
	  }
	  player.onended = function () {
		$('.audio').find ('.btn-play').removeClass (nameClass);
		player.currentTime = 0;
		player.remove ();
	  };
	});
  }
} (jQuery));