import React, { Component } from 'react';
import { render } from 'react-dom';
import DatePicker from 'react-date-picker';
import 'react-date-picker/build/DatePicker.less';

import './Sample.less';

export default class Sample extends Component {
  state = {
    value: new Date(),
  }

  onChange = value => this.setState({ value })

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
              onChange={this.onChange}
              value={value}
            />
          </main>
        </div>
      </div>
    );
  }
}

render(<Sample />, document.getElementById('react-container'));
