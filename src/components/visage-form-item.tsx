import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
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
    <FormItem className={cn("w-full relative", className)}>
      {showLabel && (
        <FormLabel className="text-base text-stone-600">
          {labelName}
          <span className="text-rose-500 text-lg font-semibold">
            {requiredCollectionLabel && "*"}
          </span>
        </FormLabel>
      )}
      <FormControl>
        <Input
          disabled={disabled}
          className={cn(
            "h-12 font-medium placeholder:text-stone-400/80 px-4 border rounded-md w-full focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-slate-500",
            inputTextSize === "sm" && "text-sm",
            inputTextSize === "base" && "text-base",
            inputTextSize === "large" && "text-lg"
          )}
          {...field}
          type={inputType}
          placeholder={inputPlaceholder}
        />
      </FormControl>
      <FormMessage className="absolute -bottom-7 rounded-b-md mr-4 bg-rose-200 w-full p-1 truncate" />
    </FormItem>
  );
}
