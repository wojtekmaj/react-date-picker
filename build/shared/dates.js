'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* Simple getters - getting a property of a given point in time */

var getYear = exports.getYear = function getYear(date) {
  if (date instanceof Date) {
    return date.getFullYear();
  }

  if (typeof date === 'number') {
    return date;
  }

  var year = parseInt(date, 10);

  if (typeof date === 'string' && !isNaN(year)) {
    return year;
  }

  throw new Error('Failed to get year from date: ' + date + '.');
};

var getMonthIndex = exports.getMonthIndex = function getMonthIndex(date) {
  return date.getMonth();
};

/* Complex getters - getting a property somehow related to a given point in time */

/**
 * Returns a number of days in a month of a given date.
 *
 * @param {Date} date Date.
 */
var getDaysInMonth = exports.getDaysInMonth = function getDaysInMonth(date) {
  var year = getYear(date);
  var monthIndex = getMonthIndex(date);
  return new Date(year, monthIndex + 1, 0).getDate();
};