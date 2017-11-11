/// <reference types="react" />

type UnitOfTime = "month" | "year" | "decade" | "century"
type DateCallback = (date: Date) => void

declare module "react-date-picker" {
    export default function DatePicker(props: DatePickerProps): JSX.Element;
    
    export interface DatePickerProps {
        calendarClassName?: string | string[];
        calendarType?: "US" | "ISO 8601";
        className?: string | string[];
        isOpen?: boolean;
        locale?: string;
        maxDate?: Date;
        maxDetail?: UnitOfTime;
        minDate?: Date;
        minDetail?: UnitOfTime;
        nextLabel?: string | React.ReactElement<any>;
        next2Label?: string | React.ReactElement<any>;
        onChange?: DateCallback;
        onClickDay?: DateCallback;
        onClickDecade?: DateCallback;
        onClickMonth?: DateCallback;
        onClickYear?: DateCallback;
        prevLabel?: string | React.ReactElement<any>;
        prev2Label?: string | React.ReactElement<any>;
        renderChildren?: (props: DatePickerRenderChildrenProps) => JSX.Element | null;
        returnValue?: "start" | "end" | "range";
        showNeighboringMonth?: boolean;
        showWeekNumbers?: boolean;
        value?: Date | Date[];
        view?: UnitOfTime;
    }

    export interface DatePickerRenderChildrenProps {
        date: Date;
        view: UnitOfTime
    }

}
