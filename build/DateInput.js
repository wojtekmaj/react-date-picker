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

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _dateFormatter = require('./shared/dateFormatter');

var _dates = require('./shared/dates');

var _propTypes3 = require('./shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var allViews = ['century', 'decade', 'year', 'month'];
var allValueTypes = [].concat((0, _toConsumableArray3.default)(allViews.slice(1)), ['day']);

var updateInputWidth = function updateInputWidth(element) {
  var span = document.createElement('span');
  span.innerHTML = element.value;

  var container = element.parentElement;

  container.appendChild(span);

  var width = span.clientWidth;
  element.style.width = width + 'px';

  container.removeChild(span);
};

var min = function min() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return Math.min.apply(Math, (0, _toConsumableArray3.default)(args.filter(function (a) {
    return typeof a === 'number';
  })));
};
var max = function max() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return Math.max.apply(Math, (0, _toConsumableArray3.default)(args.filter(function (a) {
    return typeof a === 'number';
  })));
};
var between = function between(value) {
  var minValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -Infinity;
  var maxValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  return Math.min(Math.max(value, minValue), maxValue);
};

var DateInput = function (_Component) {
  (0, _inherits3.default)(DateInput, _Component);

  function DateInput() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, DateInput);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
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
        var _this$props = _this.props,
            minDate = _this$props.minDate,
            maxDate = _this$props.maxDate;
        // @TODO: For returnValue set to "end", return year's/month's end.

        var proposedValue = new Date(values.year, values.month - 1 || 0, values.day || 1);
        var value = new Date(between(proposedValue.getTime(), minDate && minDate.getTime(), maxDate && maxDate.getTime()));
        _this.props.onChange(value, false // Prevent closing the calendar
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
    }, _this.stopPropagation = function (event) {
      return event.stopPropagation();
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
  }, {
    key: 'updateValues',
    value: function updateValues() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var value = props.value;


      this.setState({
        year: value ? (0, _dates.getYear)(value) : '',
        month: value ? (0, _dates.getMonth)(value) : '',
        day: value ? (0, _dates.getDay)(value) : ''
      });
    }
  }, {
    key: 'renderDay',
    value: function renderDay() {
      var maxDetail = this.props.maxDetail;

      // Do not display if maxDetail is "year" or less

      if (allViews.indexOf(maxDetail) < 3) {
        return null;
      }

      return _react2.default.createElement('input', (0, _extends3.default)({
        className: 'react-date-picker__button__input__day',
        name: 'day',
        key: 'day',
        max: this.maxDay,
        min: this.minDay,
        value: this.day
      }, this.commonInputProps));
    }
  }, {
    key: 'renderMonth',
    value: function renderMonth() {
      var maxDetail = this.props.maxDetail;

      // Do not display if maxDetail is "decade" or less

      if (allViews.indexOf(maxDetail) < 2) {
        return null;
      }

      return _react2.default.createElement('input', (0, _extends3.default)({
        className: 'react-date-picker__button__input__month',
        name: 'month',
        key: 'month',
        max: this.maxMonth,
        min: this.minMonth,
        value: this.month
      }, this.commonInputProps));
    }
  }, {
    key: 'renderYear',
    value: function renderYear() {
      return _react2.default.createElement('input', (0, _extends3.default)({
        className: 'react-date-picker__button__input__year',
        name: 'year',
        key: 'year',
        max: this.maxYear,
        min: this.minYear,
        step: this.yearStep,
        value: this.year
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
      }).filter(function (part) {
        return part;
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
      var nativeValueParser = this.nativeValueParser;
      var _props = this.props,
          maxDate = _props.maxDate,
          minDate = _props.minDate,
          value = _props.value;


      return _react2.default.createElement('input', {
        type: this.nativeInputType,
        max: minDate ? nativeValueParser(maxDate) : null,
        min: minDate ? nativeValueParser(minDate) : null,
        onChange: this.onChangeNative,
        onFocus: this.stopPropagation,
        step: this.yearStep,
        style: {
          visibility: 'hidden',
          position: 'absolute',
          top: '-9999px',
          left: '-9999px'
        },
        value: value ? nativeValueParser(value) : ''
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
    key: 'maxDay',
    get: function get() {
      var maxDate = this.props.maxDate;
      var _state = this.state,
          month = _state.month,
          year = _state.year;

      return min(this.currentMonthMaxDays, maxDate && year === (0, _dates.getYear)(maxDate) && month === (0, _dates.getMonth)(maxDate) && (0, _dates.getDay)(maxDate));
    }
  }, {
    key: 'minDay',
    get: function get() {
      var minDate = this.props.minDate;
      var _state2 = this.state,
          month = _state2.month,
          year = _state2.year;

      return max(1, minDate && year === (0, _dates.getYear)(minDate) && month === (0, _dates.getMonth)(minDate) && (0, _dates.getDay)(minDate));
    }
  }, {
    key: 'day',
    get: function get() {
      return between(this.state.day, this.minDay, this.maxDay);
    }
  }, {
    key: 'maxMonth',
    get: function get() {
      var maxDate = this.props.maxDate;
      var year = this.state.year;

      return min(12, maxDate && year === (0, _dates.getYear)(maxDate) && (0, _dates.getMonth)(maxDate));
    }
  }, {
    key: 'minMonth',
    get: function get() {
      var minDate = this.props.minDate;
      var year = this.state.year;

      return max(1, minDate && year === (0, _dates.getYear)(minDate) && (0, _dates.getMonth)(minDate));
    }
  }, {
    key: 'month',
    get: function get() {
      return between(this.state.month, this.minMonth, this.maxMonth);
    }
  }, {
    key: 'maxYear',
    get: function get() {
      var maxDate = this.props.maxDate;

      return maxDate ? (0, _dates.getYear)(maxDate) : null;
    }
  }, {
    key: 'minYear',
    get: function get() {
      var minDate = this.props.minDate;

      return max(1000, minDate && (0, _dates.getYear)(minDate));
    }
  }, {
    key: 'year',
    get: function get() {
      return between(this.state.year, this.minYear, this.maxYear);
    }

    /**
     * Returns value type that can be returned with currently applied settings.
     */

  }, {
    key: 'valueType',
    get: function get() {
      var maxDetail = this.props.maxDetail;

      return allValueTypes[allViews.indexOf(maxDetail)];
    }
  }, {
    key: 'nativeInputType',
    get: function get() {
      switch (this.valueType) {
        case 'decade':
        case 'year':
          return 'number';
        case 'month':
          return 'month';
        case 'day':
          return 'date';
        default:
          throw new Error('Invalid maxDetail.');
      }
    }
  }, {
    key: 'nativeValueParser',
    get: function get() {
      switch (this.valueType) {
        case 'century':
        case 'decade':
        case 'year':
          return _dates.getYear;
        case 'month':
          return _dates.getISOLocalMonth;
        case 'day':
          return _dates.getISOLocalDate;
        default:
          throw new Error('Invalid maxDetail.');
      }
    }
  }, {
    key: 'yearStep',
    get: function get() {
      if (this.valueType === 'century') {
        return 10;
      }
      return 1;
    }

    // eslint-disable-next-line class-methods-use-this

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
  maxDate: _propTypes3.isMaxDate,
  maxDetail: _propTypes2.default.oneOf(allViews).isRequired,
  minDate: _propTypes3.isMinDate,
  onChange: _propTypes2.default.func.isRequired,
  placeholder: _propTypes2.default.string.isRequired,
  value: _propTypes2.default.instanceOf(Date)
};