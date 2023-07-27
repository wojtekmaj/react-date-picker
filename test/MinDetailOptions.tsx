import React from 'react';

import type { Detail } from './shared/types.js';

const allViews = ['century', 'decade', 'year', 'month'] as const;

function upperCaseFirstLetter(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

type MinDetailOptionsProps = {
  maxDetail: Detail;
  minDetail: Detail;
  setMinDetail: (maxDetail: Detail) => void;
};

export default function MinDetailOptions({
  maxDetail,
  minDetail,
  setMinDetail,
}: MinDetailOptionsProps) {
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setMinDetail(value as Detail);
  }

  const maxDetailIndex = allViews.indexOf(maxDetail);

  return (
    <fieldset>
      <legend>Minimum detail</legend>

      {allViews.map((view, index) => (
        <div key={view}>
          <input
            checked={minDetail === view}
            disabled={maxDetailIndex < index}
            id={`min-${view}`}
            name="minDetail"
            onChange={onChange}
            type="radio"
            value={view}
          />
          <label htmlFor={`min-${view}`}>{upperCaseFirstLetter(view)}</label>
        </div>
      ))}
    </fieldset>
  );
}
