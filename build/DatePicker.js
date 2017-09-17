'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactCalendar = require('react-calendar');

var _reactCalendar2 = _interopRequireDefault(_reactCalendar);

require('react-calendar/build/Calendar.less');

var _detectElementOverflow = require('detect-element-overflow');

var _detectElementOverflow2 = _interopRequireDefault(_detectElementOverflow);

require('./DatePicker.less');

var _DateInput = require('./DateInput');

var _DateInput2 = _interopRequireDefault(_DateInput);

var _dateFormatter = require('./shared/dateFormatter');

var _locales = require('./shared/locales');

var _propTypes3 = require('./shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var allViews = ['century', 'decade', 'year', 'month'];

var DatePicker = function (_Component) {
  _inherits(DatePicker, _Component);

  function DatePicker() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DatePicker);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      isOpen: _this.props.isOpen
    }, _this.openCalendar = function () {
      _this.setState({ isOpen: true });
    }, _this.closeCalendar = function () {
      _this.setState({ isOpen: false });
    }, _this.toggleCalendar = function () {
      _this.setState(function (prevState) {
        return { isOpen: !prevState.isOpen };
      });
    }, _this.onChange = function (value) {
      var closeCalendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      _this.setState({
        isOpen: !closeCalendar
      });

      var onChange = _this.props.onChange;

      if (onChange) {
        onChange(value);
      }
    }, _this.onFocus = function () {
      _this.blurRequested = false;

      _this.openCalendar();
    }, _this.onBlur = function () {
      _this.blurRequested = true;

      setTimeout(function () {
        if (_this.blurRequested) {
          _this.closeCalendar();

          _this.blurRequested = false;
        }
      }, 100);
    }, _this.stopPropagation = function (event) {
      return event.stopPropagation();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DatePicker, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      (0, _locales.setLocale)(this.props.locale);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var props = this.props;


      if (nextProps.locale !== props.locale) {
        (0, _locales.setLocale)(nextProps.locale);
      }
    }
  }, {
    key: 'renderInput',
    value: function renderInput() {
      var _props = this.props,
          maxDate = _props.maxDate,
          maxDetail = _props.maxDetail,
          minDate = _props.minDate,
          returnValue = _props.returnValue,
          value = _props.value;

      var _concat = [].concat(value),
          _concat2 = _slicedToArray(_concat, 1),
          valueFrom = _concat2[0];

      return _react2.default.createElement(
        'div',
        { className: 'react-date-picker__button' },
        _react2.default.createElement(_DateInput2.default, {
          maxDate: maxDate,
          maxDetail: maxDetail,
          minDate: minDate,
          onChange: this.onChange,
          placeholder: this.placeholder,
          returnValue: returnValue,
          value: valueFrom
        }),
        _react2.default.createElement(
          'button',
          {
            className: 'react-date-picker__button__icon',
            onClick: this.toggleCalendar,
            onFocus: this.stopPropagation
          },
          _react2.default.createElement(
            'svg',
            { xmlns: 'http://www.w3.org/2000/svg', width: '19', height: '19', viewBox: '0 0 19 19' },
            _react2.default.createElement(
              'g',
              { stroke: 'black', strokeWidth: '2' },
              _react2.default.createElement('rect', { width: '15', height: '15', x: '2', y: '2', fill: 'none' }),
              _react2.default.createElement('line', { x1: '6', y1: '0', x2: '6', y2: '4' }),
              _react2.default.createElement('line', { x1: '13', y1: '0', x2: '13', y2: '4' })
            )
          )
        )
      );
    }
  }, {
    key: 'renderCalendar',
    value: function renderCalendar() {
      var isOpen = this.state.isOpen;


      if (isOpen === null) {
        return null;
      }

      var _props2 = this.props,
          onChange = _props2.onChange,
          calendarProps = _objectWithoutProperties(_props2, ['onChange']);

      var className = 'react-date-picker__calendar';

      return _react2.default.createElement(
        'div',
        {
          className: className + ' ' + className + '--' + (isOpen ? 'open' : 'closed'),
          ref: function ref(_ref2) {
            if (!_ref2) {
              return;
            }

            _ref2.classList.remove(className + '--above-label');

            var collisions = (0, _detectElementOverflow2.default)(_ref2, document.body);

            if (collisions.collidedBottom) {
              _ref2.classList.add(className + '--above-label');
            }
          }
        },
        _react2.default.createElement(_reactCalendar2.default, _extends({
          onChange: this.onChange
        }, calendarProps))
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          className: 'react-date-picker',
          onFocus: this.onFocus,
          onBlur: this.onBlur
        },
        this.renderInput(),
        this.renderCalendar()
      );
    }
  }, {
    key: 'placeholder',


    // eslint-disable-next-line class-methods-use-this
    get: function get() {
      var date = new Date(2017, 11, 11);

      return (0, _dateFormatter.formatDate)(date).replace('2017', 'year').replace('12', 'month').replace('11', 'day');
    }
  }]);

  return DatePicker;
}(_react.Component);

exports.default = DatePicker;


DatePicker.defaultProps = {
  maxDetail: 'month',
  returnValue: 'start'
};

DatePicker.propTypes = {
  calendarType: _propTypes3.isCalendarType,
  isOpen: _propTypes2.default.bool,
  locale: _propTypes2.default.string,
  maxDate: _propTypes3.isMaxDate,
  maxDetail: _propTypes2.default.oneOf(allViews),
  minDate: _propTypes3.isMinDate,
  minDetail: _propTypes2.default.oneOf(allViews),
  next2Label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  nextLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  onChange: _propTypes2.default.func,
  onClickDay: _propTypes2.default.func,
  onClickDecade: _propTypes2.default.func,
  onClickMonth: _propTypes2.default.func,
  onClickYear: _propTypes2.default.func,
  prev2Label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  prevLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  returnValue: _propTypes2.default.oneOf(['start', 'end']).isRequired,
  showNeighboringMonth: _propTypes2.default.bool,
  showWeekNumbers: _propTypes2.default.bool,
  value: _propTypes3.isValue
};