/*!
 * jQuery.CSS3Animate
 * Auther: Yuji Ito @110chang
 * Licenced under the MIT Licence.
 */

var $ = require('jquery');

;(function($) {
    // const
  var PLUGIN_NAME   = 'CSS3Animate',
    STYLE_ID      = 'css3animate-keyframes',
    ANIM_PREFIX   = 'css3animate-keyframe-',
    CLASS_PREFIX  = 'class-', 
    ID_PREFIX     = 'id-', 
    START_POSTFIX = '-start',
    END_POSTFIX   = '-end',
    LF            = '\n', // for debug
    TAB           = '\t', // for debug
    
    // settings
    easingConverter = {
      'linear'           : 'linear',
      'swing'            : 'swing',
      'jswing'           : 'swing',
      'easeInSine'       : 'cubic-bezier(0.47, 0, 0.745, 0.715)',
      'easeOutSine'      : 'cubic-bezier(0.39, 0.575, 0.565, 1)',
      'easeInOutSine'    : 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
      'easeInQuad'       : 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
      'easeOutQuad'      : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      'easeInOutQuad'    : 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      'easeInCubic'      : 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
      'easeOutCubic'     : 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      'easeInOutCubic'   : 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      'easeInQuart'      : 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
      'easeOutQuart'     : 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      'easeInOutQuart'   : 'cubic-bezier(0.77, 0, 0.175, 1)',
      'easeInQuint'      : 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
      'easeOutQuint'     : 'cubic-bezier(0.23, 1, 0.32, 1)',
      'easeInOutQuint'   : 'cubic-bezier(0.86, 0, 0.07, 1)',
      'easeInExpo'       : 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
      'easeOutExpo'      : 'cubic-bezier(0.19, 1, 0.22, 1)',
      'easeInOutExpo'    : 'cubic-bezier(1, 0, 0, 1)',
      'easeInCirc'       : 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
      'easeOutCirc'      : 'cubic-bezier(0.075, 0.82, 0.165, 1)',
      'easeInOutCirc'    : 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
      'easeInBack'       : 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
      'easeOutBack'      : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      'easeInOutBack'    : 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      'easeInElastic'    : false,
      'easeOutElastic'   : false,
      'easeInOutElastic' : false,
      'easeInBounce'     : false,
      'easeOutBounce'    : false,
      'easeInOutBounce'  : false
    },
    benderPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-', ''],
    animationEnd = [
      'webkitAnimationEnd',
      'mozAnimationEnd',
      'oAnimationEnd',
      'msAnimationEnd',
      'animationend'
    ],
    animationEndJoint = animationEnd.join(' '),
    stringify = JSON.stringify,
    
    // protected varibles
    uid          = 0,
    $style       = $('<style/>').attr('id', STYLE_ID),
    animations   = [],
    regAnimAll   = /class\-css3animate\-keyframe\-(\d+)\-\w+/g,
    regAnimStart = /class\-css3animate\-keyframe\-(\d+)\-start/g,
    regAnimEnd   = /class\-css3animate\-keyframe\-(\d+)\-end/g,
    regTransform = /transform/,
    regPropPx    = /translate/,
    regPropDeg   = /(rotate|skew)/,
    
    // protected functions
    _rewriteStyles = function() {
      //console.log('jQuery.CSS3Animate#_rewriteStyles');
      var animation, keyframes, innerText = '', timing, props, prop, value, prefix, i, j;
      
      for (i = 0; i < animations.length; i++) {
        animation = animations[i];
        keyframes = animation.keyframes;
        
        // write @keyframes
        for (j = 0; j < benderPrefixes.length; j++) {
          prefix = benderPrefixes[j];
          innerText += '@' + prefix + 'keyframes ' + animation.id + ' {' + LF;
          
          for (timing in keyframes) {
            props = keyframes[timing];
            
            innerText += TAB + timing + ' {' + LF;
            
            for (prop in props) {
              value = props[prop];
              
              if (prop === 'transform') {
                prop = prefix + prop;
              }
              innerText += TAB + TAB + prop + ':' + value + ';' + LF;
            }
            innerText += TAB + '}' + LF;
          }
          innerText += '} ' + LF;
        }
        
        // write animation start class
        innerText += '.' + CLASS_PREFIX + animation.id + START_POSTFIX + ' {' + LF;
        for (j = 0; j < benderPrefixes.length; j++) {
          prefix = benderPrefixes[j];
          innerText += TAB + prefix + 'animation-name:' + animation.id + ';' + LF;
          innerText += TAB + prefix + 'animation-duration:' + animation.duration + 's;' + LF;
          innerText += TAB + prefix + 'animation-timing-function:' + animation.easing + ';' + LF;
          innerText += TAB + prefix + 'animation-iteration-count:' + animation.iteration + ';' + LF;
          innerText += TAB + prefix + 'animation-direction:' + animation.direction + ';' + LF;
          innerText += TAB + prefix + 'animation-delay:' + animation.delay + 's;' + LF;
        }
        innerText += '}' + LF;
        
        // write animation end class
        innerText += '.' + CLASS_PREFIX + animation.id + END_POSTFIX + ' {' + LF;
        // goal props
        for (prop in props) {
          value = props[prop];
          
          if (prop === 'transform') {
            for (j = 0; j < benderPrefixes.length; j++) {
              prefix = benderPrefixes[j];
              innerText += TAB + prefix + prop + ':' + value + ';' + LF;
            }
          } else {
            innerText += TAB + prop + ':' + value + ';' + LF;
          }
        }
        innerText += '}' + LF;
      }
      
      $style.text(innerText);
    },
    _findAnimation = function($el, props, duration, easing) {
      //console.log('jQuery.CSS3Animate#_findAnimation');
      var animation, i = 0;
      
      for (; i < animations.length; i++) {
        animation = animations[i];
        
        if ($el.get(0) === animation.element.get(0) &&
          stringify(props) === stringify(animation.props) &&
          animation.duration === duration &&
          animation.easing === easing
        ) {
          return animation;
        }
      }
      return false;
    },
    _createKeyframes = function($el, props) {
      var keyframes = { '0%': {}, '100%': {} }, prefix = '', prop, value, i;
      
      for (prop in props) {
        value = props[prop];
        
        if (typeof value === 'number') {
          if (prop !== 'opacity' && prop !== 'outline') {
            value += 'px';
          }
        }
        if (prop === 'transform') {
          for (i = 0; i < benderPrefixes.length; i++) {
            if ($el.css(benderPrefixes[i] + prop)) {
              prefix = benderPrefixes[i];
            }
          }
          value = _createTransformValue(value);
        }
        //console.log(prefix + prop);
        keyframes['0%'][prop] = $el.css(prefix + prop);
        keyframes['100%'][prop] = value;
      }
      return keyframes;
    },
    _createTransformValue = function(transform) {
      var funcs = [], prop, value, unit;
      
      for (prop in transform) {
        value = transform[prop];
        unit = _getUnit(prop);
        
        if (typeof value === 'number') {
          value = value + unit;
        } else if ($.isArray(value)) {
          value = _propsToString(value, unit, ', ');
        }
        funcs.push(prop + '(' + value + ')');
      }
      return funcs.join(' ');
    },
    _getUnit = function(prop) {
      var unit = '';
      
      if (regPropPx.test(prop)) {
        unit = 'px';
      } else if (regPropDeg.test(prop)) {
        unit = 'deg';
      }
      return unit;
    },
    _propsToString = function(array, unit, glue) {
      var temp = [], i = 0, v;
      
      for (; i < array.length; i++) {
        v = array[i];
        if (typeof v === 'number') {
          temp[i] = v + unit;
        }
      }
      return temp.join(glue);
    },
    _removeAnimClass = function($el) {
      $el.attr('class') && $el.attr('class', $el.attr('class').replace(regAnimAll, ''));
    };
    
  // plugin instance base
  function CSS3Animate($el) {
    //console.log('CSS3Animate#constructor');
    this.$el = $el;
    this.options = $.extend({}, $.fn.CSS3Animate.defaults);
    this.memory = {
      width  : $el.css('width'),
      height : $el.css('height'),
      display: $el.css('display')
    };
    
    return this;
  }
  CSS3Animate.prototype = {
    init: function(props, duration, easing, callback) {
      //console.log('CSS3Animate#init');
      var id, animation, keyframes, found, delay,
        $el = this.$el, _self = this;
      
      duration = duration || this.options.duration;
      easing = easing || this.options.easing;
      delay = (this.delayTime > 0) ? this.delayTime : 0;
      
      if (easing && !easingConverter[easing]) {
        $.error('Don\'t support such easing function.');
      } else {
        easing = easingConverter[easing];
      }
      
      
      var doAnimation = function() {
        $el.css('display', _self.memory.display || 'block'); 
        keyframes = _createKeyframes($el, props);
        found = _findAnimation($el, props, duration / 1000, easing);
        
        if (found) {
          //console.log('animation found');
          animation = found;
          animation.keyframes = keyframes;
          id = found.id;
        } else {
          //console.log('animation not found');
          id = ANIM_PREFIX + uid++;
          animation = {
            id        : id,
            element   : $el,
            props     : props,
            keyframes : keyframes,
            duration  : duration / 1000,
            easing    : easing,
            direction : 'normal',
            iteration : 1,
            delay     : delay / 1000
          };
          animations.push(animation);
        }
        _rewriteStyles();
        
        if (delay === 0) {
          _removeAnimClass($el);
        }
        $el.addClass(CLASS_PREFIX + id + START_POSTFIX);
        $el.off(animationEndJoint)
          .on(animationEndJoint, function(e) {
          //console.log('animation end');
          if (delay > 0) {
            _removeAnimClass($el);
          } else {
            $el.removeClass(CLASS_PREFIX + id + START_POSTFIX);
          }
          $el.addClass(CLASS_PREFIX + id + END_POSTFIX);
          $el.off(animationEndJoint);
          
          callback && callback();
          
          $el.dequeue();
          
          if ($el.css('opacity') === 0 
          || $el.css('width') === 0 
          || $el.css('height') === 0) {
            $el.css('display', 'none');
          }
          
        });
      }
      $el.queue(doAnimation);
      
      this.props = props;
      this.duration = duration;
      this.easing = easing;
      this.callback = callback;
      this.delayTime = 0;
      
      if (this.options.alwaysStop) {
        this.stop();
      }
    },
    config: function(options) {
      //console.log('CSS3Animate#config');
      this.options = $.extend({}, $.fn.CSS3Animate.defaults, options);
    },
    stop: function() {
      //console.log('CSS3Animate#stop');
      this.$el.clearQueue();
      for (var prop in this.props) {
        this.$el.css({
          prop: this.$el.css(prop)
        });
      }
      return this;
    },
    delay: function(delay) {
      this.delayTime = delay;
    },
    fadeIn: function(duration, easing, callback) {
      this.init({
        'opacity': 1
      }, duration, easing, callback);
    },
    fadeOut: function(duration, easing, callback) {
      this.init({
        'opacity': 0
      }, duration, easing, $.proxy(this.hideComplete, this, callback));
    },
    fadeToggle: function(duration, easing, callback) {
      if (this.props && this.props.opacity === 0) {
        this.fadeIn(duration, easing, callback);
      } else {
        this.fadeOut(duration, easing, callback);
      }
    },
    hide: function(duration, easing, callback) {
      this.init({
        'width'  : 0,
        'height' : 0,
        'opacity': 0
      }, duration, easing, $.proxy(this.hideComplete, this, callback));
    },
    show: function(duration, easing, callback) {
      this.init({
        'width'  : this.memory.width,
        'height' : this.memory.height,
        'opacity': 1
      }, duration, easing, callback);
    },
    toggle: function(duration, easing, callback) {
      if (this.props && this.props.opacity === 0) {
        this.show(duration, easing, callback);
      } else {
        this.hide(duration, easing, callback);
      }
    },
    slideDown: function(duration, easing, callback) {
      this.init({
        'height': this.memory.height
      }, duration, easing, callback);
    },
    slideUp: function(duration, easing, callback) {
      this.init({
        'height': 0
      }, duration, easing, $.proxy(this.hideComplete, this, callback));
    },
    slideToggle: function(duration, easing, callback) {
      if (this.props && this.props.height === 0) {
        this.slideDown(duration, easing, callback);
      } else {
        this.slideUp(duration, easing, callback);
      }
    },
    removeClass: function() {
      this.$el.clearQueue();
      _removeAnimClass(this.$el);
    }
  };
  
  $.fn.CSS3Animate = function(options) {
    var method, args, instance;
    
    if ($('#' + STYLE_ID).size() > 0) {
      $style = $('#' + STYLE_ID);
    } else {
      $('head').append($style);
    }
    if (typeof options === 'string') {
      method = Array.prototype.shift.call(arguments);
    }
    args = arguments;
    
    return this.each(function() {
      instance = $(this).data('plugin_' + PLUGIN_NAME);
      
      if (!instance) {
        instance = new CSS3Animate($(this));
        $(this).data('plugin_' + PLUGIN_NAME, instance);
      }
      if (method) {
        if (instance[method]) {
          instance[method].apply(instance, args);
        } else {
          $.error('Method ' + method + ' does not exist on jQuery.' + PLUGIN_NAME);
        }
      } else {
        instance.init.apply(instance, args);
      }
    });
  };
  $.fn.CSS3Animate.defaults = {
    duration   : 500,
    easing     : 'easeOutQuad',
    alwaysStop : false
  };
}($));