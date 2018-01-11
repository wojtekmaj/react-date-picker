import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getISOLocalDate } from '../src/shared/dates';

export default class ValueOptions extends Component {
  get startDate() {
    const { value } = this.props;
    return [].concat(value)[0];
  }

  get endDate() {
    const { value } = this.props;
    return [].concat(value)[1];
  }

  setValue = value => this.props.setState({ value });

  onChange = (event) => {
    const { value } = event.target;

    this.setValue(new Date(value));
  }

  render() {
    return (
      <fieldset id="valueOptions">
        <legend htmlFor="valueOptions">Set date externally</legend>

        <div>
          <label htmlFor="startDate">Start date</label>
          <input
            id="startDate"
            onChange={this.onChange}
            type="date"
            value={this.startDate ? getISOLocalDate(this.startDate) : ''}
          />&nbsp;
          <button onClick={() => this.setValue(null)}>Clear to null</button>
          <button onClick={() => this.setValue('')}>Clear to empty string</button>
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
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  ]),
};
