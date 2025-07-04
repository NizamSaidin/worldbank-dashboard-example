import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";
import { memo } from "react";

const TimeSelectorComponent = ({
  className,
  defaultValue = 2021,
  value,
  min = 2011,
  max = 2021,
  onValueChange,
  ...props
}: Omit<React.ComponentProps<typeof SliderPrimitive.Root>, 'defaultValue' | 'value' | 'onValueChange'> & {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
}) => {
  const [internalValue, setInternalValue] = React.useState(() => {
    if (typeof defaultValue === 'number') {
      return defaultValue;
    }
    return max;
  });

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = React.useCallback(
    (newValue: number[]) => {
      const singleValue = newValue[0];
      if (value === undefined) {
        setInternalValue(singleValue);
      }
      onValueChange?.(singleValue);
    },
    [value, onValueChange]
  );

  return (
    <div className="w-full rounded-md border border-input bg-transparent flex justify-center px-[13px] gap-4 shadow-sm">
      <span className="text-sm text-muted-foreground border-r-2 min-w-14 py-[7px] font-semibold">
        {currentValue}
      </span>
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={[typeof defaultValue === 'number' ? defaultValue : max]}
        value={[currentValue]}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={props.step || 1}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: 1 }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
};

export const TimeSelector = memo(TimeSelectorComponent);

TimeSelector.displayName = "TimeSelector";
