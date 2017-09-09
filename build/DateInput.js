'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _dateFormatter = require('./shared/dateFormatter');

var _dates = require('./shared/dates');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var updateInputWidth = function updateInputWidth(element) {
  var span = document.createElement('span');
  span.innerHTML = element.value;

  var container = element.parentElement;

  container.appendChild(span);

  var width = span.clientWidth;
  element.style.width = width + 'px';

  container.removeChild(span);
};

var DateInput = function (_Component) {
  (0, _inherits3.default)(DateInput, _Component);

  function DateInput() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DateInput);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DateInput.__proto__ || (0, _getPrototypeOf2.default)(DateInput)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      year: '',
      month: '',
      day: ''
    }, _this.onSubmit = function (event) {
      if (event.preventDefault) {
        event.preventDefault();
      }

      var form = event.target;

      var values = {};

      for (var i = 0; i < form.length; i += 1) {
        values[form[i].name] = form[i].value;
      }

      if (form.checkValidity()) {
        _this.props.onChange(new Date(values.year, values.month - 1, values.day), false // Prevent closing the calendar
        );
      }
    }, _this.onKeyDown = function (event) {
      if (event.key === _this.divider) {
        event.preventDefault();

        var input = event.target;
        var nextInput = input.nextElementSibling;

        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      }
    }, _this.onChange = function (event) {
      _this.setState((0, _defineProperty3.default)({}, event.target.name, event.target.value));

      updateInputWidth(event.target);

      _this.onSubmit({ target: event.target.form });
    }, _this.onChangeNative = function (event) {
      var value = event.target.value;


      _this.props.onChange(new Date(value));
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(DateInput, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateValues();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var props = this.props;


      if (!!nextProps.value !== !!props.value || nextProps.value && props.value && nextProps.value.getTime() !== props.value.getTime()) {
        this.updateValues(nextProps);
      }
    }

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'updateValues',
    value: function updateValues() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var value = props.value;


      this.setState({
        year: value ? value.getFullYear() : '',
        month: value ? value.getMonth() + 1 : '',
        day: value ? value.getDate() : ''
      });
    }
  }, {
    key: 'renderDay',
    value: function renderDay() {
      var day = this.state.day;


      return _react2.default.createElement('input', (0, _extends3.default)({
        className: 'react-date-picker__button__input__day',
        name: 'day',
        key: 'day',
        min: 1,
        max: this.currentMonthMaxDays,
        value: day
      }, this.commonInputProps));
    }
  }, {
    key: 'renderMonth',
    value: function renderMonth() {
      var month = this.state.month;


      return _react2.default.createElement('input', (0, _extends3.default)({
        className: 'react-date-picker__button__input__month',
        name: 'month',
        key: 'month',
        min: 1,
        max: 12,
        value: month
      }, this.commonInputProps));
    }
  }, {
    key: 'renderYear',
    value: function renderYear() {
      var year = this.state.year;


      return _react2.default.createElement('input', (0, _extends3.default)({
        className: 'react-date-picker__button__input__year',
        name: 'year',
        key: 'year',
        min: 1000,
        value: year
      }, this.commonInputProps));
    }
  }, {
    key: 'renderCustomInputs',
    value: function renderCustomInputs() {
      var _this2 = this;

      var divider = this.divider;
      var placeholder = this.props.placeholder;


      return placeholder.split(divider).map(function (part) {
        switch (part) {
          case 'day':
            return _this2.renderDay();
          case 'month':
            return _this2.renderMonth();
          case 'year':
            return _this2.renderYear();
          default:
            return null;
        }
      }).reduce(function (result, element, index, array) {
        result.push(element);

        if (index + 1 < array.length) {
          result.push(divider);
        }

        return result;
      }, []);
    }
  }, {
    key: 'renderNativeInput',
    value: function renderNativeInput() {
      var value = this.props.value;


      return _react2.default.createElement('input', {
        type: 'date',
        onChange: this.onChangeNative,
        style: {
          visibility: 'hidden',
          position: 'absolute',
          top: '-9999px',
          left: '-9999px'
        },
        value: value ? (0, _dates.getISOLocalDate)(value) : ''
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'react-date-picker__button__input' },
        _react2.default.createElement(
          'form',
          { onSubmit: this.onSubmit },
          _react2.default.createElement('button', { type: 'submit', style: { display: 'none' } }),
          this.renderNativeInput(),
          this.renderCustomInputs()
        )
      );
    }
  }, {
    key: 'divider',
    get: function get() {
      var date = new Date(2017, 11, 11);

      return (0, _dateFormatter.formatDate)(date).match(/[^0-9]/)[0];
    }
  }, {
    key: 'currentMonthMaxDays',
    get: function get() {
      var value = this.props.value;


      if (!value) {
        return null;
      }

      return (0, _dates.getDaysInMonth)(value);
    }
  }, {
    key: 'commonInputProps',
    get: function get() {
      return {
        type: 'number',
        onChange: this.onChange,
        onKeyDown: this.onKeyDown,
        required: true,
        ref: function ref(_ref2) {
          if (!_ref2) {
            return;
          }

          updateInputWidth(_ref2);
        }
      };
    }
  }]);
  return DateInput;
}(_react.Component);

exports.default = DateInput;


DateInput.propTypes = {
  locale: _propTypes2.default.string,
  onChange: _propTypes2.default.func.isRequired,
  placeholder: _propTypes2.default.string.isRequired,
  value: _propTypes2.default.instanceOf(Date)
};