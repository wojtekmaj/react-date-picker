import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getISOLocalDate } from '../src/shared/dates';

export default class DateBonduariesOptions extends Component {
  onMinChange = (event) => {
    const { value } = event.target;

    this.props.setState({ minDate: value ? new Date(value) : null });
  }

  onMaxChange = (event) => {
    const { value } = event.target;

    this.props.setState({ maxDate: value ? new Date(value) : null });
  }

  render() {
    const { maxDate, minDate, setState } = this.props;

    return (
      <fieldset id="datebonduariesoptions">
        <legend htmlFor="datebonduariesoptions">Minimum and maximum date</legend>

        <div>
          <label htmlFor="minDate">Minimum date</label>
          <input
            onChange={this.onMinChange}
            type="date"
            value={minDate ? getISOLocalDate(minDate) : ''}
          />&nbsp;
          <button
            onClick={() => setState({ minDate: null })}
            type="button"
          >
            Clear
          </button>
        </div>
        <div>
          <label htmlFor="maxDate">Maximum date</label>
          <input
            onChange={this.onMaxChange}
            type="date"
            value={maxDate ? getISOLocalDate(maxDate) : ''}
          />&nbsp;
          <button
            onClick={() => setState({ maxDate: null })}
            type="button"
          >
            Clear
          </button>
        </div>
      </fieldset>
    );
  }
}

DateBonduariesOptions.propTypes = {
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  setState: PropTypes.func.isRequired,
};
