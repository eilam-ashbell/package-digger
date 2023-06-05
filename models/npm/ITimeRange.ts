export type ITimeRange =
    | "last-day"
    | "last-week"
    | "last-month"
    | `${number}${number}${number}${number}-${number}${number}-${number}${number}:${number}${number}${number}${number}-${number}${number}-${number}${number}`;
