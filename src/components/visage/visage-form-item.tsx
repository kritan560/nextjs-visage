import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type VisageFormItemProps = {
  showLabel?: boolean;
  labelName?: string;
  field: any;
  inputType?: React.HTMLInputTypeAttribute;
  inputPlaceholder?: string;
  className?: string;
  inputTextSize?: "sm" | "base" | "large";
  requiredCollectionLabel?: boolean;
  disabled?: boolean;
};

export function VisageFormItem(props: VisageFormItemProps) {
  const {
    field,
    inputPlaceholder,
    inputType,
    inputTextSize = "base",
    labelName,
    showLabel,
    className,
    requiredCollectionLabel,
    disabled = false,
  } = props;

  return (
    <FormItem className={cn("relative w-full", className)}>
      {showLabel && (
        <FormLabel className="text-base text-stone-600 dark:text-stone-300">
          {labelName}
          <span className="text-lg font-semibold text-rose-500">
            {requiredCollectionLabel && "*"}
          </span>
        </FormLabel>
      )}
      <FormControl>
        <Input
          disabled={disabled}
          className={cn(
            "h-12 w-full rounded-md border border-yellow-500 px-4 font-medium placeholder:text-stone-400/80 focus-visible:border-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0",
            inputTextSize === "sm" && "text-sm",
            inputTextSize === "base" && "text-base",
            inputTextSize === "large" && "text-lg",
          )}
          {...field}
          type={inputType}
          placeholder={inputPlaceholder}
        />
      </FormControl>
      <FormMessage className="absolute -bottom-7 mr-4 w-full truncate rounded-b-md bg-rose-200 p-1" />
    </FormItem>
  );
}
