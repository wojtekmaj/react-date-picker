'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getISOLocalDate = exports.getISOLocalMonth = exports.getMonth = exports.getDaysInMonth = exports.getDay = exports.getMonthIndex = exports.getYear = undefined;

var _dates = require('react-calendar/src/shared/dates');

exports.getYear = _dates.getYear;
exports.getMonthIndex = _dates.getMonthIndex;
exports.getDay = _dates.getDay;
exports.getDaysInMonth = _dates.getDaysInMonth;

/* Simple getters - getting a property of a given point in time */

var getMonth = exports.getMonth = function getMonth(date) {
  return date.getMonth() + 1;
};

/* Complex getters - getting a property somehow related to a given point in time */

/**
 * Returns local month in ISO-like format (YYYY-MM).
 */
var getISOLocalMonth = exports.getISOLocalMonth = function getISOLocalMonth(value) {
  if (!value) {
    return value;
  }

  if (!(value instanceof Date)) {
    throw new Error('Invalid date: ' + value);
  }

  var year = (0, _dates.getYear)(value);
  var month = ('0' + getMonth(value)).slice(-2);

  return year + '-' + month;
};

/**
 * Returns local date in ISO-like format (YYYY-MM-DD).
 */
var getISOLocalDate = exports.getISOLocalDate = function getISOLocalDate(value) {
  if (!value) {
    return value;
  }

  if (!(value instanceof Date)) {
    throw new Error('Invalid date: ' + value);
  }

  var year = (0, _dates.getYear)(value);
  var month = ('0' + getMonth(value)).slice(-2);
  var day = ('0' + (0, _dates.getDay)(value)).slice(-2);

  return year + '-' + month + '-' + day;
};