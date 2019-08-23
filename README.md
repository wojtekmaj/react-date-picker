[![npm](https://img.shields.io/npm/v/react-date-picker.svg)](https://www.npmjs.com/package/react-date-picker) ![downloads](https://img.shields.io/npm/dt/react-date-picker.svg) ![build](https://img.shields.io/travis/wojtekmaj/react-date-picker/master.svg) ![dependencies](https://img.shields.io/david/wojtekmaj/react-date-picker.svg) ![dev dependencies](https://img.shields.io/david/dev/wojtekmaj/react-date-picker.svg) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

# React-Date-Picker

A date picker for your React app.

* Pick days, months, years, or even decades
* Supports virtually any language
* No moment.js needed

## tl;dr
* Install by executing `npm install react-date-picker` or `yarn add react-date-picker`.
* Import by adding `import DatePicker from 'react-date-picker'`.
* Use by adding `<DatePicker />`. Use `onChange` prop for getting new values.

## Demo

Minimal demo page is included in sample directory.

[Online demo](http://projects.wojtekmaj.pl/react-date-picker/) is also available!

## Looking for a time picker or a datetime picker?

React-Date-Picker will play nicely with [React-Time-Picker](https://github.com/wojtekmaj/react-time-picker) and [React-DateTime-Picker](https://github.com/wojtekmaj/react-datetime-picker). Check them out!

## Getting started

### Compatibility

Your project needs to use React 16 or later. If you use older version of React, please refer to the table below to find suitable React-Date-Picker version.

|React version|Newest available React-Date-Picker|
|----|----|
|>16.0|latest|
|>15.5|6.7.0|

[React-Calendar](https://github.com/wojtekmaj/react-calendar), on which React-Date-Picker relies heavily, uses modern web technologies. That's why it's so fast, lightweight and easy to style. This, however, comes at a cost of [supporting only modern browsers](https://caniuse.com/#feat=internationalization).

#### Legacy browsers

If you need to support legacy browsers like Internet Explorer 10, you will need to use [Intl.js](https://github.com/andyearnshaw/Intl.js/) or another Intl polyfill along with React-Date-Picker.

### Installation

Add React-Date-Picker to your project by executing `npm install react-date-picker` or `yarn add react-date-picker`.

### Usage

Here's an example of basic usage:

```js
import React, { Component } from 'react';
import DatePicker from 'react-date-picker';

class MyApp extends Component {
  state = {
    date: new Date(),
  }

  onChange = date => this.setState({ date })

  render() {
    return (
      <div>
        <DatePicker
          onChange={this.onChange}
          value={this.state.date}
        />
      </div>
    );
  }
}
```

### Custom styling

If you don't want to use default React-Date-Picker styling to build upon it, you can import React-Date-Picker by using `import DatePicker from 'react-date-picker/dist/entry.nostyle';` instead.

## User guide

### DatePicker

Displays an input field complete with custom inputs, native input, and a calendar.

#### Props

|Prop name|Description|Default value|Example values|
|----|----|----|----|
|calendarAriaLabel|`aria-label` for the calendar button.|n/a|`"Toggle calendar"`|
|calendarClassName|Class name(s) that will be added along with `"react-calendar"` to the main React-Calendar `<div>` element.|n/a|<ul><li>String: `"class1 class2"`</li><li>Array of strings: `["class1", "class2 class3"]`</li></ul>|
|calendarIcon|Content of the calendar button. Setting the value explicitly to `null` will hide the icon.|(default icon)|<ul><li>String: `"Calendar"`</li><li>React element: `<CalendarIcon />`</li></ul>|
|className|Class name(s) that will be added along with `"react-date-picker"` to the main React-Date-Picker `<div>` element.|n/a|<ul><li>String: `"class1 class2"`</li><li>Array of strings: `["class1", "class2 class3"]`</li></ul>|
|clearAriaLabel|`aria-label` for the clear button.|n/a|`"Clear value"`|
|clearIcon|Content of the clear button. Setting the value explicitly to `null` will hide the icon.|(default icon)|<ul><li>String: `"Clear"`</li><li>React element: `<ClearIcon />`</li></ul>|
|dayAriaLabel|`aria-label` for the day input.|n/a|`"Day"`|
|dayPlaceholder|`placeholder` for the day input.|`"--"`|`"dd"`|
|disabled|Whether the date picker should be disabled.|`false`|`true`|
|disableCalendar|When set to `true`, will remove the calendar and the button toggling its visibility.|`false`|`true`|
|format|Input format based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table). Supported values are: `y`, `M`, `MM`, `MMM`, `MMMM`, `d`, `dd`.|n/a|`"y-MM-dd"`|
|isOpen|Whether the calendar should be opened.|`false`|`true`|
|locale|Locale that should be used by the date picker and the calendar. Can be any [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag).|User's browser settings|`"hu-HU"`|
|maxDate|Maximum date that the user can select. Periods partially overlapped by maxDate will also be selectable, although React-Date-Picker will ensure that no later date is selected.|n/a|Date: `new Date()`|
|maxDetail|The most detailed calendar view that the user shall see. View defined here also becomes the one on which clicking an item in the calendar will select a date and pass it to onChange. Can be `"month"`, `"year"`, `"decade"` or `"century"`.|`"month"`|`"year"`|
|minDate|Minimum date that the user can select. Periods partially overlapped by minDate will also be selectable, although React-Date-Picker will ensure that no earlier date is selected.|n/a|Date: `new Date()`|
|minDetail|The least detailed calendar view that the user shall see. Can be `"month"`, `"year"`, `"decade"` or `"century"`.|`"century"`|`"decade"`|
|monthAriaLabel|`aria-label` for the month input.|n/a|`"Month"`|
|monthPlaceholder|`placeholder` for the month input.|`"--"`|`"mm"`|
|name|Input name.|`"date"`|`"myCustomName"`|
|nativeInputAriaLabel|`aria-label` for the native date input.|n/a|`"Date"`|
|onCalendarClose|Function called when the calendar closes.|n/a|`() => alert('Calendar closed')`|
|onCalendarOpen|Function called when the calendar opens.|n/a|`() => alert('Calendar opened')`|
|onChange|Function called when the user clicks an item on the most detailed view available.|n/a|`(value) => alert('New date is: ', value)`|
|required|Whether date input should be required.|`false`|`true`|
|returnValue|Which dates shall be passed by the calendar to the onChange function and onClick{Period} functions. Can be `"start"`, `"end"` or `"range"`. The latter will cause an array with start and end values to be passed.|`"start"`|`"range"`|
|showLeadingZeros|Whether leading zeros should be rendered in date inputs.|`false`|`true`|
|value|Input value.|n/a|<ul><li>Date: `new Date()`</li><li>An array of dates: `[new Date(2017, 0, 1), new Date(2017, 7, 1)]`</li></ul>|
|yearAriaLabel|`aria-label` for the year input.|n/a|`"Year"`|
|yearPlaceholder|`aria-label` for the year input.|`"----"`|`"yyyy"`|

### Calendar

DatePicker component passes all props to React-Calendar, with the exception of `className` (you can use `calendarClassName` for that instead). There are tons of customizations you can do! For more information, see [Calendar component props](https://github.com/wojtekmaj/react-calendar#props).

## License

The MIT License.

## Author

<table>
  <tr>
    <td>
      <img src="https://github.com/wojtekmaj.png?s=100" width="100">
    </td>
    <td>
      Wojciech Maj<br />
      <a href="mailto:kontakt@wojtekmaj.pl">kontakt@wojtekmaj.pl</a><br />
      <a href="http://wojtekmaj.pl">http://wojtekmaj.pl</a>
    </td>
  </tr>
</table>

## Thank you

### Sponsors

Thank you to all our sponsors! [Become a sponsor](https://opencollective.com/react-date-picker#sponsor) and get your image on our README on GitHub.

<a href="https://opencollective.com/react-date-picker#sponsors" target="_blank"><img src="https://opencollective.com/react-date-picker/sponsors.svg?width=890"></a>

### Backers

Thank you to all our backers! [Become a backer](https://opencollective.com/react-date-picker#backer) and get your image on our README on GitHub.

<a href="https://opencollective.com/react-date-picker#backers" target="_blank"><img src="https://opencollective.com/react-date-picker/backers.svg?width=890"></a>

### Top Contributors

Thank you to all our contributors that helped on this project!

![Top Contributors](https://opencollective.com/react-date-picker/contributors.svg?width=890&button=false)
