import React, { forwardRef, memo, useCallback } from "react";

// shadcn
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

// utils
import { cn } from "@/lib/utils";

// assets
import { CheckIcon, ChevronDown, ChevronsUpDown, Globe } from "lucide-react";
import { CircleFlag } from "react-circle-flags";

// data
import { ASEAN_COUNTRIES_ISO2 } from "@/constants/global";
import { countries } from "country-data-list";

export type Country = {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
};

type MultiSelectCountryDropdownProps = {
  options?: Country[];
  selectedCountries: Country[];
  onChange: (countries: Country[]) => void;
  disabled?: boolean;
  placeholder?: string;
  slim?: boolean;
  inline?: boolean;
  className?: string;
};

const MultiSelectCountryDropdownComponent = (
  {
    options = countries.all.filter((country) =>
      ASEAN_COUNTRIES_ISO2.includes(country.alpha2)
    ),
    selectedCountries,
    onChange,
    disabled = false,
    placeholder = "Select countries",
    slim = false,
    inline = false,
    className,
    ...props
  }: MultiSelectCountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = useCallback(
    (country: Country) => {
      const newSelection = selectedCountries.some(
        (c) => c.alpha3 === country.alpha3
      )
        ? selectedCountries.filter((c) => c.alpha3 !== country.alpha3)
        : [...selectedCountries, country];

      onChange(newSelection);
    },
    [selectedCountries, onChange]
  );

  const getDisplayText = () => {
    if (selectedCountries.length === 0) {
      return placeholder;
    }

    if (selectedCountries.length === 1) {
      return selectedCountries[0].name;
    }

    return `${selectedCountries.length} countries selected`;
  };

  const triggerClasses = cn(
    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:bg-secondary/80",
    slim === true && "gap-1 w-min",
    inline && "rounded-r-none border-r-0 gap-1 pr-1 w-min",
    className
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        className={triggerClasses}
        disabled={disabled}
        {...props}
      >
        <div className="flex items-center flex-grow gap-2 overflow-hidden">
          {selectedCountries.length > 0 ? (
            <>
              {selectedCountries.length === 1 && !slim && !inline && (
                <div className="inline-flex items-center justify-center w-4 h-4 shrink-0 overflow-hidden rounded-full">
                  <CircleFlag
                    countryCode={selectedCountries[0].alpha2.toLowerCase()}
                    height={16}
                  />
                </div>
              )}
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {getDisplayText()}
              </span>
            </>
          ) : (
            <span className="flex items-center gap-2 text-muted-foreground">
              {inline || slim ? <Globe size={16} /> : placeholder}
            </span>
          )}
        </div>

        {!inline ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronsUpDown size={16} className="text-muted-foreground" />
        )}
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={10}
        side="bottom"
        className="min-w-[--radix-popper-anchor-width] p-0"
      >
        <Command className="w-full max-h-[200px] sm:max-h-[270px]">
          <CommandList>
            <div className="sticky top-0 z-10 bg-popover">
              <CommandInput placeholder="Search country..." />
            </div>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x) => x.name)
                .map((option, key: number) => (
                  <CommandItem
                    className="flex items-center w-full gap-2"
                    key={key}
                    onSelect={() => handleSelect(option)}
                  >
                    <div className="flex flex-grow space-x-2 overflow-hidden">
                      <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                        <CircleFlag
                          countryCode={option.alpha2.toLowerCase()}
                          height={20}
                        />
                      </div>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {option.name}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0",
                        selectedCountries.some((c) => c.name === option.name)
                          ? "opacity-100"
                          : "opacity-0"
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

MultiSelectCountryDropdownComponent.displayName =
  "MultiSelectCountryDropdownComponent";

export const MultiSelectCountryDropdown = memo(
  forwardRef(MultiSelectCountryDropdownComponent)
);
