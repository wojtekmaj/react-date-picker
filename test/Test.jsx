import React, { Component } from 'react';
import DatePicker from 'react-date-picker/src/entry';

import LocaleOptions from './LocaleOptions';

import './Test.less';

const now = new Date();

export default class Test extends Component {
  state = {
    locale: null,
    value: now,
  }

  onChange = value => this.setState({ value })

  render() {
    const {
      locale,
      value,
    } = this.state;

    const setState = state => this.setState(state);

    return (
      <div className="Test">
        <header>
          <h1>react-date-picker test page</h1>
        </header>
        <div className="Test__container">
          <aside className="Test__container__options">
            <LocaleOptions
              setState={setState}
              locale={locale}
            />
          </aside>
          <main className="Test__container__content">
            <DatePicker
              locale={locale}
              onChange={this.onChange}
              value={value}
            />
          </main>
        </div>
      </div>
    );
  }
}
