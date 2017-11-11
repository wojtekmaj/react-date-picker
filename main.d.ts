import {ReactElement} from "react"

type TimeDetail = "month" | "year" | "decade" | "century"

type AnyCallback = (value: Date) => any

declare module "react-date-picker" {
    export default function DatePicker(props: DatePickerProps): JSX.Element;
    
    export interface DatePickerProps {
        calendarClassName?: string | string[];
        calendarType?: "US" | "ISO 8601";
        className?: string | string[];
        isOpen?: boolean;
        locale?: string;
        maxDate?: Date;
        maxDetail?: TimeDetail;
        minDate?: Date;
        minDetail?: TimeDetail;
        nextLabel?: string | ReactElement<any>;
        next2Label?: string | ReactElement<any>;
        onChange?: AnyCallback;
        onClickDay?: AnyCallback;
        onClickDecade?: AnyCallback;
        onClickMonth?: AnyCallback;
        onClickYear?: AnyCallback;
        prevLabel?: string | ReactElement<any>;
        prev2Label?: string | ReactElement<any>;
        renderChildren?: any;
        returnValue?: "start" | "end" | "range";
        showNeighboringMonth?: boolean;
        showWeekNumbers?: boolean;
        value?: Date | Date[];
        view?: "month" | "year" | "decade" | "century";
    }

}
