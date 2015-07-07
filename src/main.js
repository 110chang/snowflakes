//main.js

var $ = require('jquery');
var $anim = require('./jquery.css3animate');

/*
Object
  ResultSet: Object
    ma_result: Object
      filtered_count: "49"
      total_count: "123"
      word_list: Object
        word: Array[49]
          pos: "名詞"
          reading: "けんさく"
          surface: "検索"
    uniq_result: Object
      filtered_count: "49"
      total_count: "123"
      word_list: Object
        word: Array[43]
    xmlns: "urn:yahoo:jp:jlp"
    xmlns:xsi: "http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation: "urn:yahoo:jp:jlp http://jlp.yahooapis.jp/MAService/V1/parseResponse.xsd"
*/

var timer;
var count = 0;
var centerX = window.innerWidth / 2;
var centerY = window.innerHeight / 2;
var maxFontSize = Math.floor(Math.min(centerX, centerY) / 5);
var words;

function animate($el) {
  var r = Math.floor(Math.random() * 90);
  var ro = Math.floor(Math.random() * 90) - 45;
  var dur = Math.floor(Math.random() * 2000) + 3000;
  var offsetX = Math.floor(Math.random() * centerX) - centerX / 2;
  var offsetY = Math.floor(Math.random() * centerY) - centerY / 2;
  var fontSize = Math.floor(Math.random() * maxFontSize);

  if (fontSize < 24) {
    fontSize = 24;
  }

  $el.css({
    'left': centerX + offsetX,
    'top': centerY + offsetY,
    'margin': (-$el.height() / 2) + ' ' + (-$el.width() / 2),
    'font-size': fontSize + 'px',
    'line-height': '120%',
    'transform': {
      'rotate': r
    },
  });

  $el.CSS3Animate({
    'left': centerX,
    'top': centerY,
    'font-size': 12,
    'transform': {
      'rotate': r + ro
    },
    'text-shadow': '0 0 10px #FFF, 0 0 12px #FFF, 0 0 14px #FFF, 0 0 16px #FFF',
    'opacity': 0
  }, dur, 'easeOutQuad');
}

function loop() {
  if (!words[count]) {
    return;
  }
  var $el = $('<span/>').text(words[count].surface);
  var timeout = Math.floor(Math.random() * 500) + 500;

  $('body').append($el.addClass('snowfrake'));
  animate($el);

  timer = setTimeout(function() {

    count++;
    clearTimeout(timer);
    loop();
  }, timeout);
}

$(function() {
  console.log('DOM ready.');
  //console.log(window.words.ResultSet.ma_result.word_list.word);
  words = window.words.ResultSet.ma_result.word_list.word;
  loop();
});

