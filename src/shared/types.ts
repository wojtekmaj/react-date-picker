type Range<T> = [T, T];

export type ClassName = string | null | undefined | (string | null | undefined)[];

export type Detail = 'century' | 'decade' | 'year' | 'month';

export type LooseValuePiece = string | Date | null;

export type LooseValue = LooseValuePiece | Range<LooseValuePiece>;

export type RangeType = 'century' | 'decade' | 'year' | 'month' | 'day';

type ValuePiece = Date | null;

export type Value = ValuePiece | Range<ValuePiece>;
