
/*
 * main.js
 **/

var $ = require('jquery');
var $anim = require('./jquery.css3animate');
var VM = require('./vm');

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
var vm;

function shadow(size, opacity) {
  return '0 0 ' + size + 'px rgba(255,255,255,' + opacity + ')';
}
var blurFxStart = '0 0 0 #FFF';
var blurFxEnd = '0 0 20px #FFF';

function animate($el) {
  var r = Math.floor(Math.random() * 60) - 30;
  var ro = Math.floor(Math.random() * 60) - 30;
  var dur = Math.floor(Math.random() * 2000) + 3000;
  var offsetX = Math.floor(Math.random() * centerX) - centerX / 2;
  var offsetY = Math.floor(Math.random() * centerY) - centerY / 2;
  var fontSize = Math.floor(Math.random() * maxFontSize);

  if (fontSize < 24) {
    fontSize = 24;
  }

  $el.css({
    //'left': centerX + offsetX,
    //'top': centerY + offsetY,
    'margin': (-$el.height() / 2) + ' ' + (-$el.width() / 2),
    'font-size': '12px',
    'line-height': '120%',
    'transform': 
      'translate(' + (centerX + offsetX) + 'px, ' + (centerY + offsetY) + 'px) rotate(' + r + 'deg) scale(' + Math.floor(maxFontSize / 12) + ')',
    'text-shadow': blurFxStart,
    //'color': 'rgba(255,255,255,0)'
  });

  $el.CSS3Animate({
    //'left': centerX,
    //'top': centerY,
    //'font-size': 12,
    'transform': {
      'translateX': centerX + offsetX / 5,
      'translateY': centerY + offsetY / 5,
      'rotate': r + ro,
      'scale': 1
    },
    'text-shadow': blurFxEnd,
    //'color': 'rgba(255,255,255,0)'
    //'opacity': 0
  }, dur, 'easeOutQuad', function() {
    $el.remove();
  });
}

function clear() {
  words = [];
  $('.snowflake').remove();
}

function loop() {
  if (!words[count]) {
    vm.inAction(false);
    return;
  }
  var $el = $('<span/>').text(words[count].surface);
  var timeout = Math.floor(Math.random() * 500) + 500;

  $('body').append($el.addClass('snowflake'));
  animate($el);

  timer = setTimeout(function() {

    count++;
    clearTimeout(timer);
    loop();
  }, timeout);
}

function onAPISuccess(xhr, status) {
  console.log('onAPISuccess');
  //console.log(JSON.parse(xhr.responseText));
  var json = JSON.parse(JSON.parse(xhr.responseText));

  words = json.ResultSet.ma_result.word_list.word;
  vm.apiSuccess(true);
  vm.apiLoading(false);
  vm.inAction(true);
  loop();
}

function onAPIError(xhr, status, error) {
  console.log('%s,%s,%s', xhr, status, error);
  vm.apiLoading(false);
  vm.apiSuccess(false);
}

$(function() {
  console.log('DOM ready.');
  //console.log(window.words.ResultSet.ma_result.word_list.word);
  vm = new VM();

  $('form').on('submit', function(e) {
    e.preventDefault();
    if (vm.validate()) {
      //this.submit();
      console.log(vm.url());
      vm.apiLoading(true);
      $.ajax({
        type: 'POST',
        url: '/falling',
        data: {
          url: vm.url()
        },
        complete: onAPISuccess,
        error: onAPIError
      });
    }
    return false;
  });

  $('.form-submit-wrapper').on('click', '.form-stop', function(e) {
    console.log('clear');
    clear();
  });
});

