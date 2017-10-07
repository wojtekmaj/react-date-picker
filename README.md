![downloads](https://img.shields.io/npm/dt/react-date-picker.svg) ![build](https://img.shields.io/travis/wojtekmaj/react-date-picker.svg) ![dependencies](https://img.shields.io/david/wojtekmaj/react-date-picker.svg
) ![dev dependencies](https://img.shields.io/david/dev/wojtekmaj/react-date-picker.svg
) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

# React-Date-Picker
An input component for picking dates for your React application.

## Important message for React-Date-Picker ≤5 users

Sadly, the authors of original React-Date-Picker ≤5 have abandoned the package. Because it lacked compatibility with React 16, the package would quickly become dead.

In version 6 I aim to provide a solution that will suit everyone's needs. To make that happen, I need time and your help. Please don't hesitate to file an issues with bugs, suggestions, or simply telling me more about how *you* use react-date-picker. Your help will be invaluable!

[Upgrade guide for React-Date-Picker ≤5 users](https://github.com/wojtekmaj/react-date-picker/wiki/Upgrade-guide-for-React-Date-Picker-≤5-users) is there to help you with the upgrade.

## tl;dr
* Install by executing `npm install react-date-picker` or `yarn add react-date-picker`.
* Import by adding `import DatePicker from 'react-date-picker'`.
* Use by adding `<DatePicker />`. Use `onChange` prop for getting new values.

## Demo

Minimal demo page is included in sample directory.

[Online demo](http://projekty.wojtekmaj.pl/react-date-picker/) is also available!

## Getting started

### Compatibility

[React-Calendar](https://github.com/wojtekmaj/react-calendar), on which React-Date-Picker relies heavily, uses modern web technologies. That's why it's so fast, lightweight and easy to style. This, however, comes at a cost of supporting only modern browsers.

|Browser|Minimum supported version|
|----|----|
|Google Chrome|24|
|Mozilla Firefox|29|
|Microsoft Edge|12|
|Apple Safari|10|
|Apple Safari (iOS)|10.2|
|Opera|15|
|Internet Explorer|11|
|Samsung Internet|4|

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
        />
      </div>
    );
  }
}
```

### Custom styling

If you don't want to use default React-Date-Picker styling to build upon it, you can import React-Date-Picker by using `import DatePicker from 'react-date-picker/build/entry.nostyle';` instead.

## User guide

### DatePicker

Displays an input field complete with custom inputs, native input, and a calendar.

#### Props

|Prop name|Description|Example values|
|----|----|----|
|calendarType|Defines which type of calendar should be used. Can be "US" or "ISO 8601". Defaults to "US" for "en-US" locale, "ISO 8601" to all the others.|`"ISO 8601"`|
|isOpen|Defined whether the calendar should be opened. Defaults to false.|`true`|
|locale|Defines which locale should be used by the calendar. Can be any BCP 47 language tag. Defaults to user's browser settings.|`"hu-HU"`|
|maxDate|Defines maximum date that the user can select. Periods partially overlapped by maxDate will also be selectable, although react-date-picker will ensure that no later date is selected.|Date: `new Date()`|
|maxDetail|Defines the most detailed view that the user shall see. View defined here also becomes the one on which clicking an item will select a date and pass it to onChange. Can be "month", "year", "decade" or "century". Defaults to "month".|`"month"`|
|minDate|Defines minimum date that the user can select. Periods partially overlapped by minDate will also be selectable, although react-date-picker will ensure that no earlier date is selected.|Date: `new Date()`|
|minDetail|Defines the least detailed view that the user shall see. Can be "month", "year", "decade" or "century". Defaults to "century".|`"century"`|
|nextLabel|Defines the content of the "next" button on the navigation pane. Defaults to "›".|<ul><li>String: `"›"`</li><li>React element: `<NextIcon />`</li></ul>|
|next2Label|Defines the content of the "next on higher level" button on the navigation pane. Defaults to "»". |<ul><li>String: `"»"`</li><li>React element: `<DoubleNextIcon />`</li></ul>|
|onChange|Function called when the user clicks an item on the most detailed view available.|`(value) => alert('New date is: ', value)`|
|onClickDay|Function called when the user clicks a day on a calendar.|`(value) => alert('Clicked day: ', value)`|
|onClickDecade|Function called when the user clicks a decade on a calendar.|`(value) => alert('Clicked decade: ', value)`|
|onClickMonth|Function called when the user clicks a month on a calendar.|`(value) => alert('Clicked month: ', value)`|
|onClickYear|Function called when the user clicks a year on a calendar.|`(value) => alert('Clicked year: ', value)`|
|prevLabel|Defines the content of the "previous" button on the navigation pane. Defaults to "‹".|<ul><li>String: `"‹"`</li><li>React element: `<PrevousIcon />`</li></ul>|
|prev2Label|Defines the content of the "previous on higher level" button on the navigation pane. Defaults to "«".|<ul><li>String: `"«"`</li><li>React element: `<DoublePreviousIcon />`</li></ul>|
|renderChildren|Allows to render custom content within a given calendar item (day on month view, month on year view and so on).|`({ date, view }) => view === 'month' && date.getDay() === 0 ? <p>It's Sunday!</p> : null`|
|returnValue|Defines which dates shall be passed by the calendar to the onChange function and onClick{Period} functions. Can be "start", "end" or "range". The latter will cause an array with start and end values to be passed. Defaults to "start".|`"range"`|
|showNeighboringMonth|Defines whether days from previous or next month shall be rendered if the month doesn't start on the first day of the week or doesn't end on the last day of the week, respectively. Defaults to true.|`false`|
|showWeekNumbers|Defines whether week numbers shall be shown at the left of MonthView or not. Defaults to false.|`true`|
|value|Defines the value of the input.|<ul><li>Date: `new Date()`</li><li>An array of dates: `[new Date(2017, 0, 1), new Date(2017, 7, 1)]`|
|view|Determines which calendar view shall be opened initially. Does not disable navigation. Can be "month", "year", "decade" or "century". Defaults to the most detailed view allowed.|`"year"`|

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
