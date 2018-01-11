/// <reference types="react" />

declare module "react-date-picker" {
  type Detail = "month" | "year" | "decade" | "century"
  type DateCallback = (date: Date) => void
  type ViewCallback = (props: ViewCallbackProperties) => void

  export default function DatePicker(props: DatePickerProps): JSX.Element;

  export interface DatePickerProps {
    calendarClassName?: string | string[];
    calendarIcon?: React.ReactElement<any>;
    calendarType?: "US" | "ISO 8601";
    className?: string | string[];
    clearIcon?: React.ReactElement<any>;
    isOpen?: boolean;
    locale?: string;
    maxDate?: Date;
    maxDetail?: Detail;
    minDate?: Date;
    minDetail?: Detail;
    next2Label?: string | React.ReactElement<any>;
    nextLabel?: string | React.ReactElement<any>;
    onActiveDateChange?: ViewCallback;
    onChange?: DateCallback;
    onClickDay?: DateCallback;
    onClickDecade?: DateCallback;
    onClickMonth?: DateCallback;
    onClickYear?: DateCallback;
    onDrillDown?: ViewCallback;
    onDrillUp?: ViewCallback;
    prev2Label?: string | React.ReactElement<any>;
    prevLabel?: string | React.ReactElement<any>;
    renderChildren?: (props: CalendarTileProperties) => JSX.Element | null;
    returnValue?: "start" | "end";
    tileClassName?: string | string[] | ((props: CalendarTileProperties) => string | string[] | null);
    tileContent?: React.ReactElement<any> | ((props: CalendarTileProperties) => JSX.Element | null);
    showNeighboringMonth?: boolean;
    showWeekNumbers?: boolean;
    value?: Date;
    view?: Detail;
  }

  export interface CalendarTileProperties {
    date: Date;
    view: Detail;
  }

  export interface ViewCallbackProperties {
    activeStartDate: Date;
    view: Detail;
  }
}
