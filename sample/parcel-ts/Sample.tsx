import React, { Component } from 'react';
import DatePicker from 'react-date-picker';

import './Sample.less';

interface State {
  value: Date | Date[];
}

export default class Sample extends Component<{}, State> {
  state = {
    value: new Date(),
  };

  onChange = (value: Date | Date[]) => {
    this.setState({ value });
  }

  render() {
    const { value } = this.state;

    return (
      <div className="Sample">
        <header>
          <h1>react-date-picker sample page</h1>
        </header>
        <div className="Sample__container">
          <main className="Sample__container__content">
            <DatePicker
              clearAriaLabel="Clear value"
              clockAriaLabel="Toggle clock"
              dayAriaLabel="Day"
              monthAriaLabel="Month"
              nativeInputAriaLabel="Date"
              onChange={this.onChange}
              value={value}
              yearAriaLabel="Year"
            />
          </main>
        </div>
      </div>
    );
  }
}
