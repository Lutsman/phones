'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD (Register as an anonymous module)
    define(['jquery'], factory);
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  var JTooltip = function () {
    function JTooltip(options) {
      _classCallCheck(this, JTooltip);

      this.block = options.block;
      this.content = options.content || '';
      this.tooltipPosition = options.position || 'bottom';
      this.extraMargin = options.extraMargin || 5;
      this.showAnimation = options.showAnimation || 'fade';
      this.hideAnimation = options.hideAnimation || 'fade';
      this.showAnimationSpeed = options.showAnimationSpeed || 200;
      this.hideAnimationSpeed = options.hideAnimationSpeed || 200;
      this.customContainerClass = options.customContainerClass || '';
      this.tpl = {
        tooltipContainer: '<div class="jtooltip"></div>',
        tooltipInner: '<div class="jtooltip-inner"></div>',
        tooltipArrow: '<div class="jtooltip-arrow animated bounce"></div>'
      };
      this.events = {
        beforeOpen: 'jTooltip:beforeOpen',
        afterOpen: 'jTooltip:afterOpen',
        beforeClose: 'jTooltip:beforeClose',
        afterClose: 'jTooltip:afterClose'
      };

      this.init();
    }

    _createClass(JTooltip, [{
      key: 'init',
      value: function init() {
        if (!this.block) return;

        var debounceDuration = this.showAnimationSpeed + this.hideAnimationSpeed + 20;
        this.$block = $(this.block);

        this._addTooltipHandler = this.debounce(this.addTooltipHandler, debounceDuration).bind(this);
        this._removeTooltipHandler = this.removeTooltipHandler.bind(this);

        this.content = this.content || this.block.getAttribute('data-jtooltip-title') || this.block.getAttribute('title') || this.block.getAttribute('name');

        $(this.block).on({
          'mouseenter': this._addTooltipHandler,
          'mouseleave': this._removeTooltipHandler
        });

        this.running = true;
      }
    }, {
      key: 'addTooltipHandler',
      value: function addTooltipHandler(e) {
        e.preventDefault();

        var title = this.$block.attr('title');

        if (title) {
          this.$block.removeAttr('title').attr('data-cached-title', title);
        }

        this.addTooltip();
      }
    }, {
      key: 'removeTooltipHandler',
      value: function removeTooltipHandler(e) {
        e.preventDefault();

        var cachedTitle = this.$block.attr('data-cached-title');

        if (cachedTitle) {
          this.$block.removeAttr('data-cached-title').attr('title', cachedTitle);
        }

        this.removeTooltip();
      }
    }, {
      key: 'addTooltip',
      value: function addTooltip() {
        this.renderTooltip();
        this.setTooltipPos(this.tooltipPosition);
        this.showTooltip();
      }
    }, {
      key: 'renderTooltip',
      value: function renderTooltip(hidden) {
        var $tooltip = this.$tooltip = $(this.tpl.tooltipContainer);
        var $inner = this.$inner = $(this.tpl.tooltipInner);
        var $arrow = this.$arrow = $(this.tpl.tooltipArrow);
        var content = this.content;
        var customStyleClass = this.getPartialClass(this.block, 'js__jtooltip-s_') || '';

        $inner.append(content);
        $tooltip.append($inner).append($arrow).addClass(customStyleClass).addClass(this.customContainerClass).appendTo('body');

        if (hidden) {
          $tooltip.hide();
        }
      }
    }, {
      key: 'setTooltipPos',
      value: function setTooltipPos(pos, force) {
        var baseTooltipPos = this.tooltipPosition;
        var isAvaliablePos = this.getAvailiablePos(pos);
        var currForce = false;
        var blockCoords = this.getCoords(this.block);
        var $tooltip = this.$tooltip;
        var $arrow = this.$arrow;
        var offset = this.extraMargin;
        var top = null;
        var left = null;
        var arrowClass = '';
        var arrowCss = {};

        $tooltip.show();

        var tooltipWidth = $tooltip.outerWidth();
        var tooltipHeight = $tooltip.outerHeight();

        if (!isAvaliablePos && !force) {
          var nextPos = '';

          switch (pos) {
            case 'top':
              if (baseTooltipPos === pos) {
                nextPos = 'bottom';
              } else if (baseTooltipPos === 'bottom') {
                nextPos = 'right';
              } else if (baseTooltipPos === 'left' || baseTooltipPos === 'right') {
                nextPos = baseTooltipPos;
                currForce = true;
              }
              break;
            case 'right':
              if (baseTooltipPos === 'left') {
                nextPos = 'bottom';
              } else {
                nextPos = 'left';
              }
              break;
            case 'bottom':
              if (baseTooltipPos === 'top') {
                nextPos = 'right';
              } else {
                nextPos = 'top';
              }
              break;
            case 'left':
              if (baseTooltipPos === pos) {
                nextPos = 'right';
              } else if (baseTooltipPos === 'right') {
                nextPos = 'bottom';
              } else if (baseTooltipPos === 'top' || baseTooltipPos === 'bottom') {
                nextPos = baseTooltipPos;
                currForce = true;
              }
              break;
          }

          this.setTooltipPos(nextPos, currForce);
          return;
        }

        switch (pos) {
          case 'top':
            top = blockCoords.top - (tooltipHeight + offset);
            left = this.getCenterTooltip(pos);
            arrowCss = this.getArrowCenter(pos, left);
            arrowClass = 'jtooltip-t';
            break;
          case 'right':
            top = this.getCenterTooltip(pos);
            left = blockCoords.right + offset;
            arrowCss = this.getArrowCenter(pos, top);
            arrowClass = 'jtooltip-r';
            break;
          case 'bottom':
            top = blockCoords.bottom + offset;
            left = this.getCenterTooltip(pos);
            arrowCss = this.getArrowCenter(pos, left);
            arrowClass = 'jtooltip-b';
            break;
          case 'left':
            top = this.getCenterTooltip(pos);
            left = blockCoords.left - (tooltipWidth + offset);
            arrowCss = this.getArrowCenter(pos, top);
            arrowClass = 'jtooltip-l';
            break;
        }

        $tooltip.addClass(arrowClass).css({
          left: left + 'px',
          top: top + 'px'
        });

        $arrow.css(arrowCss.propName, arrowCss.propVal);

        $tooltip.hide();
      }
    }, {
      key: 'getAvailiablePos',
      value: function getAvailiablePos(pos) {
        var blockCoodrs = this.getCoords(this.block);
        var viewportCoords = this.getViewportCoords();
        var offset = this.extraMargin;
        var $tooltip = this.$tooltip;
        var tooltipWidth = $tooltip.outerWidth() + offset;
        var tooltipHeight = $tooltip.outerHeight() + offset;
        var result = false;

        switch (pos) {
          case 'top':
            result = blockCoodrs.top - viewportCoords.top >= tooltipHeight;
            break;
          case 'right':
            result = viewportCoords.right - blockCoodrs.right >= tooltipWidth;
            break;
          case 'bottom':
            result = viewportCoords.bottom - blockCoodrs.bottom >= tooltipHeight;
            break;
          case 'left':
            result = blockCoodrs.left - viewportCoords.left >= tooltipWidth;
            break;
        }

        return result;
      }
    }, {
      key: 'getCenterTooltip',
      value: function getCenterTooltip(pos) {
        var blockCoodrs = this.getCoords(this.block);
        var viewportCoords = this.getViewportCoords();
        var $tooltip = this.$tooltip;
        var tooltipWidth = $tooltip.outerWidth();
        var tooltipHeight = $tooltip.outerHeight();
        var blockCenter = 0;

        if (pos === 'top' || pos === 'bottom') {
          blockCenter = blockCoodrs.left + blockCoodrs.width / 2;
          var availLeft = blockCenter - tooltipWidth / 2 >= viewportCoords.left;
          var availRight = blockCenter + tooltipWidth / 2 <= viewportCoords.right;

          if (!availLeft || viewportCoords.width <= tooltipWidth) {
            return viewportCoords.left;
          } else if (!availRight) {
            return viewportCoords.right - tooltipWidth;
          }

          return blockCenter - tooltipWidth / 2;
        } else {
          blockCenter = blockCoodrs.top + blockCoodrs.height / 2;
          var availTop = blockCenter - tooltipHeight / 2 >= viewportCoords.top;
          var availBottom = blockCenter + tooltipHeight / 2 <= viewportCoords.bottom;

          if (!availTop || viewportCoords.height <= tooltipHeight) {
            return viewportCoords.top;
          } else if (!availBottom) {
            return viewportCoords.bottom - tooltipHeight;
          }

          return blockCenter - tooltipHeight / 2;
        }
      }
    }, {
      key: 'getArrowCenter',
      value: function getArrowCenter(posName, posUnit) {
        var $arrow = this.$arrow;
        var arrowCoords = this.getCoords($arrow[0]);
        var blockCoords = this.getCoords(this.block);
        var blockCenter = 0;
        var arrowCenter = 0;
        var offset = 0;
        var propName = '';
        var propLengthName = '';
        var propVal = '';
        var currPropVal = '';

        if (posName === 'top' || posName === 'bottom') {
          propName = 'left';
          propLengthName = 'width';
        } else {
          propName = 'top';
          propLengthName = 'height';
        }

        offset = posUnit - arrowCoords[propName];
        blockCenter = blockCoords[propName] + blockCoords[propLengthName] / 2;
        arrowCenter = arrowCoords[propName] + arrowCoords[propLengthName] / 2 + offset;

        if (blockCenter === arrowCenter) return;

        currPropVal = $arrow.css(propName) !== 'auto' ? parseFloat($arrow.css(propName)) : 0;
        propVal = currPropVal + (blockCenter - arrowCenter) + 'px';

        return {
          propName: propName,
          propVal: propVal
        };
      }
    }, {
      key: 'removeTooltip',
      value: function removeTooltip() {
        this.hideTooltip(true);
      }
    }, {
      key: 'showTooltip',
      value: function showTooltip() {
        var _this = this;

        if (!this.$tooltip.length) return;

        $(this.block).trigger(this.events.beforeOpen, [this.$tooltip, this]);

        switch (this.showAnimation) {
          case 'simple':
            this.$tooltip.show();
            $(this.block).trigger(this.events.afterOpen, [this.$tooltip, this]);
            break;
          case 'slide':
            this.$tooltip.slideDown(this.events.showAnimationSpeed, function () {
              $(_this.block).trigger(_this.events.afterOpen, [_this.$tooltip, _this]);
            });
            break;
          case 'fade':
            this.$tooltip.fadeIn(this.events.showAnimationSpeed, function () {
              $(_this.block).trigger(_this.events.afterOpen, [_this.$tooltip, _this]);
            });
            break;
        }
      }
    }, {
      key: 'hideTooltip',
      value: function hideTooltip(destroyTooltip) {
        var _this2 = this;

        var destroy = function destroy() {};

        if (!this.$tooltip || !this.$tooltip.length) return;

        if (destroyTooltip) {
          destroy = this.destoyTooltip.bind(this);
        }

        $(this.block).trigger(this.events.beforeClose, [this.$tooltip, this]);

        switch (this.showAnimation) {
          case 'simple':
            this.$tooltip.hide();
            destroy();
            $(this.block).trigger(this.events.afterClose, [this.$tooltip, this]);
            break;
          case 'slide':
            this.$tooltip.slideUp(this.hideAnimationSpeed, function () {
              destroy();
              $(_this2.block).trigger(_this2.events.afterClose, [_this2.$tooltip, _this2]);
            });
            break;
          case 'fade':
            this.$tooltip.fadeOut(this.hideAnimationSpeed, function () {
              destroy();
              $(_this2.block).trigger(_this2.events.afterClose, [_this2.$tooltip, _this2]);
            });
            break;
        }
      }
    }, {
      key: 'destoyTooltip',
      value: function destoyTooltip() {
        this.$tooltip.remove();
        this.$tooltip = null;
        this.$inner = null;
        this.$arrow = null;
      }
    }, {
      key: 'getCoords',
      value: function getCoords(elem) {
        var box = elem.getBoundingClientRect();
        var html = document.documentElement;

        return {
          top: box.top + window.pageYOffset || html.scrollTop,
          right: box.right + window.pageXOffset || html.scrollLeft,
          bottom: box.bottom + window.pageYOffset || html.scrollTop,
          left: box.left + window.pageXOffset || html.scrollLeft,
          width: elem.offsetWidth,
          height: elem.offsetHeight
        };
      }
    }, {
      key: 'getViewportCoords',
      value: function getViewportCoords() {
        var html = document.documentElement;
        var top = window.pageYOffset || html.scrollTop;
        var left = window.pageXOffset || html.scrollLeft;
        var right = left + html.clientWidth;
        var bottom = top + html.clientHeight;

        return {
          top: top,
          right: right,
          bottom: bottom,
          left: left,
          width: html.clientWidth,
          height: html.clientHeight
        };
      }
    }, {
      key: 'getPartialClass',
      value: function getPartialClass(el, classStart) {
        var classStr = el.className;
        var startPos = classStr.indexOf(classStart);

        if (!~startPos) return null;

        var endPos = ~classStr.indexOf(' ', startPos) ? classStr.indexOf(' ', startPos) : undefined;

        return classStr.slice(startPos, endPos);
      }
    }, {
      key: 'debounce',
      value: function debounce(func, ms) {
        var state = false;

        function wrapper() {
          if (state) return;

          func.apply(this, arguments);
          state = true;

          setTimeout(function () {
            state = false;
          }, ms);
        }

        return wrapper;
      }
    }, {
      key: 'getSelf',
      value: function getSelf() {
        return this;
      }
    }, {
      key: 'stop',
      value: function stop() {
        if (!this.running) return;

        $(this.block).off({
          'mouseenter': this._addTooltipHandler,
          'mouseleave': this._removeTooltipHandler
        });

        this.running = false;
      }
    }, {
      key: 'start',
      value: function start() {
        if (this.running) return;

        $(this.block).on({
          'mouseenter': this._addTooltipHandler,
          'mouseleave': this._removeTooltipHandler
        });

        this.running = true;
      }
    }, {
      key: 'preventDef',
      value: function preventDef(e) {
        e.preventDefault();
      }
    }]);

    return JTooltip;
  }();

  $.fn.jTooltip = function () {
    var _ = this;
    var options = arguments[0] || {};
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < _.length; i++) {
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
        options.block = _[i];
        _[i].jTooltip = new JTooltip(options);
      } else {
        var result = _[i].jTooltip[options].call(_[i].jTooltip, args);

        if (typeof result !== 'undefined') return result;
      }
    }

    return _;
  };
});

/*init*/
/*
jQuery(document).ready(function ($) {
  /!*tooltip*!/
  (function() {
    let $tooltips = $('[class*="js__jtooltip"]');

    $tooltips.each(function () {
      let $tooltip = $(this);
      let className = {
        positionTop: 'js__jtooltip-t',
        positionRight: 'js__jtooltip-r',
        positionBottom: 'js__jtooltip-b',
        positionleft: 'js__jtooltip-l'
      };
      let options = {};


      if ($tooltip.hasClass('js__jtooltip') || $tooltip.hasClass('js__jtooltip-horizontal')) { //temporary patch for changing hml layout
        return;
      }

      if ($tooltip.hasClass(className.positionTop)) {
        options.position = 'top';
      } else if ($tooltip.hasClass(className.positionRight)) {
        options.position = 'right';
      } else if ($tooltip.hasClass(className.positionBottom)) {
        options.position = 'bottom';
      } else if ($tooltip.hasClass(className.positionleft)) {
        options.position = 'left';
      }

      $tooltip.jTooltip(options);
    });
  })();

  /!*vertical*!/
  (function () {
    let $tooltip = $('.js__jtooltip');
    let options = {};

    $tooltip.jTooltip(options);
  })();

  /!*horizontal*!/
  (function () {
    let $tooltip = $('.js__jtooltip-horizontal');
    let options = {
      position: 'right'
    };

    $tooltip.jTooltip(options);
  })();
});*/
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2pUb29sdGlwLmVzNi5qcyJdLCJuYW1lcyI6WyJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsIm1vZHVsZSIsInJlcXVpcmUiLCJqUXVlcnkiLCIkIiwiSlRvb2x0aXAiLCJvcHRpb25zIiwiYmxvY2siLCJjb250ZW50IiwidG9vbHRpcFBvc2l0aW9uIiwicG9zaXRpb24iLCJleHRyYU1hcmdpbiIsInNob3dBbmltYXRpb24iLCJoaWRlQW5pbWF0aW9uIiwic2hvd0FuaW1hdGlvblNwZWVkIiwiaGlkZUFuaW1hdGlvblNwZWVkIiwiY3VzdG9tQ29udGFpbmVyQ2xhc3MiLCJ0cGwiLCJ0b29sdGlwQ29udGFpbmVyIiwidG9vbHRpcElubmVyIiwidG9vbHRpcEFycm93IiwiZXZlbnRzIiwiYmVmb3JlT3BlbiIsImFmdGVyT3BlbiIsImJlZm9yZUNsb3NlIiwiYWZ0ZXJDbG9zZSIsImluaXQiLCJkZWJvdW5jZUR1cmF0aW9uIiwiJGJsb2NrIiwiX2FkZFRvb2x0aXBIYW5kbGVyIiwiZGVib3VuY2UiLCJhZGRUb29sdGlwSGFuZGxlciIsImJpbmQiLCJfcmVtb3ZlVG9vbHRpcEhhbmRsZXIiLCJyZW1vdmVUb29sdGlwSGFuZGxlciIsImdldEF0dHJpYnV0ZSIsIm9uIiwicnVubmluZyIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInRpdGxlIiwiYXR0ciIsInJlbW92ZUF0dHIiLCJhZGRUb29sdGlwIiwiY2FjaGVkVGl0bGUiLCJyZW1vdmVUb29sdGlwIiwicmVuZGVyVG9vbHRpcCIsInNldFRvb2x0aXBQb3MiLCJzaG93VG9vbHRpcCIsImhpZGRlbiIsIiR0b29sdGlwIiwiJGlubmVyIiwiJGFycm93IiwiY3VzdG9tU3R5bGVDbGFzcyIsImdldFBhcnRpYWxDbGFzcyIsImFwcGVuZCIsImFkZENsYXNzIiwiYXBwZW5kVG8iLCJoaWRlIiwicG9zIiwiZm9yY2UiLCJiYXNlVG9vbHRpcFBvcyIsImlzQXZhbGlhYmxlUG9zIiwiZ2V0QXZhaWxpYWJsZVBvcyIsImN1cnJGb3JjZSIsImJsb2NrQ29vcmRzIiwiZ2V0Q29vcmRzIiwib2Zmc2V0IiwidG9wIiwibGVmdCIsImFycm93Q2xhc3MiLCJhcnJvd0NzcyIsInNob3ciLCJ0b29sdGlwV2lkdGgiLCJvdXRlcldpZHRoIiwidG9vbHRpcEhlaWdodCIsIm91dGVySGVpZ2h0IiwibmV4dFBvcyIsImdldENlbnRlclRvb2x0aXAiLCJnZXRBcnJvd0NlbnRlciIsInJpZ2h0IiwiYm90dG9tIiwiY3NzIiwicHJvcE5hbWUiLCJwcm9wVmFsIiwiYmxvY2tDb29kcnMiLCJ2aWV3cG9ydENvb3JkcyIsImdldFZpZXdwb3J0Q29vcmRzIiwicmVzdWx0IiwiYmxvY2tDZW50ZXIiLCJ3aWR0aCIsImF2YWlsTGVmdCIsImF2YWlsUmlnaHQiLCJoZWlnaHQiLCJhdmFpbFRvcCIsImF2YWlsQm90dG9tIiwicG9zTmFtZSIsInBvc1VuaXQiLCJhcnJvd0Nvb3JkcyIsImFycm93Q2VudGVyIiwicHJvcExlbmd0aE5hbWUiLCJjdXJyUHJvcFZhbCIsInBhcnNlRmxvYXQiLCJoaWRlVG9vbHRpcCIsImxlbmd0aCIsInRyaWdnZXIiLCJzbGlkZURvd24iLCJmYWRlSW4iLCJkZXN0cm95VG9vbHRpcCIsImRlc3Ryb3kiLCJkZXN0b3lUb29sdGlwIiwic2xpZGVVcCIsImZhZGVPdXQiLCJyZW1vdmUiLCJlbGVtIiwiYm94IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiaHRtbCIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50Iiwid2luZG93IiwicGFnZVlPZmZzZXQiLCJzY3JvbGxUb3AiLCJwYWdlWE9mZnNldCIsInNjcm9sbExlZnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImNsaWVudFdpZHRoIiwiY2xpZW50SGVpZ2h0IiwiZWwiLCJjbGFzc1N0YXJ0IiwiY2xhc3NTdHIiLCJjbGFzc05hbWUiLCJzdGFydFBvcyIsImluZGV4T2YiLCJlbmRQb3MiLCJ1bmRlZmluZWQiLCJzbGljZSIsImZ1bmMiLCJtcyIsInN0YXRlIiwid3JhcHBlciIsImFwcGx5IiwiYXJndW1lbnRzIiwic2V0VGltZW91dCIsIm9mZiIsImZuIiwialRvb2x0aXAiLCJfIiwiYXJncyIsIkFycmF5IiwicHJvdG90eXBlIiwiY2FsbCIsImkiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVDLFdBQVVBLE9BQVYsRUFBbUI7QUFDbEIsTUFBSSxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxPQUFPQyxHQUEzQyxFQUFnRDtBQUM5QztBQUNBRCxXQUFPLENBQUMsUUFBRCxDQUFQLEVBQW1CRCxPQUFuQjtBQUNELEdBSEQsTUFHTyxJQUFJLFFBQU9HLE9BQVAseUNBQU9BLE9BQVAsT0FBbUIsUUFBdkIsRUFBaUM7QUFDdEM7QUFDQUMsV0FBT0QsT0FBUCxHQUFpQkgsUUFBUUssUUFBUSxRQUFSLENBQVIsQ0FBakI7QUFDRCxHQUhNLE1BR0E7QUFDTDtBQUNBTCxZQUFRTSxNQUFSO0FBQ0Q7QUFDRixDQVhBLEVBV0MsVUFBVUMsQ0FBVixFQUFhO0FBQUEsTUFFUEMsUUFGTztBQUdYLHNCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQ25CLFdBQUtDLEtBQUwsR0FBYUQsUUFBUUMsS0FBckI7QUFDQSxXQUFLQyxPQUFMLEdBQWVGLFFBQVFFLE9BQVIsSUFBbUIsRUFBbEM7QUFDQSxXQUFLQyxlQUFMLEdBQXVCSCxRQUFRSSxRQUFSLElBQW9CLFFBQTNDO0FBQ0EsV0FBS0MsV0FBTCxHQUFtQkwsUUFBUUssV0FBUixJQUF1QixDQUExQztBQUNBLFdBQUtDLGFBQUwsR0FBcUJOLFFBQVFNLGFBQVIsSUFBeUIsTUFBOUM7QUFDQSxXQUFLQyxhQUFMLEdBQXFCUCxRQUFRTyxhQUFSLElBQXlCLE1BQTlDO0FBQ0EsV0FBS0Msa0JBQUwsR0FBMEJSLFFBQVFRLGtCQUFSLElBQThCLEdBQXhEO0FBQ0EsV0FBS0Msa0JBQUwsR0FBMEJULFFBQVFTLGtCQUFSLElBQThCLEdBQXhEO0FBQ0EsV0FBS0Msb0JBQUwsR0FBNEJWLFFBQVFVLG9CQUFSLElB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RTVDLE1BQXRCLEVBQThCaUQsR0FBOUIsRUFBbUM7QUFDakMsVUFBSSxRQUFPbkosT0FBUCx5Q0FBT0EsT0FBUCxPQUFtQixRQUF2QixFQUFpQztBQUMvQkEsZ0JBQVFDLEtBQVIsR0FBZ0I2SSxFQUFFSyxDQUFGLENBQWhCO0FBQ0FMLFVBQUVLLENBQUYsRUFBS04sUUFBTCxHQUFnQixJQUFJOUksUUFBSixDQUFhQyxPQUFiLENBQWhCO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsWUFBSWtGLFNBQVM0RCxFQUFFSyxDQUFGLEVBQUtOLFFBQUwsQ0FBYzdJLE9BQWQsRUFBdUJrSixJQUF2QixDQUE0QkosRUFBRUssQ0FBRixFQUFLTixRQUFqQyxFQUEyQ0UsSUFBM0MsQ0FBYjs7QUFFQSxZQUFJLE9BQU83RCxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DLE9BQU9BLE1BQVA7QUFDcEM7QUFDRjs7QUFFRCxXQUFPNEQsQ0FBUDtBQUNELEdBakJEO0FBa0JELENBN2VBLENBQUQ7O0FBZ2ZBO0FBQ0EiLCJmaWxlIjoianMvalRvb2x0aXAuZXM2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRCAoUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZSlcbiAgICBkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gTm9kZS9Db21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgZmFjdG9yeShqUXVlcnkpO1xuICB9XG59KGZ1bmN0aW9uICgkKSB7XG5cbiAgY2xhc3MgSlRvb2x0aXAge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuYmxvY2sgPSBvcHRpb25zLmJsb2NrO1xuICAgICAgdGhpcy5jb250ZW50ID0gb3B0aW9ucy5jb250ZW50IHx8ICcnO1xuICAgICAgdGhpcy50b29sdGlwUG9zaXRpb24gPSBvcHRpb25zLnBvc2l0aW9uIHx8ICdib3R0b20nO1xuICAgICAgdGhpcy5leHRyYU1hcmdpbiA9IG9wdGlvbnMuZXh0cmFNYXJnaW4gfHwgNTtcbiAgICAgIHRoaXMuc2hvd0FuaW1hdGlvbiA9IG9wdGlvbnMuc2hvd0FuaW1hdGlvbiB8fCAnZmFkZSc7XG4gICAgICB0aGlzLmhpZGVBbmltYXRpb24gPSBvcHRpb25zLmhpZGVBbmltYXRpb24gfHwgJ2ZhZGUnO1xuICAgICAgdGhpcy5zaG93QW5pbWF0aW9uU3BlZWQgPSBvcHRpb25zLnNob3dBbmltYXRpb25TcGVlZCB8fCAyMDA7XG4gICAgICB0aGlzLmhpZGVBbmltYXRpb25TcGVlZCA9IG9wdGlvbnMuaGlkZUFuaW1hdGlvblNwZWVkIHx8IDIwMDtcbiAgICAgIHRoaXMuY3VzdG9tQ29udGFpbmVyQ2xhc3MgPSBvcHRpb25zLmN1c3RvbUNvbnRhaW5lckNsYXNzIHx8ICcnO1xuICAgICAgdGhpcy50cGwgPSB7XG4gICAgICAgIHRvb2x0aXBDb250YWluZXI6ICc8ZGl2IGNsYXNzPVwianRvb2x0aXBcIj48L2Rpdj4nLFxuICAgICAgICB0b29sdGlwSW5uZXI6ICc8ZGl2IGNsYXNzPVwianRvb2x0aXAtaW5uZXJcIj48L2Rpdj4nLFxuICAgICAgICB0b29sdGlwQXJyb3c6ICc8ZGl2IGNsYXNzPVwianRvb2x0aXAtYXJyb3dcIj48L2Rpdj4nXG4gICAgICB9O1xuICAgICAgdGhpcy5ldmVudHMgPSB7XG4gICAgICAgIGJlZm9yZU9wZW46ICdqVG9vbHRpcDpiZWZvcmVPcGVuJyxcbiAgICAgICAgYWZ0ZXJPcGVuOiAnalRvb2x0aXA6YWZ0ZXJPcGVuJyxcbiAgICAgICAgYmVmb3JlQ2xvc2U6ICdqVG9vbHRpcDpiZWZvcmVDbG9zZScsXG4gICAgICAgIGFmdGVyQ2xvc2U6ICdqVG9vbHRpcDphZnRlckNsb3NlJ1xuICAgICAgfTtcblxuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIGlmICghdGhpcy5ibG9jaykgcmV0dXJuO1xuXG4gICAgICBsZXQgZGVib3VuY2VEdXJhdGlvbiA9IHRoaXMuc2hvd0FuaW1hdGlvblNwZWVkICsgdGhpcy5oaWRlQW5pbWF0aW9uU3BlZWQgKyAyMDtcbiAgICAgIHRoaXMuJGJsb2NrID0gJCh0aGlzLmJsb2NrKTtcblxuICAgICAgdGhpcy5fYWRkVG9vbHRpcEhhbmRsZXIgPSB0aGlzLmRlYm91bmNlKHRoaXMuYWRkVG9vbHRpcEhhbmRsZXIsIGRlYm91bmNlRHVyYXRpb24pLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9yZW1vdmVUb29sdGlwSGFuZGxlciA9IHRoaXMucmVtb3ZlVG9vbHRpcEhhbmRsZXIuYmluZCh0aGlzKTtcblxuICAgICAgdGhpcy5jb250ZW50ID1cbiAgICAgICAgdGhpcy5jb250ZW50IHx8XG4gICAgICAgIHRoaXMuYmxvY2suZ2V0QXR0cmlidXRlKCdkYXRhLWp0b29sdGlwLXRpdGxlJykgfHxcbiAgICAgICAgdGhpcy5ibG9jay5nZXRBdHRyaWJ1dGUoJ3RpdGxlJykgfHxcbiAgICAgICAgdGhpcy5ibG9jay5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblxuXG4gICAgICAkKHRoaXMuYmxvY2spLm9uKHtcbiAgICAgICAgJ21vdXNlZW50ZXInOiB0aGlzLl9hZGRUb29sdGlwSGFuZGxlcixcbiAgICAgICAgJ21vdXNlbGVhdmUnOiB0aGlzLl9yZW1vdmVUb29sdGlwSGFuZGxlclxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgfTtcblxuICAgIGFkZFRvb2x0aXBIYW5kbGVyKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgbGV0IHRpdGxlID0gdGhpcy4kYmxvY2suYXR0cigndGl0bGUnKTtcblxuICAgICAgaWYgKHRpdGxlKSB7XG4gICAgICAgIHRoaXMuJGJsb2NrXG4gICAgICAgICAgLnJlbW92ZUF0dHIoJ3RpdGxlJylcbiAgICAgICAgICAuYXR0cignZGF0YS1jYWNoZWQtdGl0bGUnLCB0aXRsZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWRkVG9vbHRpcCgpO1xuICAgIH1cblxuICAgIHJlbW92ZVRvb2x0aXBIYW5kbGVyKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgbGV0IGNhY2hlZFRpdGxlID0gdGhpcy4kYmxvY2suYXR0cignZGF0YS1jYWNoZWQtdGl0bGUnKTtcblxuICAgICAgaWYgKGNhY2hlZFRpdGxlKSB7XG4gICAgICAgIHRoaXMuJGJsb2NrXG4gICAgICAgICAgLnJlbW92ZUF0dHIoJ2RhdGEtY2FjaGVkLXRpdGxlJylcbiAgICAgICAgICAuYXR0cigndGl0bGUnLCBjYWNoZWRUaXRsZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpO1xuICAgIH1cblxuICAgIGFkZFRvb2x0aXAoKSB7XG4gICAgICB0aGlzLnJlbmRlclRvb2x0aXAoKTtcbiAgICAgIHRoaXMuc2V0VG9vbHRpcFBvcyh0aGlzLnRvb2x0aXBQb3NpdGlvbik7XG4gICAgICB0aGlzLnNob3dUb29sdGlwKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyVG9vbHRpcChoaWRkZW4pIHtcbiAgICAgIGxldCAkdG9vbHRpcCA9IHRoaXMuJHRvb2x0aXAgPSAkKHRoaXMudHBsLnRvb2x0aXBDb250YWluZXIpO1xuICAgICAgbGV0ICRpbm5lciA9IHRoaXMuJGlubmVyID0gJCh0aGlzLnRwbC50b29sdGlwSW5uZXIpO1xuICAgICAgbGV0ICRhcnJvdyA9IHRoaXMuJGFycm93ID0gJCh0aGlzLnRwbC50b29sdGlwQXJyb3cpO1xuICAgICAgbGV0IGNvbnRlbnQgPSB0aGlzLmNvbnRlbnQ7XG4gICAgICBsZXQgY3VzdG9tU3R5bGVDbGFzcyA9IHRoaXMuZ2V0UGFydGlhbENsYXNzKHRoaXMuYmxvY2ssICdqc19fanRvb2x0aXAtc18nKSB8fCAnJztcblxuICAgICAgJGlubmVyLmFwcGVuZChjb250ZW50KTtcbiAgICAgICR0b29sdGlwXG4gICAgICAgIC5hcHBlbmQoJGlubmVyKVxuICAgICAgICAuYXBwZW5kKCRhcnJvdylcbiAgICAgICAgLmFkZENsYXNzKGN1c3RvbVN0eWxlQ2xhc3MpXG4gICAgICAgIC5hZGRDbGFzcyh0aGlzLmN1c3RvbUNvbnRhaW5lckNsYXNzKVxuICAgICAgICAuYXBwZW5kVG8oJ2JvZHknKTtcblxuICAgICAgaWYgKGhpZGRlbikge1xuICAgICAgICAkdG9vbHRpcC5oaWRlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNldFRvb2x0aXBQb3MocG9zLCBmb3JjZSkge1xuICAgICAgbGV0IGJhc2VUb29sdGlwUG9zID0gdGhpcy50b29sdGlwUG9zaXRpb247XG4gICAgICBsZXQgaXNBdmFsaWFibGVQb3MgPSB0aGlzLmdldEF2YWlsaWFibGVQb3MocG9zKTtcbiAgICAgIGxldCBjdXJyRm9yY2UgPSBmYWxzZTtcbiAgICAgIGxldCBibG9ja0Nvb3JkcyA9IHRoaXMuZ2V0Q29vcmRzKHRoaXMuYmxvY2spO1xuICAgICAgbGV0ICR0b29sdGlwID0gdGhpcy4kdG9vbHRpcDtcbiAgICAgIGxldCAkYXJyb3cgPSB0aGlzLiRhcnJvdztcbiAgICAgIGxldCBvZmZzZXQgPSB0aGlzLmV4dHJhTWFyZ2luO1xuICAgICAgbGV0IHRvcCA9IG51bGw7XG4gICAgICBsZXQgbGVmdCA9IG51bGw7XG4gICAgICBsZXQgYXJyb3dDbGFzcyA9ICcnO1xuICAgICAgbGV0IGFycm93Q3NzID0ge307XG5cbiAgICAgICR0b29sdGlwLnNob3coKTtcblxuICAgICAgbGV0IHRvb2x0aXBXaWR0aCA9ICR0b29sdGlwLm91dGVyV2lkdGgoKTtcbiAgICAgIGxldCB0b29sdGlwSGVpZ2h0ID0gJHRvb2x0aXAub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgaWYgKCFpc0F2YWxpYWJsZVBvcyAmJiAhZm9yY2UpIHtcbiAgICAgICAgbGV0IG5leHRQb3MgPSAnJztcblxuICAgICAgICBzd2l0Y2ggKHBvcykge1xuICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICBpZiAoYmFzZVRvb2x0aXBQb3MgPT09IHBvcykge1xuICAgICAgICAgICAgICBuZXh0UG9zID0gJ2JvdHRvbSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhc2VUb29sdGlwUG9zID09PSAnYm90dG9tJykge1xuICAgICAgICAgICAgICBuZXh0UG9zID0gJ3JpZ2h0JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmFzZVRvb2x0aXBQb3MgPT09ICdsZWZ0JyB8fCBiYXNlVG9vbHRpcFBvcyA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgICBuZXh0UG9zID0gYmFzZVRvb2x0aXBQb3M7XG4gICAgICAgICAgICAgIGN1cnJGb3JjZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICBpZiAoYmFzZVRvb2x0aXBQb3MgPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgICBuZXh0UG9zID0gJ2JvdHRvbSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXh0UG9zID0gJ2xlZnQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgIGlmIChiYXNlVG9vbHRpcFBvcyA9PT0gJ3RvcCcpIHtcbiAgICAgICAgICAgICAgbmV4dFBvcyA9ICdyaWdodCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXh0UG9zID0gJ3RvcCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgIGlmIChiYXNlVG9vbHRpcFBvcyA9PT0gcG9zKSB7XG4gICAgICAgICAgICAgIG5leHRQb3MgPSAncmlnaHQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiYXNlVG9vbHRpcFBvcyA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgICBuZXh0UG9zID0gJ2JvdHRvbSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhc2VUb29sdGlwUG9zID09PSAndG9wJyB8fCBiYXNlVG9vbHRpcFBvcyA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgICAgICAgbmV4dFBvcyA9IGJhc2VUb29sdGlwUG9zO1xuICAgICAgICAgICAgICBjdXJyRm9yY2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFRvb2x0aXBQb3MobmV4dFBvcywgY3VyckZvcmNlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKHBvcykge1xuICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgIHRvcCA9IGJsb2NrQ29vcmRzLnRvcCAtICh0b29sdGlwSGVpZ2h0ICsgb2Zmc2V0KTtcbiAgICAgICAgICBsZWZ0ID0gdGhpcy5nZXRDZW50ZXJUb29sdGlwKHBvcyk7XG4gICAgICAgICAgYXJyb3dDc3MgPSB0aGlzLmdldEFycm93Q2VudGVyKHBvcywgbGVmdCk7XG4gICAgICAgICAgYXJyb3dDbGFzcyA9ICdqdG9vbHRpcC10JztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgIHRvcCA9IHRoaXMuZ2V0Q2VudGVyVG9vbHRpcChwb3MpO1xuICAgICAgICAgIGxlZnQgPSBibG9ja0Nvb3Jkcy5yaWdodCArIG9mZnNldDtcbiAgICAgICAgICBhcnJvd0NzcyA9IHRoaXMuZ2V0QXJyb3dDZW50ZXIocG9zLCB0b3ApO1xuICAgICAgICAgIGFycm93Q2xhc3MgPSAnanRvb2x0aXAtcic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgdG9wID0gYmxvY2tDb29yZHMuYm90dG9tICsgb2Zmc2V0O1xuICAgICAgICAgIGxlZnQgPSB0aGlzLmdldENlbnRlclRvb2x0aXAocG9zKTtcbiAgICAgICAgICBhcnJvd0NzcyA9IHRoaXMuZ2V0QXJyb3dDZW50ZXIocG9zLCBsZWZ0KTtcbiAgICAgICAgICBhcnJvd0NsYXNzID0gJ2p0b29sdGlwLWInO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICB0b3AgPSB0aGlzLmdldENlbnRlclRvb2x0aXAocG9zKTtcbiAgICAgICAgICBsZWZ0ID0gYmxvY2tDb29yZHMubGVmdCAtICh0b29sdGlwV2lkdGggKyBvZmZzZXQpO1xuICAgICAgICAgIGFycm93Q3NzID0gdGhpcy5nZXRBcnJvd0NlbnRlcihwb3MsIHRvcCk7XG4gICAgICAgICAgYXJyb3dDbGFzcyA9ICdqdG9vbHRpcC1sJztcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgJHRvb2x0aXBcbiAgICAgICAgLmFkZENsYXNzKGFycm93Q2xhc3MpXG4gICAgICAgIC5jc3Moe1xuICAgICAgICAgIGxlZnQ6IGxlZnQgKyAncHgnLFxuICAgICAgICAgIHRvcDogdG9wICsgJ3B4JyxcbiAgICAgICAgfSk7XG5cbiAgICAgICRhcnJvdy5jc3MoYXJyb3dDc3MucHJvcE5hbWUsIGFycm93Q3NzLnByb3BWYWwpO1xuXG4gICAgICAkdG9vbHRpcC5oaWRlKCk7XG4gICAgfTtcblxuICAgIGdldEF2YWlsaWFibGVQb3MocG9zKSB7XG4gICAgICBsZXQgYmxvY2tDb29kcnMgPSB0aGlzLmdldENvb3Jkcyh0aGlzLmJsb2NrKTtcbiAgICAgIGxldCB2aWV3cG9ydENvb3JkcyA9IHRoaXMuZ2V0Vmlld3BvcnRDb29yZHMoKTtcbiAgICAgIGxldCBvZmZzZXQgPSB0aGlzLmV4dHJhTWFyZ2luO1xuICAgICAgbGV0ICR0b29sdGlwID0gdGhpcy4kdG9vbHRpcDtcbiAgICAgIGxldCB0b29sdGlwV2lkdGggPSAkdG9vbHRpcC5vdXRlcldpZHRoKCkgKyBvZmZzZXQ7XG4gICAgICBsZXQgdG9vbHRpcEhlaWdodCA9ICR0b29sdGlwLm91dGVySGVpZ2h0KCkgKyBvZmZzZXQ7XG4gICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICAgIHN3aXRjaCAocG9zKSB7XG4gICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgcmVzdWx0ID0gYmxvY2tDb29kcnMudG9wIC0gdmlld3BvcnRDb29yZHMudG9wID49IHRvb2x0aXBIZWlnaHQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICByZXN1bHQgPSB2aWV3cG9ydENvb3Jkcy5yaWdodCAtIGJsb2NrQ29vZHJzLnJpZ2h0ID49IHRvb2x0aXBXaWR0aDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICByZXN1bHQgPSB2aWV3cG9ydENvb3Jkcy5ib3R0b20gLSBibG9ja0Nvb2Rycy5ib3R0b20gPj0gdG9vbHRpcEhlaWdodDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgcmVzdWx0ID0gYmxvY2tDb29kcnMubGVmdCAtIHZpZXdwb3J0Q29vcmRzLmxlZnQgPj0gdG9vbHRpcFdpZHRoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGdldENlbnRlclRvb2x0aXAocG9zKSB7XG4gICAgICBsZXQgYmxvY2tDb29kcnMgPSB0aGlzLmdldENvb3Jkcyh0aGlzLmJsb2NrKTtcbiAgICAgIGxldCB2aWV3cG9ydENvb3JkcyA9IHRoaXMuZ2V0Vmlld3BvcnRDb29yZHMoKTtcbiAgICAgIGxldCAkdG9vbHRpcCA9IHRoaXMuJHRvb2x0aXA7XG4gICAgICBsZXQgdG9vbHRpcFdpZHRoID0gJHRvb2x0aXAub3V0ZXJXaWR0aCgpO1xuICAgICAgbGV0IHRvb2x0aXBIZWlnaHQgPSAkdG9vbHRpcC5vdXRlckhlaWdodCgpO1xuICAgICAgbGV0IGJsb2NrQ2VudGVyID0gMDtcblxuICAgICAgaWYgKHBvcyA9PT0gJ3RvcCcgfHwgcG9zID09PSAnYm90dG9tJykge1xuICAgICAgICBibG9ja0NlbnRlciA9IGJsb2NrQ29vZHJzLmxlZnQgKyBibG9ja0Nvb2Rycy53aWR0aCAvIDI7XG4gICAgICAgIGxldCBhdmFpbExlZnQgPSBibG9ja0NlbnRlciAtIHRvb2x0aXBXaWR0aCAvIDIgPj0gdmlld3BvcnRDb29yZHMubGVmdDtcbiAgICAgICAgbGV0IGF2YWlsUmlnaHQgPSBibG9ja0NlbnRlciArIHRvb2x0aXBXaWR0aCAvIDIgPD0gdmlld3BvcnRDb29yZHMucmlnaHQ7XG5cbiAgICAgICAgaWYgKCFhdmFpbExlZnQgfHwgdmlld3BvcnRDb29yZHMud2lkdGggPD0gdG9vbHRpcFdpZHRoKSB7XG4gICAgICAgICAgcmV0dXJuIHZpZXdwb3J0Q29vcmRzLmxlZnQ7XG4gICAgICAgIH0gZWxzZSBpZiAoIWF2YWlsUmlnaHQpIHtcbiAgICAgICAgICByZXR1cm4gdmlld3BvcnRDb29yZHMucmlnaHQgLSB0b29sdGlwV2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYmxvY2tDZW50ZXIgLSB0b29sdGlwV2lkdGggLyAyO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBibG9ja0NlbnRlciA9IGJsb2NrQ29vZHJzLnRvcCArIChibG9ja0Nvb2Rycy5oZWlnaHQgLyAyKTtcbiAgICAgICAgbGV0IGF2YWlsVG9wID0gYmxvY2tDZW50ZXIgLSB0b29sdGlwSGVpZ2h0IC8gMiA+PSB2aWV3cG9ydENvb3Jkcy50b3A7XG4gICAgICAgIGxldCBhdmFpbEJvdHRvbSA9IGJsb2NrQ2VudGVyICsgdG9vbHRpcEhlaWdodCAvIDIgPD0gdmlld3BvcnRDb29yZHMuYm90dG9tO1xuXG4gICAgICAgIGlmICghYXZhaWxUb3AgfHwgdmlld3BvcnRDb29yZHMuaGVpZ2h0IDw9IHRvb2x0aXBIZWlnaHQpIHtcbiAgICAgICAgICByZXR1cm4gdmlld3BvcnRDb29yZHMudG9wO1xuICAgICAgICB9IGVsc2UgaWYgKCFhdmFpbEJvdHRvbSkge1xuICAgICAgICAgIHJldHVybiB2aWV3cG9ydENvb3Jkcy5ib3R0b20gLSB0b29sdGlwSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJsb2NrQ2VudGVyIC0gdG9vbHRpcEhlaWdodCAvIDI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QXJyb3dDZW50ZXIocG9zTmFtZSwgcG9zVW5pdCkge1xuICAgICAgbGV0ICRhcnJvdyA9IHRoaXMuJGFycm93O1xuICAgICAgbGV0IGFycm93Q29vcmRzID0gdGhpcy5nZXRDb29yZHMoJGFycm93WzBdKTtcbiAgICAgIGxldCBibG9ja0Nvb3JkcyA9IHRoaXMuZ2V0Q29vcmRzKHRoaXMuYmxvY2spO1xuICAgICAgbGV0IGJsb2NrQ2VudGVyID0gMDtcbiAgICAgIGxldCBhcnJvd0NlbnRlciA9IDA7XG4gICAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICAgIGxldCBwcm9wTmFtZSA9ICcnO1xuICAgICAgbGV0IHByb3BMZW5ndGhOYW1lID0gJyc7XG4gICAgICBsZXQgcHJvcFZhbCA9ICcnO1xuICAgICAgbGV0IGN1cnJQcm9wVmFsID0gJyc7XG5cblxuICAgICAgaWYgKHBvc05hbWUgPT09ICd0b3AnIHx8IHBvc05hbWUgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHByb3BOYW1lID0gJ2xlZnQnO1xuICAgICAgICBwcm9wTGVuZ3RoTmFtZSA9ICd3aWR0aCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9wTmFtZSA9ICd0b3AnO1xuICAgICAgICBwcm9wTGVuZ3RoTmFtZSA9ICdoZWlnaHQnO1xuICAgICAgfVxuXG4gICAgICBvZmZzZXQgPSBwb3NVbml0IC0gYXJyb3dDb29yZHNbcHJvcE5hbWVdO1xuICAgICAgYmxvY2tDZW50ZXIgPSBibG9ja0Nvb3Jkc1twcm9wTmFtZV0gKyBibG9ja0Nvb3Jkc1twcm9wTGVuZ3RoTmFtZV0gLyAyO1xuICAgICAgYXJyb3dDZW50ZXIgPSBhcnJvd0Nvb3Jkc1twcm9wTmFtZV0gKyBhcnJvd0Nvb3Jkc1twcm9wTGVuZ3RoTmFtZV0gLyAyICsgb2Zmc2V0O1xuXG4gICAgICBpZiAoYmxvY2tDZW50ZXIgPT09IGFycm93Q2VudGVyKSByZXR1cm47XG5cbiAgICAgIGN1cnJQcm9wVmFsID0gJGFycm93LmNzcyhwcm9wTmFtZSkgIT09ICdhdXRvJyA/IHBhcnNlRmxvYXQoJGFycm93LmNzcyhwcm9wTmFtZSkpIDogMDtcbiAgICAgIHByb3BWYWwgPSBjdXJyUHJvcFZhbCArIChibG9ja0NlbnRlciAtIGFycm93Q2VudGVyKSArICdweCc7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHByb3BOYW1lOiBwcm9wTmFtZSxcbiAgICAgICAgcHJvcFZhbDogcHJvcFZhbFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZW1vdmVUb29sdGlwKCkge1xuICAgICAgdGhpcy5oaWRlVG9vbHRpcCh0cnVlKTtcbiAgICB9XG5cbiAgICBzaG93VG9vbHRpcCgpIHtcbiAgICAgIGlmICghdGhpcy4kdG9vbHRpcC5sZW5ndGgpIHJldHVybjtcblxuICAgICAgJCh0aGlzLmJsb2NrKS50cmlnZ2VyKHRoaXMuZXZlbnRzLmJlZm9yZU9wZW4sIFt0aGlzLiR0b29sdGlwLCB0aGlzXSk7XG5cbiAgICAgIHN3aXRjaCAodGhpcy5zaG93QW5pbWF0aW9uKSB7XG4gICAgICAgIGNhc2UgJ3NpbXBsZSc6XG4gICAgICAgICAgdGhpcy4kdG9vbHRpcC5zaG93KCk7XG4gICAgICAgICAgJCh0aGlzLmJsb2NrKS50cmlnZ2VyKHRoaXMuZXZlbnRzLmFmdGVyT3BlbiwgW3RoaXMuJHRvb2x0aXAsIHRoaXNdKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc2xpZGUnOlxuICAgICAgICAgIHRoaXMuJHRvb2x0aXAuc2xpZGVEb3duKHRoaXMuZXZlbnRzLnNob3dBbmltYXRpb25TcGVlZCwgKCkgPT4ge1xuICAgICAgICAgICAgJCh0aGlzLmJsb2NrKS50cmlnZ2VyKHRoaXMuZXZlbnRzLmFmdGVyT3BlbiwgW3RoaXMuJHRvb2x0aXAsIHRoaXNdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZmFkZSc6XG4gICAgICAgICAgdGhpcy4kdG9vbHRpcC5mYWRlSW4odGhpcy5ldmVudHMuc2hvd0FuaW1hdGlvblNwZWVkLCAoKSA9PiB7XG4gICAgICAgICAgICAkKHRoaXMuYmxvY2spLnRyaWdnZXIodGhpcy5ldmVudHMuYWZ0ZXJPcGVuLCBbdGhpcy4kdG9vbHRpcCwgdGhpc10pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhpZGVUb29sdGlwKGRlc3Ryb3lUb29sdGlwKSB7XG4gICAgICBsZXQgZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIH07XG5cbiAgICAgIGlmICghdGhpcy4kdG9vbHRpcCB8fCAhdGhpcy4kdG9vbHRpcC5sZW5ndGgpIHJldHVybjtcblxuICAgICAgaWYgKGRlc3Ryb3lUb29sdGlwKSB7XG4gICAgICAgIGRlc3Ryb3kgPSB0aGlzLmRlc3RveVRvb2x0aXAuYmluZCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgJCh0aGlzLmJsb2NrKS50cmlnZ2VyKHRoaXMuZXZlbnRzLmJlZm9yZUNsb3NlLCBbdGhpcy4kdG9vbHRpcCwgdGhpc10pO1xuXG4gICAgICBzd2l0Y2ggKHRoaXMuc2hvd0FuaW1hdGlvbikge1xuICAgICAgICBjYXNlICdzaW1wbGUnOlxuICAgICAgICAgIHRoaXMuJHRvb2x0aXAuaGlkZSgpO1xuICAgICAgICAgIGRlc3Ryb3koKTtcbiAgICAgICAgICAkKHRoaXMuYmxvY2spLnRyaWdnZXIodGhpcy5ldmVudHMuYWZ0ZXJDbG9zZSwgW3RoaXMuJHRvb2x0aXAsIHRoaXNdKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc2xpZGUnOlxuICAgICAgICAgIHRoaXMuJHRvb2x0aXAuc2xpZGVVcCh0aGlzLmhpZGVBbmltYXRpb25TcGVlZCwgKCkgPT4ge1xuICAgICAgICAgICAgZGVzdHJveSgpO1xuICAgICAgICAgICAgJCh0aGlzLmJsb2NrKS50cmlnZ2VyKHRoaXMuZXZlbnRzLmFmdGVyQ2xvc2UsIFt0aGlzLiR0b29sdGlwLCB0aGlzXSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ZhZGUnOlxuICAgICAgICAgIHRoaXMuJHRvb2x0aXAuZmFkZU91dCh0aGlzLmhpZGVBbmltYXRpb25TcGVlZCwgKCkgPT4ge1xuICAgICAgICAgICAgZGVzdHJveSgpO1xuICAgICAgICAgICAgJCh0aGlzLmJsb2NrKS50cmlnZ2VyKHRoaXMuZXZlbnRzLmFmdGVyQ2xvc2UsIFt0aGlzLiR0b29sdGlwLCB0aGlzXSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGVzdG95VG9vbHRpcCgpIHtcbiAgICAgIHRoaXMuJHRvb2x0aXAucmVtb3ZlKCk7XG4gICAgICB0aGlzLiR0b29sdGlwID0gbnVsbDtcbiAgICAgIHRoaXMuJGlubmVyID0gbnVsbDtcbiAgICAgIHRoaXMuJGFycm93ID0gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRDb29yZHMoZWxlbSkge1xuICAgICAgbGV0IGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBsZXQgaHRtbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiBib3gudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGh0bWwuc2Nyb2xsVG9wLFxuICAgICAgICByaWdodDogYm94LnJpZ2h0ICsgd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGh0bWwuc2Nyb2xsTGVmdCxcbiAgICAgICAgYm90dG9tOiBib3guYm90dG9tICsgd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGh0bWwuc2Nyb2xsVG9wLFxuICAgICAgICBsZWZ0OiBib3gubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCB8fCBodG1sLnNjcm9sbExlZnQsXG4gICAgICAgIHdpZHRoOiBlbGVtLm9mZnNldFdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGVsZW0ub2Zmc2V0SGVpZ2h0XG4gICAgICB9O1xuICAgIH1cblxuICAgIGdldFZpZXdwb3J0Q29vcmRzKCkge1xuICAgICAgbGV0IGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICBsZXQgdG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGh0bWwuc2Nyb2xsVG9wO1xuICAgICAgbGV0IGxlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgaHRtbC5zY3JvbGxMZWZ0O1xuICAgICAgbGV0IHJpZ2h0ID0gbGVmdCArIGh0bWwuY2xpZW50V2lkdGg7XG4gICAgICBsZXQgYm90dG9tID0gdG9wICsgaHRtbC5jbGllbnRIZWlnaHQ7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvcDogdG9wLFxuICAgICAgICByaWdodDogcmlnaHQsXG4gICAgICAgIGJvdHRvbTogYm90dG9tLFxuICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICB3aWR0aDogaHRtbC5jbGllbnRXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiBodG1sLmNsaWVudEhlaWdodFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRQYXJ0aWFsQ2xhc3MoZWwsIGNsYXNzU3RhcnQpIHtcbiAgICAgIGxldCBjbGFzc1N0ciA9IGVsLmNsYXNzTmFtZTtcbiAgICAgIGxldCBzdGFydFBvcyA9IGNsYXNzU3RyLmluZGV4T2YoY2xhc3NTdGFydCk7XG5cbiAgICAgIGlmICghfnN0YXJ0UG9zKSByZXR1cm4gbnVsbDtcblxuICAgICAgbGV0IGVuZFBvcyA9IH5jbGFzc1N0ci5pbmRleE9mKCcgJywgc3RhcnRQb3MpID8gY2xhc3NTdHIuaW5kZXhPZignICcsIHN0YXJ0UG9zKSA6IHVuZGVmaW5lZDtcblxuICAgICAgcmV0dXJuIGNsYXNzU3RyLnNsaWNlKHN0YXJ0UG9zLCBlbmRQb3MpO1xuICAgIH1cblxuICAgIGRlYm91bmNlKGZ1bmMsIG1zKSB7XG4gICAgICB2YXIgc3RhdGUgPSBmYWxzZTtcblxuICAgICAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICAgICAgaWYgKHN0YXRlKSByZXR1cm47XG5cbiAgICAgICAgZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBzdGF0ZSA9IHRydWU7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc3RhdGUgPSBmYWxzZTtcbiAgICAgICAgfSwgbXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9XG5cbiAgICBnZXRTZWxmKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgIGlmICghdGhpcy5ydW5uaW5nKSByZXR1cm47XG5cbiAgICAgICQodGhpcy5ibG9jaykub2ZmKHtcbiAgICAgICAgJ21vdXNlZW50ZXInOiB0aGlzLl9hZGRUb29sdGlwSGFuZGxlcixcbiAgICAgICAgJ21vdXNlbGVhdmUnOiB0aGlzLl9yZW1vdmVUb29sdGlwSGFuZGxlclxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgaWYgKHRoaXMucnVubmluZykgcmV0dXJuO1xuXG4gICAgICAkKHRoaXMuYmxvY2spLm9uKHtcbiAgICAgICAgJ21vdXNlZW50ZXInOiB0aGlzLl9hZGRUb29sdGlwSGFuZGxlcixcbiAgICAgICAgJ21vdXNlbGVhdmUnOiB0aGlzLl9yZW1vdmVUb29sdGlwSGFuZGxlclxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgcHJldmVudERlZihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cblxuICAkLmZuLmpUb29sdGlwID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBfID0gdGhpcztcbiAgICBsZXQgb3B0aW9ucyA9IGFyZ3VtZW50c1swXSB8fCB7fTtcbiAgICBsZXQgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IF8ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgb3B0aW9ucy5ibG9jayA9IF9baV07XG4gICAgICAgIF9baV0ualRvb2x0aXAgPSBuZXcgSlRvb2x0aXAob3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcmVzdWx0ID0gX1tpXS5qVG9vbHRpcFtvcHRpb25zXS5jYWxsKF9baV0ualRvb2x0aXAsIGFyZ3MpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gXztcbiAgfTtcbn0pKTtcblxuXG4vKmluaXQqL1xuLypcbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCQpIHtcbiAgLyEqdG9vbHRpcCohL1xuICAoZnVuY3Rpb24oKSB7XG4gICAgbGV0ICR0b29sdGlwcyA9ICQoJ1tjbGFzcyo9XCJqc19fanRvb2x0aXBcIl0nKTtcblxuICAgICR0b29sdGlwcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCAkdG9vbHRpcCA9ICQodGhpcyk7XG4gICAgICBsZXQgY2xhc3NOYW1lID0ge1xuICAgICAgICBwb3NpdGlvblRvcDogJ2pzX19qdG9vbHRpcC10JyxcbiAgICAgICAgcG9zaXRpb25SaWdodDogJ2pzX19qdG9vbHRpcC1yJyxcbiAgICAgICAgcG9zaXRpb25Cb3R0b206ICdqc19fanRvb2x0aXAtYicsXG4gICAgICAgIHBvc2l0aW9ubGVmdDogJ2pzX19qdG9vbHRpcC1sJ1xuICAgICAgfTtcbiAgICAgIGxldCBvcHRpb25zID0ge307XG5cblxuICAgICAgaWYgKCR0b29sdGlwLmhhc0NsYXNzKCdqc19fanRvb2x0aXAnKSB8fCAkdG9vbHRpcC5oYXNDbGFzcygnanNfX2p0b29sdGlwLWhvcml6b250YWwnKSkgeyAvL3RlbXBvcmFyeSBwYXRjaCBmb3IgY2hhbmdpbmcgaG1sIGxheW91dFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICgkdG9vbHRpcC5oYXNDbGFzcyhjbGFzc05hbWUucG9zaXRpb25Ub3ApKSB7XG4gICAgICAgIG9wdGlvbnMucG9zaXRpb24gPSAndG9wJztcbiAgICAgIH0gZWxzZSBpZiAoJHRvb2x0aXAuaGFzQ2xhc3MoY2xhc3NOYW1lLnBvc2l0aW9uUmlnaHQpKSB7XG4gICAgICAgIG9wdGlvbnMucG9zaXRpb24gPSAncmlnaHQnO1xuICAgICAgfSBlbHNlIGlmICgkdG9vbHRpcC5oYXNDbGFzcyhjbGFzc05hbWUucG9zaXRpb25Cb3R0b20pKSB7XG4gICAgICAgIG9wdGlvbnMucG9zaXRpb24gPSAnYm90dG9tJztcbiAgICAgIH0gZWxzZSBpZiAoJHRvb2x0aXAuaGFzQ2xhc3MoY2xhc3NOYW1lLnBvc2l0aW9ubGVmdCkpIHtcbiAgICAgICAgb3B0aW9ucy5wb3NpdGlvbiA9ICdsZWZ0JztcbiAgICAgIH1cblxuICAgICAgJHRvb2x0aXAualRvb2x0aXAob3B0aW9ucyk7XG4gICAgfSk7XG4gIH0pKCk7XG5cbiAgLyEqdmVydGljYWwqIS9cbiAgKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgJHRvb2x0aXAgPSAkKCcuanNfX2p0b29sdGlwJyk7XG4gICAgbGV0IG9wdGlvbnMgPSB7fTtcblxuICAgICR0b29sdGlwLmpUb29sdGlwKG9wdGlvbnMpO1xuICB9KSgpO1xuXG4gIC8hKmhvcml6b250YWwqIS9cbiAgKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgJHRvb2x0aXAgPSAkKCcuanNfX2p0b29sdGlwLWhvcml6b250YWwnKTtcbiAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgIHBvc2l0aW9uOiAncmlnaHQnXG4gICAgfTtcblxuICAgICR0b29sdGlwLmpUb29sdGlwKG9wdGlvbnMpO1xuICB9KSgpO1xufSk7Ki9cbiJdfQ==
