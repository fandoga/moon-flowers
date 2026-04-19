import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";

export type TimePickerProps = {
  date?: Date;
  onDateChange?: (value: Date | undefined) => void;
  time?: string;
  onTimeChange?: (value: string) => void;
  preferSoon?: boolean;
  onPreferSoonChange?: (value: boolean) => void;
};

const TimePicker = ({
  date: dateProp,
  onDateChange,
  time: timeProp,
  onTimeChange,
  preferSoon: preferSoonProp,
  onPreferSoonChange,
}: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const [innerAsSoon, setInnerAsSoon] = useState(true);
  const [innerSelectTime, setInnerSelectTime] = useState(false);
  const [innerDate, setInnerDate] = useState<Date | undefined>();
  const [innerTime, setInnerTime] = useState("10:30");

  const preferSoon = preferSoonProp ?? innerAsSoon;
  const setPreferSoon = (v: boolean) => {
    onPreferSoonChange?.(v);
    if (preferSoonProp === undefined) setInnerAsSoon(v);
  };

  const selectTime = innerSelectTime;
  const setSelectTime = setInnerSelectTime;

  const date = dateProp ?? innerDate;
  const setDate = (v: Date | undefined) => {
    onDateChange?.(v);
    if (dateProp === undefined) setInnerDate(v);
  };

  const time = timeProp ?? innerTime;
  const setTime = (v: string) => {
    onTimeChange?.(v);
    if (timeProp === undefined) setInnerTime(v);
  };

  const formattedDate = date?.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (selectTime) {
    return (
      <div className="col-span-3 flex h-12 items-center justify-end gap-2 rounded-lg bg-gray p-2">
        <Input
          type="time"
          id="time-picker"
          step="60"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className=" cursor-pointer !text-xl appearance-none rounded-lg border-none bg-transparent text-center shadow-none outline-none focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="cursor-pointer flex h-10 shrink-0 items-center gap-2 rounded-lg bg-background px-3"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 1V3M3.5 1V3M1 5H14M2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm">{formattedDate ?? "Дата"}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="col-span-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray p-2"
        >
          {preferSoon ? "Как можно скорее" : "Время"}
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.05075 12.1205L12.5977 6.57354C11.6646 6.18371 10.8171 5.61444 10.1032 4.89804C9.3865 4.18408 8.81697 3.33628 8.427 2.40279L2.88 7.94979C2.44725 8.38254 2.2305 8.59929 2.0445 8.83779C1.82504 9.1194 1.6367 9.42392 1.48275 9.74604C1.353 10.019 1.25625 10.31 1.06275 10.8905L0.0412466 13.9528C-0.00576807 14.093 -0.0127434 14.2435 0.0211045 14.3875C0.0549524 14.5315 0.128282 14.6631 0.23285 14.7677C0.337419 14.8723 0.469081 14.9456 0.613037 14.9794C0.756993 15.0133 0.907537 15.0063 1.04775 14.9593L4.11 13.9378C4.69125 13.7443 4.9815 13.6475 5.2545 13.5178C5.578 13.3638 5.88075 13.1765 6.16275 12.956C6.40125 12.77 6.618 12.5533 7.05075 12.1205ZM14.1367 5.03454C14.6898 4.48147 15.0005 3.73133 15.0005 2.94917C15.0005 2.167 14.6898 1.41687 14.1367 0.863791C13.5837 0.310715 12.8335 5.8276e-09 12.0514 0C11.2692 -5.8276e-09 10.5191 0.310715 9.966 0.863791L9.30075 1.52904L9.32925 1.61229C9.65699 2.55037 10.1935 3.40178 10.8982 4.10229C11.6197 4.82815 12.5009 5.37522 13.4715 5.69979L14.1367 5.03454Z"
              fill="black"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto rounded-lg border-none p-0 shadow-none">
        <div className=" bg-gray flex flex-col gap-1 rounded-lg p-1 w-full">
          <button
            type="button"
            onClick={() => {
              setPreferSoon(true);
              setOpen(false);
            }}
            className="cursor-pointer p-2 bg-background rounded-md"
          >
            Как можно быстрее
          </button>
          <button
            type="button"
            onClick={() => {
              setPreferSoon(false);
              setSelectTime(true);
              setOpen(false);
            }}
            className="cursor-pointer p-2 bg-background rounded-md"
          >
            Выбрать дату
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;
