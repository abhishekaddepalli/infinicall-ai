"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-bg-card rounded-lg border-none! outline-none! shadow-none!", className)}
      classNames={{
        months: "flex flex-col space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 relative",
        month_caption: "flex justify-center pt-1 relative items-center h-10 w-full mb-2",
        caption_label: "text-sm font-black text-title uppercase tracking-wider",
        nav: "flex items-center",
        button_previous: cn(buttonVariants({ variant: "outline" }), "h-9 w-9 bg-transparent p-0! opacity-60 hover:opacity-100 absolute left-2 top-2 z-10 rounded-radius border-primary/20"),
        button_next: cn(buttonVariants({ variant: "outline" }), "h-9 w-9 bg-transparent p-0! opacity-60 hover:opacity-100 absolute right-2 top-2 z-10 rounded-radius border-primary/20"),
        month_grid: "w-full border-collapse",
        weekdays: "",
        weekday: "text-muted-foreground text-title rounded-md w-9 font-black text-[10px] uppercase text-center shrink-0 tracking-tighter pb-2",
        week: "",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day_button: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-bold hover:bg-primary hover:text-white! text-title rounded-lg transition-all aria-selected:opacity-100"),
        range_start: "bg-primary text-white! [&>button]:text-white! rounded-l-lg hover:bg-primary hover:text-white!",
        range_end: "bg-primary text-white! [&>button]:text-white! rounded-r-lg hover:bg-primary hover:text-white!",
        selected: "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary focus:text-primary-foreground",
        today: "bg-muted text-primary font-black ring-1 ring-primary/20",
        outside: "text-muted-foreground opacity-40",
        disabled: "text-muted-foreground opacity-40",
        range_middle: "bg-primary/10 text-primary rounded-none font-bold",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4 text-primary" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
