import { Check, ChevronDown } from "lucide-react";
import { memo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { INDICATOR_DEFINITIONS, type IndicatorType } from "@/constants/global";
import { cn } from "@/lib/utils";

interface IndicatorOption {
  value: IndicatorType;
  label: (typeof INDICATOR_DEFINITIONS)[IndicatorType];
}

const indicatorOptions: IndicatorOption[] = Object.entries(
  INDICATOR_DEFINITIONS
).map(([value, label]) => ({
  value: value as IndicatorType,
  label: label as (typeof INDICATOR_DEFINITIONS)[IndicatorType],
}));

interface IndicatorDropdownProps {
  value?: IndicatorType | null;
  onChange?: (value: IndicatorType | null) => void;
}

const IndicatorDropdownComponent = ({
  value,
  onChange,
}: IndicatorDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between overflow-ellipsis flex shadow-sm"
        >
          <span className="overflow-hidden text-start text-wrap text-ellipsis line-clamp-1">
            {value
              ? indicatorOptions.find((indicator) => indicator.value === value)
                  ?.label
              : "Select indicator..."}
          </span>
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 min-w-full" align="start">
        <Command>
          <CommandInput
            placeholder="Search indicator type..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No indicator found.</CommandEmpty>
            <CommandGroup>
              {indicatorOptions.map((indicator) => (
                <CommandItem
                  key={indicator.value}
                  value={indicator.value}
                  onSelect={(currentValue) => {
                    if (!currentValue || currentValue === value) return;

                    onChange?.(currentValue as IndicatorType);
                    setOpen(false);
                  }}
                >
                  {indicator.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === indicator.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const IndicatorDropdown = memo(IndicatorDropdownComponent);

IndicatorDropdown.displayName = "IndicatorDropdown";
