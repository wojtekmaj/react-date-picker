import { useId } from 'react';

type ViewOptionsProps = {
  disabled: boolean;
  renderInPortal: boolean;
  setDisabled: (disabled: boolean) => void;
  setRenderInPortal: (renderInPortal: boolean) => void;
  setShowLeadingZeros: (showLeadingZeros: boolean) => void;
  setShowNeighboringMonth: (showNeighboringMonth: boolean) => void;
  setShowWeekNumbers: (showWeekNumbers: boolean) => void;
  showLeadingZeros: boolean;
  showNeighboringMonth: boolean;
  showWeekNumbers: boolean;
};

export default function ViewOptions({
  disabled,
  renderInPortal,
  setDisabled,
  setRenderInPortal,
  setShowLeadingZeros,
  setShowNeighboringMonth,
  setShowWeekNumbers,
  showLeadingZeros,
  showNeighboringMonth,
  showWeekNumbers,
}: ViewOptionsProps) {
  const disabledId = useId();
  const showLeadingZerosId = useId();
  const showWeekNumbersId = useId();
  const showNeighboringMonthId = useId();
  const renderInPortalId = useId();

  function onDisabledChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setDisabled(checked);
  }

  function onShowLeadingZerosChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setShowLeadingZeros(checked);
  }

  function onShowWeekNumbersChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setShowWeekNumbers(checked);
  }

  function onShowNeighboringMonthChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setShowNeighboringMonth(checked);
  }

  function onRenderInPortalChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setRenderInPortal(checked);
  }

  return (
    <fieldset>
      <legend>View options</legend>

      <div>
        <input checked={disabled} id={disabledId} onChange={onDisabledChange} type="checkbox" />
        <label htmlFor={disabledId}>Disabled</label>
      </div>

      <div>
        <input
          checked={showLeadingZeros}
          id={showLeadingZerosId}
          onChange={onShowLeadingZerosChange}
          type="checkbox"
        />
        <label htmlFor={showLeadingZerosId}>Show leading zeros</label>
      </div>

      <div>
        <input
          checked={showWeekNumbers}
          id={showWeekNumbersId}
          onChange={onShowWeekNumbersChange}
          type="checkbox"
        />
        <label htmlFor={showWeekNumbersId}>Show week numbers</label>
      </div>

      <div>
        <input
          checked={showNeighboringMonth}
          id={showNeighboringMonthId}
          onChange={onShowNeighboringMonthChange}
          type="checkbox"
        />
        <label htmlFor={showNeighboringMonthId}>Show neighboring month's days</label>
      </div>

      <div>
        <input
          checked={renderInPortal}
          id={renderInPortalId}
          onChange={onRenderInPortalChange}
          type="checkbox"
        />
        <label htmlFor={renderInPortalId}>Render in portal</label>
      </div>
    </fieldset>
  );
}
