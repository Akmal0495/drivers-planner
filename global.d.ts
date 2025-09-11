declare module "react-big-calendar" {
  import { ComponentType } from "react";
  import { CalendarProps } from "react-big-calendar";
  export const Calendar: ComponentType<CalendarProps>;
  export function momentLocalizer(moment: any): any;
}

