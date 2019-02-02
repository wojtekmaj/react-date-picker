import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getISOLocalDate } from '../src/shared/dates';

export default class ValueOptions extends PureComponent {
  get date() {
    const { value } = this.props;
    return [].concat(value)[0];
  }

  setValue = (value) => {
    const { setState } = this.props;

    setState({ value });
  }

  onChange = (event) => {
    const { value } = event.target;

    this.setValue(value ? new Date(value) : value);
  }

  render() {
    return (
      <fieldset id="valueOptions">
        <legend htmlFor="valueOptions">
          Set date externally
        </legend>

        <div>
          <label htmlFor="date">
            Date
          </label>
          <input
            id="date"
            onChange={this.onChange}
            type="date"
            value={this.date ? getISOLocalDate(this.date) : ''}
          />
          &nbsp;
          <button
            type="button"
            onClick={() => this.setValue(null)}
          >
            Clear to null
          </button>
          <button
            type="button"
            onClick={() => this.setValue('')}
          >
            Clear to empty string
          </button>
        </div>
      </fieldset>
    );
  }
}

ValueOptions.propTypes = {
  setState: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ])),
  ]),
};
