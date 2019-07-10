import * as React from 'react';
import DatePicker from 'react-date-picker';

import './Sample.less';

export default class Sample extends React.Component<{}, {value: Date}> {
  public state = {
    value: new Date(),
  };

  public onChange = (value: Date) => this.setState({ value });

  public render() {
    const { value } = this.state;

    return (
      <div className="Sample">
        <header>
          <h1>react-date-picker sample page</h1>
        </header>
        <div className="Sample__container">
          <main className="Sample__container__content">
            <DatePicker
              calendarAriaLabel="Toggle calendar"
              clearAriaLabel="Clear value"
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
