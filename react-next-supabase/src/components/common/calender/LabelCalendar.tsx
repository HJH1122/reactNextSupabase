"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import styles from "./LabelCalendar.module.scss";

interface Props {
    label: string;
    readonly?: boolean;
}

function LabelCalendar({ label, readonly }: Props) {
    const [date, setDate] = useState<Date>();

    return (
        <div className={styles.container}>
            <div className={styles.container__label}>{label}</div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                {!readonly && (
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                        />
                    </PopoverContent>
                )}
            </Popover>
        </div>
    );
}

export default LabelCalendar;
