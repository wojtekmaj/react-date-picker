type Range<T> = [T, T];

export type Detail = 'century' | 'decade' | 'year' | 'month';

type LooseValuePiece = string | Date | null;

export type LooseValue = LooseValuePiece | Range<LooseValuePiece>;
