import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class ViewOptions extends PureComponent {
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

  onshowNeighboringMonthChange = (event) => {
    const { setState } = this.props;

    const { checked } = event.target;

    setState({ showNeighboringMonth: checked });
  }

  render() {
    const { showLeadingZeros, showWeekNumbers, showNeighboringMonth } = this.props;

    return (
      <fieldset id="viewoptions">
        <legend htmlFor="viewoptions">
          View options
        </legend>

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
            onChange={this.onshowNeighboringMonthChange}
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
  setState: PropTypes.func.isRequired,
  showLeadingZeros: PropTypes.bool.isRequired,
  showNeighboringMonth: PropTypes.bool.isRequired,
  showWeekNumbers: PropTypes.bool.isRequired,
};
