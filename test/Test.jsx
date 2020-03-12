import React, { PureComponent } from 'react';
import DatePicker from 'react-date-picker/src/entry.nostyle';
import 'react-date-picker/src/DatePicker.less';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-calendar/src/Calendar.less';

import ValidityOptions from './ValidityOptions';
import MaxDetailOptions from './MaxDetailOptions';
import MinDetailOptions from './MinDetailOptions';
import LocaleOptions from './LocaleOptions';
import ValueOptions from './ValueOptions';
import ViewOptions from './ViewOptions';

import './Test.less';

const now = new Date();

const ariaLabelProps = {
  calendarAriaLabel: 'Toggle calendar',
  clearAriaLabel: 'Clear value',
  dayAriaLabel: 'Day',
  monthAriaLabel: 'Month',
  nativeInputAriaLabel: 'Date',
  yearAriaLabel: 'Year',
};

const placeholderProps = {
  dayPlaceholder: 'dd',
  monthPlaceholder: 'mm',
  yearPlaceholder: 'yyyy',
};

/* eslint-disable no-console */

export default class Test extends PureComponent {
  state = {
    disabled: false,
    isOpen: false,
    locale: null,
    maxDate: new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 15, 12),
    maxDetail: 'month',
    minDate: new Date(1995, now.getUTCMonth() + 1, 15, 12),
    minDetail: 'century',
    returnValue: 'start',
    required: true,
    showLeadingZeros: true,
    showNeighboringMonth: false,
    showWeekNumbers: false,
    value: now,
  }

  onChange = value => this.setState({ value });

  render() {
    const {
      disabled,
      isOpen,
      locale,
      maxDate,
      maxDetail,
      minDate,
      minDetail,
      returnValue,
      required,
      showLeadingZeros,
      showNeighboringMonth,
      showWeekNumbers,
      value,
    } = this.state;

    const setState = state => this.setState(state);

    const commonProps = {
      ...ariaLabelProps,
      ...placeholderProps,
      calendarClassName: 'myCustomCalendarClassName',
      className: 'myCustomDatePickerClassName',
      disabled,
      locale,
      maxDate,
      maxDetail,
      minDate,
      minDetail,
      name: 'myCustomName',
      onCalendarClose: () => console.log('Calendar closed'),
      onCalendarOpen: () => console.log('Calendar opened'),
      onChange: this.onChange,
      required,
      returnValue,
      showLeadingZeros,
      showNeighboringMonth,
      showWeekNumbers,
    };

    return (
      <div className="Test">
        <header>
          <h1>
            react-date-picker test page
          </h1>
        </header>
        <div className="Test__container">
          <aside className="Test__container__options">
            <MinDetailOptions
              maxDetail={maxDetail}
              minDetail={minDetail}
              setState={setState}
            />
            <MaxDetailOptions
              maxDetail={maxDetail}
              minDetail={minDetail}
              setState={setState}
            />
            <ValidityOptions
              maxDate={maxDate}
              minDate={minDate}
              required={required}
              setState={setState}
            />
            <LocaleOptions
              locale={locale}
              setState={setState}
            />
            <ValueOptions
              setState={setState}
              value={value}
            />
            <ViewOptions
              disabled={disabled}
              isOpen={isOpen}
              setState={setState}
              showLeadingZeros={showLeadingZeros}
              showNeighboringMonth={showNeighboringMonth}
              showWeekNumbers={showWeekNumbers}
            />
          </aside>
          <main className="Test__container__content">
            <form
              onSubmit={(event) => {
                event.preventDefault();

                console.warn('Calendar triggered submitting the form.');
                console.log(event);
              }}
            >
              <p>Controlled:</p>
              <DatePicker
                {...commonProps}
                isOpen={isOpen}
                value={value}
              />
              <p>Uncontrolled:</p>
              <DatePicker
                {...commonProps}
                defaultIsOpen={isOpen}
                defaultValue={value}
              />
              <br />
              <br />
              <button
                id="submit"
                type="submit"
              >
                Submit
              </button>
            </form>
          </main>
        </div>
      </div>
    );
  }
}
