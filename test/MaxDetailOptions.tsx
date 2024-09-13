import type { Detail } from './shared/types.js';

const allViews = ['century', 'decade', 'year', 'month'] as const;

function upperCaseFirstLetter(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

type MaxDetailOptionsProps = {
  maxDetail: Detail;
  minDetail: Detail;
  setMaxDetail: (maxDetail: Detail) => void;
};

export default function MaxDetailOptions({
  maxDetail,
  minDetail,
  setMaxDetail,
}: MaxDetailOptionsProps) {
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setMaxDetail(value as Detail);
  }

  const minDetailIndex = allViews.indexOf(minDetail);

  return (
    <fieldset>
      <legend>Maximum detail</legend>

      {allViews.map((view, index) => (
        <div key={view}>
          <input
            checked={maxDetail === view}
            disabled={minDetailIndex > index}
            id={`max-${view}`}
            name="maxDetail"
            onChange={onChange}
            type="radio"
            value={view}
          />
          {/* biome-ignore lint/a11y/noLabelWithoutControl: Pinky promise this label won't ever be empty */}
          <label htmlFor={`max-${view}`}>{upperCaseFirstLetter(view)}</label>
        </div>
      ))}
    </fieldset>
  );
}
