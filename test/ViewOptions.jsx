import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class ViewOptions extends PureComponent {
  onDisabledChange = (event) => {
    const { setState } = this.props;

    const { checked } = event.target;

    setState({ disabled: checked });
  }

  onShowLeadingZerosChange = (event) => {
    const { setState } = this.props;

    const { checked } = event.target;

    setState({ showLeadingZeros: checked });
  }

  onShowWeekNumbersChange = (event) => {
    const { setState } = this.props;

    const { checked } = event.target;

    setState({ showWeekNumbers: checked });
  }

  onShowNeighboringMonthChange = (event) => {
    const { setState } = this.props;

    const { checked } = event.target;

    setState({ showNeighboringMonth: checked });
  }

  render() {
    const {
      disabled,
      showLeadingZeros,
      showWeekNumbers,
      showNeighboringMonth,
    } = this.props;

    return (
      <fieldset id="viewoptions">
        <legend htmlFor="viewoptions">
          View options
        </legend>

        <div>
          <input
            id="disabled"
            type="checkbox"
            checked={disabled}
            onChange={this.onDisabledChange}
          />
          <label htmlFor="disabled">
            Disabled
          </label>
        </div>

        <div>
          <input
            id="showLeadingZeros"
            type="checkbox"
            checked={showLeadingZeros}
            onChange={this.onShowLeadingZerosChange}
          />
          <label htmlFor="showLeadingZeros">
            Show leading zeros
          </label>
        </div>

        <div>
          <input
            id="showWeekNumbers"
            type="checkbox"
            checked={showWeekNumbers}
            onChange={this.onShowWeekNumbersChange}
          />
          <label htmlFor="showWeekNumbers">
            Show week numbers
          </label>
        </div>

        <div>
          <input
            id="showNeighboringMonth"
            type="checkbox"
            checked={showNeighboringMonth}
            onChange={this.onShowNeighboringMonthChange}
          />
          <label htmlFor="showNeighboringMonth">
            {'Show neighboring month\'s days'}
          </label>
        </div>
      </fieldset>
    );
  }
}

ViewOptions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired,
  showLeadingZeros: PropTypes.bool.isRequired,
  showNeighboringMonth: PropTypes.bool.isRequired,
  showWeekNumbers: PropTypes.bool.isRequired,
};
