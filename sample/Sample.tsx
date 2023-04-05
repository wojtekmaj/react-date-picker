import React, { useState } from 'react';
import DatePicker from 'react-date-picker';

import './Sample.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Sample() {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="Sample">
      <header>
        <h1>react-date-picker sample page</h1>
      </header>
      <div className="Sample__container">
        <main className="Sample__container__content">
          <DatePicker
            calendarAriaLabel="Toggle calendar"
            clearAriaLabel="Clear value"
            dayAriaLabel="Day"
            monthAriaLabel="Month"
            nativeInputAriaLabel="Date"
            onChange={onChange}
            value={value}
            yearAriaLabel="Year"
          />
        </main>
      </div>
    </div>
  );
}
