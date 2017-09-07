'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactCalendar = require('react-calendar');

var _reactCalendar2 = _interopRequireDefault(_reactCalendar);

require('react-calendar/src/Calendar.less');

var _detectElementOverflow = require('detect-element-overflow');

var _detectElementOverflow2 = _interopRequireDefault(_detectElementOverflow);

require('./DatePicker.less');

var _DateInput = require('./DateInput');

var _DateInput2 = _interopRequireDefault(_DateInput);

var _locales = require('./shared/locales');

var _dateFormatter = require('./shared/dateFormatter');

var _propTypes3 = require('./shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DatePicker = function (_Component) {
  (0, _inherits3.default)(DatePicker, _Component);

  function DatePicker() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DatePicker);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DatePicker.__proto__ || (0, _getPrototypeOf2.default)(DatePicker)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
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

      if (_this.props.onChange) {
        _this.props.onChange(value);
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
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DatePicker, [{
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
      var value = this.props.value;


      return _react2.default.createElement(
        'div',
        { className: 'react-date-picker__button' },
        _react2.default.createElement(_DateInput2.default, {
          onChange: this.onChange,
          placeholder: this.placeholder,
          value: value
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

      var _props = this.props,
          calendarType = _props.calendarType,
          locale = _props.locale,
          maxDate = _props.maxDate,
          minDate = _props.minDate,
          showWeekNumbers = _props.showWeekNumbers,
          value = _props.value;


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
        _react2.default.createElement(_reactCalendar2.default, {
          calendarType: calendarType,
          locale: locale,
          maxDate: maxDate,
          minDate: minDate,
          onChange: this.onChange,
          showWeekNumbers: showWeekNumbers,
          value: value
        })
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

      return (0, _dateFormatter.formatDate)(date).replace('2017', 'YYYY').replace('12', 'MM').replace('11', 'DD');
    }
  }]);
  return DatePicker;
}(_react.Component);

exports.default = DatePicker;


DatePicker.propTypes = {
  calendarType: _propTypes3.isCalendarType,
  isOpen: _propTypes2.default.bool,
  locale: _propTypes2.default.string,
  maxDate: _propTypes3.isMaxDate,
  minDate: _propTypes3.isMinDate,
  onChange: _propTypes2.default.func,
  showWeekNumbers: _propTypes2.default.bool,
  value: _propTypes2.default.instanceOf(Date)
};