/**
 * picker日历组件
 * @name biggerHacker
 * @email 1049025971@qq.com
 *
 */
//匿名函数自调用
;(function (global, factory) {
  //使用严格模式
  "use strict";
  //如果输出为对象
  if (typeof module === "object" && typeof module.exports === "object") {
	//输出三元表达式
	module.exports = global.document ?
	  factory (global, true) :
	  function (w) {
		if (!w.document) {
		  throw new Error ("DatePicker requires a window with a document");
		}
		return factory (w);
	  };
  } else {
	factory (global);
  }
  //匿名函数运行 传参
} (typeof window !== "undefined" ? window : this, function __factory__ (window, noGlobal) {
  var defaultOptions = {
	container: '.container',
	week: ['一', '二', '三', '四', '五', '六', '日'],
	columns: 6,   // 默认6行7列42个格
	prevClassName: 'arrow-left',
	nextClassName: 'arrow-right',
	dayItemClassName: '.picker-day',
	tpl: false,          // 是否响应当前模板
	tipsEvent: function () {
	}
  };
  /**
   * 基于给定的日期获取当前月份
   */
  var getMonthHelper = function (date) {
	return date.getMonth () + 1;
  }
  // DatePicker构造函数
  var DatePicker = function (options) {
	//如果this没有指向自己 返回nwe
	if (!(this instanceof DatePicker)) {
	  return new DatePicker (options);
	}
	// 合并配置选项
	this.options = $.extend (defaultOptions, options || {});
	// 存储当前日期 后续会进行操作
	this.currentDate = new Date ();
	// 存储当日
	this.nowDate = new Date ();
	// 日历外框
	this.mainEle = this.options.mainEle || $ ('<div class="ui-datepicker"></div>').appendTo ($ (this.options.container));
	// 执行初始化操作
	this.init ();
  }
  DatePicker.fn = DatePicker.prototype = {
	constrcutor: DatePicker,
	init: function () {
	  var self = this;
	  // 标题
	  var div = $ ('<div class="picker-head"></div>').appendTo (this.mainEle);
	  var title = $ ('<h4 class="picker-title">活动标题<span class="month">12月</span></h4>').appendTo (div);
	  var arrowLeft = $ ('<span class="arrow ' + this.options.prevClassName + '">&lt;</span>').appendTo (div);
	  var arrowRight = $ ('<span class="arrow ' + this.options.nextClassName + '">&gt;</span>').appendTo (div);
	  var eachDayItemWidth = self.mainEle.width () / 7;
	  // 日期
	  var dayDiv = $ ('<div />').appendTo (this.mainEle);
	  var weekItem = $ ('<span class="picker-week"></span>');
	  var dayItem = $ ('<a href="#" class="picker-day"></a>');

	  /**
	   * Week创建
	   */
	  function createWeekItem () {
		return weekItem.clone ().width (eachDayItemWidth);
	  }

	  /**
	   * Day创建
	   */
	  function createDayItem () {
		return dayItem.clone ().width (eachDayItemWidth);
	  }

	  // 为当前配置 选项中的属性 创建一个快捷变量 方便下面 操作
	  var optWeek, optColumns;
	  optWeek = this.options.week;
	  optColumns = this.options.columns;
	  var $$currWeekItem;
	  for (var i = 0, len = optWeek.length; i < len, currWeekItem = optWeek[i]; i++) {
		$$currWeekItem = createWeekItem ().html (this.options.week[i]).appendTo (dayDiv);
	  }
	  // 日期
	  var $$currDayItem;
	  var j = 0,
		optDayItemLength = optWeek.length * optColumns;
	  while (j++ < optDayItemLength) {
		$$currDayItem = createDayItem ().appendTo (dayDiv);
	  }
	  // 渲染日期节点
	  this.renderByDate (this.currentDate);
	  // 绑定点击时间
	  $ (this.options.container).on (
		'click.prev.datepicker',
		'.' + this.options.prevClassName,
		$.proxy (this.prevEventHandler, self)
	  ).on ('click.next.datepicker',
		'.' + this.options.nextClassName,
		$.proxy (this.nextEventHandler, self)
	  );
	  if (this.options.tpl) {
		$ (this.options.container)
		  .on (
			'mouseover.dayItem.datepicker',
			this.options.dayItemClassName,
			$.proxy (this.tipsEventHandler, self)
		  );
	  }
	},
	// tips操作
	tipsEventHandler: function (e) {
	  var target = $ (e.target || e.srcElement);
	  if (!target.hasClass ('picker-day'))
		return;
	  this.options.tipsEvent.call (target);
	},
	// 格式化时间戳
	getDateFormat: function (date) {
	  var year = date.getFullYear ();
	  var month = date.getMonth () + 1;
	  var d = date.getDate ();
	  d = d < 10 ? '0' + d : d;
	  month = month < 10 ? '0' + month : month;
	  return year + '' + month + '' + d;
	},
	prevEventHandler: function (e) {
	  var currentDayCopy = new Date (this.currentDate);
	  currentDayCopy.setMonth (currentDayCopy.getMonth () - 1);
	  this.selectDate (currentDayCopy);
	},
	nextEventHandler: function (e) {
	  var currentDayCopy = new Date (this.currentDate);
	  currentDayCopy.setMonth (currentDayCopy.getMonth () + 1);
	  this.selectDate (currentDayCopy);
	},
	selectDate: function (date) {
	  this.renderByDate (date);
	  this.currentDate = date;
	},
	renderByDate: function (date) {
	  var $$currentMonthItem = $ ('.month');
	  var currentMonth = getMonthHelper (date);
	  // 月份补零
	  switch (currentMonth) {
		case 10:
		case 11:
		case 12:
		  $$currentMonthItem.html ((currentMonth) + '月');
		  break;
		default:
		  $$currentMonthItem.html ('0' + (currentMonth) + '月');
	  }
	  // 计算每个月 第一个日期时间
	  var d = new Date (date);
	  var datediff = d.getDate () - this.currentDate.getDate ();
	  d.setDate (datediff);
	  d.setDate (d.getDate () - d.getDay () + 1);
	  // 循环生成日期天数
	  var $allSpan = $ ('.picker-day');
	  for (var i = 0; i < 42; i++) {
		var $currSpanItem = $allSpan.eq (i).html (this.options.tpl ? d.getDate () + '<div class="tipDate"></div>' : d.getDate ());
		$currSpanItem.data ('tipsDate', this.getDateFormat (d));
		// 用于测试是否是当前月份的表达式
		var expression = d.getMonth () !== date.getMonth ();
		if (expression) {
		  $currSpanItem.addClass ('off').removeClass ('on');
		} else {
		  $currSpanItem.addClass ('on').removeClass ('off');
		}
		$currSpanItem.css ({
		  color: expression ? '#b9b9b9' : '#585858'
		})
		// 为当天添加特定的样式
		if (d.getTime () === this.nowDate.getTime ()) {
		  $currSpanItem.append ('<i class="dot"></i>');
		}
		d.setDate (d.getDate () + 1);
	  }
	}
  };
  // 注册为一个命名的AMD模块
  if (typeof define === "function" && define.amd) {
	define ("datepicker", [], function () {
	  return DatePicker;
	});
  }
  if (!noGlobal) {
	window.DatePicker = DatePicker;
  }
  return DatePicker;
}));
