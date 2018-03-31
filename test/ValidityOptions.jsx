import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getISOLocalDate } from '../src/shared/dates';

export default class ValidityOptions extends PureComponent {
  onMinChange = (event) => {
    const { value } = event.target;

    this.props.setState({ minDate: value ? new Date(value) : null });
  }

  onMaxChange = (event) => {
    const { value } = event.target;

    this.props.setState({ maxDate: value ? new Date(value) : null });
  }

  render() {
    const {
      maxDate, minDate, required, setState,
    } = this.props;

    return (
      <fieldset id="ValidityOptions">
        <legend htmlFor="ValidityOptions">Minimum and maximum date</legend>

        <div>
          <label htmlFor="minDate">Minimum date</label>
          <input
            id="minDate"
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
            id="maxDate"
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

        <div>
          <input
            id="required"
            type="checkbox"
            checked={required}
            onChange={event => setState({ required: event.target.checked })}
          />
          <label htmlFor="required">Required</label>
        </div>
      </fieldset>
    );
  }
}

ValidityOptions.propTypes = {
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  required: PropTypes.bool,
  setState: PropTypes.func.isRequired,
};
